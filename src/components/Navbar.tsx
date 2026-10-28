'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@/lib/types';
import { dataStore, DEFAULT_AVATAR, openAuthModal } from '@/lib/store';
import AuthModal from './AuthModal';
import EditProfileModal from './EditProfileModal';
import BrandLogo from './BrandLogo';
import {
  Search,
  PlusCircle,
  LayoutDashboard,
  LogIn,
  User as UserIcon,
  LogOut,
  Edit3,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Auth and profile modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'register'>('login');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Reactive state
  const [currentUser, setCurrentUser] = useState<User>(() => dataStore.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => dataStore.getIsAuthenticated());

  useEffect(() => {
    setCurrentUser(dataStore.getCurrentUser());
    setIsAuthenticated(dataStore.getIsAuthenticated());

    const unsub = dataStore.subscribe(() => {
      setCurrentUser(dataStore.getCurrentUser());
      setIsAuthenticated(dataStore.getIsAuthenticated());
    });

    // Listen to global auth trigger events
    const handleOpenAuth = (e: any) => {
      const detail = e.detail || {};
      setAuthDefaultMode(detail.mode || 'login');
      setAuthReason(detail.reason || undefined);
      setIsAuthModalOpen(true);
    };

    const handleOpenEditProfile = () => {
      if (!dataStore.getIsAuthenticated()) {
        setAuthReason('Please sign in to edit your profile.');
        setAuthDefaultMode('login');
        setIsAuthModalOpen(true);
      } else {
        setIsEditProfileModalOpen(true);
      }
    };

    window.addEventListener('foundhub:open-auth', handleOpenAuth);
    window.addEventListener('foundhub:open-edit-profile', handleOpenEditProfile);

    return () => {
      unsub();
      window.removeEventListener('foundhub:open-auth', handleOpenAuth);
      window.removeEventListener('foundhub:open-edit-profile', handleOpenEditProfile);
    };
  }, []);

  const handlePostItemClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setAuthReason('Please sign in or create an account to report a found item or lost belonging.');
      setAuthDefaultMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const navLinks = [
    { label: 'Explore Items', href: '/', icon: Search },
    { label: 'Report Lost or Found', href: '/report', icon: PlusCircle, requiresAuth: true },
    { label: 'Dashboard & Claims', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <>
      {/* Top Telemetry Dispatch Bar */}
      <div className="bg-[#0c0d12] text-zinc-400 text-[11px] font-mono py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#1b1e2a]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-zinc-200 tracking-wider">FOUNDHUB TELEMETRY NETWORK</span>
            <span className="hidden sm:inline text-zinc-600">·</span>
            <span className="hidden sm:inline text-zinc-400">Civic Geolocation & Safe Custody Grid</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-zinc-500 text-[10px]">
            <span>ZERO-KNOWLEDGE CHALLENGE</span>
            <span>·</span>
            <span>CARTODB RADAR INTEGRATED</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-[#090a0f]/95 backdrop-blur-xl border-b border-[#1f2330] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <BrandLogo size={38} className="w-9 h-9 group-hover:scale-105 transition-transform shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight text-white">Found</span>
                  <span className="font-black text-xl tracking-tight text-emerald-400">Hub</span>
                  <span className="ml-1 text-[9px] font-mono uppercase bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/60 font-bold">
                    RADAR
                  </span>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 tracking-wider -mt-0.5 uppercase">
                  Telemetry & Custody Network
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
                    onClick={(e) => {
                      if (link.requiresAuth && !isAuthenticated) {
                        e.preventDefault();
                        setAuthReason('Please sign in or create an account to post a lost or found item.');
                        setAuthDefaultMode('login');
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-zinc-800/90 text-white border border-zinc-700/80 shadow-inner'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions & User Profile */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/report"
                onClick={handlePostItemClick}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-black" strokeWidth={2} />
                <span>Deploy Signal</span>
              </Link>

              {/* Authentication Status Pill */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 bg-[#12151e] hover:bg-[#181c28] rounded-xl transition-colors border border-[#232733] shadow-sm cursor-pointer"
                  >
                    <img
                      src={currentUser.avatarUrl || DEFAULT_AVATAR}
                      alt={currentUser.fullName}
                      className="w-7 h-7 rounded-lg object-cover bg-zinc-900 border border-zinc-700"
                    />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-zinc-100 leading-tight">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[9px] text-emerald-400 font-mono font-semibold leading-tight">
                        VERIFIED NODE
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 ml-0.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-[#12151e] rounded-2xl shadow-2xl border border-[#282d3c] py-2 z-50 animate-fade-in text-xs font-semibold">
                      <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                        <p className="text-white font-bold truncate">{currentUser.fullName}</p>
                        <p className="text-[11px] text-zinc-500 truncate font-mono">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setIsEditProfileModalOpen(true);
                        }}
                        className="w-full px-3 py-2 text-left text-zinc-300 hover:bg-zinc-800/60 flex items-center gap-2 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-emerald-400" />
                        Edit Profile
                      </button>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full px-3 py-2 text-left text-zinc-300 hover:bg-zinc-800/60 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                        Dashboard & Signals
                      </Link>

                      <div className="border-t border-zinc-800/80 my-1" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          dataStore.logout();
                        }}
                        className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthReason(undefined);
                    setAuthDefaultMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/80 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-900 cursor-pointer"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c0d12] border-b border-zinc-800 px-4 pt-2 pb-5 space-y-3">
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (link.requiresAuth && !isAuthenticated) {
                        e.preventDefault();
                        setAuthReason('Please sign in or create an account to post a lost or found item.');
                        setAuthDefaultMode('login');
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                      isActive
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-zinc-800 space-y-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-[#12151e] rounded-xl border border-zinc-800">
                    <img
                      src={currentUser.avatarUrl || DEFAULT_AVATAR}
                      alt={currentUser.fullName}
                      className="w-9 h-9 rounded-full object-cover bg-zinc-900"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsEditProfileModalOpen(true);
                    }}
                    className="w-full py-2 px-3 text-left text-xs font-semibold text-zinc-300 bg-zinc-900 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      dataStore.logout();
                    }}
                    className="w-full py-2 px-3 text-left text-xs font-semibold text-rose-400 bg-rose-950/30 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthReason(undefined);
                    setAuthDefaultMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-zinc-900 border border-zinc-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  Sign In
                </button>
              )}

              <Link
                href="/report"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handlePostItemClick(e);
                }}
                className="w-full py-2.5 bg-emerald-600 text-black text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-black" strokeWidth={2} />
                Deploy Signal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Auth and Edit Profile Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthReason(undefined);
        }}
        defaultMode={authDefaultMode}
        reason={authReason}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
      />
    </>
  );
}
