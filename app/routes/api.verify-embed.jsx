import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  // Mark embed as activated — verification is handled by the merchant
  // confirming they enabled the app embed in the theme editor
  await prisma.setupProgress.update({
    where: { shop },
    data: { embedActivated: true },
  });

  return json({
    verified: true,
    message: "App embed marked as active!",
  });
}
