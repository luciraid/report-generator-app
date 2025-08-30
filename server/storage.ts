import { workshopReports, type WorkshopReport, type InsertWorkshopReport } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, gte, lte, count, sql } from "drizzle-orm";

export interface IStorage {
  getWorkshopReport(id: string): Promise<WorkshopReport | undefined>;
  getAllWorkshopReports(): Promise<WorkshopReport[]>;
  createWorkshopReport(report: InsertWorkshopReport): Promise<WorkshopReport>;
  updateWorkshopReport(id: string, report: Partial<InsertWorkshopReport>): Promise<WorkshopReport | undefined>;
  deleteWorkshopReport(id: string): Promise<boolean>;
  searchWorkshopReports(filters: {
    search?: string;
    reasonForShopVisit?: string;
    shopExitReason?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<WorkshopReport[]>;
}

export class DatabaseStorage implements IStorage {
  private async generateReportNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const [result] = await db
      .select({ count: count() })
      .from(workshopReports)
      .where(sql`extract(year from created_at) = ${year}`);
    
    const nextCounter = (result?.count || 0) + 1;
    const paddedCounter = nextCounter.toString().padStart(3, '0');
    return `RPT-${year}-${paddedCounter}`;
  }

  async getWorkshopReport(id: string): Promise<WorkshopReport | undefined> {
    const [report] = await db.select().from(workshopReports).where(eq(workshopReports.id, id));
    return report || undefined;
  }

  async getAllWorkshopReports(): Promise<WorkshopReport[]> {
    return await db.select().from(workshopReports).orderBy(desc(workshopReports.createdAt));
  }

  async createWorkshopReport(insertReport: InsertWorkshopReport): Promise<WorkshopReport> {
    const reportNumber = await this.generateReportNumber();
    const [report] = await db
      .insert(workshopReports)
      .values({
        ...insertReport,
        reportNumber,
      })
      .returning();
    return report;
  }

  async updateWorkshopReport(id: string, updateData: Partial<InsertWorkshopReport>): Promise<WorkshopReport | undefined> {
    const [report] = await db
      .update(workshopReports)
      .set(updateData)
      .where(eq(workshopReports.id, id))
      .returning();
    return report || undefined;
  }

  async deleteWorkshopReport(id: string): Promise<boolean> {
    const result = await db.delete(workshopReports).where(eq(workshopReports.id, id));
    return result.rowCount > 0;
  }

  async searchWorkshopReports(filters: {
    search?: string;
    reasonForShopVisit?: string;
    shopExitReason?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<WorkshopReport[]> {
    const conditions = [];

    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      conditions.push(
        or(
          like(workshopReports.incomingPartNumber, searchPattern),
          like(workshopReports.incomingSerialNumber, searchPattern),
          like(workshopReports.outgoingPartNumber, searchPattern),
          like(workshopReports.outgoingSerialNumber, searchPattern),
          like(workshopReports.reportNumber, searchPattern),
          like(workshopReports.findings, searchPattern),
          like(workshopReports.actionsTaken, searchPattern)
        )
      );
    }

    if (filters.reasonForShopVisit) {
      conditions.push(eq(workshopReports.reasonForShopVisit, filters.reasonForShopVisit));
    }

    if (filters.shopExitReason) {
      conditions.push(eq(workshopReports.shopExitReason, filters.shopExitReason));
    }

    if (filters.dateFrom) {
      conditions.push(gte(workshopReports.dateOfManufacture, filters.dateFrom));
    }

    if (filters.dateTo) {
      conditions.push(lte(workshopReports.dateOfManufacture, filters.dateTo));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return await db
      .select()
      .from(workshopReports)
      .where(whereClause)
      .orderBy(desc(workshopReports.createdAt));
  }
}

export const storage = new DatabaseStorage();
