import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop } = await authenticate.webhook(request);

  // Shopify GDPR: Customer data erasure request
  // Delete any customer PII (we don't store customer-level data)
  console.log(`[webhook] ${topic} from ${shop}`);

  return new Response(null, { status: 200 });
};
