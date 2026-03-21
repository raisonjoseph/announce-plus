import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function loader() {
  const sessions = await prisma.session.deleteMany({});
  const plans = await prisma.shopPlan.deleteMany({});
  const setup = await prisma.setupProgress.deleteMany({});
  const views = await prisma.barView.deleteMany({});
  const announcements = await prisma.announcement.deleteMany({});
  return json({
    cleared: {
      sessions: sessions.count,
      plans: plans.count,
      setup: setup.count,
      views: views.count,
      announcements: announcements.count,
    },
    message: "All data cleared. Reinstall the app.",
  });
}
