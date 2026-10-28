'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { ShieldCheck, Lock, MapPin, Send, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <BrandLogo size={32} className="w-8 h-8 shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white">Found<span className="text-emerald-500">Hub</span></span>
                <span className="text-[9px] font-mono text-stone-400 border border-stone-700 px-1 py-0.5 rounded">CIVIC</span>
              </div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              The neighborhood-first civic lost & found registry. Geotagged noticeboard, proof-of-ownership challenges, and secure custody handoffs.
            </p>
          </div>

          {/* Core Security Features */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-200 text-xs uppercase tracking-wider font-mono">
              Integrity & Trust
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Proof-of-Ownership Challenge
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Safe Custody Location Logs
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                OpenStreetMap Geolocation
              </li>
              <li className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                Printable QR Street Flyers
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-200 text-xs uppercase tracking-wider font-mono">
              Noticeboard Dispatch
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Browse Active Notices
                </Link>
              </li>
              <li>
                <Link href="/report?type=FOUND" className="hover:text-white transition-colors">
                  Register Found Property
                </Link>
              </li>
              <li>
                <Link href="/report?type=LOST" className="hover:text-white transition-colors">
                  Post Missing Item Alert
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard & My Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety Notice Reminder */}
          <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700/80 space-y-2">
            <h5 className="font-bold text-stone-200 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Safe Hand-off Principle
            </h5>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Always conduct physical item reunions in public, well-lit spaces such as metro stations, university information desks, or police reception lobbies.
            </p>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <p>© {new Date().getFullYear()} FoundHub Civic Registry. Built for community trust.</p>
          <p className="flex items-center gap-1 text-stone-400">
            OpenStreetMap · Supabase · Next.js 14
          </p>
        </div>
      </div>
    </footer>
  );
}
