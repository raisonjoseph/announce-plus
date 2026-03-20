import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop } = await authenticate.webhook(request);

  // Shopify GDPR: Shop data erasure request
  // Delete all data for this shop after they uninstall
  console.log(`[webhook] ${topic} from ${shop} — deleting all shop data`);

  await prisma.barView.deleteMany({ where: { shop } });
  await prisma.announcement.deleteMany({ where: { shop } });
  await prisma.setupProgress.deleteMany({ where: { shop } });
  await prisma.shopPlan.deleteMany({ where: { shop } });

  return new Response(null, { status: 200 });
};
