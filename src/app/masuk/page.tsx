'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '@/components/Navigation';
import { normalizeIndonesianWhatsApp, isValidEmail } from '@/data/ums-prodi';
import { IS_DEMO_MODE, DEMO_BADGE_LABEL } from '@/lib/config';
import {
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  User,
  LogOut,
  Sparkles,
  KeyRound,
  Loader2,
} from 'lucide-react';

interface ActiveSession {
  sub: string;
  role: 'member' | 'admin';
  exp: number;
}

export default function MasukPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'whatsapp' | 'email' | 'admin'>('whatsapp');
  const [identifier, setIdentifier] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.session) {
          setActiveSession(data.session);
        }
      })
      .catch(() => {});
  }, []);

  const handleLoginRole = async (
    role: 'member' | 'admin',
    customId?: string,
    passcode?: string,
    isDemoClick?: boolean
  ) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          role,
          identifier: customId || (role === 'admin' ? 'Pengurus Wilayah' : 'Alumni UMS'),
          passkey: passcode,
          isDemoClick: Boolean(isDemoClick),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveSession({
          sub: data.sub,
          role: data.role,
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
        });
        setSent(true);
        router.refresh();
      } else {
        setError(data.error || 'Gagal masuk.');
      }
    } catch {
      setError('Terjadi kendala jaringan saat menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      setActiveSession(null);
      setSent(false);
      setIdentifier('');
      setPasskey('');
      router.refresh();
    } catch {
      setError('Gagal keluar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = identifier.trim();

    if (method === 'admin') {
      if (!passkey.trim()) {
        setError('Masukkan kode akses / kata sandi pengurus.');
        return;
      }
      await handleLoginRole('admin', raw || 'Pengurus Wilayah', passkey.trim());
      return;
    }

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

    if (IS_DEMO_MODE) {
      await handleLoginRole('member', raw);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#0C2340] flex flex-col font-sans selection:bg-[#0C2340] selection:text-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="surface-card rounded-3xl p-6 sm:p-9 max-w-md w-full space-y-6 relative z-[1] shadow-sm border border-slate-200/80">
          <div className="text-center space-y-2">
            <Image
              src="/images/logo-emblem.png"
              alt="Logo IKA UMS"
              width={52}
              height={52}
              className="w-13 h-13 mx-auto object-contain mb-2"
            />
            {IS_DEMO_MODE && (
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-[#92400E] text-xs font-semibold">
                {DEMO_BADGE_LABEL}
              </span>
            )}
            <h1 className="text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-bold text-[#0C2340]">
              {method === 'admin' ? 'Masuk Pengurus' : 'Masuk Anggota'}
            </h1>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              {method === 'admin'
                ? 'Panel internal verifikasi pendaftaran & koordinasi jadwal kopdar wilayah.'
                : 'Akses portal Profil Saya dan Direktori Anggota terverifikasi.'}
            </p>
          </div>

          {activeSession ? (
            <div className="bg-slate-50 border border-emerald-300 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-semibold text-sm">Sesi Aktif Terverifikasi</p>
                  <p className="text-xs text-[#475569]">
                    Masuk sebagai <strong>{activeSession.sub}</strong> ({activeSession.role === 'admin' ? 'Pengurus Wilayah' : 'Anggota Alumni'})
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {activeSession.role === 'admin' ? (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#0C2340] text-white text-sm font-bold hover:bg-[#08182E] transition-colors"
                  >
                    Buka Panel Pengurus (/admin)
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/app"
                    className="flex items-center justify-center gap-2 w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-[#0C2340] text-white text-sm font-bold hover:bg-[#08182E] transition-colors"
                  >
                    Buka Profil Saya (/app)
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <Link
                  href="/direktori"
                  className="flex items-center justify-center gap-2 w-full min-h-[46px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-[#0C2340] text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  Buka Daftar Anggota (/direktori)
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-xl text-red-700 hover:bg-red-50 text-sm font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar dari Sesi
                </button>
              </div>
            </div>
          ) : !sent ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
              {/* Pilihan Metode Masuk (3 Tab) */}
              <div
                className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl"
                role="group"
                aria-label="Pilih metode masuk"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMethod('whatsapp');
                    setIdentifier('');
                    setError('');
                  }}
                  className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    method === 'whatsapp'
                      ? 'bg-[#0C2340] text-white shadow-xs'
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
                  className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    method === 'email'
                      ? 'bg-[#0C2340] text-white shadow-xs'
                      : 'text-[#0C2340] hover:bg-white/70'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod('admin');
                    setIdentifier('');
                    setPasskey('');
                    setError('');
                  }}
                  className={`min-h-[46px] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    method === 'admin'
                      ? 'bg-[#0C2340] text-white shadow-xs'
                      : 'text-[#92400E] hover:bg-white/70'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pengurus
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {method === 'admin' ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="adminIdentifier"
                      className="block text-sm sm:text-base font-bold text-[#0C2340]"
                    >
                      Nama / Jabatan Pengurus
                    </label>
                    <input
                      id="adminIdentifier"
                      type="text"
                      placeholder="Contoh: Sekretariat Wilayah / Korwil Jaksel"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full min-h-[50px] sm:min-h-[52px] px-4 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white border border-slate-300/80 text-[16px] text-[#0C2340] focus:bg-white focus:border-[#0C2340] focus:outline-hidden focus:ring-4 focus:ring-amber-500/15 transition-all shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="adminPasskey"
                      className="block text-sm sm:text-base font-bold text-[#0C2340] flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#92400E]" />
                      Kode Akses Pengurus (PIN/Kata Sandi)
                    </label>
                    <input
                      id="adminPasskey"
                      type="password"
                      required
                      placeholder="Masukkan kode akses pengurus"
                      value={passkey}
                      onChange={(e) => {
                        setPasskey(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full min-h-[50px] sm:min-h-[52px] px-4 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white border border-slate-300/80 text-[16px] text-[#0C2340] focus:bg-white focus:border-[#0C2340] focus:outline-hidden focus:ring-4 focus:ring-amber-500/15 transition-all shadow-2xs"
                    />
                    <p className="text-xs text-[#475569]">
                      Diberikan khusus untuk koordinator wilayah &amp; pengurus terdaftar.
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label
                    htmlFor="loginIdentifier"
                    className="block text-sm sm:text-base font-bold text-[#0C2340]"
                  >
                    {method === 'whatsapp' ? 'Nomor WhatsApp Terdaftar' : 'Alamat Email Terdaftar'}
                  </label>
                  <input
                    id="loginIdentifier"
                    type={method === 'whatsapp' ? 'tel' : 'email'}
                    inputMode={method === 'whatsapp' ? 'tel' : 'email'}
                    autoComplete={method === 'whatsapp' ? 'tel' : 'email'}
                    required
                    aria-invalid={Boolean(error)}
                    placeholder={method === 'whatsapp' ? 'Contoh: 081234567890' : 'nama@email.com'}
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full min-h-[50px] sm:min-h-[52px] px-4 py-3 rounded-xl sm:rounded-2xl bg-slate-50/40 hover:bg-white text-[16px] text-[#0C2340] border transition-all shadow-2xs focus:bg-white focus:outline-hidden focus:ring-4 ${
                      error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-slate-300/80 focus:border-[#0C2340] focus:ring-amber-500/15'
                    }`}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-[#0C2340] hover:bg-[#16325C] active:scale-[0.98] text-white text-base font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#F59E0B]" />
                    <span>Memverifikasi...</span>
                  </>
                ) : method === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Masuk sebagai Pengurus</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </>
                ) : method === 'whatsapp' ? (
                  <>
                    <span>Minta kode masuk WhatsApp</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </>
                ) : (
                  <>
                    <span>Kirim tautan masuk email</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-200 text-center">
                <p className="text-sm text-[#475569]">
                  Belum pernah mengisi pendataan?{' '}
                  <Link
                    href="/gabung"
                    className="font-bold text-[#0C2340] hover:text-[#92400E] underline underline-offset-4"
                  >
                    Daftar jadi anggota
                  </Link>
                </p>
              </div>

              {IS_DEMO_MODE && (
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <p className="text-xs font-semibold text-[#92400E] flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Uji Akses Cepat ({DEMO_BADGE_LABEL}):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoginRole('member', 'demo-alumni', undefined, true)}
                      disabled={isLoading}
                      className="min-h-[44px] px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-[#0C2340] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-[#92400E]" />
                      Simulasi Anggota
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoginRole('admin', 'demo-pengurus', undefined, true)}
                      disabled={isLoading}
                      className="min-h-[44px] px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-[#0C2340] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0C2340]" />
                      Simulasi Pengurus
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="bg-white border border-emerald-200 rounded-xl p-5 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h2 className="text-lg font-bold text-[#0C2340]">
                Masuk Berhasil
              </h2>
              <p className="text-base text-[#475569] leading-[1.6]">
                Sesi akun berhasil diaktifkan untuk{' '}
                <strong>
                  {identifier || (method === 'admin' ? 'Pengurus Wilayah' : 'Alumni UMS')}
                </strong>
                .
              </p>

              <div className="space-y-2 pt-2">
                {method === 'admin' ? (
                  <Link
                    href="/admin"
                    className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] px-4 py-2.5 rounded-lg bg-[#0C2340] text-white text-base font-semibold hover:bg-[#08182E] transition-colors"
                  >
                    Buka Panel Pengurus (/admin)
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] px-4 py-2.5 rounded-lg bg-[#0C2340] text-white text-base font-semibold hover:bg-[#08182E] transition-colors"
                  >
                    Buka Profil Saya (/app)
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  href="/direktori"
                  className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-lg border border-slate-300 bg-white text-[#0C2340] text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  Buka Daftar Anggota (/direktori)
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
