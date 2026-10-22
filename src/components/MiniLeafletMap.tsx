'use client';

import React, { useEffect, useRef } from 'react';

interface MiniLeafletMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
  isFound?: boolean;
}

export default function MiniLeafletMap({
  latitude,
  longitude,
  locationName,
  isFound = true,
}: MiniLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMiniMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Dynamically load leaflet
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      });

      mapInstanceRef.current = map;

      // Tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icon
      const pinColor = isFound ? '#10b981' : '#f59e0b';
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background-color: ${pinColor}; width: 28px; height: 28px; border-radius: 9999px; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      L.marker([latitude, longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${locationName}</b><br/><span style="font-size: 11px; color: #64748b;">${latitude.toFixed(4)}, ${longitude.toFixed(4)}</span>`);
    }

    initMiniMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, locationName, isFound]);

  return (
    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-2 right-2 z-20 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-slate-600 shadow-sm border border-slate-200">
        © OpenStreetMap
      </div>
    </div>
  );
}
