'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Item, CATEGORY_MAP } from '@/lib/types';
import { dataStore, CURRENT_USER, openAuthModal } from '@/lib/store';
import { findSmartMatches, MatchResult } from '@/lib/aiMatching';
import CustodyInfoCard from '@/components/CustodyInfoCard';
import ClaimModal from '@/components/ClaimModal';
import ContactFinderModal from '@/components/ContactFinderModal';
import CommunityCluesThread from '@/components/CommunityCluesThread';
import FlyerGeneratorModal from '@/components/FlyerGeneratorModal';
import TelegramBroadcastModal from '@/components/TelegramBroadcastModal';
import SmartMatchBanner from '@/components/SmartMatchBanner';
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  Share2,
  Send,
  Building2,
  Calendar,
  MapPin,
  MessageSquare,
  Sparkles,
  Maximize2,
  CheckCircle,
  Clock,
  Printer,
  HelpCircle,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [item, setItem] = useState<Item | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [mainImageError, setMainImageError] = useState(false);

  // Modals state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  // AI Matches
  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    setMainImageError(false);
    const current = dataStore.getItemById(itemId);
    if (current) {
      setItem(current);
      // Run AI matcher for counter-part items
      const allItems = dataStore.getItems();
      const detected = findSmartMatches(
        {
          type: current.type,
          category: current.category,
          title: current.title,
          description: current.description,
          latitude: current.latitude,
          longitude: current.longitude,
          eventDate: current.eventDate,
        },
        allItems
      );
      setMatches(detected);
    }

    const unsub = dataStore.subscribe(() => {
      const updated = dataStore.getItemById(itemId);
      if (updated) setItem({ ...updated });
    });
    return unsub;
  }, [itemId]);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Item Not Found</h2>
        <p className="text-xs text-slate-500">The listing might have been removed or archived.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Exploration
        </Link>
      </div>
    );
  }

  const isFound = item.type === 'FOUND';
  const isReturned = item.status === 'RETURNED_TO_OWNER';
  const isClaimPending = item.status === 'CLAIM_PENDING';
  const categoryMeta = CATEGORY_MAP[item.category] || CATEGORY_MAP.OTHER;
  const caseId = `FH-${(item.id || '0000').slice(0, 6).toUpperCase()}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Archival Case File Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/90">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors p-1.5 -ml-1.5 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Noticeboard</span>
          </Link>
          <span className="text-stone-300">/</span>
          <span className="font-mono text-xs font-semibold text-stone-500">
            CASE #{caseId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Telegram Relay button */}
          <button
            onClick={() => setIsTelegramModalOpen(true)}
            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold border border-sky-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Preview or dispatch Telegram channel broadcast"
          >
            <Send className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Telegram Relay</span>
          </button>

          {/* Share & Printable Flyer button */}
          <button
            onClick={() => setIsFlyerModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-bold border border-stone-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print Street Flyer (QR)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Photo Gallery & Headline Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs bg-stone-900 group">
            {item.imageUrls[activePhotoIndex] && !mainImageError ? (
              <img
                src={item.imageUrls[activePhotoIndex]}
                alt={item.title}
                onError={() => setMainImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 gap-2 p-6 border-b border-stone-200/60">
                <div className="p-4 bg-stone-200/60 rounded-2xl border border-stone-300/60 text-stone-500">
                  <ImageIcon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-stone-600">No Photo Attached</span>
                <span className="text-[11px] text-stone-400 font-sans">Physical description and holding custody recorded below</span>
              </div>
            )}

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
              <span
                className={`px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider font-bold shadow-md ${
                  isFound ? 'bg-emerald-800 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {isFound ? 'IN SAFE CUSTODY' : 'MISSING NOTICE'}
              </span>

              <span
                className={`px-3 py-1 rounded-md text-xs font-bold shadow-md backdrop-blur-md ${
                  isReturned
                    ? 'bg-blue-600 text-white'
                    : isClaimPending
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/95 text-stone-900 border border-stone-200'
                }`}
              >
                {isReturned ? 'Reunited to Owner' : isClaimPending ? 'Claim Pending' : 'Active Notice'}
              </span>
            </div>

            {/* Zoom Inspection Trigger */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-md cursor-pointer"
              aria-label="Inspect Full Photo"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails row if multiple photos */}
          {item.imageUrls.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {item.imageUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIndex(i)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIndex === i
                      ? 'border-emerald-700 shadow-sm scale-102'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Core Badges & Claim Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${categoryMeta.badgeClass}`}>
                {categoryMeta.label}
              </span>
              {item.rewardAmount && !isReturned && (
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 flex items-center gap-1 shadow-2xs font-mono">
                  <Award className="w-3.5 h-3.5" />
                  ${item.rewardAmount} REWARD OFFERED
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {item.title}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Anti-Fraud Protection Notice */}
          {item.secretVerificationQuestion && isFound && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/90 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-950 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Anti-Fraud Proof Question Active
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                To prevent false claims, claimant must answer the confidential verification challenge set by the custodian.
              </p>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            {isFound && !isReturned && (
              <button
                onClick={() => {
                  if (!dataStore.getIsAuthenticated()) {
                    openAuthModal({
                      mode: 'login',
                      reason: 'Please sign in or create an account to submit a proof-of-ownership claim.',
                    });
                    return;
                  }
                  setIsClaimModalOpen(true);
                }}
                className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-white" />
                <span>Claim This Belonging (Prove Ownership)</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!dataStore.getIsAuthenticated()) {
                  openAuthModal({
                    mode: 'login',
                    reason: 'Please sign in or create an account to view custodian contact information.',
                  });
                  return;
                }
                setIsContactModalOpen(true);
              }}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Contact Custodian / Finder</span>
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED METADATA BOX (Prominently Under the Item Photo) */}
      <section className="space-y-2">
        <CustodyInfoCard
          item={item}
          onContactClick={() => setIsContactModalOpen(true)}
        />
      </section>

      {/* Smart AI Matching Suggestions if counter items detected */}
      {matches.length > 0 && (
        <section>
          <SmartMatchBanner matches={matches} targetType={item.type} />
        </section>
      )}

      {/* Community Clues & "Know the Owner" Thread */}
      <section>
        <CommunityCluesThread
          itemId={item.id}
          comments={item.comments || []}
          onAddComment={(commentData) => {
            dataStore.addComment(item.id, commentData);
          }}
        />
      </section>

      {/* Modals */}
      <ClaimModal
        item={item}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onClaimSubmitted={(newClaim) => {
          dataStore.addClaim(item.id, newClaim);
        }}
      />

      <ContactFinderModal
        item={item}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <FlyerGeneratorModal
        item={item}
        isOpen={isFlyerModalOpen}
        onClose={() => setIsFlyerModalOpen(false)}
      />

      <TelegramBroadcastModal
        item={item}
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      {/* Full-screen Photo Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsZoomOpen(false)}
        >
          <img
            src={item.imageUrls[activePhotoIndex]}
            alt={item.title}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
