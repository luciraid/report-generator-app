import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  dateOfManufacture: text("date_of_manufacture").notNull(),
  incomingPartNumber: text("incoming_part_number").notNull(),
  incomingSerialNumber: text("incoming_serial_number").notNull(),
  outgoingPartNumber: text("outgoing_part_number").notNull(),
  outgoingSerialNumber: text("outgoing_serial_number").notNull(),
  modificationStatus: text("modification_status").notNull(),
  reasonForShopVisit: text("reason_for_shop_visit").notNull(),
  shopExitReason: text("shop_exit_reason").notNull(),
  findings: text("findings").notNull(),
  actionsTaken: text("actions_taken").notNull(),
});

export const insertWorkshopReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkshopReport = z.infer<typeof insertWorkshopReportSchema>;
export type WorkshopReport = typeof reports.$inferSelect;
