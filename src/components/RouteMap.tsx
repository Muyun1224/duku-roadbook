import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DayRoute } from '@/types/route';

interface RouteMapProps {
  days: DayRoute[];
  activeDay?: number;  // -1 = show all
  className?: string;
}

// Day colors used for route lines — cycle through if more than 7 days
const dayColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

// Amap 高德瓦片 — 国内秒开，中文标签，无需 API Key
const TILE_URL = 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';

export function RouteMap({ days, activeDay = -1, className }: RouteMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [43.0, 84.5],
      zoom: 8,
      zoomControl: true,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: false,
    });

    // 高德地图瓦片 — 中文标签，国内秒开
    L.tileLayer(TILE_URL, {
      maxZoom: 18,
      minZoom: 3,
      subdomains: '1234',
    }).addTo(map);

    // Invalidate size after render to fix any layout issues
    setTimeout(() => map.invalidateSize(), 100);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove previous polylines & circle markers (keep tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Use pathCoords from day data
    days.forEach((day, i) => {
      if (activeDay !== -1 && i !== activeDay) return;

      const coords = day.pathCoords;
      if (!coords || coords.length === 0) return;

      const colorIdx = activeDay === -1 ? i : activeDay;
      const color = dayColors[colorIdx % dayColors.length];
      const opacity = activeDay === -1 ? 0.8 : 1;

      // Route line
      L.polyline(coords, {
        color,
        weight: activeDay === -1 ? 4 : 5,
        opacity,
      }).addTo(map);

      // Day markers
      if (activeDay === -1 || i === activeDay) {
        coords.forEach(([lat, lng], j) => {
          const isEndpoint = j === 0 || j === coords.length - 1;
          L.circleMarker([lat, lng], {
            radius: isEndpoint ? 7 : 4,
            fillColor: color,
            color: '#fff',
            weight: 2,
            fillOpacity: 1,
          }).addTo(map);
        });
      }
    });

    // Fit bounds
    const activeCoords = activeDay === -1
      ? days.flatMap(d => d.pathCoords || [])
      : (days[activeDay]?.pathCoords || []);
    if (activeCoords.length > 0) {
      map.fitBounds(L.latLngBounds(activeCoords as [number, number][]), { padding: [30, 30] });
    }
  }, [activeDay]);

  return <div ref={containerRef} className={className} style={{ height: 250, backgroundColor: '#e8ecf1' }} />;
}
