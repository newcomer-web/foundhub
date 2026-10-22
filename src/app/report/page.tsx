'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ItemType, ItemCategory, CATEGORY_MAP } from '@/lib/types';
import { dataStore, CURRENT_USER } from '@/lib/store';
import { findSmartMatches, MatchResult } from '@/lib/aiMatching';
import LeafletMap from '@/components/LeafletMap';
import PiiMaskingGuide from '@/components/PiiMaskingGuide';
import SmartMatchBanner from '@/components/SmartMatchBanner';
import {
  PlusCircle,
  AlertCircle,
  Upload,
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Send,
  Laptop,
  FileText,
  Briefcase,
  Key,
  Watch,
  Shirt,
  Dog,
  HelpCircle,
  Clock,
  X,
  Image as ImageIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Laptop,
  FileText,
  Briefcase,
  Key,
  Watch,
  Shirt,
  Dog,
  HelpCircle,
};

// Preset sample photos for quick demo selection
const SAMPLE_PHOTOS: Record<ItemCategory, string[]> = {
  ELECTRONICS: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  ],
  DOCUMENTS_AND_IDS: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
  ],
  WALLETS_AND_BAGS: [
    'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  ],
  KEYS: [
    'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
  ],
  JEWELRY_AND_WATCHES: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
  ],
  CLOTHING: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
  ],
  PETS: [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
  ],
  OTHER: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
  ],
};

const LANDMARK_PRESETS = [
  { name: 'University Central Library 2nd Floor', lat: 37.7749, lng: -122.4194 },
  { name: 'Downtown Metro Station, Platform 3', lat: 37.7833, lng: -122.4167 },
  { name: 'Arts & Design Quad, West Lawn', lat: 37.7712, lng: -122.4289 },
  { name: 'Maplewood Community Park Fountain', lat: 37.7810, lng: -122.4110 },
  { name: 'Engineering Quad Cafe Pathway', lat: 37.7735, lng: -122.4240 },
];

function ReportWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as ItemType) || 'FOUND';

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [itemType, setItemType] = useState<ItemType>(initialType);
  const [category, setCategory] = useState<ItemCategory>('ELECTRONICS');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Location & Time
  const [incidentLocation, setIncidentLocation] = useState('University Central Library 2nd Floor');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 16);
  });

  // Custody & Contact
  const [currentHoldingLocation, setCurrentHoldingLocation] = useState(
    itemType === 'FOUND'
      ? "Campus Dean's Office / Security Desk Room 102"
      : 'LOST - Searching actively'
  );
  const [finderContactPreference, setFinderContactPreference] = useState(
    'In-app message or Telegram: @' + (CURRENT_USER.telegramUsername || 'user')
  );

  // Anti-fraud
  const [secretVerificationQuestion, setSecretVerificationQuestion] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [relayToTelegram, setRelayToTelegram] = useState(true);

  // Live AI matches
  const [liveMatches, setLiveMatches] = useState<MatchResult[]>([]);

  // Auto-fill sample photo when category changes if empty
  useEffect(() => {
    if (imageUrls.length === 0 && SAMPLE_PHOTOS[category]?.[0]) {
      setImageUrls([SAMPLE_PHOTOS[category][0]]);
    }
  }, [category]);

  // Calculate live AI matches when reaching Step 5
  useEffect(() => {
    if (currentStep === 5 && title.trim()) {
      const allItems = dataStore.getItems();
      const matches = findSmartMatches(
        {
          type: itemType,
          category,
          title,
          description,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          eventDate: new Date(eventDate).toISOString(),
        },
        allItems
      );
      setLiveMatches(matches);
    }
  }, [currentStep, title, description, category, itemType, coordinates, eventDate]);

  const handleLocationPreset = (preset: typeof LANDMARK_PRESETS[0]) => {
    setIncidentLocation(preset.name);
    setCoordinates({ lat: preset.lat, lng: preset.lng });
  };

  const handleMapPinSelected = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  };

  const handleAddSampleImage = (url: string) => {
    if (!imageUrls.includes(url)) {
      setImageUrls([...imageUrls, url]);
    }
  };

  const handleAddCustomImage = () => {
    if (customImageUrl.trim() && !imageUrls.includes(customImageUrl.trim())) {
      setImageUrls([...imageUrls, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !incidentLocation.trim()) return;

    setSubmitting(true);
    try {
      const newItem = dataStore.addItem({
        userId: CURRENT_USER.id,
        user: CURRENT_USER,
        type: itemType,
        title: title.trim(),
        category,
        description: description.trim(),
        imageUrls: imageUrls.length > 0 ? imageUrls : [SAMPLE_PHOTOS[category][0]],
        eventDate: new Date(eventDate).toISOString(),
        incidentLocation: incidentLocation.trim(),
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        currentHoldingLocation: currentHoldingLocation.trim(),
        finderContactPreference: finderContactPreference.trim(),
        secretVerificationQuestion: secretVerificationQuestion.trim() || null,
        status: 'ACTIVE',
        rewardAmount: rewardAmount ? parseFloat(rewardAmount) : null,
      });

      // Relay to Telegram channel if enabled
      if (relayToTelegram && typeof window !== 'undefined') {
        const { dispatchTelegramBroadcast } = await import('@/lib/telegram');
        dispatchTelegramBroadcast(newItem, window.location.origin);
      }

      router.push(`/item/${newItem.id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Classification' },
    { num: 2, title: 'Media & PII' },
    { num: 3, title: 'Location & Time' },
    { num: 4, title: 'Custody & Contact' },
    { num: 5, title: 'Anti-Fraud & AI Match' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {itemType === 'FOUND' ? 'Report a Found Item' : 'Post a Lost Item Alert'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Help reunite community belongings with transparent custody tracking, geolocation pins, and anti-fraud verification.
        </p>
      </div>

      {/* Multi-Step Indicator */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 hidden sm:block" />
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer"
                onClick={() => {
                  if (s.num <= currentStep) setCurrentStep(s.num);
                }}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-slate-900 text-white ring-4 ring-emerald-100 scale-110 shadow-md'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-bold hidden sm:block ${
                    isCurrent ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        {/* STEP 1: Classification */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Classification</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Are you reporting an item you recovered, or searching for an item you lost?
              </p>
            </div>

            {/* Dual Mode Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setItemType('FOUND');
                  setCurrentHoldingLocation("Campus Dean's Office / Security Desk Room 102");
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  itemType === 'FOUND'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">I Found an Item</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You picked up an item and want to safely store and return it to its rightful owner.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setItemType('LOST');
                  setCurrentHoldingLocation('LOST - Searching actively');
                }}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  itemType === 'LOST'
                    ? 'border-amber-500 bg-amber-50/70 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">I Lost Something</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You misplaced a personal belonging and want community members to report leads.
                </p>
              </button>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Item Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(CATEGORY_MAP).map(([key, meta]) => {
                  const Icon = ICON_MAP[meta.iconName] || HelpCircle;
                  const isSelected = category === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key as ItemCategory)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl w-fit ${meta.colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{meta.label}</p>
                        <p className="text-[10px] text-slate-400 truncate">{meta.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Media & PII Protection */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Media Upload & Details</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide clear photos and description. Sensitive ID numbers are protected.
              </p>
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Item Title & Brand / Model <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Space Gray MacBook Pro 14' M3 or Brown Leather Fossil Wallet"
                  className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Description & Identifying Traits
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe where it was situated, outer case color, stickers, or brand markings (do NOT reveal secret answers if you plan to challenge claimants)..."
                  className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>

            {/* PII Masking Guide (Enforced if DOCUMENTS_AND_IDS) */}
            {category === 'DOCUMENTS_AND_IDS' && (
              <PiiMaskingGuide
                onApplyMaskedText={(masked) => {
                  setTitle((prev) => `${prev} (${masked})`);
                }}
              />
            )}

            {/* Media Upload Area */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Item Photos (Drag & Drop or Sample Library)
              </label>

              {/* Upload Dropzone */}
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-500 flex items-center justify-center mx-auto shadow-sm">
                  <Upload className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Drag and drop images here, or paste image URL
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WebP (Max 10MB per file)
                  </p>
                </div>

                <div className="flex items-center gap-2 max-w-md mx-auto pt-1">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomImage}
                    className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Sample Quick Library */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Or select curated sample photos for {CATEGORY_MAP[category]?.label}:
                </span>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {(SAMPLE_PHOTOS[category] || []).map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddSampleImage(url)}
                      className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 hover:ring-2 hover:ring-emerald-500 transition-all"
                    >
                      <img src={url} alt="sample" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 hover:bg-transparent transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Image Previews */}
              {imageUrls.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700">Selected Images:</span>
                  <div className="flex items-center gap-3 flex-wrap">
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group"
                      >
                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Location & Time */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Location & Incident Time</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pin exact recovery/lost location on the map and set the timestamp.
              </p>
            </div>

            {/* Landmark presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Quick Landmark Presets:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {LANDMARK_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLocationPreset(preset)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 font-semibold text-slate-700 border border-slate-200 transition-colors"
                  >
                    📍 {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Address input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Precise Landmark / Room / Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  placeholder="e.g. University Library 2nd Floor, Room 204 or Metro Station Platform"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Interactive Leaflet Map for Pin Drop */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Interactive Pin Selection (Click anywhere to set coordinates)
              </label>
              <LeafletMap
                mode="select"
                selectedLocation={coordinates}
                onLocationSelect={handleMapPinSelected}
                className="h-[360px]"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Date & Time of Incident <span className="text-rose-500">*</span>
              </label>
              <div className="relative max-w-sm">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Custody & Contact */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 4: Custody & Custodian Contact</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Where is the item right now? Provide clear custody status and preferred contact channel.
              </p>
            </div>

            {/* Holding Location Options */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Current Holding Location (Physical Custody) <span className="text-rose-500">*</span>
              </label>

              {itemType === 'FOUND' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  {[
                    "Campus Dean's Office / Room 102 Safe",
                    "Metro Security Lost & Found Depot",
                    "Central Campus Police Lost Property Station",
                    "With Finder (Safe in personal possession)",
                  ].map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentHoldingLocation(preset)}
                      className="p-3 text-left rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 text-xs font-semibold text-slate-800 transition-colors flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{preset}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <Building2 className="w-4 h-4 text-indigo-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={currentHoldingLocation}
                  onChange={(e) => setCurrentHoldingLocation(e.target.value)}
                  placeholder="e.g. Campus Dean's Office, Metro Security Station, or In finder's possession"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                This will be highlighted directly under the item photo so claimants know where the physical item is held.
              </p>
            </div>

            {/* Contact Preference */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Preferred Contact Channel <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Send className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={finderContactPreference}
                  onChange={(e) => setFinderContactPreference(e.target.value)}
                  placeholder="e.g. Telegram: @username, Phone: +1 555-1234, or In-app chat"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Verified member: <strong>{CURRENT_USER.fullName}</strong> ({CURRENT_USER.email})
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Anti-Fraud & AI Match */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 5: Anti-Fraud Verification & Review</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set ownership challenge questions to prevent fraudulent claims and review smart AI matches.
              </p>
            </div>

            {/* Anti-Fraud Secret Question */}
            {itemType === 'FOUND' ? (
              <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                      Anti-Fraud Proof-of-Ownership Challenge Question (Recommended)
                    </h3>
                    <p className="text-[11px] text-emerald-800">
                      Prevents false claims. Ask for an unphotographed detail only the real owner knows.
                    </p>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={secretVerificationQuestion}
                    onChange={(e) => setSecretVerificationQuestion(e.target.value)}
                    placeholder="e.g. 'What is the lock screen wallpaper?', 'What color is the keychain cord?', 'Last 4 digits on the card?'"
                    className="w-full p-3 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                  />
                </div>
              </div>
            ) : (
              <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                      Optional Recovery Reward (For Lost Items)
                    </h3>
                    <p className="text-[11px] text-amber-800">
                      Motivate bystanders and finders with an optional reward amount.
                    </p>
                  </div>
                </div>

                <div className="relative max-w-xs">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-600 text-sm">$</span>
                  <input
                    type="number"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    placeholder="e.g. 50, 100, 200"
                    className="w-full pl-8 pr-4 py-2.5 text-xs font-bold rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Telegram Relay Checkbox */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Broadcast to @FoundHub_Community Telegram Channel
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Automatically posts formatted alert with photo, location pin, and deep link to the community channel.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={relayToTelegram}
                onChange={(e) => setRelayToTelegram(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Live Smart AI Matching Results */}
            {liveMatches.length > 0 && (
              <SmartMatchBanner matches={liveMatches} targetType={itemType} />
            )}
          </div>
        )}

        {/* Wizard Navigation Controls */}
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 2 && !title.trim()) {
                  alert('Please enter an item title before proceeding.');
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {submitting ? 'Publishing Report...' : 'Publish Item to Community'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-16 text-center text-slate-400 text-xs">Loading form wizard...</div>}>
      <ReportWizardContent />
    </Suspense>
  );
}
