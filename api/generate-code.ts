// ─── POST /api/generate-code ───
// 管理员后台：生成解锁码
// 需要 ADMIN_KEY 验证
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

const ROUTE_PREFIXES: Record<string, string> = {
  'kanas-loop': 'KA',
  'southern-xinjiang': 'SX',
  'duku-highway': 'DK',
};

function generateCode(routeId: string): string {
  const prefix = ROUTE_PREFIXES[routeId] || 'XX';
  const random = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉容易混淆的 0/O/1/I
    let s = '';
    for (let i = 0; i < 4; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
  };
  return `${prefix}-${random()}-${random()}`;
}

interface GenerateRequest {
  adminKey: string;
  routeId: string;
  count?: number;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey) {
      return Response.json(
        { success: false, error: '管理员密钥未配置（请在 Vercel 设置 ADMIN_KEY 环境变量）' },
        { status: 500 }
      );
    }

    const { adminKey: providedKey, routeId, count = 1 } = (await request.json()) as GenerateRequest;

    if (providedKey !== adminKey) {
      return Response.json(
        { success: false, error: '管理员密钥错误' },
        { status: 403 }
      );
    }

    if (!routeId || !ROUTE_PREFIXES[routeId]) {
      return Response.json(
        { success: false, error: `无效的路线 ID。可选: ${Object.keys(ROUTE_PREFIXES).join(', ')}` },
        { status: 400 }
      );
    }

    const actualCount = Math.min(Math.max(1, count), 100); // 限制 1-100
    const redis = getRedis();
    const codes: string[] = [];

    for (let i = 0; i < actualCount; i++) {
      const code = generateCode(routeId);
      const codeKey = `code:${code}`;

      // 存入 Redis：解锁码 → 路线映射
      await redis.set(codeKey, {
        routeId,
        used: false,
        created: new Date().toISOString(),
      });

      // 记录到管理列表
      await redis.lpush('admin:codes', code);

      codes.push(code);
    }

    return Response.json({
      success: true,
      routeId,
      codes,
      count: codes.length,
    });
  } catch (error: any) {
    console.error('Generate code error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
