"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "@/types";

interface MapViewProps {
  properties: Property[];
  height?: string;
  defaultCenter?: [number, number];
}

// Center of Maharashtra
const MAHARASHTRA_CENTER: [number, number] = [19.7515, 75.7139];

export function MapView({ properties, height = "400px", defaultCenter }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize map if not already initialized
    if (!mapRef.current) {
      const container = mapContainerRef.current;
      // Clean up any internal Leaflet ID leftover on the DOM node
      if ((container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }

      const map = L.map(container, {
        center: defaultCenter || MAHARASHTRA_CENTER,
        zoom: defaultCenter ? 12 : 6,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // 2. Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // 3. Define custom default marker icon (Leaflet defaults break in Next.js bundlers)
    const defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // 4. Add markers for each property
    const bounds: [number, number][] = [];
    properties.forEach((property) => {
      if (property.latitude && property.longitude) {
        const marker = L.marker([property.latitude, property.longitude], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; min-width: 150px;">
              <div style="margin-bottom: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #0f766e;">
                Rs. ${property.price}
              </div>
              <a href="/property/${property.id}" target="_blank" rel="noreferrer" style="display: block; font-size: 13px; font-weight: 600; color: #102033; text-decoration: none; text-underline-offset: 2px;">
                ${property.title}
              </a>
              <div style="margin-top: 4px; font-size: 11px; color: #53657a;">
                ${property.areaLocality || property.city}
              </div>
            </div>
          `);
        markersRef.current.push(marker);
        bounds.push([property.latitude, property.longitude]);
      }
    });

    // 5. Update map view bounds
    if (properties.length === 0) {
      if (defaultCenter) {
        map.setView(defaultCenter, 12);
      } else {
        map.setView(MAHARASHTRA_CENTER, 6);
      }
    } else if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    // Cleanup function: remove map instance when component unmounts or dependency changes
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [properties, defaultCenter]);

  return (
    <div className="overflow-hidden rounded-lg border border-base-300 shadow-sm relative z-0" style={{ height }}>
      <div ref={mapContainerRef} className="h-full w-full bg-base-300" />
    </div>
  );
}
