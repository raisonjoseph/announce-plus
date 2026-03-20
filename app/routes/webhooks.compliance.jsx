import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`[compliance webhook] ${topic} from ${shop}`);

  switch (topic) {
    case "CUSTOMERS_DATA_REQUEST":
      // We don't store customer PII — acknowledge the request
      break;

    case "CUSTOMERS_REDACT":
      // We don't store customer PII — acknowledge the erasure
      break;

    case "SHOP_REDACT":
      // Delete all data for this shop
      await prisma.barView.deleteMany({ where: { shop } });
      await prisma.announcement.deleteMany({ where: { shop } });
      await prisma.setupProgress.deleteMany({ where: { shop } });
      await prisma.shopPlan.deleteMany({ where: { shop } });
      break;
  }

  return new Response(null, { status: 200 });
};
