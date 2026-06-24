import { useState } from 'react';

interface NavButtonProps {
  name: string;
  lat: number;
  lng: number;
}

interface NavApp {
  name: string;
  icon: string;
  url: string;
  available: boolean;
}

function buildNavApps(name: string, lat: number, lng: number): NavApp[] {
  const encodedName = encodeURIComponent(name);
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isWechat = /MicroMessenger/i.test(ua);

  // Use GCJ-02 (Amap/Chinese standard) coordinates
  return [
    {
      name: '高德地图',
      icon: '🗺️',
      // amapuri scheme for native app, with web fallback
      url: isWechat
        // In WeChat, use web version
        ? `https://uri.amap.com/navigation?to=${lng},${lat},0&mode=car&callnative=1&name=${encodedName}`
        : isIOS
          ? `iosamap://path?sourceApplication=duku&dlat=${lat}&dlon=${lng}&dname=${encodedName}&dev=0&t=0`
          : isAndroid
            ? `amapuri://route/plan/?dlat=${lat}&dlon=${lng}&dname=${encodedName}&dev=0&t=0`
            : `https://uri.amap.com/navigation?to=${lng},${lat},0&mode=car&name=${encodedName}`,
      available: true,
    },
    {
      name: '百度地图',
      icon: '📍',
      url: `https://api.map.baidu.com/direction?destination=${lat},${lng}&coord_type=gcj02&mode=driving&destination_name=${encodedName}`,
      available: true,
    },
    {
      name: 'Apple 地图',
      icon: '🧭',
      url: `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d&q=${encodedName}`,
      available: isIOS,
    },
    {
      name: 'Google Maps',
      icon: '🌍',
      url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
      available: true,
    },
  ];
}

export function NavButton({ name, lat, lng }: NavButtonProps) {
  const [open, setOpen] = useState(false);
  const apps = buildNavApps(name, lat, lng);
  const availableApps = apps.filter(a => a.available);

  if (lat === 0 && lng === 0) return null;

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 active:bg-blue-200 transition-colors"
      >
        🧭 导航
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl w-full max-w-lg p-5 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <h4 className="text-base font-semibold text-gray-800 mb-1">导航到</h4>
            <p className="text-sm text-gray-500 mb-4">{name}</p>

            <div className="space-y-2">
              {availableApps.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setTimeout(() => setOpen(false), 300)}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors text-decoration-none"
                >
                  <span className="text-xl">{app.icon}</span>
                  <span className="flex-1 text-sm font-medium text-gray-800">{app.name}</span>
                  <span className="text-gray-400 text-sm">→</span>
                </a>
              ))}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-full mt-3 py-3 text-sm text-gray-400 active:text-gray-600"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
        a.text-decoration-none {
          text-decoration: none;
          color: inherit;
        }
      `}</style>
    </>
  );
}
