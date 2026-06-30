import { useNavigate } from 'react-router-dom';
import { allRoutes } from '@/data/routes';

const difficultyLabel: Record<string, string> = {
  easy: '轻松',
  moderate: '中等',
  challenging: '挑战',
};

export function RouteSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="px-4 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🗺️</span>
            <div>
              <h1 className="text-xl font-bold">自驾路书</h1>
              <p className="text-sm text-blue-200">精选全球自驾路线，一条路线一个故事</p>
            </div>
          </div>
          <p className="text-blue-100 text-sm leading-relaxed">
            不跟 Wanderlog 比工具，不跟 Plan WeGo 比平台——我们做精选路书。每条路线都是实地踩过的，从路线规划到吃饭住宿，一站式安排。
          </p>
        </div>
      </div>

      {/* Route Cards */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="space-y-3">
          {allRoutes.map((route) => {
            const { meta, days } = route;
            return (
              <button
                key={meta.id}
                onClick={() => navigate(`/route/${meta.id}`)}
                className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform overflow-hidden"
              >
                {/* Cover area with emoji */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-5 flex items-center gap-4">
                  <span className="text-4xl">{meta.coverEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base">{meta.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{meta.subtitle}</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="px-4 py-3">
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center bg-gray-50 rounded-lg py-2">
                      <div className="text-sm font-bold text-gray-700">{meta.totalDistanceKm}km</div>
                      <div className="text-xs text-gray-400">总里程</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg py-2">
                      <div className="text-sm font-bold text-gray-700">{meta.totalDays}天</div>
                      <div className="text-xs text-gray-400">行程</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg py-2">
                      <div className="text-sm font-bold text-gray-700">
                        {'⭐'.repeat(meta.difficulty === 'easy' ? 2 : meta.difficulty === 'moderate' ? 3 : 4)}
                      </div>
                      <div className="text-xs text-gray-400">{difficultyLabel[meta.difficulty]}</div>
                    </div>
                  </div>

                  {/* Route line */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-medium text-gray-600">{meta.startPoint.name}</span>
                    <span className="flex-1 h-px bg-gray-200" />
                    <span className="font-medium text-gray-600">{meta.endPoint.name}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">{meta.region}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">{meta.bestSeason}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">{days.length}日行程</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 mb-4">
          <p className="text-xs text-gray-400">更多路线筹备中 · 川藏线 · 海南环岛 · 川西环线</p>
        </div>
      </div>
    </div>
  );
}
