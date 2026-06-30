// ─── 路线注册表 ───
// 所有自驾路线在此注册，添加新路线只需：
// 1. 创建 src/data/routes/你的路线.ts
// 2. 在此 import 并加入 allRoutes 数组

import type { RouteData } from '@/types/route';
import { dukuHighway } from '@/data/dukuRoute';
import { kanasLoop } from '@/data/routes/kanas-loop';
import { southernXinjiang } from '@/data/routes/southern-xinjiang';

export const allRoutes: RouteData[] = [
  dukuHighway,
  kanasLoop,
  southernXinjiang,
];

export function getRoute(id: string): RouteData | undefined {
  return allRoutes.find(r => r.meta.id === id);
}

export { dukuHighway, kanasLoop, southernXinjiang };
