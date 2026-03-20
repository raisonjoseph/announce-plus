import prisma from "./db.server";
import { getPlanConfig, getPlanLimits } from "./plans";

export async function getShopPlan(shop) {
  let shopPlan = await prisma.shopPlan.findUnique({ where: { shop } });

  if (!shopPlan) {
    shopPlan = await prisma.shopPlan.create({
      data: { shop, plan: "free" },
    });
  }

  const config = getPlanConfig(shopPlan.plan);
  const limits = getPlanLimits(shopPlan.plan);

  return {
    id: shopPlan.plan,
    ...config,
    ...limits,
  };
}

export async function canCreateBar(shop) {
  const plan = await getShopPlan(shop);
  if (plan.maxBars === Infinity) return { allowed: true, plan };

  const count = await prisma.announcement.count({ where: { shop } });
  return {
    allowed: count < plan.maxBars,
    current: count,
    limit: plan.maxBars,
    plan,
  };
}

export async function getMonthlyViewCount(shop) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return prisma.barView.count({
    where: { shop, viewedAt: { gte: startOfMonth } },
  });
}
