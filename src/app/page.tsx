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
    <div className="space-y-8 pb-20">
      {/* Editorial Civic Dispatch Hero */}
      <section className="bg-white border-b border-stone-200/90 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Human Editorial Masthead */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-mono tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>PUBLIC COMMUNITY REGISTRY</span>
              <span className="text-stone-400">/</span>
              <span className="text-stone-500">OPEN ARCHIVE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 leading-[1.12]">
              Lost belongings, <br className="hidden sm:inline" />
              <span className="text-emerald-800 underline decoration-emerald-200 decoration-wavy underline-offset-8">
                returned with proof.
              </span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              From transit passes and laptops to pets and heirloom rings, FoundHub turns public spaces into an organized civic noticeboard. Geotagged maps, secret verification questions, and secure custody logs.
            </p>

            {/* Platform Dispatch Metrics */}
            <div className="pt-2 grid grid-cols-3 gap-3 max-w-lg">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <p className="text-2xl font-black text-stone-900 font-mono">{reunitedCount}</p>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">
                  Reunited With Owners
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <p className="text-2xl font-black text-emerald-800 font-mono">{activeFound}</p>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">
                  Safeguarded in Custody
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <p className="text-2xl font-black text-amber-800 font-mono">{activeLost}</p>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">
                  Active Missing Searches
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Tactile Dual Action Slips */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Found Item Intake Card */}
            <div className="p-5 rounded-2xl bg-[#f4f9f6] border border-emerald-300/80 shadow-[0_2px_8px_rgba(4,120,87,0.04)] space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Safe Custody Desk
                  </span>
                  <PlusCircle className="w-4 h-4 text-emerald-700" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Found someone's property?
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Log the holding location and add a secret verification question so only the verified owner can claim it.
                </p>
              </div>

              <Link
                href="/report?type=FOUND"
                onClick={(e) => handleReportClick(e, 'FOUND')}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Register Found Belonging</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Lost Item Alert Card */}
            <div className="p-5 rounded-2xl bg-[#fffbf5] border border-amber-300/80 shadow-[0_2px_8px_rgba(245,158,11,0.04)] space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                    Missing Notice
                  </span>
                  <AlertCircle className="w-4 h-4 text-amber-700" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Misplaced an item?
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Post an urgent community bulletin with location coordinates, optional reward offer, and printable flyers.
                </p>
              </div>

              <Link
                href="/report?type=LOST"
                onClick={(e) => handleReportClick(e, 'LOST')}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Post Lost Item Alert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Noticeboard Exploration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Filter & Command Console */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-[0_2px_8px_rgba(28,25,23,0.03)] space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input with Keyboard Indicator */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={2} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices by keyword, item model, or place (e.g. 'AirPods', 'Metro', 'Backpack')..."
                className="w-full pl-10 pr-20 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium text-stone-900 transition-all placeholder:text-stone-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-200/60 rounded border border-stone-300">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* View Mode Toggle (Notice Board vs Map) */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/80 self-end md:self-auto shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.75} />
                Notice Board
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                Radar Map
              </button>
            </div>
          </div>

          {/* Filter Bar: Notice Type & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
            {/* Type selector */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedType === 'ALL'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Notices ({items.length})
              </button>
              <button
                onClick={() => setSelectedType('FOUND')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedType === 'FOUND'
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                In Custody ({activeFound})
              </button>
              <button
                onClick={() => setSelectedType('LOST')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedType === 'LOST'
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Missing Reports ({activeLost})
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs font-semibold bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active (Unresolved)</option>
                <option value="CLAIM_PENDING">Claim Pending</option>
                <option value="RETURNED_TO_OWNER">Reunited to Owner</option>
              </select>
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`shrink-0 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Categories
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
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{meta.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-600'}`}>
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
            <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-emerald-700" />
                  Showing {filteredItems.length} Incident Locations
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Found Item
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> Lost Alert
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-400 inline-block" /> Reunited
                  </span>
                </div>
              </div>
              <LeafletMap mode="browse" items={filteredItems} className="h-[550px]" />
            </div>
          </div>
        ) : (
          <div>
            {items.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/90 shadow-2xs space-y-4">
                <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-stone-500">
                  <Compass className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-stone-900">Noticeboard is clear</h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    No active lost or found notices recorded yet. If you have misplaced an item or found something in public transit or campus, post the first bulletin.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link
                    href="/report?type=FOUND"
                    onClick={(e) => handleReportClick(e, 'FOUND')}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Register Found Belonging
                  </Link>
                  <Link
                    href="/report?type=LOST"
                    onClick={(e) => handleReportClick(e, 'LOST')}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-stone-200 cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Post Lost Alert
                  </Link>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200/90 shadow-2xs space-y-4">
                <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <Search className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-stone-900">No notices match your filters</h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Try refining your search keyword or clearing category filters to view all active neighborhood records.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('ALL');
                    setSelectedCategory('ALL');
                    setSelectedStatus('ALL');
                  }}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer hover:bg-stone-800 transition-colors"
                >
                  Clear All Filters
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
