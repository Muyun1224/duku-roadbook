import type { DayRoute } from '@/types/route';

interface ElevationChartProps {
  days: DayRoute[];
}

export function ElevationChart({ days }: ElevationChartProps) {
  const maxElev = Math.max(...days.map(d => d.elevation.max)) + 200;
  const minElev = Math.min(...days.map(d => d.elevation.start));
  const range = maxElev - minElev;
  const width = 100 / (days.length * 2); // width per segment as percentage

  const points = days.map((day, i) => {
    const x = ((i + 0.5) / days.length) * 100;
    const y = 100 - ((day.elevation.max - minElev) / range) * 90 - 5;
    return { x, y, label: day.elevation.maxPoint, elev: day.elevation.max };
  });

  // Build SVG path: start with Day 1 start elev, then max for each day, then Day N end
  const pathPoints: string[] = [];
  days.forEach((day, i) => {
    const x = (i / (days.length - 1)) * 100;
    const y = 100 - ((day.elevation.max - minElev) / range) * 90 - 5;
    pathPoints.push(`${x},${y}`);
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">📈 海拔变化</h3>
      <div className="relative" style={{ height: 140 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
          ))}
          {/* Elevation line */}
          <polyline
            points={pathPoints.join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Fill area */}
          <polygon
            points={`0,100 ${pathPoints.join(' ')} 100,100`}
            fill="url(#elevGradient)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Peak points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="2.5" fill="#3B82F6" stroke="#fff" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
        {/* Labels */}
        {points.map((p, i) => (
          <div
            key={i}
            className="absolute text-xs text-gray-500 transform -translate-x-1/2"
            style={{ left: `${p.x}%`, top: `${p.y - 3}%` }}
          >
            {p.elev}m
          </div>
        ))}
      </div>
      {/* Day labels */}
      <div className="flex justify-between mt-2">
        {days.map((day, i) => (
          <span key={i} className="text-xs text-gray-400">
            D{day.dayNumber}
          </span>
        ))}
      </div>
    </div>
  );
}
