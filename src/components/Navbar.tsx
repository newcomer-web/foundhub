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
  Compass,
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
    { label: 'Explore Items', href: '/', icon: Compass },
    { label: 'Report Lost or Found', href: '/report', icon: PlusCircle, requiresAuth: true },
    { label: 'Dashboard & Claims', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <BrandLogo size={40} className="w-10 h-10 group-hover:scale-105 transition-transform shrink-0" />
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
                onClick={handlePostItemClick}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Post Item
              </Link>

              {/* Authentication Status Pill */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200 cursor-pointer"
                  >
                    <img
                      src={currentUser.avatarUrl || DEFAULT_AVATAR}
                      alt={currentUser.fullName}
                      className="w-7 h-7 rounded-lg object-cover bg-white"
                    />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-slate-900 leading-tight">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[9px] text-emerald-600 font-semibold leading-tight">
                        Active Member
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in text-xs font-semibold">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-slate-900 font-bold truncate">{currentUser.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setIsEditProfileModalOpen(true);
                        }}
                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 text-emerald-600" />
                        Edit Profile
                      </button>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                        Dashboard
                      </Link>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          dataStore.logout();
                        }}
                        className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
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
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  Sign In / Register
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
                aria-label="Menu"
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
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
                    <img
                      src={currentUser.avatarUrl || DEFAULT_AVATAR}
                      alt={currentUser.fullName}
                      className="w-9 h-9 rounded-full object-cover bg-white"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                      <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsEditProfileModalOpen(true);
                    }}
                    className="w-full py-2 px-3 text-left text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-600" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      dataStore.logout();
                    }}
                    className="w-full py-2 px-3 text-left text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
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
                  className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  Sign In / Register
                </button>
              )}

              <Link
                href="/report"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handlePostItemClick(e);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Post an Item
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
