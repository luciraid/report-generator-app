import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workshopReports = pgTable("workshop_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportNumber: text("report_number").notNull().unique(),
  
  // Basic Information
  dateOfManufacture: text("date_of_manufacture").notNull(),
  
  // Incoming Part
  incomingPartNumber: text("incoming_part_number").notNull(),
  incomingSerialNumber: text("incoming_serial_number").notNull(),
  
  // Outgoing Part
  outgoingPartNumber: text("outgoing_part_number").notNull(),
  outgoingSerialNumber: text("outgoing_serial_number").notNull(),
  
  // Status and Visit Details
  modificationStatus: text("modification_status").notNull(),
  reasonForShopVisit: text("reason_for_shop_visit").notNull(),
  shopExitReason: text("shop_exit_reason").notNull(),
  
  // Findings and Actions
  findings: text("findings").notNull(),
  actionsTaken: text("actions_taken").notNull(),

  // 👇 NEW FIELD
  otherDetails: text("other_details"),   // optional free-text field
  
  // Meta Information
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkshopReportSchema = createInsertSchema(workshopReports).omit({
  id: true,
  reportNumber: true,
  createdAt: true,
});

export type InsertWorkshopReport = z.infer<typeof insertWorkshopReportSchema>;
export type WorkshopReport = typeof workshopReports.$inferSelect;
