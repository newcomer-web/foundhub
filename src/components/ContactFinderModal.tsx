'use client';

import React from 'react';
import { Item } from '@/lib/types';
import { X, AlertTriangle, ShieldCheck, Send, Phone, MessageSquare, Building2 } from 'lucide-react';

interface ContactFinderModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactFinderModal({
  item,
  isOpen,
  onClose,
}: ContactFinderModalProps) {
  if (!isOpen) return null;

  const isFound = item.type === 'FOUND';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isFound ? 'Contact Finder / Custodian' : 'Contact Reporter'}
              </h3>
              <p className="text-xs text-slate-300">{item.user?.fullName || 'Community Member'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Safety Notice Banner */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              <strong>Safety Notice:</strong> Always meet in a well-lit, public location (police stations, malls, campus offices). Never transfer money in advance.
            </p>
          </div>

          {/* Holding location reminder */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Holding Location:
            </span>
            <p className="text-slate-900 font-medium">{item.currentHoldingLocation}</p>
          </div>

          {/* Contact options */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Preferred Contact Channel
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
                <Send className="w-4 h-4 text-emerald-600" />
                {item.finderContactPreference}
              </div>
              <p className="text-xs text-emerald-800">
                This finder has indicated they prefer communications through the above channel.
              </p>
            </div>

            {item.user?.telegramUsername && (
              <a
                href={`https://t.me/${item.user.telegramUsername.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                Open in Telegram (@{item.user.telegramUsername.replace('@', '')})
              </a>
            )}

            {item.user?.phone && (
              <a
                href={`tel:${item.user.phone}`}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                Call Phone ({item.user.phone})
              </a>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
