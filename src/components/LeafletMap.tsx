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
                  <div style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); cursor: pointer;">
                    <svg width="30" height="38" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 0C7.163 0 0 7.163 0 16C0 26 16 40 16 40C16 40 32 26 32 16C32 7.163 24.837 0 16 0Z" fill="${pinColor}"/>
                      <circle cx="16" cy="15" r="6" fill="white"/>
                      <circle cx="16" cy="15" r="3" fill="${pinColor}"/>
                    </svg>
                  </div>
                `,
                iconSize: [30, 38],
                iconAnchor: [15, 38],
                popupAnchor: [0, -34],
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
              <div style="filter: drop-shadow(0 6px 10px rgba(5,150,105,0.4)); cursor: grab;">
                <svg width="34" height="42" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C7.163 0 0 7.163 0 16C0 26 16 40 16 40C16 40 32 26 32 16C32 7.163 24.837 0 16 0Z" fill="#059669"/>
                  <circle cx="16" cy="15" r="7" fill="white"/>
                  <path d="M16 11V19M12 15H20" stroke="#059669" stroke-width="2.2" stroke-linecap="round"/>
                </svg>
              </div>
            `,
            iconSize: [34, 42],
            iconAnchor: [17, 42],
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
