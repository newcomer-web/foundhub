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
    <div className="space-y-8 pb-20 bg-[#090a0f] text-zinc-100 min-h-screen">
      {/* High-Precision Telemetry Dispatch Hero */}
      <section className="relative bg-[#0c0d12] border-b border-[#1f2330] py-14 sm:py-18 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle engineering grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Command & Telemetry Masthead */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141722] border border-[#262c3e] text-zinc-300 text-[11px] font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>RADAR TELEMETRY ACTIVE</span>
              <span className="text-zinc-600">/</span>
              <span className="text-emerald-400 font-bold">GRID v2.4</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.1]">
              Lost property, <br className="hidden sm:inline" />
              <span className="text-emerald-400">tracked & recovered.</span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              A high-precision community telemetry network. Real-time geotagged beacons, verified holding hubs, and zero-knowledge anti-fraud ownership verification.
            </p>

            {/* Platform Telemetry Metrics */}
            <div className="pt-2 grid grid-cols-3 gap-3 max-w-lg">
              <div className="p-3.5 bg-[#12151e] rounded-xl border border-[#232733] shadow-sm">
                <p className="text-2xl font-black text-white font-mono">{reunitedCount}</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">
                  Reunited With Owners
                </p>
              </div>
              <div className="p-3.5 bg-[#12151e] rounded-xl border border-[#232733] shadow-sm">
                <p className="text-2xl font-black text-emerald-400 font-mono">{activeFound}</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">
                  In Secured Custody
                </p>
              </div>
              <div className="p-3.5 bg-[#12151e] rounded-xl border border-[#232733] shadow-sm">
                <p className="text-2xl font-black text-amber-400 font-mono">{activeLost}</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">
                  Active Lost Beacons
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Precision Dual Dispatch Terminals */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Found Custody Intake Card */}
            <div className="p-5 rounded-2xl bg-[#12151e] border border-[#232733] hover:border-emerald-500/40 transition-all duration-300 shadow-xl space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold">
                    ● Secured Custody Hub
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-white text-sm">
                  Turned in or safeguarding an item?
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  Log the verified holding hub and set a secret ownership challenge to block false claims.
                </p>
              </div>

              <Link
                href="/report?type=FOUND"
                onClick={(e) => handleReportClick(e, 'FOUND')}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register Secured Property</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Lost Item Alert Card */}
            <div className="p-5 rounded-2xl bg-[#12151e] border border-[#232733] hover:border-amber-500/40 transition-all duration-300 shadow-xl space-y-3.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/60 font-bold">
                    ● Active Signal Dispatch
                  </span>
                  <AlertCircle className="w-4 h-4 text-amber-400" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-white text-sm">
                  Misplaced a vital belonging?
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  Deploy a geotagged radar beacon with secret challenge questions, reward bounty, and printable street notice.
                </p>
              </div>

              <Link
                href="/report?type=LOST"
                onClick={(e) => handleReportClick(e, 'LOST')}
                className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Deploy Lost Beacon</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Radar & Signal Exploration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Command & Filter Console */}
        <div className="bg-[#12151e] p-5 rounded-2xl border border-[#232733] shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input with Keyboard Indicator */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={2} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search telemetry by keywords, device model, or coordinates..."
                className="w-full pl-10 pr-20 py-2.5 bg-[#090a0f] border border-[#232733] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-white transition-all placeholder:text-zinc-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-[#171a24] rounded border border-zinc-700">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* View Mode Toggle (Notice Board vs Map) */}
            <div className="flex items-center gap-1 p-1 bg-[#090a0f] rounded-xl border border-[#232733] self-end md:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.75} />
                Signal Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                Radar Map
              </button>
            </div>
          </div>

          {/* Filter Bar: Notice Type & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1f2330]">
            {/* Type selector */}
            <div className="flex items-center gap-1.5 bg-[#090a0f] p-1 rounded-xl border border-[#232733] text-xs font-mono font-bold">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedType === 'ALL'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ALL BEACONS ({items.length})
              </button>
              <button
                onClick={() => setSelectedType('FOUND')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedType === 'FOUND'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                IN CUSTODY ({activeFound})
              </button>
              <button
                onClick={() => setSelectedType('LOST')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedType === 'LOST'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800/80'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                LOST BEACONS ({activeLost})
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">STATUS:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs font-mono font-semibold bg-[#090a0f] border border-[#232733] px-3 py-1.5 rounded-xl text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="ACTIVE">ACTIVE TELEMETRY</option>
                <option value="CLAIM_PENDING">CLAIM REVIEW</option>
                <option value="RETURNED_TO_OWNER">REUNITED TO OWNER</option>
              </select>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`shrink-0 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#090a0f] text-zinc-400 border border-[#232733] hover:text-white'
              }`}
            >
              ALL CATEGORIES
            </button>
            {Object.entries(CATEGORY_MAP).map(([key, meta]) => {
              const isSelected = selectedCategory === key;
              const count = items.filter((i) => i.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(isSelected ? 'ALL' : key)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'bg-[#090a0f] text-zinc-400 border border-[#232733] hover:text-white'
                  }`}
                >
                  <span>{meta.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-zinc-700 text-zinc-200' : 'bg-[#181c27] text-zinc-500'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Display: Grid vs Map */}
        {viewMode === 'map' ? (
          <div className="space-y-4">
            <div className="bg-[#12151e] p-4 rounded-2xl border border-[#232733] shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1f2330] text-xs">
                <span className="font-bold text-white flex items-center gap-2 font-mono">
                  <MapIcon className="w-4 h-4 text-emerald-400" />
                  Showing {filteredItems.length} Geotagged Beacons
                </span>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" /> Found in Custody
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" /> Lost Beacon
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Reunited
                  </span>
                </div>
              </div>
              <LeafletMap mode="browse" items={filteredItems} className="h-[550px]" />
            </div>
          </div>
        ) : (
          <div>
            {items.length === 0 ? (
              <div className="bg-[#12151e] rounded-2xl p-12 text-center border border-[#232733] shadow-xl space-y-4">
                <div className="w-14 h-14 bg-[#181c28] rounded-2xl flex items-center justify-center mx-auto text-emerald-400 border border-[#262b3a]">
                  <Compass className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-mono">RADAR TELEMETRY QUIET</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    No active lost or found beacons registered in the area yet. Deploy a signal alert or register found property to initialize telemetry.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link
                    href="/report?type=FOUND"
                    onClick={(e) => handleReportClick(e, 'FOUND')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-black" />
                    Register Secured Property
                  </Link>
                  <Link
                    href="/report?type=LOST"
                    onClick={(e) => handleReportClick(e, 'LOST')}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Deploy Lost Beacon
                  </Link>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-[#12151e] rounded-2xl p-12 text-center border border-[#232733] shadow-xl space-y-4">
                <div className="w-14 h-14 bg-[#181c28] rounded-full flex items-center justify-center mx-auto text-zinc-500 border border-[#262b3a]">
                  <Search className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-mono">NO SIGNALS MATCHING FILTER</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Try clearing keyword search or resetting category filters to inspect all registered grid coordinates.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('ALL');
                    setSelectedCategory('ALL');
                    setSelectedStatus('ALL');
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold border border-zinc-700 shadow-xs cursor-pointer transition-colors"
                >
                  Reset All Filters
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
