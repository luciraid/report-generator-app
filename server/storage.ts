import { reports, type InsertWorkshopReport, type WorkshopReport } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like } from "drizzle-orm";

export class DatabaseStorage {
  async getWorkshopReport(id: number): Promise<WorkshopReport | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async getAllWorkshopReports(): Promise<WorkshopReport[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  async createWorkshopReport(data: InsertWorkshopReport): Promise<WorkshopReport> {
    const [report] = await db.insert(reports).values(data).returning();
    return report;
  }

  async updateWorkshopReport(id: number, data: Partial<InsertWorkshopReport>): Promise<WorkshopReport | undefined> {
    const [report] = await db.update(reports).set(data).where(eq(reports.id, id)).returning();
    return report;
  }

  async deleteWorkshopReport(id: number): Promise<boolean> {
    const result = await db.delete(reports).where(eq(reports.id, id));
    return result.changes > 0;
  }

  async searchWorkshopReports(search?: string): Promise<WorkshopReport[]> {
    if (!search) return this.getAllWorkshopReports();
    const query = `%${search}%`;
    return await db
      .select()
      .from(reports)
      .where(
        or(
          like(reports.incomingPartNumber, query),
          like(reports.incomingSerialNumber, query),
          like(reports.outgoingPartNumber, query),
          like(reports.outgoingSerialNumber, query),
          like(reports.findings, query),
          like(reports.actionsTaken, query)
        )
      )
      .orderBy(desc(reports.createdAt));
  }
}

export const storage = new DatabaseStorage();
