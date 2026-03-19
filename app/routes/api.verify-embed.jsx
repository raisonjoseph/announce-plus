import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    await prisma.setupProgress.update({
      where: { shop },
      data: { embedActivated: true },
    });
    return json({
      verified: true,
      dev: true,
      message:
        "Marked as done (development mode). In production this will verify automatically via Shopify.",
    });
  }

  try {
    const response = await admin.graphql(
      `#graphql
        query GetActiveEmbeds {
          currentAppInstallation {
            activeEmbeds {
              handle
              title
              type
            }
          }
        }`,
    );

    const data = await response.json();
    const embeds =
      data?.data?.currentAppInstallation?.activeEmbeds ?? [];

    const isActive = embeds.some(
      (e) => e.handle === "announceplus-bar",
    );

    if (isActive) {
      await prisma.setupProgress.update({
        where: { shop },
        data: { embedActivated: true },
      });
      return json({
        verified: true,
        message: "App embed is active!",
      });
    }

    return json(
      {
        verified: false,
        message:
          "App embed is not active yet. Please open the theme editor, enable the AnnouncePlus embed, and click Save before trying again.",
      },
      { status: 400 },
    );
  } catch (err) {
    return json(
      {
        verified: false,
        message: "Could not verify embed status. Please try again.",
      },
      { status: 500 },
    );
  }
}
