import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoute } from '@/data/routes';
import { RouteMap } from '@/components/RouteMap';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAmapPOI } from '@/hooks/useAmapPOI';
import { getAmapKey, setAmapKey, type AmapPOI } from '@/services/amapService';
import { NavButton } from '@/components/NavButton';

const dayColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
const dayEmojis = ['🏔️', '🌿', '🌅', '🏜️', '🏞️', '🌌', '🌊', '🗺️'];

export function DayDetailPage() {
  const { routeId, dayNum } = useParams<{ routeId: string; dayNum: string }>();
  const navigate = useNavigate();
  const route = getRoute(routeId || 'duku-highway');
  const dayIndex = Number(dayNum) - 1;
  const day = route?.days[dayIndex];
  const color = dayColors[dayIndex % dayColors.length];

  // Amap live data — search center = midpoint of the day's route
  const amapLat = day ? day.stops[Math.floor(day.stops.length / 2)]?.lat ?? 43.0 : 43.0;
  const amapLng = day ? day.stops[Math.floor(day.stops.length / 2)]?.lng ?? 84.5 : 84.5;
  const { hotels, restaurants, loading: amapLoading, hasKey, error: amapError } = useAmapPOI(amapLat, amapLng);

  // Daily notes — load from localStorage
  const storageKey = route ? `roadbook-notes-${route.meta.id}` : 'roadbook-notes';
  const [todayNote, setTodayNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const notes: Record<string, string> = stored ? JSON.parse(stored) : {};
    setTodayNote(notes[String(day?.dayNumber)] || '');
    setSaved(false);
  }, [dayNum, routeId]);

  const handleSaveNote = useCallback(() => {
    const stored = localStorage.getItem(storageKey);
    const notes: Record<string, string> = stored ? JSON.parse(stored) : {};
    notes[String(day?.dayNumber || 0)] = todayNote;
    localStorage.setItem(storageKey, JSON.stringify(notes));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [todayNote, day, storageKey]);

  const handleCompleteDay = useCallback(() => {
    // Auto-save before moving on
    const stored = localStorage.getItem(storageKey);
    const notes: Record<string, string> = stored ? JSON.parse(stored) : {};
    notes[String(day?.dayNumber || 0)] = todayNote;
    localStorage.setItem(storageKey, JSON.stringify(notes));

    const dayIndex = Number(dayNum) - 1;
    const parentId = routeId || 'duku-highway';
    if (route && dayIndex < route.days.length - 1) {
      navigate(`/route/${parentId}/day/${dayIndex + 2}`);
    } else {
      navigate(`/route/${parentId}/journal`);
    }
  }, [todayNote, day, dayNum, navigate, route, routeId]);

  if (!route || !day) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">找不到该日行程</p>
          <Button variant="secondary" onClick={() => navigate('/')}>返回路线选择</Button>
        </div>
      </div>
    );
  }

  const parentId = route.meta.id;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(`/route/${parentId}`)} className="text-gray-500 active:text-gray-800">
            <span className="text-lg">←</span>
          </button>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-800">第{day.dayNumber}天</div>
            <div className="text-xs text-gray-400">{day.title}</div>
          </div>
          <div className="w-8" /> {/* Spacer */}
        </div>
      </div>

      {/* Day Navigation */}
      <div className="flex overflow-x-auto scroll-container bg-white border-b border-gray-50 px-2 py-2 gap-1">
        {route.days.map((d, i) => (
          <button
            key={i}
            onClick={() => navigate(`/route/${parentId}/day/${d.dayNumber}`)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: i === dayIndex ? color : '#f8fafc',
              color: i === dayIndex ? '#fff' : '#94a3b8',
            }}
          >
            D{d.dayNumber} {d.route.from}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: color + '10' }}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{dayEmojis[dayIndex % dayEmojis.length]}</span>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{day.title}</h2>
                <p className="text-sm" style={{ color: color }}>{day.subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{day.description}</p>

            {/* Stats row */}
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-200/50">
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color }}>{day.distanceKm}</div>
                <div className="text-xs text-gray-400">公里</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color }}>{Math.floor(day.drivingTimeMin / 60)}h{day.drivingTimeMin % 60 ? day.drivingTimeMin % 60 : ''}</div>
                <div className="text-xs text-gray-400">驾驶时间</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color }}>{day.elevation.max}m</div>
                <div className="text-xs text-gray-400">最高海拔</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color }}>⛰️</div>
                <div className="text-xs text-gray-400">{day.elevation.maxPoint}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 pt-3 pb-2">
            <h3 className="text-sm font-semibold text-gray-700">🗺️ {day.route.from} → {day.route.to}</h3>
          </div>
          <RouteMap days={[day]} activeDay={0} className="h-52 w-full" />
        </div>
      </div>

      {/* Via points */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📍 途经点</h3>
          <div className="flex flex-wrap gap-1.5">
            {day.route.via.map((point, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs rounded-full">
                {i + 1}. {point}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stops */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">🛑 沿途停靠</h3>
        <div className="space-y-3">
          {day.stops.map((stop, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: color + '20' }}>
                  {stop.type === 'attraction' ? '🏛' : stop.type === 'viewpoint' ? '📷' : stop.type === 'photo' ? '📸' : '☕'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-semibold text-gray-800 text-sm">{stop.name}</h4>
                    <span className="text-xs text-gray-400 flex-shrink-0">{stop.duration}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{stop.description}</p>
                  {stop.tips && (
                    <p className="text-xs text-blue-600 mt-1 leading-relaxed">💡 {stop.tips}</p>
                  )}
                  <div className="mt-2">
                    <NavButton name={stop.name} lat={stop.lat} lng={stop.lng} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Food */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">🍽️ 推荐美食</h3>
        <div className="space-y-2">
          {day.meals.map((meal, i) => (
            <Card key={i} padding>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                      {meal.type === 'breakfast' ? '早餐' : meal.type === 'lunch' ? '午餐' : meal.type === 'dinner' ? '晚餐' : '小吃'}
                    </span>
                    <h4 className="font-semibold text-gray-800 text-sm">{meal.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500">{meal.description}</p>
                  {meal.mustTry && (
                    <p className="text-xs text-orange-500 mt-1">🔥 必点：{meal.mustTry}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{meal.avgPrice}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Accommodation */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">🏨 住宿推荐</h3>
        <div className="space-y-2">
          {day.accommodation.map((acc, i) => (
            <Card key={i} padding>
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                    {acc.type === 'hotel' ? '酒店' : acc.type === 'guesthouse' ? '民宿' : acc.type === 'camp' ? '营地' : '青旅'}
                  </span>
                  <h4 className="font-semibold text-gray-800 text-sm">{acc.name}</h4>
                </div>
                <span className="text-xs font-medium text-gray-600">{acc.priceRange}</span>
              </div>
              <p className="text-sm text-gray-500">{acc.description}</p>
              {acc.tip && <p className="text-xs text-blue-600 mt-1">💡 {acc.tip}</p>}
            </Card>
          ))}
        </div>
      </div>

      {/* Amap Live Data — restaurants & hotels */}
      <div className="px-4 mt-4">
        {!hasKey ? (
          // No API key — show prompt
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">🔍 查询实时住宿和美食</h3>
            <p className="text-sm text-blue-600 mb-3">接入高德地图 API，获取周边真实的酒店和餐厅信息（名称、地址、评分、价格），数据实时更新。</p>
            <ApiKeyInput />
          </div>
        ) : amapLoading ? (
          // Loading
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="animate-pulse text-gray-400 text-sm">正在查询高德地图数据...</div>
          </div>
        ) : amapError ? (
          // Error
          <div className="bg-red-50 rounded-2xl border border-red-100 p-4">
            <p className="text-sm text-red-600">⚠️ 获取数据失败：{amapError}</p>
          </div>
        ) : (
          // Live data
          <div className="space-y-4">
            {/* Restaurants */}
            {restaurants.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  🍽️ 附近实时美食 <span className="text-xs font-normal text-gray-400">· 高德地图</span>
                </h3>
                <div className="space-y-2">
                  {restaurants.slice(0, 5).map((poi: AmapPOI) => (
                    <Card key={poi.id} padding>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm">{poi.name}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{poi.address || '暂无地址'}</p>
                          {poi.biz_ext?.rating && (
                            <span className="text-xs text-yellow-600">⭐ {poi.biz_ext.rating}</span>
                          )}
                          {poi.biz_ext?.cost && (
                            <span className="text-xs text-gray-400 ml-2">人均 ¥{poi.biz_ext.cost}</span>
                          )}
                          {poi.location && (
                            <div className="mt-2">
                              {(() => {
                                const [lng, lat] = poi.location.split(',').map(Number);
                                return <NavButton name={poi.name} lat={lat} lng={lng} />;
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {hotels.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  🏨 附近实时住宿 <span className="text-xs font-normal text-gray-400">· 高德地图</span>
                </h3>
                <div className="space-y-2">
                  {hotels.slice(0, 5).map((poi: AmapPOI) => (
                    <Card key={poi.id} padding>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm">{poi.name}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{poi.address || '暂无地址'}</p>
                          {poi.biz_ext?.rating && (
                            <span className="text-xs text-yellow-600">⭐ {poi.biz_ext.rating}</span>
                          )}
                          {poi.biz_ext?.cost && (
                            <span className="text-xs text-gray-400 ml-2">参考价 ¥{poi.biz_ext.cost}</span>
                          )}
                          {poi.location && (
                            <div className="mt-2">
                              {(() => {
                                const [lng, lat] = poi.location.split(',').map(Number);
                                return <NavButton name={poi.name} lat={lat} lng={lng} />;
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Road condition & warnings */}
      <div className="px-4 mt-4">
        <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ 路况与注意事项</h3>
          <p className="text-sm text-yellow-700 mb-3">{day.roadCondition}</p>
          <div className="space-y-1.5">
            {day.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-yellow-700">
                <span className="flex-shrink-0">⚠️</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Notes & Completion */}
      <div className="px-4 mt-6 mb-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">📝 今日备注</h3>
          <textarea
            value={todayNote}
            onChange={e => setTodayNote(e.target.value)}
            placeholder="今天的感受、路上遇到的趣事、明天要注意的…"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 resize-none focus:outline-none focus:border-blue-400"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{saved ? '✓ 已自动保存' : ''}</span>
            <button
              onClick={handleSaveNote}
              className="text-xs text-blue-600 font-medium"
            >
              保存
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          {dayIndex > 0 && (
            <Button variant="secondary" size="md" onClick={() => navigate(`/route/${parentId}/day/${dayIndex}`)}>
              ← 回看
            </Button>
          )}
          {dayIndex < route.days.length - 1 ? (
            <Button variant="primary" size="md" fullWidth onClick={handleCompleteDay}>
              ✅ 完成今日 · 前往第{dayIndex + 2}天 →
            </Button>
          ) : (
            <Button variant="primary" size="md" fullWidth onClick={handleCompleteDay}>
              🏁 完成旅程！
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline API Key input component
function ApiKeyInput() {
  const [key, setKey] = React.useState(getAmapKey());
  const [saved, setSaved] = React.useState(!!getAmapKey());

  const handleSave = () => {
    setAmapKey(key);
    setSaved(true);
    // Reload to trigger data fetch
    window.location.reload();
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={key}
        onChange={e => { setKey(e.target.value); setSaved(false); }}
        placeholder="粘贴高德 Web API Key"
        className="w-full px-3 py-2 text-sm rounded-xl border border-blue-200 focus:outline-none focus:border-blue-400"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={!key.trim()}
          className="px-4 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg disabled:opacity-40"
        >
          {saved ? '已保存 ✓' : '保存 Key'}
        </button>
        <a
          href="https://lbs.amap.com/api/webservice/create-project/get-key"
          target="_blank"
          className="text-xs text-blue-500 underline"
        >
          免费获取 Key →
        </a>
      </div>
    </div>
  );
}
