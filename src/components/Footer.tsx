'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { ShieldCheck, Lock, MapPin, Send, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090a0f] text-zinc-500 text-xs border-t border-[#1f2330] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <BrandLogo size={32} className="w-8 h-8 shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white">Found<span className="text-emerald-400">Hub</span></span>
              </div>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-normal">
              Toshkent bo'ylab topilgan va yo'qolgan buyumlar xizmati. Buyumlarni xavfsiz saqlash va haqiqiy egasiga qaytarish tarmog'i.
            </p>
          </div>

          {/* Core Security Features */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-200 text-xs uppercase tracking-wider font-mono">
              XAVFSIZLIK VA PROTOKOL
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Sirli savol orqali egalik tekshiruvi
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Himoyalangan saqlov ma'lumotlari
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                Toshkent bo'yicha qidiruv xaritasi
              </li>
              <li className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                Tezkor Telegram xabarnomalar
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-200 text-xs uppercase tracking-wider font-mono">
              BO'LIMLAR
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  E'lonlar ro'yxati
                </Link>
              </li>
              <li>
                <Link href="/report?type=FOUND" className="hover:text-emerald-400 transition-colors">
                  Buyum topib oldim
                </Link>
              </li>
              <li>
                <Link href="/report?type=LOST" className="hover:text-emerald-400 transition-colors">
                  Buyum yo'qotdim
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Mening kabinetim
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety Notice Reminder */}
          <div className="p-4 bg-[#12151e] rounded-2xl border border-[#232733] space-y-2">
            <h5 className="font-bold text-zinc-200 text-xs flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              BUYUMNI TOPSHIRISH TARTIBI
            </h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
              Topshirish uchun har doim odam gavjum, yorug' jamoat joyini tanlang (metro bekati, bino xavfsizlik xizmati yoki savdo markazi).
            </p>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#1f2330] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} FoundHub Toshkent. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center gap-1 text-zinc-400">
            OpenStreetMap · CartoDB · Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
