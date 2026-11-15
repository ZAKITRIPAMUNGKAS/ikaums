import { NextRequest, NextResponse } from 'next/server';
import {
  getCmsData,
  saveAgendaItem,
  deleteAgendaItem,
  savePengurusData,
  saveKomunitasSettings,
  saveLokerItem,
  deleteLokerItem,
  saveLandingContent,
} from '@/lib/cms-store';
import { getServerSession } from '@/lib/server-auth';

export async function GET() {
  const session = await getServerSession();
  const data = await getCmsData();

  if (session?.role !== 'admin') {
    return NextResponse.json({ lokers: data.lokers });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (session?.role !== 'admin') {
    return NextResponse.json({ error: 'Akses ditolak. Sesi pengurus diperlukan.' }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { type, data, id } = body;

    if (type === 'agenda') {
      const saved = await saveAgendaItem(data);
      return NextResponse.json({ success: true, message: 'Jadwal kopdar berhasil disimpan.', item: saved });
    }

    if (type === 'agenda-delete') {
      if (!id) return NextResponse.json({ error: 'ID agenda diperlukan' }, { status: 400 });
      await deleteAgendaItem(id);
      return NextResponse.json({ success: true, message: 'Jadwal kopdar berhasil dihapus.' });
    }

    if (type === 'loker') {
      const saved = await saveLokerItem(data);
      return NextResponse.json({ success: true, message: 'Info lowongan kerja berhasil disimpan.', item: saved });
    }

    if (type === 'loker-delete') {
      if (!id) return NextResponse.json({ error: 'ID lowongan kerja diperlukan' }, { status: 400 });
      await deleteLokerItem(id);
      return NextResponse.json({ success: true, message: 'Info lowongan kerja berhasil dihapus.' });
    }

    if (type === 'pengurus') {
      const saved = await savePengurusData(data);
      return NextResponse.json({ success: true, message: 'Data pengurus & koordinator wilayah berhasil diperbarui.', data: saved });
    }

    if (type === 'settings') {
      const saved = await saveKomunitasSettings(data);
      return NextResponse.json({ success: true, message: 'Pengaturan informasi komunitas berhasil disimpan.', data: saved });
    }

    if (type === 'landing') {
      const saved = await saveLandingContent(data);
      return NextResponse.json({ success: true, message: 'Konten beranda berhasil diperbarui.', data: saved });
    }

    return NextResponse.json({ error: 'Tipe konten tidak dikenal' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Gagal memproses pembaruan konten' }, { status: 500 });
  }
}
