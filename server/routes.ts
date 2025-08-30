import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";                 // your SQLite drizzle instance
import { reports, insertWorkshopReportSchema, updateWorkshopReportSchema } from "../schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import PDFDocument from "pdfkit";          // 👈 PDF generation

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all workshop reports
  app.get("/api/reports", async (req, res) => {
    try {
      const allReports = await db.select().from(reports);
      res.json(allReports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Get a specific workshop report
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const [report] = await db
        .select()
        .from(reports)
        .where(eq(reports.id, Number(req.params.id)));
      if (!report) return res.status(404).json({ message: "Report not found" });
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  // Create a new workshop report
  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertWorkshopReportSchema.parse(req.body);
      const result = await db.insert(reports).values(validatedData).returning();
      res.status(201).json(result[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Update a workshop report
  app.put("/api/reports/:id", async (req, res) => {
    try {
      const validatedData = updateWorkshopReportSchema.parse(req.body);
      const result = await db
        .update(reports)
        .set(validatedData)
        .where(eq(reports.id, Number(req.params.id)))
        .returning();
      if (!result[0]) return res.status(404).json({ message: "Report not found" });
      res.json(result[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  // Delete a workshop report
  app.delete("/api/reports/:id", async (req, res) => {
    try {
      const result = await db
        .delete(reports)
        .where(eq(reports.id, Number(req.params.id)))
        .returning();
      if (!result[0]) return res.status(404).json({ message: "Report not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete report" });
    }
  });

  // ✅ Export a report as PDF
  app.get("/api/reports/:id/pdf", async (req, res) => {
    try {
      const [report] = await db
        .select()
        .from(reports)
        .where(eq(reports.id, Number(req.params.id)));
      if (!report) return res.status(404).json({ message: "Report not found" });

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=report-${report.id}.pdf`);

      doc.pipe(res);

      doc.fontSize(18).text(`Workshop Report #${report.id}`, { underline: true });
      doc.moveDown();

      doc.fontSize(12).text(`Date of Manufacture: ${report.dateOfManufacture ?? "N/A"}`);
      doc.text(`Incoming Part: ${report.incomingPartNumber ?? "N/A"} / SN: ${report.incomingSerialNumber ?? "N/A"}`);
      doc.text(`Outgoing Part: ${report.outgoingPartNumber ?? "N/A"} / SN: ${report.outgoingSerialNumber ?? "N/A"}`);
      doc.text(`Modification Status: ${report.modificationStatus ?? "N/A"}`);
      doc.text(`Reason for Shop Visit: ${report.reasonForShopVisit ?? "N/A"}`);
      doc.text(`Exit Reason: ${report.shopExitReason ?? "N/A"}`);
      doc.moveDown();
      doc.text(`Findings: ${report.findings ?? "N/A"}`);
      doc.text(`Actions Taken: ${report.actionsTaken ?? "N/A"}`);
      doc.text(`Other Details: ${report.otherDetails ?? "N/A"}`);

      doc.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // ✅ Dashboard statistics (null-safe)
  app.get("/api/stats", async (req, res) => {
    try {
      const allReports = await db.select().from(reports);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const thisMonthReports = allReports.filter((r) => {
        if (!r.createdAt) return false; // skip nulls
        const d = new Date(r.createdAt);
        return !isNaN(d.getTime()) && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      res.json({
        totalReports: allReports.length,
        thisMonth: thisMonthReports.length,
        componentsServiced: allReports.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
