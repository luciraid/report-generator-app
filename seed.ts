// seed.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema"; // adjust if schema is in another path

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite, { schema });

async function main() {
  // Clear existing rows
  await db.delete(schema.reports);

  // Insert some sample workshop reports
  await db.insert(schema.reports).values([
    {
      title: "Hydraulic Pump Inspection",
      content: "Technician noted wear in seal, replaced seal kit.",
    },
    {
      title: "Avionics Box Repair",
      content: "Replaced burnt capacitor, cleaned PCB, unit tested OK.",
    },
    {
      title: "Landing Gear Overhaul",
      content: "Bushings replaced, lubricated, corrosion removed.",
    },
  ]);

  console.log("✅ Seed data inserted!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
