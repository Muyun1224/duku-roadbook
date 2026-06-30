// ─── AdminPage ───
// 管理后台：管理员登录 → 生成解锁码
// 访问路径: #/admin

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface GeneratedCodes {
  codes: string[];
  routeId: string;
  count: number;
}

const ROUTE_OPTIONS = [
  { id: 'kanas-loop', name: '北疆喀纳斯环线 (¥9.9)', prefix: 'KA' },
  { id: 'southern-xinjiang', name: '南疆风情线 (¥9.9)', prefix: 'SX' },
  { id: 'duku-highway', name: '独库公路 (免费/测试)', prefix: 'DK' },
];

export function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [routeId, setRouteId] = useState('kanas-loop');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedCodes | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLogin = () => {
    if (adminKey.trim()) {
      setLoggedIn(true);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: adminKey.trim(), routeId, count }),
      });
      const data = await res.json();

      if (data.success) {
        setResult({ codes: data.codes, routeId, count: data.count });
      } else {
        setError(data.error || '生成失败');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = async () => {
    if (!result) return;
    const text = result.codes.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 pt-8 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🛠️</span>
          <h1 className="text-lg font-bold">路书管理员后台</h1>
        </div>
        <p className="text-gray-400 text-xs">生成解锁码 · 管理路线</p>
      </div>

      <div className="px-4 pt-4 max-w-md mx-auto">
        {!loggedIn ? (
          /* ─── Login ─── */
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">🔑 管理员登录</h3>
            <input
              type="password"
              value={adminKey}
              onChange={e => setAdminKey(e.target.value)}
              placeholder="输入管理员密钥"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
            <Button variant="primary" size="md" fullWidth onClick={handleLogin} disabled={!adminKey.trim()}>
              登录
            </Button>
            <p className="text-xs text-gray-400 text-center">
              密钥在 Vercel 环境变量 ADMIN_KEY 中设置
            </p>
          </div>
        ) : (
          /* ─── Generate panel ─── */
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">🎫 生成解锁码</h3>

              {/* Route select */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">选择路线</label>
                <select
                  value={routeId}
                  onChange={e => setRouteId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 bg-white"
                >
                  {ROUTE_OPTIONS.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Count */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">生成数量</label>
                <div className="flex gap-2">
                  {[1, 5, 10, 20].map(n => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                        count === n
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? '生成中...' : `✨ 生成 ${count} 个解锁码`}
              </Button>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
            </div>

            {/* Result */}
            {result && (
              <div className="bg-white rounded-2xl border border-green-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-green-700">
                    ✅ 已生成 {result.count} 个解锁码
                  </h3>
                  <button
                    onClick={handleCopyAll}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    {copied ? '已复制 ✓' : '一键复制'}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                  {result.codes.map((code, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <code className="text-sm font-mono text-gray-800 tracking-widest">{code}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                        }}
                        className="text-xs text-gray-400 hover:text-blue-600"
                      >
                        📋
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  发给用户后，用户在 App 内输入解锁码即可永久解锁。
                  每个码只能使用一次。
                </p>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={() => { setLoggedIn(false); setResult(null); }}
              className="w-full py-2 text-xs text-gray-400 hover:text-gray-600"
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
