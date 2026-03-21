import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function loader() {
  const sessions = await prisma.session.deleteMany({});
  const plans = await prisma.shopPlan.deleteMany({});
  const setup = await prisma.setupProgress.deleteMany({});
  return json({
    cleared: { sessions: sessions.count, plans: plans.count, setup: setup.count },
    message: "All sessions, plans, and setup cleared. Reinstall the app.",
  });
}
