// shared/schema.ts
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workshopReports = pgTable("workshop_reports", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  reportNumber: text("report_number").notNull().unique(),

  dateOfManufacture: text("date_of_manufacture").notNull(),
  incomingPartNumber: text("incoming_part_number").notNull(),
  incomingSerialNumber: text("incoming_serial_number").notNull(),
  outgoingPartNumber: text("outgoing_part_number").notNull(),
  outgoingSerialNumber: text("outgoing_serial_number").notNull(),

  modificationStatus: text("modification_status").notNull(),
  reasonForShopVisit: text("reason_for_shop_visit").notNull(),
  shopExitReason: text("shop_exit_reason").notNull(),
  otherDetails: text("other_details"), // ✅ new free text field

  findings: text("findings").notNull(),
  actionsTaken: text("actions_taken").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkshopReportSchema = createInsertSchema(workshopReports).omit({
  id: true,
  reportNumber: true,
  createdAt: true,
});

export type InsertWorkshopReport = z.infer<typeof insertWorkshopReportSchema>;
export type WorkshopReport = typeof workshopReports.$inferSelect;
