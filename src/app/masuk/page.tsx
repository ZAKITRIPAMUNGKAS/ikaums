'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar, Footer } from '@/components/Navigation';
import { normalizeIndonesianWhatsApp, isValidEmail } from '@/data/ums-prodi';
import { COMMUNITY_PLACEHOLDERS, IS_DEMO_MODE, DEMO_BADGE_LABEL } from '@/lib/config';
import { CheckCircle2, ArrowRight, AlertCircle, HelpCircle } from 'lucide-react';

export default function MasukPage() {
  const [method, setMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = identifier.trim();

    if (method === 'whatsapp') {
      const validWa = normalizeIndonesianWhatsApp(raw);
      if (!validWa) {
        setError(
          'Masukkan nomor WhatsApp yang terdaftar (misalnya 081234567890 atau +6281234567890).'
        );
        return;
      }
      setIdentifier(validWa);
    } else {
      if (!isValidEmail(raw)) {
        setError('Masukkan alamat email yang benar, misalnya nama@domain.com.');
        return;
      }
    }

    setError('');
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="bg-white border border-[#0C2340]/12 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <Image
              src="/images/logo-emblem.png"
              alt="Logo IKA UMS"
              width={48}
              height={48}
              className="w-12 h-12 mx-auto object-contain mb-2"
            />
            {IS_DEMO_MODE && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-xs font-semibold">
                {DEMO_BADGE_LABEL}
              </span>
            )}
            <h1 className="text-2xl font-bold text-[#0C2340]">
              Masuk Anggota
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed">
              Masuk dengan kode WhatsApp atau tautan email tanpa perlu menghafal kata sandi.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Pilihan Kanal Masuk */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F3F1EA] rounded-xl" role="group" aria-label="Pilih metode masuk">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('whatsapp');
                    setIdentifier('');
                    setError('');
                  }}
                  className={`min-h-[44px] rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    method === 'whatsapp'
                      ? 'bg-[#0C2340] text-white'
                      : 'text-[#0C2340] hover:bg-white/70'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod('email');
                    setIdentifier('');
                    setError('');
                  }}
                  className={`min-h-[44px] rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    method === 'email'
                      ? 'bg-[#0C2340] text-white'
                      : 'text-[#0C2340] hover:bg-white/70'
                  }`}
                >
                  Email
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="loginIdentifier" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                  {method === 'whatsapp' ? 'Nomor WhatsApp Terdaftar' : 'Alamat Email Terdaftar'}
                </label>
                <input
                  id="loginIdentifier"
                  type={method === 'whatsapp' ? 'tel' : 'email'}
                  inputMode={method === 'whatsapp' ? 'tel' : 'email'}
                  autoComplete={method === 'whatsapp' ? 'tel' : 'email'}
                  required
                  aria-invalid={Boolean(error)}
                  placeholder={method === 'whatsapp' ? '081234567890' : 'nama@email.com'}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError('');
                  }}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#FDFCF7] border text-sm text-[#0C2340] focus:outline-hidden focus:ring-2 ${
                    error
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-[#0C2340]/20 focus:border-[#0C2340] focus:ring-[#0C2340]/10'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {method === 'whatsapp' ? 'Minta kode masuk WhatsApp' : 'Kirim tautan masuk email'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="bg-[#FDFCF7] border border-emerald-200 rounded-xl p-5 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h2 className="text-base font-bold text-[#0C2340]">
                {IS_DEMO_MODE ? `Masuk (${DEMO_BADGE_LABEL})` : 'Login Otomatis Segera Aktif'}
              </h2>
              <p className="text-xs text-[#475569] leading-relaxed">
                {IS_DEMO_MODE ? (
                  <>
                    Pratinjau akun siap dibuka untuk <strong>{identifier}</strong>.
                  </>
                ) : (
                  <>
                    Fitur masuk anggota via OTP WhatsApp dan tautan email untuk{' '}
                    <strong>{identifier}</strong> sedang disiapkan menjelang peluncuran penuh.
                    Jika kamu sudah mendaftar dan ingin memeriksa status, hubungi pengurus di{' '}
                    <strong className="text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactWhatsapp}</strong>.
                  </>
                )}
              </p>

              {IS_DEMO_MODE ? (
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#16325C] transition-colors"
                >
                  Buka Profil Saya ({DEMO_BADGE_LABEL})
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="inline-flex items-center justify-center w-full min-h-[44px] px-4 py-2 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Kembali ke halaman masuk
                </button>
              )}
            </div>
          )}

          {/* Bantuan Lupa Akses */}
          <details className="pt-4 border-t border-[#0C2340]/10 text-xs text-[#475569] group">
            <summary className="list-none flex items-center justify-between gap-2 min-h-[44px] font-semibold text-[#0C2340] cursor-pointer">
              <span className="inline-flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#B45309]" />
                Lupa akses atau nomor WhatsApp berubah?
              </span>
            </summary>
            <p className="pt-2 pb-1 leading-relaxed text-[#475569]">
              Hubungi sekretariat pengurus melalui{' '}
              <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactEmail}</span>{' '}
              atau WhatsApp{' '}
              <span className="font-medium text-[#0C2340]">{COMMUNITY_PLACEHOLDERS.contactWhatsapp}</span>{' '}
              dengan menyertakan nama lengkap, program studi, dan tahun angkatan UMS untuk pembaruan data.
            </p>
          </details>

          <p className="text-xs text-center text-[#475569] pt-1">
            Belum terdaftar sebagai anggota?{' '}
            <Link
              href="/gabung"
              className="inline-flex items-center min-h-[44px] text-[#0C2340] font-semibold hover:text-[#B45309] underline underline-offset-4"
            >
              Daftar jadi anggota
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
