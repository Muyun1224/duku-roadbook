/**
 * 高德地图 API 服务
 * 免费额度: 每日 5000 次调用
 * 文档: https://lbs.amap.com/api/webservice/summary
 */

const BASE = 'https://restapi.amap.com/v3';

// ---- 缓存（1小时有效）----
function cacheGet(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(`amap_${key}`);
    if (!raw) return null;
    const { data, expires } = JSON.parse(raw);
    if (Date.now() > expires) { localStorage.removeItem(`amap_${key}`); return null; }
    return data;
  } catch { return null; }
}

function cacheSet(key: string, data: unknown, ttlMs = 3600000): void {
  localStorage.setItem(`amap_${key}`, JSON.stringify({ data, expires: Date.now() + ttlMs }));
}

// ---- 通用请求 ----
async function amapFetch(path: string, params: Record<string, string>, key: string): Promise<unknown> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('key', key);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const cacheKey = url.pathname + url.searchParams.toString();
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`高德API请求失败: ${res.status}`);
  const json = await res.json();
  if (json.status !== '1') throw new Error(`高德API错误: ${json.info || '未知错误'}`);

  cacheSet(cacheKey, json, 3600000); // 缓存1小时
  return json;
}

// ---- 类型 ----
export interface AmapPOI {
  id: string;
  name: string;
  type: string;
  address: string;
  location: string; // "lng,lat"
  biz_ext?: { rating?: string; cost?: string };
  photos?: { url: string }[];
}

// ---- POI 搜索 ----
const POI_TYPE_MAP: Record<string, string> = {
  restaurant: '050000',
  hotel: '100000',
};

export async function searchNearbyPOI(
  centerLng: number,
  centerLat: number,
  type: 'restaurant' | 'hotel',
  key: string,
  radius = 50000, // 50km 范围
): Promise<AmapPOI[]> {
  const data = await amapFetch('/place/around', {
    location: `${centerLng},${centerLat}`,
    types: POI_TYPE_MAP[type],
    radius: String(radius),
    offset: '5',
    page: '1',
    extensions: 'all',
  }, key) as { pois: AmapPOI[] };

  return data.pois || [];
}

// ---- 获取 API Key ----
export function getAmapKey(): string {
  return localStorage.getItem('amap_api_key') || '';
}

export function setAmapKey(key: string): void {
  localStorage.setItem('amap_api_key', key.trim());
}
