'use client';

import React, { useState } from 'react';
import { Item } from '@/lib/types';
import { dataStore, openAuthModal } from '@/lib/store';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, X, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClaimModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onClaimSubmitted: (claim: any) => void;
}

export default function ClaimModal({
  item,
  isOpen,
  onClose,
  onClaimSubmitted,
}: ClaimModalProps) {
  const [proofMessage, setProofMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataStore.getIsAuthenticated()) {
      openAuthModal({
        mode: 'login',
        reason: 'Please sign in or create an account to submit a proof-of-ownership claim.',
      });
      return;
    }
    if (!proofMessage.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      const activeUser = dataStore.getCurrentUser();
      onClaimSubmitted({
        itemId: item.id,
        claimantId: activeUser.id,
        claimant: activeUser,
        proofMessage,
      });

      setTimeout(() => {
        setSuccess(false);
        setProofMessage('');
        onClose();
      }, 2400);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Proof-of-Ownership Verification</h3>
              <p className="text-xs text-emerald-100">Anti-Fraud Security System</p>
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Claim Submitted Successfully!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your proof has been confidentially routed to the finder (<strong>{item.user?.fullName}</strong>) for review in their dashboard.
              </p>
            </div>
          ) : (
            <>
              {/* Safety Notice Sticky / Prominent Banner */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/90 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed font-medium">
                  <strong>Safety Notice:</strong> Always meet in a well-lit, public location (police stations, malls, campus security offices). Never transfer money or payments in advance.
                </div>
              </div>

              {/* Secret Question Box (if set) */}
              {item.secretVerificationQuestion ? (
                <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    <ShieldAlert className="w-4 h-4 text-emerald-600" />
                    Finder’s Secret Challenge Question
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900 bg-white p-3 rounded-xl border border-emerald-100 italic">
                    "{item.secretVerificationQuestion}"
                  </p>
                  <p className="mt-1.5 text-[11px] text-emerald-700">
                    Provide the exact answer below. Only the genuine owner should know this detail.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 mb-1">Standard Ownership Verification</p>
                  Describe unique, unphotographed markers, engravings, lock screen backgrounds, or card details to prove this item belongs to you.
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Verification Proof & Answer <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={proofMessage}
                    onChange={(e) => setProofMessage(e.target.value)}
                    required
                    placeholder="Provide specific details: e.g., 'The sticker next to the keyboard is an indie band sticker', serial numbers, lock screens, exact card brands..."
                    className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm resize-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Submitted privately to the finder. Not visible in public comment threads.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !proofMessage.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Verifying...' : 'Submit Ownership Claim'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
