'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { ShieldCheck, Lock, MapPin, Send, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <BrandLogo size={32} className="w-8 h-8 shrink-0" />
              <span className="font-black text-lg text-white">Found<span className="text-emerald-500">Hub</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The high-performance, mobile-first community lost & found network. Powered by geolocation, anti-fraud ownership verification, and Telegram instant relays.
            </p>
          </div>

          {/* Core Security Features */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Safety & Verification
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Proof-of-Ownership Challenge
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                PII ID Masking System
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                OpenStreetMap Geolocation
              </li>
              <li className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                Automated Telegram Relays
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Explore & Report
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Browse All Lost & Found Items
                </Link>
              </li>
              <li>
                <Link href="/report?type=FOUND" className="hover:text-white transition-colors">
                  Report a Found Item
                </Link>
              </li>
              <li>
                <Link href="/report?type=LOST" className="hover:text-white transition-colors">
                  Post a Lost Item Alert
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  My Dashboard & Claims
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety Notice Reminder */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <h5 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Community Safety Rule
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Always conduct physical exchanges in designated safe zones such as campus security stations, library reception desks, or well-lit police stations.
            </p>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} FoundHub. Community-Driven Lost and Found Platform.</p>
          <p className="flex items-center gap-1">
            Built with Next.js 14, Tailwind CSS & OpenStreetMap
          </p>
        </div>
      </div>
    </footer>
  );
}
