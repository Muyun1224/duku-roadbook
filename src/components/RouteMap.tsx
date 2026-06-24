import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DayRoute } from '@/data/dukuRoute';

interface RouteMapProps {
  days: DayRoute[];
  activeDay?: number;  // -1 = show all
  className?: string;
}

// Route points for each day (simplified key coordinates along Duku Highway)
const dayPathCoords: [number, number][][] = [
  // Day 1: 独山子 → 乔尔玛
  [[44.3272, 84.8835], [44.2000, 84.6500], [43.9500, 84.4500], [43.8500, 84.3500], [43.6500, 84.3000]],
  // Day 2: 乔尔玛 → 那拉提
  [[43.6500, 84.3000], [43.5800, 84.1500], [43.4500, 84.0500], [43.3500, 83.9500]],
  // Day 3: 那拉提 → 巴音布鲁克
  [[43.3500, 83.9500], [43.2500, 84.0000], [43.0500, 84.1000]],
  // Day 4: 巴音布鲁克 → 库车
  [[43.0500, 84.1000], [42.6000, 83.5000], [42.4500, 83.3000], [42.1000, 83.0000], [41.7179, 82.9623]],
];

const dayColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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

    dayPathCoords.forEach((coords, i) => {
      if (activeDay !== -1 && i !== activeDay) return;

      const color = activeDay === -1 ? dayColors[i] : dayColors[activeDay];
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
      ? dayPathCoords.flat()
      : dayPathCoords[activeDay];
    if (activeCoords.length > 0) {
      map.fitBounds(L.latLngBounds(activeCoords as [number, number][]), { padding: [30, 30] });
    }
  }, [activeDay]);

  return <div ref={containerRef} className={className} style={{ height: 250, backgroundColor: '#e8ecf1' }} />;
}
