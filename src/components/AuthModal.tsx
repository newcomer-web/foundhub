'use client';

import React, { useState, useEffect } from 'react';
import { dataStore, DEFAULT_AVATAR } from '@/lib/store';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Send,
  CheckCircle2,
  UserCheck,
  Info,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  reason?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'login',
  reason,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setSuccessMsg('');
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setTimeout(() => {
      if (mode === 'login') {
        dataStore.login(email.trim(), fullName.trim() || undefined);
        setSuccessMsg('Signed in successfully!');
      } else {
        dataStore.register({
          fullName: fullName.trim() || 'Community Member',
          email: email.trim(),
          phone: phone.trim() || undefined,
          telegramUsername: telegramUsername.trim() || undefined,
          avatarUrl: DEFAULT_AVATAR,
        });
        setSuccessMsg('Account created and signed in successfully!');
      }

      setLoading(false);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 900);
    }, 350);
  };

  const handleQuickDemoLogin = () => {
    dataStore.login('member@foundhub.app', 'Community Member');
    setSuccessMsg('Signed in as demo member!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              {mode === 'login' ? (
                <LogIn className="w-5 h-5 text-emerald-400" />
              ) : (
                <UserPlus className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {mode === 'login' ? 'Sign In to FoundHub' : 'Create an Account'}
              </h3>
              <p className="text-xs text-slate-300">
                {mode === 'login'
                  ? 'Access listings, claims, and messages'
                  : 'Join the community to reunite belongings safely'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason banner if triggered by a protected action */}
        {reason && (
          <div className="p-3 bg-amber-50 border-b border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{reason}</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Telegram Username
                </label>
                <div className="relative">
                  <Send className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="@username"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                'Processing...'
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>

            {mode === 'login' && (
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                Quick Demo Member Sign-in
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
