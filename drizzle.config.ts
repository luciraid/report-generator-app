// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",    // ✅ Postgres only
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // ✅ Neon URL from Railway env
  },
} satisfies Config;
