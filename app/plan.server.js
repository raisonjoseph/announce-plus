import prisma from "./db.server";
import { getPlanConfig, getPlanLimits, getPlanIdFromBillingName } from "./plans";
import { STARTER_PLAN, STARTER_YEARLY_PLAN, PRO_PLAN, PRO_YEARLY_PLAN } from "./shopify.server";

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
    chargeId: shopPlan.chargeId,
    ...config,
    ...limits,
  };
}

export async function updateShopPlan(shop, planId, chargeId = null) {
  return prisma.shopPlan.upsert({
    where: { shop },
    update: { plan: planId, chargeId },
    create: { shop, plan: planId, chargeId },
  });
}

export async function syncPlanFromBilling(billing, shop) {
  try {
    const { hasActivePayment, appSubscriptions } = await billing.check({
      plans: [STARTER_PLAN, STARTER_YEARLY_PLAN, PRO_PLAN, PRO_YEARLY_PLAN],
      isTest: true,
    });

    if (!hasActivePayment || !appSubscriptions?.length) {
      await updateShopPlan(shop, "free", null);
      return getShopPlan(shop);
    }

    const active = appSubscriptions[0];
    const planId = getPlanIdFromBillingName(active.name);
    await updateShopPlan(shop, planId, active.id);
    return getShopPlan(shop);
  } catch (e) {
    console.error("Failed to sync billing:", e);
    return getShopPlan(shop);
  }
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
