'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Item } from '@/lib/types';
import Link from 'next/link';

interface LeafletMapProps {
  mode: 'browse' | 'select';
  items?: Item[];
  selectedLocation?: { lat: number; lng: number };
  onLocationSelect?: (lat: number, lng: number, addressSuggestion?: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function LeafletMap({
  mode,
  items = [],
  selectedLocation,
  onLocationSelect,
  center = [37.7749, -122.4194],
  zoom = 13,
  className = 'h-[500px]',
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(
    selectedLocation || null
  );

  useEffect(() => {
    let isMounted = true;

    async function setupMap() {
      if (typeof window === 'undefined' || !containerRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted || !containerRef.current) return;

      if (!mapRef.current) {
        const map = L.map(containerRef.current).setView(center, zoom);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;

        if (mode === 'select') {
          map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            setSelectedCoords({ lat, lng });
            if (onLocationSelect) {
              onLocationSelect(lat, lng);
            }
          });
        }
      }

      // Update markers
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();

        if (mode === 'browse' && items.length > 0) {
          const bounds: [number, number][] = [];

          items.forEach((item) => {
            if (item.latitude != null && item.longitude != null) {
              bounds.push([item.latitude, item.longitude]);

              const isFound = item.type === 'FOUND';
              const pinColor =
                item.status === 'RETURNED_TO_OWNER'
                  ? '#3b82f6'
                  : isFound
                  ? '#10b981'
                  : '#f59e0b';

              const customIcon = L.divIcon({
                className: 'custom-map-pin',
                html: `
                  <div style="background-color: ${pinColor}; width: 34px; height: 34px; border-radius: 9999px; border: 3px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25); display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;">
                    <span style="font-size: 11px; font-weight: 800;">${isFound ? 'F' : 'L'}</span>
                  </div>
                `,
                iconSize: [34, 34],
                iconAnchor: [17, 34],
              });

              const popupHtml = `
                <div style="font-family: inherit; width: 230px; padding: 4px;">
                  <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: ${pinColor}; margin-bottom: 2px;">
                    ${item.type} • ${item.category.replace(/_/g, ' ')}
                  </div>
                  <h4 style="font-size: 13px; font-weight: 700; line-height: 1.25; margin: 0 0 6px 0; color: #0f172a;">
                    ${item.title}
                  </h4>
                  <div style="font-size: 11px; color: #475569; margin-bottom: 6px; line-height: 1.4;">
                    <strong>Location:</strong> ${item.incidentLocation}<br/>
                    <strong>Custody:</strong> <i>${item.currentHoldingLocation}</i>
                  </div>
                  <a href="/item/${item.id}" style="display: block; text-align: center; background: #0f172a; color: white; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none; margin-top: 6px;">
                    View Details & Claim →
                  </a>
                </div>
              `;

              L.marker([item.latitude, item.longitude], { icon: customIcon })
                .addTo(markersLayerRef.current)
                .bindPopup(popupHtml);
            }
          });

          if (bounds.length > 0 && mapRef.current) {
            mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
          }
        } else if (mode === 'select' && selectedCoords) {
          const selectIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `
              <div style="background-color: #059669; width: 36px; height: 36px; border-radius: 9999px; border: 3px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; color: white; animation: bounce 1s infinite;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          });

          const marker = L.marker([selectedCoords.lat, selectedCoords.lng], {
            icon: selectIcon,
            draggable: true,
          }).addTo(markersLayerRef.current);

          marker.on('dragend', (e: any) => {
            const pos = e.target.getLatLng();
            setSelectedCoords({ lat: pos.lat, lng: pos.lng });
            if (onLocationSelect) {
              onLocationSelect(pos.lat, pos.lng);
            }
          });

          marker.bindPopup(`<b>Selected Incident Location</b><br/>${selectedCoords.lat.toFixed(5)}, ${selectedCoords.lng.toFixed(5)}`).openPopup();
        }
      }
    }

    setupMap();

    return () => {
      isMounted = false;
    };
  }, [mode, items, selectedCoords, center, zoom, onLocationSelect]);

  useEffect(() => {
    if (selectedLocation) {
      setSelectedCoords(selectedLocation);
      if (mapRef.current) {
        mapRef.current.panTo([selectedLocation.lat, selectedLocation.lng]);
      }
    }
  }, [selectedLocation]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[300px]" />
      
      {mode === 'select' && (
        <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-xs">
          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Click anywhere on the map or drag the pin
          </p>
          {selectedCoords && (
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Lat: {selectedCoords.lat.toFixed(5)}, Lng: {selectedCoords.lng.toFixed(5)}
            </p>
          )}
        </div>
      )}

      <div className="absolute bottom-2 right-2 z-[400] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-medium text-slate-500 border border-slate-200 shadow-sm">
        Map data © <a href="https://openstreetmap.org" target="_blank" rel="noreferrer" className="underline hover:text-slate-800">OpenStreetMap</a>
      </div>
    </div>
  );
}
