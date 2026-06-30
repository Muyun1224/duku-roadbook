// ─── UnlockGate ───
// 付费弹窗：显示路线预览 + 价格 + 解锁码输入

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getRoutePrice } from '@/hooks/useUnlock';

interface UnlockGateProps {
  routeId: string;
  routeName: string;
  onUnlock: (code: string) => Promise<boolean>;
  error: string | null;
}

export function UnlockGate({ routeId, routeName, onUnlock, error }: UnlockGateProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const price = getRoutePrice(routeId);

  const handleSubmit = async () => {
    if (!code.trim() || loading) return;
    setLoading(true);
    setLocalError(null);
    const ok = await onUnlock(code);
    if (!ok) {
      setLocalError(error || '解锁码无效');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-5 text-center">
          <span className="text-3xl mb-2 block">🔐</span>
          <h3 className="font-bold text-lg">解锁 {routeName}</h3>
          <p className="text-blue-100 text-sm mt-1">
            完整路书 · 每日详情 · 导航 · 美食住宿
          </p>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {/* Price */}
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-800">
              ¥{price}
            </div>
            <div className="text-sm text-gray-400 mt-0.5">一条路线 · 永久解锁</div>
          </div>

          {/* Unlock code input */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                输入解锁码
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="例如: KA-XXXX-XXXX"
                maxLength={14}
                className="w-full px-3 py-2.5 text-sm text-center rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 tracking-widest uppercase placeholder:tracking-normal placeholder:normal-case"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
            </div>

            {(localError || error) && (
              <p className="text-xs text-red-500 text-center">{localError || error}</p>
            )}

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleSubmit}
              disabled={!code.trim() || loading}
            >
              {loading ? '验证中...' : '🔓 解锁'}
            </Button>
          </div>

          {/* How to get */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              还没有解锁码？<br />
              扫码联系客服获取 👇
            </p>
            <div className="text-center mt-2 text-xs">
              {/* 占位：后续替换为实际微信/赞赏码 */}
              <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full font-medium">
                💬 微信：roadbook2025
              </span>
            </div>
            <p className="text-xs text-gray-300 text-center mt-2">
              {price === 9.9 ? '¥9.9/条 或 ¥49.9/终身全部路线' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
