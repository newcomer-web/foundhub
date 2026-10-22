'use client';

import React, { useState } from 'react';
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
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setTimeout(() => {
      if (mode === 'login') {
        dataStore.login(email.trim(), fullName.trim() || undefined);
        setSuccessMsg("Tizimga muvaffaqiyatli kirdingiz!");
      } else {
        dataStore.register({
          fullName: fullName.trim() || 'Community Member',
          email: email.trim(),
          phone: phone.trim() || undefined,
          telegramUsername: telegramUsername.trim() || undefined,
          avatarUrl: DEFAULT_AVATAR,
        });
        setSuccessMsg("Akkauntingiz yaratildi va tizimga kirdingiz!");
      }

      setLoading(false);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    dataStore.login('member@foundhub.app', 'Community Member');
    setSuccessMsg("Tezkor profil bilan kirildi!");
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              {mode === 'login' ? <LogIn className="w-5 h-5 text-emerald-400" /> : <UserPlus className="w-5 h-5 text-emerald-400" />}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {mode === 'login' ? 'FoundHub-ga Kirish' : 'Yangi Akkaunt Ochish'}
              </h3>
              <p className="text-xs text-slate-300">
                {mode === 'login' ? 'E\'lonlar va da\'volarni boshqarish' : 'Jamoaga qo\'shiling va buyumlarni qaytaring'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
            Kirish (Sign In)
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
            Ro'yxatdan o'tish (Sign Up)
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ism va Familiya <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masalan: Aziz Rahimov"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Manzil <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Parol <span className="text-rose-500">*</span>
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
                  Telefon Raqam
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
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
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                'Bajarilmoqda...'
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Kirish
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Ro'yxatdan o'tish
                </>
              )}
            </button>

            {mode === 'login' && (
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Tezkor Mehmon/A'zo sifatida kirish
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
