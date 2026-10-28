'use client';

import React, { useEffect, useState } from 'react';
import { Item, CATEGORY_MAP } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { generateTelegramShareUrl, generateWhatsAppShareUrl } from '@/lib/telegram';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Share2,
  Send,
  MessageCircle,
  Copy,
  Check,
  MapPin,
  Building2,
  Calendar,
  ShieldCheck,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';

interface FlyerGeneratorModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export default function FlyerGeneratorModal({
  item,
  isOpen,
  onClose,
}: FlyerGeneratorModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      setOrigin(window.location.origin);
      QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
    setImageError(false);
  }, [item.id, isOpen]);

  if (!isOpen) return null;

  const isFound = item.type === 'FOUND';
  const categoryMeta = CATEGORY_MAP[item.category] || CATEGORY_MAP.OTHER;
  const telegramUrl = generateTelegramShareUrl(item, origin);
  const whatsAppUrl = generateWhatsAppShareUrl(item, origin);
  const hasValidPhoto = Boolean(item.imageUrls?.[0]) && !imageError;

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Fixed Header (Always visible at top, never scrolled away) */}
        <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Share2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                Share & Printable QR Flyer
              </h3>
              <p className="text-xs text-slate-300">
                Spread to community channels or print for notice boards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick Instant Share Bar */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Instant Social Channels
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-[#229ED9] hover:bg-[#1e8cc0] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Send className="w-4 h-4" />
                Share on Telegram
              </a>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Share on WhatsApp
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Link!' : 'Copy Item Link'}
              </button>
            </div>
          </div>

          {/* Printable Flyer Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-indigo-600" />
                Printable Notice Board Preview
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF Flyer
              </button>
            </div>

            {/* The Actual Flyer to Print */}
            <div
              id="printable-flyer"
              className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-dashed border-slate-300 shadow-xs text-slate-900 space-y-4 font-sans"
            >
              {/* Flyer Header Banner */}
              <div
                className={`text-center py-2.5 px-4 rounded-xl text-white font-extrabold tracking-wider text-sm sm:text-base uppercase flex items-center justify-center gap-2 shadow-xs ${
                  isFound ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  {isFound ? 'FOUND ITEM NOTICE' : 'LOST ITEM ALERT • REWARD OFFERED'}
                </span>
              </div>

              {/* Title & Category */}
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {item.title}
                </h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Category: {categoryMeta.label}
                  {item.rewardAmount ? ` • $${item.rewardAmount} REWARD OFFERED` : ''}
                </p>
              </div>

              {/* Grid: Photo + QR Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {hasValidPhoto ? (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                      <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-slate-400">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <span className="text-xs font-bold text-slate-500">No Photo Provided</span>
                      <span className="text-[10px] text-slate-400">
                        Detailed markings described below
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan QR code"
                      className="w-32 h-32 rounded-xl border border-slate-200 shadow-xs bg-white p-1"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-xl" />
                  )}
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">
                    Scan with phone camera to view full report & verify ownership
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold">FoundHub Network</p>
                </div>
              </div>

              {/* Details List */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" strokeWidth={1.75} />
                  <span>
                    <strong>Incident Location:</strong> {item.incidentLocation}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500 shrink-0" strokeWidth={1.75} />
                  <span>
                    <strong>Current Custody:</strong> {item.currentHoldingLocation}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" strokeWidth={1.75} />
                  <span>
                    <strong>Incident Date:</strong> {formatDate(item.eventDate)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-xs text-slate-700 italic border-l-2 border-emerald-500 pl-3 py-0.5">
                  "{item.description}"
                </p>
              )}

              {/* Anti-Fraud Disclaimer */}
              <div className="text-[10px] text-center text-slate-500 pt-3 border-t border-slate-200 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Protected by FoundHub Anti-Fraud Verification. Claimants must answer proof-of-ownership verification before retrieval.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
