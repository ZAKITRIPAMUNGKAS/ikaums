'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileKopdarCta() {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const formSection = document.getElementById('kopdar');
    if (!formSection || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(formSection);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={formVisible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-lg transition-transform duration-200 lg:hidden',
        formVisible && 'pointer-events-none translate-y-full'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-2.5">
        <a
          href="#kopdar"
          tabIndex={formVisible ? -1 : 0}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#0C2340] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#08182E] active:scale-[0.99]"
        >
          Kirim minat kopdar
          <ArrowRight className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
