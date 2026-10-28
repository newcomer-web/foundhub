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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Dedicated Custody & Incident Details
          </h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          isFound ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          {isFound ? 'Found Verification Log' : 'Loss Incident Log'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location & Mini-map */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isFound ? 'Found Location' : 'Lost Location'}
              </p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {item.incidentLocation}
              </p>
              {item.latitude != null && item.longitude != null && (
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  GPS: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
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
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isFound ? 'Found Date & Time' : 'Lost Date & Time'}
              </p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {formatDate(item.eventDate)}
              </p>
            </div>
          </div>

          {/* Current Holding Location */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Current Holding Location
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {item.currentHoldingLocation}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Item is physically stored here. Custody chain verified.
              </p>
            </div>
          </div>

          {/* Finder / Custodian Information */}
          <div className="flex items-start justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {isFound ? 'Finder / Custodian' : 'Reported By'}
                </p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {item.user?.fullName || 'Community Member'}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                    <Send className="w-3 h-3 text-slate-500" strokeWidth={1.75} />
                    {item.finderContactPreference}
                  </span>
                </div>
              </div>
            </div>

            {onContactClick && (
              <button
                onClick={onContactClick}
                className="shrink-0 self-center px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
