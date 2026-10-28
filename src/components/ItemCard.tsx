'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Item, CATEGORY_MAP } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import {
  MapPin,
  Building2,
  Calendar,
  ShieldCheck,
  Award,
  ArrowRight,
  Laptop,
  FileText,
  Briefcase,
  Key,
  Watch,
  Shirt,
  Dog,
  HelpCircle,
} from 'lucide-react';

interface ItemCardProps {
  item: Item;
}

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  Laptop,
  FileText,
  Briefcase,
  Key,
  Watch,
  Shirt,
  Dog,
  HelpCircle,
};

export default function ItemCard({ item }: ItemCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const isFound = item.type === 'FOUND';
  const categoryMeta = CATEGORY_MAP[item.category] || CATEGORY_MAP.OTHER;
  const CategoryIcon = ICON_COMPONENTS[categoryMeta.iconName] || HelpCircle;

  const isReturned = item.status === 'RETURNED_TO_OWNER';
  const isClaimPending = item.status === 'CLAIM_PENDING';
  const hasValidPhoto = Boolean(item.imageUrls && item.imageUrls[0]) && !imageError;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Media Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {hasValidPhoto ? (
          <img
            src={item.imageUrls[0]}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2 p-4">
            <CategoryIcon className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
              {categoryMeta.label}
            </span>
          </div>
        )}

        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black tracking-wide shadow-md ${
              isFound
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isFound ? 'FOUND ITEM' : 'LOST REPORT'}
          </span>

          {/* Status pill */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md ${
              isReturned
                ? 'bg-blue-600 text-white'
                : isClaimPending
                ? 'bg-purple-600 text-white'
                : 'bg-white/90 text-slate-900 border border-white/50'
            }`}
          >
            {isReturned
              ? 'Reunited'
              : isClaimPending
              ? 'Claim Pending'
              : 'Active'}
          </span>
        </div>

        {/* Category Pill Floating on Bottom Left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/20">
          <CategoryIcon className="w-3.5 h-3.5 text-white" strokeWidth={1.75} />
          <span>{categoryMeta.label}</span>
        </div>

        {/* Reward amount tag if available */}
        {item.rewardAmount && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
            <Award className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>${item.rewardAmount} Reward</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <Link href={`/item/${item.id}`} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
              {item.title}
            </h3>
          </Link>

          {/* Incident location */}
          <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span className="line-clamp-1">{item.incidentLocation}</span>
          </div>

          {/* Current Holding Location pill */}
          <div className="mt-2 flex items-start gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span className="font-medium line-clamp-1">
              <strong className="text-slate-900">Holding:</strong> {item.currentHoldingLocation}
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatRelativeTime(item.eventDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            {item.secretVerificationQuestion && isFound && (
              <span className="flex items-center gap-0.5 text-emerald-700 text-[11px] font-semibold" title="Protected by Secret Verification Question">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified
              </span>
            )}

            <Link
              href={`/item/${item.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <span>{isFound ? 'Claim' : 'View'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
