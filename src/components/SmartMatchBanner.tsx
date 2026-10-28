'use client';

import React from 'react';
import { MatchResult } from '@/lib/aiMatching';
import Link from 'next/link';
import { SearchCheck, ArrowRight, ShieldCheck, MapPin, Building2, CheckCircle2 } from 'lucide-react';

interface SmartMatchBannerProps {
  matches: MatchResult[];
  targetType: 'FOUND' | 'LOST';
}

export default function SmartMatchBanner({ matches, targetType }: SmartMatchBannerProps) {
  if (matches.length === 0) return null;

  const counterTypeName = targetType === 'FOUND' ? 'Lost' : 'Found';

  return (
    <div className="p-6 bg-stone-900 text-stone-100 rounded-2xl shadow-md border border-stone-800 space-y-4">
      {/* Banner Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-800 text-stone-300 rounded-xl border border-stone-700/80 flex items-center justify-center shrink-0">
            <SearchCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base flex items-center gap-2 text-white">
              Sighting Correlation Matches
              <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-md font-mono font-bold">
                {matches.length} Potential {counterTypeName} Match{matches.length > 1 ? 'es' : ''}
              </span>
            </h4>
            <p className="text-xs text-stone-400">
              FoundHub correlated existing {counterTypeName.toLowerCase()} dispatches matching keywords, category, and geolocation.
            </p>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {matches.map(({ item, score, reasons }) => (
          <div
            key={item.id}
            className="p-4 bg-stone-800/80 rounded-xl border border-stone-700/90 hover:border-stone-500 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                {/* Match score badge */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      score >= 80
                        ? 'bg-emerald-500 text-stone-950'
                        : score >= 60
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-600 text-stone-100'
                    }`}
                  >
                    {score}% Confidence
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">
                    #{item.id.slice(0, 6)}
                  </span>
                </div>

                <span className="text-[11px] text-stone-400 font-medium">
                  {item.category.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Title & thumbnail */}
              <div className="flex items-start gap-3">
                {item.imageUrls[0] && (
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-stone-700 bg-stone-900"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-sm text-white line-clamp-1 leading-snug">
                    {item.title}
                  </h5>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-1">
                    <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                    <span className="line-clamp-1">{item.incidentLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                    <Building2 className="w-3 h-3 text-stone-500 shrink-0" />
                    <span className="line-clamp-1 italic">{item.currentHoldingLocation}</span>
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              <div className="space-y-1 pt-2 border-t border-stone-700/60">
                {reasons.slice(0, 3).map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/item/${item.id}`}
              className="w-full py-2 bg-stone-100 hover:bg-white text-stone-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>Inspect & Compare Case</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
