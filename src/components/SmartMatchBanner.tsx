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
    <div className="p-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl shadow-xl border border-indigo-500/30 space-y-4">
      {/* Banner Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <SearchCheck className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h4 className="font-bold text-base flex items-center gap-2">
              Automated Correlation Matches
              <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">
                {matches.length} Potential {counterTypeName} Match{matches.length > 1 ? 'es' : ''}
              </span>
            </h4>
            <p className="text-xs text-slate-300">
              FoundHub cross-referenced existing {counterTypeName.toLowerCase()} reports matching item characteristics and coordinates.
            </p>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {matches.map(({ item, score, reasons }) => (
          <div
            key={item.id}
            className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                {/* Match score badge */}
                <div className="flex items-center gap-1.5 text-xs font-black">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] ${
                      score >= 80
                        ? 'bg-emerald-500 text-slate-950'
                        : score >= 60
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-indigo-400 text-slate-950'
                    }`}
                  >
                    {score}% Match
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    {item.type}
                  </span>
                </div>

                <span className="text-[11px] text-indigo-200">
                  {item.category.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Title & thumbnail */}
              <div className="flex items-start gap-3">
                {item.imageUrls[0] && (
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/20"
                  />
                )}
                <div>
                  <h5 className="font-bold text-sm text-white line-clamp-1 leading-snug">
                    {item.title}
                  </h5>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5">
                    <MapPin className="w-3 h-3 text-indigo-300 shrink-0" />
                    <span className="line-clamp-1">{item.incidentLocation}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-0.5">
                    <Building2 className="w-3 h-3 text-sky-300 shrink-0" />
                    <span className="line-clamp-1 italic">{item.currentHoldingLocation}</span>
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              <div className="space-y-1 pt-1 border-t border-white/10">
                {reasons.slice(0, 3).map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/item/${item.id}`}
              className="w-full py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <span>Inspect & Reconcile Item</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
