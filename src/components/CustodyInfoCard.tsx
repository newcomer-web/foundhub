'use client';

import React from 'react';
import { Item } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import MiniLeafletMap from './MiniLeafletMap';
import { MapPin, Calendar, Building2, UserCheck, MessageSquare, Send, PhoneCall } from 'lucide-react';

interface CustodyInfoCardProps {
  item: Item;
  onContactClick?: () => void;
}

export default function CustodyInfoCard({ item, onContactClick }: CustodyInfoCardProps) {
  const isFound = item.type === 'FOUND';

  return (
    <div className="bg-[#12151e] rounded-2xl border border-[#232733] shadow-xl overflow-hidden p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1f2330]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Telemetry & Custody Chain Log
          </h3>
        </div>
        <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-3 py-1 rounded-full ${
          isFound ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
        }`}>
          {isFound ? '● VERIFIED CUSTODY' : '● ACTIVE INCIDENT'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location & Mini-map */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181c28] border border-[#282d3c] text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                {isFound ? 'Found Incident Spot' : 'Last Sighted Location'}
              </p>
              <p className="text-sm font-bold text-white mt-0.5">
                {item.incidentLocation}
              </p>
              {item.latitude != null && item.longitude != null && (
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  RADAR: {item.latitude.toFixed(5)}° N, {item.longitude.toFixed(5)}° E
                </p>
              )}
            </div>
          </div>

          {/* Interactive Mini Map */}
          {item.latitude != null && item.longitude != null && (
            <div className="pt-1">
              <MiniLeafletMap
                latitude={item.latitude}
                longitude={item.longitude}
                locationName={item.incidentLocation}
                isFound={isFound}
              />
            </div>
          )}
        </div>

        {/* Date, Custody Holding & Finder */}
        <div className="space-y-4">
          {/* Incident Date */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181c28] border border-[#282d3c] text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-5 h-5 text-zinc-400" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                {isFound ? 'Registered Incident Time' : 'Lost Incident Time'}
              </p>
              <p className="text-sm font-bold text-white mt-0.5 font-mono">
                {formatDate(item.eventDate)}
              </p>
            </div>
          </div>

          {/* Current Holding Location */}
          <div className="flex items-start gap-3 p-3.5 bg-[#171a24] rounded-xl border border-[#262b3a]">
            <div className="w-10 h-10 rounded-xl bg-[#1f2433] border border-[#2d3448] text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Holding Hub / Custody Location
              </p>
              <p className="text-sm font-bold text-white mt-0.5 font-mono">
                {item.currentHoldingLocation}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Item is physically secured here. Custody chain verified.
              </p>
            </div>
          </div>

          {/* Finder / Custodian Information */}
          <div className="flex items-start justify-between gap-3 p-3.5 bg-[#171a24] rounded-xl border border-[#262b3a]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1f2433] border border-[#2d3448] text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  {isFound ? 'Custodian Node' : 'Reported By'}
                </p>
                <p className="text-sm font-bold text-white mt-0.5">
                  {item.user?.fullName || 'Community Member'}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-[#0f1118] px-2 py-0.5 rounded border border-[#232733] text-zinc-300">
                    <Send className="w-3 h-3 text-zinc-500" strokeWidth={1.75} />
                    {item.finderContactPreference}
                  </span>
                </div>
              </div>
            </div>

            {onContactClick && (
              <button
                onClick={onContactClick}
                className="shrink-0 self-center px-3.5 py-1.5 bg-[#232734] hover:bg-emerald-500 hover:text-black text-white rounded-xl text-xs font-bold border border-[#383f52] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
                Contact
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
