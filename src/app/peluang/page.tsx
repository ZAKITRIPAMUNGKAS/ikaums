'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/Navigation';
import { Briefcase, Code, Palette, Users, ChevronRight, ArrowRight } from 'lucide-react';

export default function PeluangPage() {
  const [activeTab, setActiveTab] = useState('Lowongan');

  const tabs = ['Lowongan', 'Proyek', 'Bisnis Alumni', 'Mentoring'];

  const items = [
    {
      id: 'pl-1',
      title: 'Front-End Developer',
      company: 'EdTech Alumni UMS • Jakarta',
      type: 'Lowongan',
      badge: 'Baru',
      tags: ['Full-time', 'React / Next.js'],
      iconBg: 'bg-[#FEF3C7] text-[#92400E]',
      icon: Code
    },
    {
      id: 'pl-2',
      title: 'Product Designer',
      company: 'Fintech Alumni UMS • Jakarta Selatan',
      type: 'Lowongan',
      tags: ['Full-time', 'Hybrid'],
      iconBg: 'bg-[#EDF1FA] text-[#101F5B]',
      icon: Palette
    },
    {
      id: 'pl-3',
      title: 'Mentor Karier (Volunteer)',
      company: 'Program Alumni Mentoring • Online',
      type: 'Mentoring',
      tags: ['Volunteer', 'Mentoring'],
      iconBg: 'bg-[#FFF6E5] text-[#D97706]',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18213D] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#5F6678] mb-4">
          <Link href="/" className="hover:text-[#101F5B]">Beranda</Link>
          <span>&gt;</span>
          <span className="text-[#101F5B] font-semibold">Peluang</span>
        </nav>

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#101F5B]">
            Peluang & Kolaborasi
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6678] mt-1.5 max-w-2xl leading-relaxed">
            Temukan lowongan kerja, proyek, kolaborasi bisnis, dan kesempatan mentoring dari alumni.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#101F5B] text-white shadow-xs'
                  : 'bg-white text-[#5F6678] border border-[#D1D5DB] hover:text-[#101F5B]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Opportunities List */}
        <div className="space-y-3.5 max-w-3xl">
          {items.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white border border-[#E5E8EF] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs hover:border-[#101F5B]/30 hover:shadow-sm cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-bold text-[#101F5B]">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold px-2 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5F6678] mt-0.5">
                      {item.company}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="bg-[#FAFAF8] text-[#5F6678] border border-[#E5E8EF] text-[10px] font-medium px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <ChevronRight className="w-5 h-5 text-[#5F6678]" />
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}
