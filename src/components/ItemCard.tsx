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
  const caseId = `FH-${(item.id || '0000').slice(0, 6).toUpperCase()}`;

  return (
    <article className="group relative bg-white rounded-2xl border border-stone-200/90 shadow-[0_2px_8px_rgba(28,25,23,0.04)] hover:shadow-[0_8px_24px_rgba(28,25,23,0.08)] hover:border-stone-400/80 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Archival Header Bar */}
      <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-600 tracking-wider">#{caseId}</span>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500 font-sans font-medium">{categoryMeta.label}</span>
        </div>

        {/* Notice Type Badge */}
        {isReturned ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans font-bold text-[10px] tracking-wide">
            ✓ REUNITED
          </span>
        ) : isClaimPending ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-sans font-bold text-[10px] tracking-wide">
            ⏳ CLAIM PENDING
          </span>
        ) : isFound ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300/80 font-sans font-bold text-[10px] tracking-wide">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            IN SAFE CUSTODY
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300/80 font-sans font-bold text-[10px] tracking-wide">
            MISSING NOTICE
          </span>
        )}
      </div>

      {/* Media Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        {hasValidPhoto ? (
          <img
            src={item.imageUrls[0]}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 gap-2 p-6 border-b border-stone-200/50">
            <CategoryIcon className="w-9 h-9 text-stone-400" strokeWidth={1.5} />
            <div className="text-center">
              <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500 block">
                Evidence Photo Pending
              </span>
              <span className="text-[10px] text-stone-400 font-sans">
                Physical description recorded
              </span>
            </div>
          </div>
        )}

        {/* Reward strip if available */}
        {item.rewardAmount && !isReturned && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-amber-500 text-stone-950 text-xs font-black px-3 py-1 rounded-full shadow-md border border-amber-400">
            <Award className="w-3.5 h-3.5 text-stone-950" strokeWidth={2} />
            <span>${item.rewardAmount} Reward</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Title */}
          <Link href={`/item/${item.id}`} className="block group-hover:text-emerald-800 transition-colors">
            <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2">
              {item.title}
            </h3>
          </Link>

          {/* Description snippet if available */}
          {item.description && (
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
              {item.description}
            </p>
          )}

          {/* Incident location */}
          <div className="flex items-start gap-1.5 text-xs text-stone-600 pt-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span className="line-clamp-1 font-medium">{item.incidentLocation}</span>
          </div>

          {/* Holding / Safe custody location */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-700">
            <div className="flex items-start gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <span className="text-stone-500 block text-[10px] uppercase font-mono tracking-wider">
                  Current Custody Desk:
                </span>
                <span className="font-semibold text-stone-900 line-clamp-1">
                  {item.currentHoldingLocation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-500">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{formatRelativeTime(item.eventDate)}</span>
          </div>

          <Link
            href={`/item/${item.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
          >
            <span>{isFound ? 'Inspect & Claim' : 'View Notice'}</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </article>
  );
}
