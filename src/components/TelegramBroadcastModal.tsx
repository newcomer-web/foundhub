'use client';

import React, { useState } from 'react';
import { Item } from '@/lib/types';
import { formatTelegramPost, dispatchTelegramBroadcast } from '@/lib/telegram';
import { Send, CheckCircle, ExternalLink, Bot, Radio, X } from 'lucide-react';

interface TelegramBroadcastModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export default function TelegramBroadcastModal({
  item,
  isOpen,
  onClose,
}: TelegramBroadcastModalProps) {
  const [broadcasted, setBroadcasted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://foundhub.app';
  const postPreview = formatTelegramPost(item, origin);

  const handleBroadcast = () => {
    setLoading(true);
    setTimeout(() => {
      dispatchTelegramBroadcast(item, origin);
      setLoading(false);
      setBroadcasted(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#229ED9] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Telegram Community Channel Bot</h3>
              <p className="text-xs text-sky-100">Automated Instant Messaging Webhook</p>
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
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            FoundHub automatically relays verified listings to the <strong>@FoundHub_Community</strong> Telegram channel so neighborhood and campus members get notified immediately.
          </p>

          {/* Telegram Message Mockup */}
          <div className="p-4 bg-[#0e1621] text-white rounded-2xl border border-slate-700 font-sans space-y-3 shadow-inner">
            <div className="flex items-center gap-2 border-b border-slate-700/80 pb-2">
              <div className="w-6 h-6 rounded-full bg-[#229ED9] flex items-center justify-center text-white text-[10px] font-bold">
                FH
              </div>
              <div>
                <span className="text-xs font-bold text-[#229ED9]">FoundHub Bot</span>
                <span className="text-[10px] text-slate-400 ml-2">channel • just now</span>
              </div>
            </div>

            {item.imageUrls[0] && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                <img
                  src={item.imageUrls[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              className="text-xs text-slate-200 leading-relaxed font-sans space-y-1.5 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: postPreview }}
            />
          </div>

          {/* Actions */}
          <div className="pt-2">
            {broadcasted ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Successfully broadcasted to @FoundHub_Community channel!
                </span>
                <button
                  onClick={onClose}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBroadcast}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1e8cc0] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? 'Transmitting to Channel...' : 'Dispatch Telegram Relay'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
