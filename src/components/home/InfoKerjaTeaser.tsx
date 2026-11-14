import Link from 'next/link';
import { ArrowRight, Briefcase, MessagesSquare } from 'lucide-react';

export function InfoKerjaTeaser() {
  return (
    <section
      aria-labelledby="info-kerja-heading"
      className="border-y border-[#0C2340]/10 bg-[#FDFCF7]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="lg:col-span-6">
          <span className="inline-block text-sm font-semibold text-[#92400E]">
            Info Kerja &amp; Usaha
          </span>
          <h2
            id="info-kerja-heading"
            className="mt-2 text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold tracking-[-0.015em] text-[#0C2340]"
          >
            Lowongan dan usaha alumni, satu pintu.
          </h2>
          <p className="mt-3 max-w-[58ch] text-base leading-[1.6] text-[#475569]">
            Pengurus mengumpulkan info lowongan dan usaha dari sesama alumni. Kalau kamu
            sedang mencari peluang atau ingin membagikan info, semuanya ada di halaman
            Mentoring &amp; Kerja.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/peluang#loker"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#08182E]"
            >
              Buka Info Kerja &amp; Usaha
              <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
            </Link>
            <Link
              href="/peluang#mentoring"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-2 py-2 text-base font-semibold text-[#0C2340] underline decoration-[#92400E] underline-offset-4 transition-colors hover:text-[#92400E]"
            >
              Butuh mentoring CV?
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
          <div className="surface-card rounded-xl p-5">
            <Briefcase className="h-5 w-5 text-[#92400E]" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[#0C2340]">Info lowongan</h3>
            <p className="mt-1 text-base leading-[1.6] text-[#475569]">
              Lowongan yang dibagikan alumni, lengkap dengan bidang dan wilayahnya.
            </p>
          </div>
          <div className="surface-card rounded-xl p-5">
            <MessagesSquare className="h-5 w-5 text-[#92400E]" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[#0C2340]">Usaha alumni</h3>
            <p className="mt-1 text-base leading-[1.6] text-[#475569]">
              Kenalan dengan usaha sesama alumni atau tawarkan kerja sama.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
