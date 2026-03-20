export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    maxBars: 1,
    maxMonthlyViews: 2000,
    features: {
      scheduling: false,
      advancedTargeting: false,
      rotatingMessages: false,
      prioritySupport: false,
    },
  },
  starter: {
    name: "Starter",
    price: 4.99,
    maxBars: 3,
    maxMonthlyViews: 10000,
    features: {
      scheduling: false,
      advancedTargeting: false,
      rotatingMessages: true,
      prioritySupport: false,
    },
  },
  pro: {
    name: "Pro",
    price: 9.99,
    maxBars: Infinity,
    maxMonthlyViews: Infinity,
    features: {
      scheduling: true,
      advancedTargeting: true,
      rotatingMessages: true,
      prioritySupport: true,
    },
  },
};

export function getPlanConfig(planId) {
  return PLANS[planId] || PLANS.free;
}

export function getPlanLimits(planId) {
  const plan = getPlanConfig(planId);
  return {
    maxBars: plan.maxBars,
    maxMonthlyViews: plan.maxMonthlyViews,
  };
}
