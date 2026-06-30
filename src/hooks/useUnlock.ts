// ─── useUnlock Hook ───
// 管理用户购买/解锁状态：检查 localStorage + 调后端 API

import { useState, useEffect, useCallback } from 'react';

// 付费路线列表 — 为空时所有路线免费
// 想启用付费时，把路线 ID 加回来：['kanas-loop', 'southern-xinjiang']
const PAID_ROUTES: string[] = [];

// 生成或读取用户唯一 ID（存在 localStorage，不清除）
function getUserId(): string {
  const key = 'roadbook-user-id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(key, id);
  }
  return id;
}

// 本地存储已解锁 token（加速判断，不调 API 也能用）
function getLocalUnlocks(): Record<string, string> {
  try {
    const raw = localStorage.getItem('roadbook-unlocks');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalUnlock(routeId: string, token: string) {
  const unlocks = getLocalUnlocks();
  unlocks[routeId] = token;
  localStorage.setItem('roadbook-unlocks', JSON.stringify(unlocks));
}

export function isFreeRoute(routeId: string): boolean {
  return !PAID_ROUTES.includes(routeId);
}

export function getRoutePrice(routeId: string): number {
  return routeId === 'kanas-loop' || routeId === 'southern-xinjiang' ? 9.9 : 0;
}

export function useUnlock(routeId: string) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null); // null = loading
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = getUserId();

  // 初始化：检查是否已解锁
  useEffect(() => {
    if (isFreeRoute(routeId)) {
      setIsUnlocked(true);
      setIsChecking(false);
      return;
    }

    // 1. 先查本地
    const localUnlocks = getLocalUnlocks();
    if (localUnlocks[routeId]) {
      setIsUnlocked(true);
      setIsChecking(false);
      return;
    }

    // 2. 调后端 API 查询
    const checkRemote = async () => {
      try {
        const res = await fetch(`/api/check-purchase?userId=${userId}&routeId=${routeId}`);
        const data = await res.json();
        if (data.unlocked && data.token) {
          setLocalUnlock(routeId, data.token);
          setIsUnlocked(true);
        } else {
          setIsUnlocked(false);
        }
      } catch {
        // 网络错误，假设未解锁（不让付费用户被卡住，但优先安全）
        setIsUnlocked(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkRemote();
  }, [routeId, userId]);

  // 解锁操作
  const unlock = useCallback(async (code: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: code.trim().toUpperCase() }),
      });
      const data = await res.json();

      if (data.success) {
        setLocalUnlock(data.routeId, data.token);
        setIsUnlocked(true);
        return true;
      } else {
        setError(data.error || '解锁失败');
        return false;
      }
    } catch {
      setError('网络错误，请稍后重试');
      return false;
    }
  }, [userId]);

  return { isUnlocked, isChecking, error, unlock, userId, isFree: isFreeRoute(routeId) };
}
