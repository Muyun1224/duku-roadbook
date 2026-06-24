import { useState, useEffect } from 'react';
import { searchNearbyPOI, getAmapKey, type AmapPOI } from '@/services/amapService';

interface UseAmapPOIResult {
  hotels: AmapPOI[];
  restaurants: AmapPOI[];
  loading: boolean;
  error: string | null;
  hasKey: boolean;
}

export function useAmapPOI(lat: number, lng: number): UseAmapPOIResult {
  const [hotels, setHotels] = useState<AmapPOI[]>([]);
  const [restaurants, setRestaurants] = useState<AmapPOI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = getAmapKey();
  const hasKey = !!key;

  useEffect(() => {
    if (!key || lat === 0 || lng === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      searchNearbyPOI(lng, lat, 'hotel', key).catch(() => [] as AmapPOI[]),
      searchNearbyPOI(lng, lat, 'restaurant', key).catch(() => [] as AmapPOI[]),
    ])
      .then(([h, r]) => {
        if (!cancelled) {
          setHotels(h);
          setRestaurants(r);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '获取数据失败');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [lat, lng, key]);

  return { hotels, restaurants, loading, error, hasKey };
}
