import { Card } from '@/components/ui/Card';
import type { DayRoute } from '@/types/route';

interface DayCardProps {
  day: DayRoute;
  onClick: () => void;
  color: string;
}

const dayIcons = ['🏔️', '🌿', '🌅', '🏜️'];

export function DayCard({ day, onClick, color }: DayCardProps) {
  return (
    <Card onClick={onClick} className="overflow-hidden">
      <div className="flex gap-3">
        {/* Left color bar */}
        <div
          className="w-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color, minHeight: '100%' }}
        />
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{dayIcons[day.dayNumber - 1]}</span>
            <span className="text-xs font-medium text-gray-400">第{day.dayNumber}天</span>
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">{day.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-1 mb-2">{day.subtitle}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>🚗 {day.distanceKm}km</span>
            <span>⏱ {Math.floor(day.drivingTimeMin / 60)}h{day.drivingTimeMin % 60 ? `${day.drivingTimeMin % 60}m` : ''}</span>
            <span>⛰ {day.elevation.max}m</span>
          </div>
          {/* Highlight */}
          <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-600">
              ✨ {day.highlight}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
