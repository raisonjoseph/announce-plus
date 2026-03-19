import { PrismaClient } from "@prisma/client";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

let prisma;

if (process.env.NODE_ENV === "production" && process.env.TURSO_DATABASE_URL) {
  const { PrismaLibSQL } = require("@prisma/adapter-libsql");
  const { createClient } = require("@libsql/client");

  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const adapter = new PrismaLibSQL(libsql);
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  prisma = global.__db;
}

export { prisma };
export default prisma;
