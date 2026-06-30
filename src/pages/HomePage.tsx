import { useParams, useNavigate } from 'react-router-dom';
import { getRoute } from '@/data/routes';
import { Button } from '@/components/ui/Button';
import { RouteMap } from '@/components/RouteMap';
import { ElevationChart } from '@/components/ElevationChart';
import { DayCard } from '@/components/DayCard';
import { useState } from 'react';

const dayColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export function HomePage() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(-1);

  const route = getRoute(routeId || 'duku-highway');

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <span className="text-4xl mb-4 block">🗺️</span>
          <p className="text-gray-600 mb-1 font-semibold">找不到该路线</p>
          <p className="text-gray-400 text-sm mb-4">这条路还没开通，先看看别的吧</p>
          <button onClick={() => navigate('/')} className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-full">
            返回路线选择
          </button>
        </div>
      </div>
    );
  }

  const { meta, days } = route;
  const formatCurrency = (n: number) => `¥${n.toLocaleString('zh-CN')}`;

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="px-4 pt-8 pb-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/')} className="text-xl">
                ←
              </button>
              <div>
                <h1 className="text-lg font-bold leading-tight">{meta.name}自驾路书</h1>
                <p className="text-xs text-blue-200">{meta.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/route/${meta.id}/journal`)}
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              📔 旅行日记
            </button>
          </div>

          {/* Route stats */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4">
            <p className="text-sm text-blue-100 mb-3">{meta.subtitle}</p>
            <div className="grid grid-cols-2 gap-3">
              <StatItem label="总里程" value={`${meta.totalDistanceKm} km`} icon="🛞" />
              <StatItem label="行程天数" value={`${meta.totalDays} 天`} icon="📅" />
              <StatItem label="最高海拔" value={`${meta.highestPoint.elevation}m`} icon="⛰️" />
              <StatItem label="最佳季节" value={meta.bestSeason} icon="☀️" />
            </div>
          </div>

          {/* Route line */}
          <div className="flex items-center justify-between text-xs text-blue-200 px-2 mb-2">
            <span className="font-medium text-white">{meta.startPoint.name}</span>
            <span className="text-blue-300">━━━━━━━━━━━━━</span>
            <span className="font-medium text-white">{meta.endPoint.name}</span>
          </div>

          {/* Difficulty badge */}
          <div className="flex items-center gap-2 text-xs text-blue-200">
            <span>难度：{'⭐'.repeat(meta.difficulty === 'easy' ? 2 : meta.difficulty === 'moderate' ? 3 : 4)}</span>
            <span>·</span>
            <span>{meta.seasonMonths}</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold text-gray-700">🗺️ 路线地图</h3>
            <div className="flex gap-1">
              <MapToggleBtn label="全部" active={activeDay === -1} onClick={() => setActiveDay(-1)} />
              {days.map((_, i) => (
                <MapToggleBtn
                  key={i}
                  label={`D${i + 1}`}
                  active={activeDay === i}
                  onClick={() => setActiveDay(i)}
                  color={dayColors[i % dayColors.length]}
                />
              ))}
            </div>
          </div>
          <RouteMap days={days} activeDay={activeDay} className="h-56 w-full" />
          {/* Day color legend */}
          <div className="flex flex-wrap gap-3 px-4 py-2 text-xs text-gray-400">
            {days.map((day, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dayColors[i % dayColors.length] }} />
                D{day.dayNumber}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Elevation Profile */}
      <div className="px-4 mt-4">
        <ElevationChart days={days} />
      </div>

      {/* Day Cards */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 每日行程</h3>
        <div className="space-y-3">
          {days.map((day, i) => (
            <DayCard
              key={day.dayNumber}
              day={day}
              onClick={() => navigate(`/route/${meta.id}/day/${day.dayNumber}`)}
              color={dayColors[i % dayColors.length]}
            />
          ))}
        </div>
      </div>

      {/* Route highlights */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">✨ 路线亮点</h3>
          <div className="space-y-2">
            {meta.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-blue-500 flex-shrink-0 mt-0.5">•</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget estimate */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">💰 费用预估（每人）</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center bg-gray-50 rounded-xl py-3">
              <div className="text-xs text-gray-400 mb-1">经济</div>
              <div className="font-bold text-gray-800">{formatCurrency(meta.budget.economy)}</div>
            </div>
            <div className="text-center bg-blue-50 rounded-xl py-3 border border-blue-200">
              <div className="text-xs text-blue-500 mb-1">舒适 ★</div>
              <div className="font-bold text-blue-700">{formatCurrency(meta.budget.comfort)}</div>
            </div>
            <div className="text-center bg-gray-50 rounded-xl py-3">
              <div className="text-xs text-gray-400 mb-1">豪华</div>
              <div className="font-bold text-gray-800">{formatCurrency(meta.budget.luxury)}</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <p>✅ 包含：{meta.budget.includes.join('、')}</p>
            <p>❌ 不含：{meta.budget.excludes.join('、')}</p>
          </div>
        </div>
      </div>

      {/* Packing tips */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">🎒 装备清单</h3>
          <div className="space-y-2">
            {meta.packingTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-yellow-500 flex-shrink-0 mt-0.5">▸</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-6 mb-12">
        <Button variant="primary" size="lg" fullWidth onClick={() => navigate(`/route/${meta.id}/day/1`)}>
          🚗 开始这段旅程
        </Button>
        <p className="text-center text-xs text-gray-400 mt-2">
          {meta.totalDistanceKm}公里 · {meta.totalDays}天{meta.totalDays - 1}晚 · {meta.startPoint.name}→{meta.endPoint.name}
        </p>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div>
        <div className="text-xs text-blue-200">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}

function MapToggleBtn({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 text-xs rounded-full font-medium transition-colors"
      style={{
        backgroundColor: active ? (color || '#3B82F6') : '#f1f5f9',
        color: active ? '#fff' : '#94a3b8',
      }}
    >
      {label}
    </button>
  );
}
