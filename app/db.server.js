import { PrismaClient } from "@prisma/client";

if (!global.__db) {
  global.__db = new PrismaClient();
}

const prisma = global.__db;

export { prisma };
export { prisma as db };
export default prisma;
