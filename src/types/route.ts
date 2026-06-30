// ─── 自驾路书通用类型定义 ───

export interface Stop {
  type: 'viewpoint' | 'attraction' | 'rest' | 'photo';
  name: string;
  lat: number;
  lng: number;
  description: string;
  duration: string;  // 建议停留时间
  tips?: string;
}

export interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  mustTry?: string;
  avgPrice: string;
}

export interface Accommodation {
  name: string;
  type: 'hotel' | 'guesthouse' | 'camp' | 'hostel';
  priceRange: string;
  description: string;
  tip?: string;
}

export interface DayRoute {
  dayNumber: number;
  title: string;           // e.g. "独山子 → 乔尔玛"
  subtitle: string;        // e.g. "穿越哈希勒根达坂"
  distanceKm: number;
  drivingTimeMin: number;
  elevation: {
    start: number;         // 出发海拔(m)
    end: number;           // 到达海拔(m)
    max: number;           // 最高点海拔(m)
    maxPoint: string;      // 最高点名称
  };
  description: string;     // 当日概述
  route: {
    from: string;
    to: string;
    via: string[];         // 途经主要地点
  };
  stops: Stop[];           // 沿途停靠点
  meals: Meal[];           // 推荐餐饮
  accommodation: Accommodation[]; // 推荐住宿
  roadCondition: string;   // 路况说明
  warnings: string[];      // 注意事项
  highlight: string;       // 当日亮点（一行字）
  pathCoords: [number, number][];  // 当日路线在地图上的坐标
}

export interface RouteMeta {
  id: string;
  name: string;
  subtitle: string;
  region: string;
  totalDistanceKm: number;
  totalDays: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  bestSeason: string;
  seasonMonths: string;
  highestPoint: { name: string; elevation: number };
  startPoint: { name: string; lat: number; lng: number };
  endPoint: { name: string; lat: number; lng: number };
  description: string;
  highlights: string[];
  packingTips: string[];
  coverEmoji: string;      // 列表页展示用
  budget: {
    economy: number;
    comfort: number;
    luxury: number;
    perPerson: boolean;
    includes: string[];
    excludes: string[];
  };
}

export interface RouteData {
  meta: RouteMeta;
  days: DayRoute[];
}
