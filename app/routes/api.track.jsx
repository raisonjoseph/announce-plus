import { json } from "@remix-run/node";
import prisma from "../db.server";
import { getShopPlan, getMonthlyViewCount } from "../plan.server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function action({ request }) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed" },
      { status: 405, headers: CORS_HEADERS },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json(
      { error: "Invalid JSON" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const { shop, barId } = body;

  if (!shop || !barId) {
    return json(
      { error: "Missing fields" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  try {
    const plan = await getShopPlan(shop);
    const monthlyViews = await getMonthlyViewCount(shop);

    if (plan.maxMonthlyViews !== Infinity && monthlyViews >= plan.maxMonthlyViews) {
      return json(
        {
          ok: false,
          reason: "limit_reached",
          limit: plan.maxMonthlyViews,
          current: monthlyViews,
        },
        { headers: CORS_HEADERS },
      );
    }

    await prisma.barView.create({
      data: { shop, announcementId: barId },
    });

    try {
      await prisma.announcement.update({
        where: { id: barId },
        data: { viewCount: { increment: 1 } },
      });
    } catch (e) {
      // barId may not exist in DB — that's fine
    }

    return json(
      {
        ok: true,
        current: monthlyViews + 1,
        limit: plan.maxMonthlyViews,
      },
      { headers: CORS_HEADERS },
    );
  } catch (err) {
    return json(
      { error: "Server error" },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}

export async function loader({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }
  return json({ error: "Not found" }, { status: 404 });
}
