'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Item, ItemType, ItemCategory, CATEGORY_MAP } from '@/lib/types';
import { dataStore, openAuthModal } from '@/lib/store';
import ItemCard from '@/components/ItemCard';
import LeafletMap from '@/components/LeafletMap';
import {
  Compass,
  Search,
  PlusCircle,
  AlertCircle,
  LayoutGrid,
  Map as MapIcon,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Send,
  ArrowRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | ItemType>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    setItems(dataStore.getItems());
    const unsub = dataStore.subscribe(() => {
      setItems(dataStore.getItems());
    });
    return unsub;
  }, []);

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLoc = item.incidentLocation.toLowerCase().includes(q);
        const matchesHolding = item.currentHoldingLocation.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesHolding) return false;
      }

      // Type
      if (selectedType !== 'ALL' && item.type !== selectedType) return false;

      // Category
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;

      // Status
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;

      return true;
    });
  }, [items, searchQuery, selectedType, selectedCategory, selectedStatus]);

  // Platform metrics
  const reunitedCount = items.filter((i) => i.status === 'RETURNED_TO_OWNER').length;
  const activeFound = items.filter((i) => i.type === 'FOUND' && i.status === 'ACTIVE').length;
  const activeLost = items.filter((i) => i.type === 'LOST' && i.status === 'ACTIVE').length;

  const handleReportClick = (e: React.MouseEvent, type: 'FOUND' | 'LOST') => {
    if (!dataStore.getIsAuthenticated()) {
      e.preventDefault();
      openAuthModal({
        mode: 'login',
        reason:
          type === 'FOUND'
            ? 'Please sign in or create an account to report a found item.'
            : 'Please sign in or create an account to post a lost item alert.',
      });
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/20 to-sky-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-400 shadow-sm animate-pulse-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Community-Driven • Proof-of-Ownership • OpenStreetMap</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Lost Something? <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              FoundHub Brings It Back.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            The modern, secure lost and found platform. Geolocation pin tracking, anti-fraud ownership challenges, PII masking, and instant community Telegram broadcast.
          </p>

          {/* Dual Main CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/report?type=FOUND"
              onClick={(e) => handleReportClick(e, 'FOUND')}
              className="w-full sm:w-auto px-7 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-slate-950" strokeWidth={1.75} />
              <span>Report a Found Item</span>
            </Link>

            <Link
              href="/report?type=LOST"
              onClick={(e) => handleReportClick(e, 'LOST')}
              className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <AlertCircle className="w-5 h-5 text-amber-400" strokeWidth={1.75} />
              <span>I Lost Something</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 max-w-3xl mx-auto grid grid-cols-3 gap-3 border-t border-white/10 text-center">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">{reunitedCount}</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Reunited to Owner
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-white">{activeFound}</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Found in Safe Custody
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{activeLost}</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Active Lost Alerts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Exploration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Control Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items by keywords, device model, or location (e.g. 'MacBook', 'Metro', 'Keys')..."
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Mode Toggle (Grid vs Map) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 self-end md:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={1.75} />
                Grid View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-4 h-4" strokeWidth={1.75} />
                Interactive Map
              </button>
            </div>
          </div>

          {/* Filter Bar: Dual Mode (Found / Lost) & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Type selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedType === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Items ({items.length})
              </button>
              <button
                onClick={() => setSelectedType('FOUND')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedType === 'FOUND'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Found Items
              </button>
              <button
                onClick={() => setSelectedType('LOST')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedType === 'LOST'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Lost Reports
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active (Available / Unresolved)</option>
                <option value="CLAIM_PENDING">Claim Pending</option>
                <option value="RETURNED_TO_OWNER">Returned to Owner</option>
              </select>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {Object.entries(CATEGORY_MAP).map(([key, meta]) => {
              const isSelected = selectedCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(isSelected ? 'ALL' : key)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Display: Grid vs Map */}
        {viewMode === 'map' ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-emerald-600" />
                  Showing {filteredItems.length} Map Pins
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Found Item
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Lost Item
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Reunited
                  </span>
                </div>
              </div>
              <LeafletMap mode="browse" items={filteredItems} className="h-[550px]" />
            </div>
          </div>
        ) : (
          <div>
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No items reported yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first to post a found item or report something you lost to start reuniting community belongings.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link
                    href="/report?type=FOUND"
                    onClick={(e) => handleReportClick(e, 'FOUND')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Report a Found Item
                  </Link>
                  <Link
                    href="/report?type=LOST"
                    onClick={(e) => handleReportClick(e, 'LOST')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Report a Lost Item
                  </Link>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No items match your filters</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try clearing your search query or switching filters to browse all community lost & found records.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('ALL');
                    setSelectedCategory('ALL');
                    setSelectedStatus('ALL');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
