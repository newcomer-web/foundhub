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
  const beaconId = `SIG-${(item.id || '0000').slice(0, 6).toUpperCase()}`;

  return (
    <article className="group relative bg-[#12151e] rounded-2xl border border-[#232733] hover:border-[#383f52] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Telemetry Header Bar */}
      <div className="px-4 py-2.5 bg-[#0d0f16] border-b border-[#1f2330] flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-400 tracking-wider">#{beaconId}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 font-sans font-medium text-[11px]">{categoryMeta.label}</span>
        </div>

        {/* Telemetry Status Beacon Badge */}
        {isReturned ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/60 font-mono font-bold text-[10px] tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            REUNITED
          </span>
        ) : isClaimPending ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-400 border border-purple-800/60 font-mono font-bold text-[10px] tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            CLAIM REVIEW
          </span>
        ) : isFound ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono font-bold text-[10px] tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            IN CUSTODY
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/60 font-mono font-bold text-[10px] tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            LOST BEACON
          </span>
        )}
      </div>

      {/* Media Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#090a0f]">
        {hasValidPhoto ? (
          <img
            src={item.imageUrls[0]}
            alt={item.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d0f16] text-zinc-500 gap-2 p-6 border-b border-[#1f2330]">
            <div className="p-3 bg-[#151822] rounded-xl border border-[#232733] text-zinc-400">
              <CategoryIcon className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 block">
                TELEMETRY REGISTERED
              </span>
              <span className="text-[10px] text-zinc-600 font-mono">
                {item.latitude && item.longitude ? `${item.latitude.toFixed(3)}°N, ${item.longitude.toFixed(3)}°E` : 'No Image Provided'}
              </span>
            </div>
          </div>
        )}

        {/* Coordinates Watermark in corner */}
        {item.latitude != null && item.longitude != null && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#090a0f]/80 backdrop-blur-md rounded text-[9px] font-mono text-zinc-400 border border-white/10 pointer-events-none">
            {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°
          </div>
        )}

        {/* Bounty tag if available */}
        {item.rewardAmount && !isReturned && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-amber-500/20 backdrop-blur-md text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-lg shadow-lg border border-amber-500/40">
            <Award className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />
            <span>BOUNTY: ${item.rewardAmount}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Title */}
          <Link href={`/item/${item.id}`} className="block group-hover:text-emerald-400 transition-colors">
            <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
              {item.title}
            </h3>
          </Link>

          {/* Description snippet if available */}
          {item.description && (
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal">
              {item.description}
            </p>
          )}

          {/* Incident location */}
          <div className="flex items-start gap-2 text-xs text-zinc-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={1.75} />
            <span className="line-clamp-1">{item.incidentLocation}</span>
          </div>

          {/* Holding / Safe custody location */}
          <div className="p-2.5 rounded-xl bg-[#171a24] border border-[#262b3a] text-[11px] text-zinc-300">
            <div className="flex items-start gap-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <span className="text-zinc-500 block text-[9px] uppercase font-mono tracking-wider">
                  Holding Hub:
                </span>
                <span className="font-semibold text-zinc-200 line-clamp-1 font-mono text-[11px]">
                  {item.currentHoldingLocation}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3.5 border-t border-[#1f2330] flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
            <span>{formatRelativeTime(item.eventDate)}</span>
          </div>

          <Link
            href={`/item/${item.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1d212c] hover:bg-emerald-500 hover:text-black text-zinc-200 rounded-xl text-xs font-bold border border-[#2d3345] shadow-sm transition-all"
          >
            <span>{isFound ? 'Inspect & Claim' : 'View Beacon'}</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </article>
  );
}
