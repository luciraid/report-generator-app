import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkshopReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all workshop reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllWorkshopReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Get a specific workshop report
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getWorkshopReport(req.params.id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  // Create a new workshop report
  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertWorkshopReportSchema.parse(req.body);
      const report = await storage.createWorkshopReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Update a workshop report
  app.put("/api/reports/:id", async (req, res) => {
    try {
      const validatedData = insertWorkshopReportSchema.partial().parse(req.body);
      const report = await storage.updateWorkshopReport(req.params.id, validatedData);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
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
      const deleted = await storage.deleteWorkshopReport(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete report" });
    }
  });

  // Search workshop reports
  app.get("/api/reports/search", async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        reasonForShopVisit: req.query.reasonForShopVisit as string,
        shopExitReason: req.query.shopExitReason as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
      };
      
      const reports = await storage.searchWorkshopReports(filters);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to search reports" });
    }
  });

  // Get dashboard statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const allReports = await storage.getAllWorkshopReports();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthReports = allReports.filter(report => {
        const reportDate = new Date(report.createdAt!);
        return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
      });

      const componentsServiced = allReports.length;

      const stats = {
        totalReports: allReports.length,
        thisMonth: thisMonthReports.length,
        componentsServiced,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
