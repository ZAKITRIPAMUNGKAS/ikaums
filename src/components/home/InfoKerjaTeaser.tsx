import Link from 'next/link';
import { ArrowRight, Briefcase, MessagesSquare } from 'lucide-react';

export function InfoKerjaTeaser() {
  return (
    <section
      aria-labelledby="info-kerja-heading"
      className="border-y border-slate-200 bg-slate-50"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="lg:col-span-6">
          <span className="inline-block text-xs sm:text-sm font-semibold text-[#B45309]">
            Info Kerja &amp; Usaha
          </span>
          <h2
            id="info-kerja-heading"
            className="mt-2 text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-slate-900"
          >
            Lowongan dan usaha alumni, satu pintu.
          </h2>
          <p className="mt-3 max-w-[58ch] text-sm sm:text-base leading-[1.6] text-slate-600">
            Pengurus mengumpulkan info lowongan dan usaha dari sesama alumni. Kalau kamu
            sedang mencari peluang atau ingin membagikan info, semuanya ada di halaman
            Mentoring &amp; Kerja.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/peluang#loker"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-5 py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-[#08182E] shadow-xs"
            >
              Buka Info Kerja &amp; Usaha
              <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
            </Link>
            <Link
              href="/peluang#mentoring"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm sm:text-base font-semibold text-[#0C2340] underline decoration-[#D97706] underline-offset-4 transition-colors hover:text-[#D97706]"
            >
              Butuh mentoring CV?
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-[#B45309] border border-amber-200/60">
              <Briefcase className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-base sm:text-lg font-bold text-slate-900">Info lowongan</h3>
            <p className="mt-1 text-sm sm:text-base leading-[1.6] text-slate-600">
              Lowongan yang dibagikan alumni, lengkap dengan bidang, sistem kerja, dan wilayahnya.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0C2340] border border-blue-200/60">
              <MessagesSquare className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-base sm:text-lg font-bold text-slate-900">Usaha alumni</h3>
            <p className="mt-1 text-sm sm:text-base leading-[1.6] text-slate-600">
              Kenalan dengan jejaring usaha sesama alumni atau tawarkan kerja sama antar wilayah.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
