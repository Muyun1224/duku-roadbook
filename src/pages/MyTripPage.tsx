import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoute } from '@/data/routes';
import { Card } from '@/components/ui/Card';
import { getAmapKey, setAmapKey } from '@/services/amapService';

const dayEmojis = ['🏔️', '🌿', '🌅', '🏜️', '🏞️', '🌌', '🌊', '🗺️'];

export function JournalPage() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const route = getRoute(routeId || 'duku-highway');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [amapKey, setAmapKeyLocal] = useState(getAmapKey());

  const storageKey = route ? `roadbook-notes-${route.meta.id}` : 'roadbook-notes';

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try { setNotes(JSON.parse(stored)); } catch { /* */ }
    }
  }, [storageKey]);

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <span className="text-4xl mb-4 block">📔</span>
          <p className="text-gray-600 mb-1 font-semibold">找不到该路线</p>
          <button onClick={() => navigate('/')} className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-full">
            返回路线选择
          </button>
        </div>
      </div>
    );
  }

  const { meta, days } = route;
  const parentId = meta.id;
  const completedDays = days.filter(d => notes[String(d.dayNumber)]?.trim());
  const progress = Math.round((completedDays.length / days.length) * 100);

  const handleSaveKey = () => {
    setAmapKey(amapKey);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(`/route/${parentId}`)} className="text-gray-500 active:text-gray-800">
            <span className="text-lg">←</span>
          </button>
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-800">旅行日记</div>
            <div className="text-xs text-gray-400">{meta.name}</div>
          </div>
          <div className="w-8" />
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">🏁 旅程进度</h3>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {completedDays.length}/{days.length} 天已完成
            {completedDays.length === days.length ? ` 🎉 恭喜走完${meta.name}！` : ''}
          </p>
        </div>

        {/* Day notes */}
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📝 每日记录</h3>
        <div className="space-y-3">
          {days.map((day, i) => {
            const note = notes[String(day.dayNumber)] || '';
            const isCompleted = !!note.trim();

            return (
              <Card key={day.dayNumber}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{dayEmojis[i % dayEmojis.length]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">
                        第{day.dayNumber}天
                      </span>
                      <span className="text-xs text-gray-400">{day.title}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {day.route.from} → {day.route.to} · {day.distanceKm}km
                    </div>
                  </div>
                  {isCompleted ? (
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full font-medium">已完成</span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-gray-50 text-gray-400 rounded-full">待完成</span>
                  )}
                </div>

                {isCompleted ? (
                  <div className="bg-gray-50 rounded-lg px-3 py-2 mt-2">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{note}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/route/${parentId}/day/${day.dayNumber}`)}
                    className="text-sm text-blue-500 mt-2 inline-block hover:text-blue-700"
                  >
                    🚗 开始这一天 →
                  </button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Amap Key */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">🗺️ 高德地图 API Key</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={amapKey}
              onChange={e => setAmapKeyLocal(e.target.value)}
              placeholder="粘贴高德 Web API Key"
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-xl whitespace-nowrap"
            >
              保存
            </button>
          </div>
        </div>

        {completedDays.length === days.length && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 mt-4 text-white text-center">
            <p className="text-2xl mb-1">🏆</p>
            <p className="font-bold text-lg">恭喜完成{meta.name}！</p>
            <p className="text-sm text-yellow-100 mt-1">
              {meta.totalDistanceKm}公里 · {meta.totalDays}天 · {meta.startPoint.name} → {meta.endPoint.name}
            </p>
          </div>
        )}

        <div className="mt-6 mb-12">
          <button
            onClick={() => navigate(`/route/${parentId}`)}
            className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 返回路书首页
          </button>
        </div>
      </div>
    </div>
  );
}
