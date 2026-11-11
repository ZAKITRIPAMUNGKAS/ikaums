'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

export default function MasukPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Mohon masukkan alamat email yang terdaftar.');
      return;
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
            <img
              src="/images/logo-emblem.png"
              alt="Logo IKA UMS"
              className="w-12 h-12 mx-auto object-contain mb-2"
            />
            <h1 className="text-2xl font-bold text-[#0C2340]">
              Masuk ke Portal Anggota
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed">
              Kelola profil direktori, balas permintaan mentoring, dan ikuti kabar kegiatan wilayah tanpa kata sandi yang rumit.
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                <label htmlFor="loginEmail" className="block text-sm font-semibold text-[#0C2340] mb-1.5">
                  Alamat Email Terdaftar
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FDFCF7] border border-[#0C2340]/20 focus:border-[#0C2340] focus:outline-hidden focus:ring-2 focus:ring-[#0C2340]/10 text-sm text-[#0C2340]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0C2340] hover:bg-[#16325C] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Kirim Tautan Masuk Sekali Pakai
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="bg-[#FDFCF7] border border-emerald-200 rounded-xl p-5 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <p className="text-sm font-semibold text-[#0C2340]">
                Tautan Pratinjau Siap
              </p>
              <p className="text-xs text-[#475569] leading-relaxed">
                Pada layanan penuh, tautan masuk dikirim ke <strong>{email}</strong>. Untuk mencoba tampilan portal sekarang, gunakan pintasan pratinjau di bawah ini.
              </p>
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-[#0C2340] text-white text-sm font-semibold hover:bg-[#16325C] transition-colors"
              >
                Buka Portal Anggota
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Pintasan Pratinjau yang Jelas & Terpisah */}
          <div className="pt-5 border-t border-[#0C2340]/10 space-y-3">
            <p className="text-xs font-medium text-[#64748B] text-center">
              Pratinjau Antarmuka Anggota & Pengurus
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/app"
                className="text-center px-3 py-2 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-xs font-semibold transition-colors"
              >
                Demo Portal Anggota
              </Link>
              <Link
                href="/admin"
                className="text-center px-3 py-2 rounded-lg bg-[#F3F1EA] hover:bg-[#E7E3D7] text-[#0C2340] text-xs font-semibold transition-colors"
              >
                Demo Panel Pengurus
              </Link>
            </div>
            <p className="text-xs text-center text-[#64748B] pt-1">
              Belum pernah mendaftar?{' '}
              <Link href="/gabung" className="text-[#0C2340] font-semibold hover:text-[#D97706] underline underline-offset-4">
                Daftar sebagai alumni
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
