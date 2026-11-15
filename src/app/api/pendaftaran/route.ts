import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import {
  getAllPendaftar,
  savePendaftar,
  updatePendaftarStatus,
  deletePendaftar,
  exportPendaftarCsv,
} from '@/lib/pendaftaran-store';
import { getServerSession } from '@/lib/server-auth';
import { normalizeIndonesianWhatsApp, isValidEmail } from '@/data/ums-prodi';
import { inviteMemberByEmail } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  const isAdmin = session?.role === 'admin';

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  if (format === 'csv') {
    if (!isAdmin) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }
    const csv = await exportPendaftarCsv();
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="ikaums-pendaftar-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const list = await getAllPendaftar();

  if (!isAdmin) {
    // Pengunjung umum hanya melihat total pendaftar terverifikasi
    const approvedCount = list.filter((p) => p.status === 'disetujui').length;
    return NextResponse.json({
      total: approvedCount,
    });
  }

  return NextResponse.json({
    total: list.length,
    items: list,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    // Honeypot anti bot spam
    if (body.website && String(body.website).trim().length > 0) {
      return NextResponse.json(
        { error: 'Permintaan tidak dapat diproses.' },
        { status: 400 }
      );
    }

    const namaLengkap = String(body.namaLengkap || '').trim();
    if (namaLengkap.length < 3) {
      return NextResponse.json(
        { error: 'Nama lengkap minimal 3 karakter.' },
        { status: 400 }
      );
    }

    const angkatan = Number(body.angkatan);
    if (!angkatan || angkatan < 1980 || angkatan > 2030) {
      return NextResponse.json(
        { error: 'Pilih tahun angkatan masuk UMS yang valid.' },
        { status: 400 }
      );
    }

    const prodi = String(body.prodi || '').trim();
    if (!prodi) {
      return NextResponse.json(
        { error: 'Program studi wajib dipilih.' },
        { status: 400 }
      );
    }

    const wilayah = String(body.wilayah || '').trim();
    if (!wilayah) {
      return NextResponse.json(
        { error: 'Wilayah domisili Jabodetabek wajib dipilih.' },
        { status: 400 }
      );
    }

    const validWa = normalizeIndonesianWhatsApp(String(body.whatsapp || ''));
    if (!validWa) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp Indonesia tidak valid.' },
        { status: 400 }
      );
    }

    const email = body.email ? String(body.email).trim().toLowerCase() : undefined;
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format alamat email tidak valid.' },
        { status: 400 }
      );
    }

    if (!body.agreeConsent) {
      return NextResponse.json(
        { error: 'Persetujuan pemrosesan data wajib dicentang.' },
        { status: 400 }
      );
    }

    const result = await savePendaftar({
      namaLengkap,
      angkatan,
      prodi,
      wilayah,
      whatsapp: validWa,
      email,
      pekerjaan: body.pekerjaan ? String(body.pekerjaan).trim() : undefined,
      perusahaan: body.perusahaan ? String(body.perusahaan).trim() : undefined,
      fotoUrl: body.fotoUrl ? String(body.fotoUrl).trim() : undefined,
      siapMentoring: Boolean(body.siapMentoring),
      tampilDiDirektori: Boolean(body.tampilDiDirektori),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Gagal menyimpan pendaftaran.' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dicatat dalam basis data.',
      id: result.record?.id,
    });
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses pendaftaran.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession();
  const isAdmin = session?.role === 'admin';
  if (!isAdmin) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { id, status } = body;
    if (!id || (status !== 'disetujui' && status !== 'ditolak' && status !== 'menunggu')) {
      return NextResponse.json({ error: 'Data tidak lengkap atau status tidak valid' }, { status: 400 });
    }

    const current = (await getAllPendaftar()).find((pendaftar) => pendaftar.id === id);
    if (!current) {
      return NextResponse.json({ error: 'Catatan tidak ditemukan' }, { status: 404 });
    }

    if (status === 'disetujui' && !current.email) {
      return NextResponse.json(
        { error: 'Email wajib tersedia sebelum anggota dapat disetujui untuk akses magic link.' },
        { status: 422 }
      );
    }

    const success = await updatePendaftarStatus(id, status);
    if (!success) {
      return NextResponse.json({ error: 'Catatan tidak ditemukan' }, { status: 404 });
    }

    let invitationMessage = '';
    if (status === 'disetujui' && current.status !== 'disetujui' && current.email) {
      const appUrl = process.env.APP_URL;
      const redirectTo = appUrl?.startsWith('https://')
        ? new URL('/auth/confirm', appUrl).toString()
        : process.env.NODE_ENV !== 'production'
          ? new URL('/auth/confirm', request.nextUrl.origin).toString()
          : null;

      if (!redirectTo) {
        invitationMessage = ' Status disimpan, tetapi APP_URL production belum dikonfigurasi untuk mengirim undangan.';
      } else {
        const invitation = await inviteMemberByEmail(current.email, redirectTo);
        if (invitation.sent) {
          invitationMessage = ' Undangan akses email telah dikirim.';
        } else if (invitation.reason) {
          invitationMessage = ` Status disimpan, tetapi undangan belum terkirim: ${invitation.reason}`;
        }
      }
    }

    return NextResponse.json({ success: true, message: `Status berhasil diubah menjadi ${status}.${invitationMessage}` });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui status' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  const isAdmin = session?.role === 'admin';
  if (!isAdmin) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: 'ID pendaftar diperlukan' }, { status: 400 });
    }

    const success = await deletePendaftar(id);
    if (!success) {
      return NextResponse.json({ error: 'Catatan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Data pendaftar berhasil dihapus.' });
  } catch {
    return NextResponse.json({ error: 'Gagal menghapus data pendaftar' }, { status: 500 });
  }
}
