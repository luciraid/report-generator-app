import type { Config } from "drizzle-kit";

export default {
  schema: "./schema.ts",   // ✅ points to new schema file
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite.db",
  },
} satisfies Config;
