import { json } from "@remix-run/node";
import prisma from "../db.server";

export async function loader() {
  const deleted = await prisma.session.deleteMany({});
  return json({ deleted: deleted.count, message: "All sessions cleared. Reinstall the app." });
}
