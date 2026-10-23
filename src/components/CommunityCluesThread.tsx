'use client';

import React, { useState, useEffect } from 'react';
import { Comment, CommentType } from '@/lib/types';
import { CURRENT_USER, DEFAULT_AVATAR, dataStore, openAuthModal } from '@/lib/store';
import { formatRelativeTime } from '@/lib/utils';
import {
  MessageSquare,
  Users,
  ShieldCheck,
  Send,
  Tag,
  Lightbulb,
  HelpCircle,
  Filter,
  LogIn,
  AlertCircle,
} from 'lucide-react';

interface CommunityCluesThreadProps {
  itemId: string;
  comments: Comment[];
  onAddComment: (comment: {
    itemId: string;
    userId: string;
    user: any;
    content: string;
    commentType: CommentType;
    taggedOwnerInfo?: string | null;
  }) => void;
}

export default function CommunityCluesThread({
  itemId,
  comments,
  onAddComment,
}: CommunityCluesThreadProps) {
  const [filter, setFilter] = useState<'ALL' | CommentType>('ALL');
  const [commentType, setCommentType] = useState<CommentType>('OWNER_LEAD');
  const [content, setContent] = useState('');
  const [taggedOwnerInfo, setTaggedOwnerInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => dataStore.getIsAuthenticated());

  useEffect(() => {
    setIsAuthenticated(dataStore.getIsAuthenticated());
    const unsub = dataStore.subscribe(() => {
      setIsAuthenticated(dataStore.getIsAuthenticated());
    });
    return unsub;
  }, []);

  const filteredComments = comments.filter((c) => {
    if (filter === 'ALL') return true;
    return c.commentType === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal({
        mode: 'login',
        reason: 'Please sign in or create an account to post clues, tag owners, or leave comments.',
      });
      return;
    }
    if (!content.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const activeUser = dataStore.getCurrentUser();
      onAddComment({
        itemId,
        userId: activeUser.id,
        user: activeUser,
        content: content.trim(),
        commentType,
        taggedOwnerInfo: commentType === 'OWNER_LEAD' && taggedOwnerInfo.trim() ? taggedOwnerInfo.trim() : null,
      });

      setContent('');
      setTaggedOwnerInfo('');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Community Clues & "Know the Owner" Thread
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Recognize this item? Bystanders and campus members can tag the owner or share verified leads.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setFilter('OWNER_LEAD')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
              filter === 'OWNER_LEAD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-3 h-3" />
            Owner Leads
          </button>
          <button
            onClick={() => setFilter('OFFICIAL_UPDATE')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'OFFICIAL_UPDATE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Updates
          </button>
          <button
            onClick={() => setFilter('GENERAL')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'GENERAL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            General
          </button>
        </div>
      </div>

      {/* New Lead Form or Sign-in prompt */}
      {!isAuthenticated ? (
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sign In to Post Community Clues</h4>
              <p className="text-xs text-slate-300">
                You must have an active account to share owner leads, tips, or questions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              openAuthModal({
                mode: 'login',
                reason: 'Please sign in or create an account to post community clues and leads.',
              })
            }
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <LogIn className="w-4 h-4" />
            Sign In / Register
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Post a Community Clue or Question
            </span>

            {/* Comment Type Selector */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setCommentType('OWNER_LEAD')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  commentType === 'OWNER_LEAD'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-3 h-3 text-indigo-500" />
                Owner Lead
              </button>
              <button
                type="button"
                onClick={() => setCommentType('GENERAL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  commentType === 'GENERAL'
                    ? 'bg-slate-200 text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                General Question
              </button>
              <button
                type="button"
                onClick={() => setCommentType('OFFICIAL_UPDATE')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  commentType === 'OFFICIAL_UPDATE'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Official Custody Update
              </button>
            </div>
          </div>

          {/* Tagged owner input (only if OWNER_LEAD) */}
          {commentType === 'OWNER_LEAD' && (
            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-0.5">
                  Tag or Mention Potential Owner
                </label>
                <input
                  type="text"
                  value={taggedOwnerInfo}
                  onChange={(e) => setTaggedOwnerInfo(e.target.value)}
                  placeholder="e.g. '@johndoe or student from Room 402 Architecture studio'"
                  className="w-full text-xs bg-white px-2.5 py-1.5 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Content text */}
          <div>
            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder={
                commentType === 'OWNER_LEAD'
                  ? "e.g., 'Saw this same backpack next to Sarah in the chemistry lab this morning. She was looking for it!'"
                  : commentType === 'OFFICIAL_UPDATE'
                  ? "e.g., 'Custody transferred to Campus Security Office Room 102 under custody log #4092.'"
                  : "Ask a general question about the item's location or status..."
              }
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400">
              Posting as <strong>{dataStore.getCurrentUser().fullName}</strong>
            </p>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Posting...' : 'Post Clue'}
            </button>
          </div>
        </form>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No clues or comments under this filter yet. Be the first to share a lead!
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isLead = comment.commentType === 'OWNER_LEAD';
            const isOfficial = comment.commentType === 'OFFICIAL_UPDATE';

            return (
              <div
                key={comment.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isLead
                    ? 'bg-indigo-50/40 border-indigo-200/80 shadow-xs'
                    : isOfficial
                    ? 'bg-blue-50/40 border-blue-200/80'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={comment.user?.avatarUrl || DEFAULT_AVATAR}
                      alt={comment.user?.fullName || 'User'}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 bg-white"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {comment.user?.fullName || 'Community Bystander'}
                        </span>
                        {isLead && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                            <Lightbulb className="w-2.5 h-2.5" />
                            Owner Lead
                          </span>
                        )}
                        {isOfficial && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Official Custody Update
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tagged owner banner if present */}
                {comment.taggedOwnerInfo && (
                  <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-indigo-200 text-xs text-indigo-900 font-semibold shadow-xs">
                    <Tag className="w-3 h-3 text-indigo-600" />
                    <span>Identified Owner Lead: {comment.taggedOwnerInfo}</span>
                  </div>
                )}

                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
