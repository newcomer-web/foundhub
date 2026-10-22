'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CURRENT_USER } from '@/lib/store';
import {
  Compass,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  Send,
  Menu,
  X,
  Search,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore Items', href: '/', icon: Compass },
    { label: 'Report Lost or Found', href: '/report', icon: PlusCircle },
    { label: 'Dashboard & Claims', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">Found</span>
                <span className="font-black text-xl tracking-tight text-emerald-600">Hub</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                Community Lost & Found
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/report"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Post Item
            </Link>

            {/* Current user pill */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 p-1.5 pr-3 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200"
            >
              <img
                src={CURRENT_USER.avatarUrl!}
                alt={CURRENT_USER.fullName}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div className="text-left">
                <p className="text-[11px] font-bold text-slate-900 leading-tight">
                  {CURRENT_USER.fullName}
                </p>
                <p className="text-[9px] text-emerald-600 font-semibold leading-tight">
                  Verified Member
                </p>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              href="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Post an Item
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
