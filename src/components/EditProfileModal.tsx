'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/types';
import { dataStore, DEFAULT_AVATAR } from '@/lib/store';
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Send,
  Camera,
  RotateCcw,
  CheckCircle,
  Save,
  ShieldCheck,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const [user, setUser] = useState<User>(() => dataStore.getCurrentUser());
  const [fullName, setFullName] = useState(user.fullName || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [telegramUsername, setTelegramUsername] = useState(user.telegramUsername || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || DEFAULT_AVATAR);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const current = dataStore.getCurrentUser();
      setUser(current);
      setFullName(current.fullName || '');
      setEmail(current.email || '');
      setPhone(current.phone || '');
      setTelegramUsername(current.telegramUsername || '');
      setAvatarUrl(current.avatarUrl || DEFAULT_AVATAR);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Rasm hajmi 5MB dan oshmasligi kerak.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToDefaultAvatar = () => {
    setAvatarUrl(DEFAULT_AVATAR);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Iltimos, ism-familiyangizni kiriting.');
      return;
    }

    dataStore.updateUserProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      telegramUsername: telegramUsername.trim().replace(/^@/, '') || null,
      avatarUrl: avatarUrl || DEFAULT_AVATAR,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <UserIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Profilni Tahrirlash</h3>
              <p className="text-xs text-slate-300">Shaxsiy ma'lumotlar va profilingiz rasmi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {savedSuccess && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center gap-2 text-xs font-bold animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profil ma'lumotlari muvaffaqiyatli saqlandi!</span>
            </div>
          )}

          {/* Profile Photo Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="relative group shrink-0">
              <img
                src={avatarUrl || DEFAULT_AVATAR}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-md bg-white"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Rasm yuklash"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <p className="text-xs font-bold text-slate-900">Profilingiz Rasmi</p>
              <p className="text-[11px] text-slate-500">
                Siz yuklagan rasm default holatda turadi. O'z xohishingizga ko'ra yangi rasm yuklashingiz mumkin.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Rasm yuklash
                </button>

                {avatarUrl !== DEFAULT_AVATAR && (
                  <button
                    type="button"
                    onClick={handleResetToDefaultAvatar}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    Default rasm
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ism va Familiya <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masalan: Sardor Aliyev"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Manzil
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Telefon Raqam (Bog'lanish uchun)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 (90) 123-45-67"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Telegram Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Telegram Username (@belgisiz)
              </label>
              <div className="relative">
                <Send className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="masalan: sardor_dev"
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                E'lonlaringizda topuvchi yoki egasi siz bilan Telegram orqali oson bog'lanishi mumkin bo'ladi.
              </p>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
