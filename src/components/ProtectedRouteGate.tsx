import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, ShieldAlert, Users } from 'lucide-react';
import { Footer, Navbar } from '@/components/Navigation';
import { getServerSession, type SessionRole } from '@/lib/server-auth';

export type ProtectedRouteVariant = 'admin' | 'member' | 'direktori';

const VARIANT_CONTENT: Record<
  ProtectedRouteVariant,
  {
    eyebrow: string;
    title: string;
    description: string;
    detail: string;
    loginHref: string;
    loginLabel: string;
  }
> = {
  admin: {
    eyebrow: 'Area Pengurus',
    title: 'Halaman ini khusus pengurus terverifikasi',
    description:
      'Verifikasi pendaftar baru, jadwal kopdar wilayah, dan data anggota hanya dapat dibuka melalui sesi pengurus yang sah.',
    detail:
      'Sesi pengurus belum aktif pada peramban ini. Data antrean dan rekap anggota tidak dikirim sebelum autentikasi sisi server terverifikasi.',
    loginHref: '/masuk?next=/admin',
    loginLabel: 'Masuk sebagai pengurus',
  },
  member: {
    eyebrow: 'Profil Anggota',
    title: 'Masuk dulu untuk membuka halaman anggota',
    description:
      'Pengaturan visibilitas direktori, status keanggotaan, dan permintaan hapus data hanya tersedia untuk alumni yang sudah masuk.',
    detail:
      'Selama kamu belum masuk dengan sesi terverifikasi, data profil anggota tidak ditampilkan oleh server.',
    loginHref: '/masuk?next=/app',
    loginLabel: 'Masuk ke akun anggota',
  },
  direktori: {
    eyebrow: 'Direktori Khusus Anggota',
    title: 'Direktori hanya terbuka untuk anggota yang sudah masuk',
    description:
      'Untuk menjaga privasi alumni, nama dan latar bidang kerja hanya dapat dicari oleh anggota yang sudah diverifikasi dan menyetujui ketentuan tampil.',
    detail:
      'Nomor WhatsApp maupun email pribadi tidak pernah ditampilkan di halaman ini. Bila kamu belum terdaftar, silakan isi formulir pendaftaran terlebih dahulu.',
    loginHref: '/masuk?next=/direktori',
    loginLabel: 'Masuk untuk lihat direktori',
  },
};

interface ProtectedRouteGateProps {
  variant: ProtectedRouteVariant;
}

export function ProtectedRouteGate({ variant }: ProtectedRouteGateProps) {
  const copy = VARIANT_CONTENT[variant];

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F1EA] text-[#111827] font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <section
          aria-labelledby="protected-route-title"
          className="w-full max-w-xl bg-[#FDFCF7] border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#92400E] bg-[#FEF3C7]/85 border border-[#92400E]/20 px-3 py-1 rounded-full mb-4">
            {variant === 'admin' ? (
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            ) : variant === 'direktori' ? (
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>{copy.eyebrow}</span>
          </div>

          <h1
            id="protected-route-title"
            className="text-2xl sm:text-3xl font-bold text-[#0C2340] tracking-tight"
          >
            {copy.title}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#475569] leading-relaxed">
            {copy.description}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-[#475569] bg-[#F3F1EA] border border-[#E2E8F0] rounded-xl p-4 leading-relaxed">
            {copy.detail}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={copy.loginHref}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0C2340] hover:bg-[#1E3A5F] text-[#FDFCF7] text-sm font-semibold transition-colors"
            >
              <span>{copy.loginLabel}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              href="/gabung"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0C2340] text-sm font-semibold transition-colors"
            >
              Daftar jadi anggota
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

interface ServerProtectedRouteProps {
  variant: ProtectedRouteVariant;
  requiredRole?: SessionRole;
  renderAuthorized: () => Promise<React.ReactNode>;
}

async function SessionGate({
  variant,
  requiredRole,
  renderAuthorized,
}: ServerProtectedRouteProps) {
  const session = await getServerSession();
  const isAuthorized =
    session !== null &&
    (!requiredRole || session.role === requiredRole || session.role === 'admin');

  if (!isAuthorized) {
    return <ProtectedRouteGate variant={variant} />;
  }

  return <>{await renderAuthorized()}</>;
}

export function ServerProtectedRoute({
  variant,
  requiredRole,
  renderAuthorized,
}: ServerProtectedRouteProps) {
  return (
    <Suspense fallback={<ProtectedRouteGate variant={variant} />}>
      <SessionGate
        variant={variant}
        requiredRole={requiredRole}
        renderAuthorized={renderAuthorized}
      />
    </Suspense>
  );
}
