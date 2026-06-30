// ─── GET /api/check-purchase ───
// 查询某个用户是否已购买某条路线
// Vercel Function (Edge Runtime)

import { Redis } from '@upstash/redis';

const getRedis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error('Redis not configured.');
  }
  return new Redis({ url, token });
};

export async function GET(request: Request): Promise<Response> {
  try {
    const redis = getRedis();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const routeId = searchParams.get('routeId');

    if (!userId) {
      return Response.json({ unlocked: false, error: '缺少 userId' }, { status: 400 });
    }

    // 如果没有指定 routeId，返回该用户所有已购买路线
    if (!routeId) {
      // 扫描所有 purchase:userId:* 的 key
      const keys = await redis.keys(`purchase:${userId}:*`);
      const routeIds = keys.map(k => k.split(':')[2]).filter(Boolean);
      return Response.json({ unlocked: routeIds.length > 0, purchasedRoutes: routeIds });
    }

    // 查询特定路线
    const purchaseKey = `purchase:${userId}:${routeId}`;
    const data = await redis.get<{ unlocked: boolean; token?: string }>(purchaseKey);

    return Response.json({
      unlocked: !!data?.unlocked,
      token: data?.token || null,
    });
  } catch (error: any) {
    console.error('Check purchase error:', error);
    return Response.json(
      { unlocked: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
