'use client';

import React, { useState } from 'react';
import { Navbar, Footer } from '@/components/Navigation';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MasukPage() {
  const [email, setEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMagicSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="bg-white border border-[#E5E8EF] rounded-2xl p-8 max-w-md w-full shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#101F5B] text-[#F4C542] flex items-center justify-center font-serif font-bold text-xl mx-auto mb-3">
              U
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#101F5B]">
              Masuk ke IKA UMS Connect
            </h1>
            <p className="text-xs text-[#5F6678] mt-1">
              Gunakan email yang telah terdaftar untuk menerima tautan masuk aman (Magic Link).
            </p>
          </div>

          {magicSent ? (
            <div className="bg-[#EDF1FA] border border-[#101F5B]/20 rounded-xl p-6 text-center space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#22775A] mx-auto" />
              <h3 className="font-semibold text-sm text-[#101F5B]">Tautan Masuk Terkirim</h3>
              <p className="text-xs text-[#5F6678]">
                Kami telah mengirimkan tautan masuk ke <strong>{email}</strong>. Silakan periksa kotak masuk atau spam Anda.
              </p>
              <div className="pt-2">
                <Link
                  href="/app"
                  className="inline-block bg-[#101F5B] text-[#FAFAF8] text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Lanjut ke Area Member (Simulasi)
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#18213D] mb-1">
                  Email Terdaftar
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E5E8EF] rounded-lg text-sm text-[#18213D] focus:outline-none focus:border-[#101F5B]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#101F5B] hover:bg-[#18213D] text-[#FAFAF8] font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Kirim Magic Link Masuk</span>
                <ArrowRight className="w-4 h-4 text-[#F4C542]" />
              </button>

              <div className="text-center text-xs text-[#5F6678] pt-2">
                Belum mendaftar?{' '}
                <Link href="/gabung" className="text-[#101F5B] font-semibold underline">
                  Daftar Sukarela
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
