'use client';

import React, { useEffect, useState } from 'react';
import { Item } from '@/lib/types';
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
  QrCode,
  MapPin,
  Building2,
  Calendar,
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
  }, [item.id]);

  if (!isOpen) return null;

  const isFound = item.type === 'FOUND';
  const telegramUrl = generateTelegramShareUrl(item, origin);
  const whatsAppUrl = generateWhatsAppShareUrl(item, origin);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Share2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Share & Printable QR Flyer</h3>
              <p className="text-xs text-slate-300">Spread the word to campus and community channels</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Instant Share Bar */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              One-Click Instant Sharing
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-[#229ED9] hover:bg-[#1e8cc0] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                Share on Telegram
              </a>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Share on WhatsApp
              </a>

              <button
                onClick={handleCopy}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Link!' : 'Copy Item Link'}
              </button>
            </div>
          </div>

          {/* Printable Flyer Preview Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-indigo-600" />
                Community Board Printable Flyer Preview
              </span>
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF Flyer
              </button>
            </div>

            {/* The Actual Flyer to Print */}
            <div
              id="printable-flyer"
              className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-300 shadow-inner text-slate-900 space-y-4 font-sans"
            >
              {/* Flyer Header Banner */}
              <div
                className={`text-center py-3 px-4 rounded-xl text-white font-black tracking-widest text-xl uppercase ${
                  isFound ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                {isFound ? '★ FOUND ITEM NOTICE ★' : '★ REWARD: LOST ITEM ★'}
              </div>

              {/* Title & Category */}
              <div className="text-center space-y-1">
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {item.title}
                </h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Category: {item.category.replace(/_/g, ' ')}
                  {item.rewardAmount ? ` • $${item.rewardAmount} REWARD OFFERED` : ''}
                </p>
              </div>

              {/* Grid: Photo + QR Code */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  {item.imageUrls[0] ? (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan QR code"
                      className="w-32 h-32 rounded-lg border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-lg" />
                  )}
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">
                    Scan with phone camera to view full report & verify ownership
                  </p>
                  <p className="text-[9px] text-slate-500 font-mono">FoundHub.app</p>
                </div>
              </div>

              {/* Details List */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Incident Location:</strong> {item.incidentLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span><strong>Current Custody:</strong> {item.currentHoldingLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Date:</strong> {formatDate(item.eventDate)}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 italic border-l-2 border-slate-300 pl-3">
                "{item.description}"
              </p>

              {/* Anti-Fraud Disclaimer */}
              <div className="text-[10px] text-center text-slate-500 pt-2 border-t border-slate-200">
                🔒 Protected by FoundHub Proof-of-Ownership Verification System. Claimant must answer the secret verification question.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
