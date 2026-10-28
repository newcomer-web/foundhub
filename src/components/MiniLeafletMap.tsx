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
          <div style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.25));">
            <svg width="26" height="34" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16C0 26 16 40 16 40C16 40 32 26 32 16C32 7.163 24.837 0 16 0Z" fill="${pinColor}"/>
              <circle cx="16" cy="15" r="6" fill="white"/>
              <circle cx="16" cy="15" r="3" fill="${pinColor}"/>
            </svg>
          </div>
        `,
        iconSize: [26, 34],
        iconAnchor: [13, 34],
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
