// ─── POST /api/unlock ───
// 用户输入解锁码 → 验证 → 标记已使用 → 返回成功
// Vercel Function (Edge Runtime)

import { Redis } from '@upstash/redis';

// Upstash Redis client — 从 Vercel 环境变量自动注入
// 部署后在 Vercel Dashboard → Integrations → 添加 Upstash Redis
const getRedis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error('Redis not configured. Add Upstash Redis integration in Vercel Dashboard.');
  }
  return new Redis({ url, token });
};

interface UnlockRequest {
  userId: string;
  code: string;
}

function generateToken(length = 32): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const redis = getRedis();
    const { userId, code } = (await request.json()) as UnlockRequest;

    if (!userId || !code) {
      return Response.json(
        { success: false, error: '缺少参数' },
        { status: 400 }
      );
    }

    // 1. 查这个解锁码是否有效
    const codeKey = `code:${code.toUpperCase()}`;
    const codeData = await redis.get<{ routeId: string; used: boolean }>(codeKey);

    if (!codeData) {
      return Response.json(
        { success: false, error: '解锁码无效' },
        { status: 404 }
      );
    }

    if (codeData.used) {
      return Response.json(
        { success: false, error: '该解锁码已被使用' },
        { status: 409 }
      );
    }

    // 2. 标记解锁码已使用
    await redis.set(codeKey, { ...codeData, used: true, usedBy: userId, usedAt: new Date().toISOString() });

    // 3. 记录用户购买
    const token = generateToken();
    const purchaseKey = `purchase:${userId}:${codeData.routeId}`;
    await redis.set(purchaseKey, {
      unlocked: true,
      routeId: codeData.routeId,
      token,
      date: new Date().toISOString(),
      code,
    });

    return Response.json({
      success: true,
      routeId: codeData.routeId,
      token,
    });
  } catch (error: any) {
    console.error('Unlock error:', error);
    return Response.json(
      { success: false, error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS（CORS 预检）
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
