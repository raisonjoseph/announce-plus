import { authenticate } from "../shopify.server";
import { updateShopPlan } from "../plan.server";
import { getPlanIdFromBillingName } from "../plans";

export const action = async ({ request }) => {
  const { shop, payload } = await authenticate.webhook(request);

  const status = payload.app_subscription?.status;
  const name = payload.app_subscription?.name;

  if (
    status === "CANCELLED" ||
    status === "DECLINED" ||
    status === "EXPIRED" ||
    status === "FROZEN"
  ) {
    await updateShopPlan(shop, "free", null);
  } else if (status === "ACTIVE" && name) {
    const planId = getPlanIdFromBillingName(name);
    await updateShopPlan(shop, planId, payload.app_subscription?.admin_graphql_api_id);
  }

  return new Response(null, { status: 200 });
};
