// schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { z } from "zod";

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  dateOfManufacture: text("date_of_manufacture"), // ✅ maps to frontend "dateOfManufacture"
  incomingPartNumber: text("incoming_part_number"),
  incomingSerialNumber: text("incoming_serial_number"),
  outgoingPartNumber: text("outgoing_part_number"),
  outgoingSerialNumber: text("outgoing_serial_number"),

  modificationStatus: text("modification_status"),
  reasonForShopVisit: text("reason_for_shop_visit"),
  shopExitReason: text("shop_exit_reason"),

  findings: text("findings"),
  actionsTaken: text("actions_taken"),

  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// ✅ Zod schema that matches the frontend field names
export const insertWorkshopReportSchema = z.object({
  dateOfManufacture: z.string().optional(),

  incomingPartNumber: z.string().optional(),
  incomingSerialNumber: z.string().optional(),
  outgoingPartNumber: z.string().optional(),
  outgoingSerialNumber: z.string().optional(),

  modificationStatus: z.enum([
    "no-modification",
    "minor-modification",
    "major-modification",
    "replacement",
  ]).optional(),

  reasonForShopVisit: z.enum([
    "scheduled-maintenance",
    "unscheduled-repair",
    "inspection",
    "overhaul",
    "modification",
    "testing",
  ]).optional(),

  shopExitReason: z.enum([
    "repair-completed",
    "maintenance-completed",
    "inspection-completed",
    "no-defect-found",
    "beyond-repair",
    "awaiting-parts",
  ]).optional(),

  findings: z.string().optional(),
  actionsTaken: z.string().optional(),
});

export const updateWorkshopReportSchema = insertWorkshopReportSchema.partial();

// ✅ export for useForm
export type InsertWorkshopReport = z.infer<typeof insertWorkshopReportSchema>;
