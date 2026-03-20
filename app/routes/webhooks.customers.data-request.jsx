import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop } = await authenticate.webhook(request);

  // Shopify GDPR: Customer data request
  // Return the customer data you store (we only store shop-level data, no customer PII)
  console.log(`[webhook] ${topic} from ${shop}`);

  return new Response(null, { status: 200 });
};
