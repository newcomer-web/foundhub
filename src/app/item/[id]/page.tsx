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
} from 'lucide-react';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const [item, setItem] = useState<Item | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Modals state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  // AI Matches
  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>

        <div className="flex items-center gap-2">
          {/* Telegram Relay button */}
          <button
            onClick={() => setIsTelegramModalOpen(true)}
            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold border border-sky-200 transition-all flex items-center gap-1.5"
            title="Preview or dispatch Telegram channel broadcast"
          >
            <Send className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">Telegram Relay</span>
          </button>

          {/* Share & Printable Flyer button */}
          <button
            onClick={() => setIsFlyerModalOpen(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Share & Flyer QR</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Photo Gallery & Headline Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-[16/11] w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900 group">
            {item.imageUrls[activePhotoIndex] ? (
              <img
                src={item.imageUrls[activePhotoIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                No Photo Available
              </div>
            )}

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black shadow-lg ${
                  isFound ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {isFound ? 'FOUND ITEM' : 'LOST REPORT'}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
                  isReturned
                    ? 'bg-blue-600 text-white'
                    : isClaimPending
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/90 text-slate-900 border border-white/50'
                }`}
              >
                {isReturned ? '✓ Reunited to Owner' : isClaimPending ? 'Claim Pending' : 'Active'}
              </span>
            </div>

            {/* Zoom Inspection Trigger */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-md"
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
                  className={`relative w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                    activePhotoIndex === i
                      ? 'border-emerald-600 shadow-md scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
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
              {item.rewardAmount && (
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  ${item.rewardAmount} Reward Offered
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {item.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Anti-Fraud Protection Notice */}
          {item.secretVerificationQuestion && isFound && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-950 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Anti-Fraud Verification Enforced
              </div>
              <p className="text-xs text-emerald-800">
                To claim this item, claimant must answer the secret verification question set by the finder. Dishonest claims are blocked.
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
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5 text-white" />
                <span>Claim This Item (Prove Ownership)</span>
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
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Contact Finder / Custodian</span>
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
