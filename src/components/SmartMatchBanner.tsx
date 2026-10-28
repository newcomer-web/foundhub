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
    <div className="p-6 bg-[#12151e] text-zinc-100 rounded-2xl shadow-2xl border border-[#232733] space-y-4">
      {/* Banner Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#181c28] text-emerald-400 rounded-xl border border-[#282d3c] flex items-center justify-center shrink-0">
            <SearchCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base flex items-center gap-2 text-white font-mono">
              RADAR CORRELATION DETECTED
              <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full font-mono font-bold">
                {matches.length} POTENTIAL {counterTypeName.toUpperCase()} MATCH{matches.length > 1 ? 'ES' : ''}
              </span>
            </h4>
            <p className="text-xs text-zinc-400">
              FoundHub automated correlation matched item characteristics, category, and geolocation telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {matches.map(({ item, score, reasons }) => (
          <div
            key={item.id}
            className="p-4 bg-[#171a24] rounded-xl border border-[#262b3a] hover:border-zinc-500 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                {/* Match score badge */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      score >= 80
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : score >= 60
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {score}% Confidence
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                    #{item.id.slice(0, 6)}
                  </span>
                </div>

                <span className="text-[11px] text-zinc-400 font-mono">
                  {item.category.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Title & thumbnail */}
              <div className="flex items-start gap-3">
                {item.imageUrls[0] && (
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-[#282d3c] bg-[#090a0f]"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-sm text-white line-clamp-1 leading-snug">
                    {item.title}
                  </h5>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1">
                    <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span className="line-clamp-1">{item.incidentLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                    <Building2 className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span className="line-clamp-1 italic font-mono">{item.currentHoldingLocation}</span>
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              <div className="space-y-1 pt-2 border-t border-[#232733]">
                {reasons.slice(0, 3).map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/item/${item.id}`}
              className="w-full py-2 bg-[#232734] hover:bg-emerald-500 hover:text-black text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-[#383f52] shadow-sm transition-all"
            >
              <span>Inspect & Compare Signal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
