'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Item, ItemClaim, User } from '@/lib/types';
import { dataStore, DEFAULT_AVATAR } from '@/lib/store';
import { getSimulatedTelegramFeed, TelegramRelayMessage } from '@/lib/telegram';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import confetti from 'canvas-confetti';
import EditProfileModal from '@/components/EditProfileModal';
import AuthModal from '@/components/AuthModal';
import {
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Archive,
  ArrowRight,
  Send,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  RotateCcw,
  Clock,
  User as UserIcon,
  Radio,
  FileText,
  Edit3,
  LogIn,
} from 'lucide-react';

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState<'incoming_claims' | 'my_listings' | 'my_claims' | 'telegram_feed'>('incoming_claims');
  const [telegramFeed, setTelegramFeed] = useState<TelegramRelayMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(() => dataStore.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => dataStore.getIsAuthenticated());
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    setItems(dataStore.getItems());
    setTelegramFeed(getSimulatedTelegramFeed());
    setCurrentUser(dataStore.getCurrentUser());
    setIsAuthenticated(dataStore.getIsAuthenticated());

    const unsub = dataStore.subscribe(() => {
      setItems(dataStore.getItems());
      setTelegramFeed(getSimulatedTelegramFeed());
      setCurrentUser(dataStore.getCurrentUser());
      setIsAuthenticated(dataStore.getIsAuthenticated());
    });
    return unsub;
  }, []);

  // Items created by current user
  const myListings = items.filter((i) => i.userId === currentUser.id);

  // Incoming claims on items created by current user
  const incomingClaimsList: { item: Item; claim: ItemClaim }[] = [];
  items.forEach((item) => {
    if (item.claims && item.claims.length > 0) {
      item.claims.forEach((claim) => {
        incomingClaimsList.push({ item, claim });
      });
    }
  });

  // Claims submitted by current user
  const mySubmittedClaims: { item: Item; claim: ItemClaim }[] = [];
  items.forEach((item) => {
    if (item.claims) {
      item.claims.forEach((claim) => {
        if (claim.claimantId === currentUser.id) {
          mySubmittedClaims.push({ item, claim });
        }
      });
    }
  });

  const handleResolveClaim = (itemId: string, claimId: string, status: 'ACCEPTED' | 'REJECTED') => {
    const success = dataStore.resolveClaim(itemId, claimId, status);
    if (success && status === 'ACCEPTED') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleUpdateItemStatus = (itemId: string, status: any) => {
    dataStore.updateItemStatus(itemId, status);
  };

  const handleResetData = () => {
    if (confirm('Reset mock database to initial seed data?')) {
      dataStore.resetToDefaults();
    }
  };

  const pendingIncomingCount = incomingClaimsList.filter((c) => c.claim.status === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            onClick={() => {
              if (!isAuthenticated) {
                setIsAuthOpen(true);
              } else {
                setIsEditProfileOpen(true);
              }
            }}
            className="relative group cursor-pointer shrink-0"
            title="Change avatar photo"
          >
            <img
              src={currentUser.avatarUrl || DEFAULT_AVATAR}
              alt={currentUser.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm bg-white"
            />
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {currentUser.fullName}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {isAuthenticated ? 'Active Member' : 'Guest Account'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span>{currentUser.email}</span>
              {currentUser.telegramUsername && (
                <span>• Telegram: <strong>@{currentUser.telegramUsername}</strong></span>
              )}
              {currentUser.phone && (
                <span>• Tel: <strong>{currentUser.phone}</strong></span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setIsAuthOpen(true);
              } else {
                setIsEditProfileOpen(true);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            Edit Profile
          </button>

          {!isAuthenticated && (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

          <button
            onClick={handleResetData}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset to initial mock items"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data
          </button>

          <Link
            href="/report"
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                setIsAuthOpen(true);
              }
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Post Item
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('incoming_claims')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'incoming_claims'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Review Incoming Claims
          {pendingIncomingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
              {pendingIncomingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my_listings')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'my_listings'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          My Submitted Listings ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('my_claims')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'my_claims'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          Claims I Submitted ({mySubmittedClaims.length})
        </button>

        <button
          onClick={() => setActiveTab('telegram_feed')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'telegram_feed'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4 text-sky-200" />
          Live Telegram Broadcast Feed ({telegramFeed.length})
        </button>
      </div>

      {/* TAB 1: Incoming Claims Review */}
      {activeTab === 'incoming_claims' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Anti-Fraud Ownership Claims Verification Center
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review answers to your secret challenge question. Accept only if claimant accurately describes undisclosed markers.
            </p>
          </div>

          {incomingClaimsList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
              No ownership claims submitted on your items yet.
            </div>
          ) : (
            <div className="space-y-4">
              {incomingClaimsList.map(({ item, claim }) => {
                const isPending = claim.status === 'PENDING';
                const isAccepted = claim.status === 'ACCEPTED';
                const isRejected = claim.status === 'REJECTED';

                return (
                  <div
                    key={claim.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrls[0]}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <Link href={`/item/${item.id}`} className="font-bold text-sm text-slate-900 hover:underline">
                            {item.title}
                          </Link>
                          <p className="text-xs text-slate-500">
                            Current Holding: <strong>{item.currentHoldingLocation}</strong>
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${
                          isAccepted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200 animate-pulse'
                        }`}
                      >
                        {claim.status === 'PENDING' ? 'Verification Required' : claim.status}
                      </span>
                    </div>

                    {/* Secret Question vs Claimant Proof */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {item.secretVerificationQuestion && (
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                          <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                            Your Challenge Question:
                          </span>
                          <p className="text-slate-800 font-semibold italic">
                            "{item.secretVerificationQuestion}"
                          </p>
                        </div>
                      )}

                      <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold uppercase tracking-wider text-emerald-900 text-[10px]">
                            Claimant's Submitted Proof:
                          </span>
                          <span className="text-[10px] text-emerald-700">
                            By {claim.claimant?.fullName || 'Claimant'} ({formatRelativeTime(claim.createdAt)})
                          </span>
                        </div>
                        <p className="text-slate-900 font-medium whitespace-pre-wrap">
                          "{claim.proofMessage}"
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-slate-500">
                        {claim.claimant?.telegramUsername && (
                          <span className="mr-3">
                            Telegram: <strong>@{claim.claimant.telegramUsername}</strong>
                          </span>
                        )}
                        {claim.claimant?.phone && (
                          <span>
                            Phone: <strong>{claim.claimant.phone}</strong>
                          </span>
                        )}
                      </div>

                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResolveClaim(item.id, claim.id, 'REJECTED')}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject Claim
                          </button>
                          <button
                            onClick={() => handleResolveClaim(item.id, claim.id, 'ACCEPTED')}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Accept & Reconcile Item
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-500">
                          Resolved on {formatDate(claim.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: My Listings */}
      {activeTab === 'my_listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Items You Reported</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update holding status, archive old listings, or view public pages.
              </p>
            </div>
          </div>

          {myListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
              You haven't posted any items yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            item.type === 'FOUND'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.type}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-1">
                          {item.title}
                        </h3>
                      </div>
                      <img
                        src={item.imageUrls[0]}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.incidentLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">Holding: {item.currentHoldingLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {/* Status change selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400">Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateItemStatus(item.id, e.target.value)}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="CLAIM_PENDING">CLAIM PENDING</option>
                        <option value="RETURNED_TO_OWNER">RETURNED TO OWNER</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>

                    <Link
                      href={`/item/${item.id}`}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: My Claims */}
      {activeTab === 'my_claims' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Submitted Claims</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track the progress of ownership proofs you submitted to finders.
            </p>
          </div>

          {mySubmittedClaims.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
              You haven't claimed any items yet.
            </div>
          ) : (
            <div className="space-y-3">
              {mySubmittedClaims.map(({ item, claim }) => (
                <div
                  key={claim.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrls[0]}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <Link href={`/item/${item.id}`} className="font-bold text-sm text-slate-900 hover:underline">
                        {item.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Reported by: {item.user?.fullName} • Custody: {item.currentHoldingLocation}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 italic">
                        Proof submitted: "{claim.proofMessage}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        claim.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                    <Link
                      href={`/item/${item.id}`}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                    >
                      View Item
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Telegram Live Broadcast Feed */}
      {activeTab === 'telegram_feed' && (
        <div className="space-y-4">
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500 text-white rounded-xl">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                  Community Telegram Channel Hook Simulation
                </h3>
                <p className="text-xs text-sky-800">
                  Channel: <strong>@FoundHub_Official_Community</strong> • Relays verified items instantly.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl">
            {telegramFeed.map((msg) => (
              <div
                key={msg.id}
                className="bg-[#0e1621] text-white p-5 rounded-3xl border border-slate-700 shadow-lg space-y-3 font-sans"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-[#229ED9]">FoundHub Community Bot</span>
                  <span>{formatRelativeTime(msg.sentAt)}</span>
                </div>

                {msg.photoUrl && (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden">
                    <img src={msg.photoUrl} alt="telegram" className="w-full h-full object-cover" />
                  </div>
                )}

                <div
                  className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <Link
                    href={`/item/${msg.itemId}`}
                    className="px-4 py-1.5 bg-[#229ED9] hover:bg-[#1e8cc0] text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Open in FoundHub →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile and Auth Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
