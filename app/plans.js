export const PLANS = {
  free: {
    name: "Free",
    billingName: null,
    price: 0,
    maxBars: 1,
    maxMonthlyViews: 2000,
    features: {
      pageTargeting: true,
      visitorTargeting: true,
      cartStateTargeting: true,
      deviceTargeting: false,
      delayTrigger: false,
      urlTargeting: false,
      cartValueTargeting: false,
      scrollTrigger: false,
      scheduling: false,
      countdownTimer: false,
      customerTagTargeting: false,
      geoTargeting: false,
      exitIntent: false,
      utmTargeting: false,
      rotatingMessages: false,
      prioritySupport: false,
    },
  },
  starter: {
    name: "Starter",
    billingName: "Starter",
    price: 4.99,
    maxBars: 3,
    maxMonthlyViews: 10000,
    features: {
      pageTargeting: true,
      visitorTargeting: true,
      cartStateTargeting: true,
      deviceTargeting: true,
      delayTrigger: true,
      urlTargeting: true,
      cartValueTargeting: true,
      scrollTrigger: true,
      scheduling: false,
      countdownTimer: false,
      customerTagTargeting: false,
      geoTargeting: false,
      exitIntent: false,
      utmTargeting: false,
      rotatingMessages: true,
      prioritySupport: false,
    },
  },
  pro: {
    name: "Pro",
    billingName: "Pro",
    price: 9.99,
    maxBars: Infinity,
    maxMonthlyViews: Infinity,
    features: {
      pageTargeting: true,
      visitorTargeting: true,
      cartStateTargeting: true,
      deviceTargeting: true,
      delayTrigger: true,
      urlTargeting: true,
      cartValueTargeting: true,
      scrollTrigger: true,
      scheduling: true,
      countdownTimer: true,
      customerTagTargeting: true,
      geoTargeting: true,
      exitIntent: true,
      utmTargeting: true,
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

export function hasFeature(planId, featureName) {
  const plan = getPlanConfig(planId);
  return plan.features[featureName] ?? false;
}

export function getPlanIdFromBillingName(billingName) {
  for (const [id, plan] of Object.entries(PLANS)) {
    if (plan.billingName === billingName) return id;
  }
  return "free";
}
