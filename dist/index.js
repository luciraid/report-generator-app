var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertWorkshopReportSchema: () => insertWorkshopReportSchema,
  workshopReports: () => workshopReports
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var workshopReports = pgTable("workshop_reports", {
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
  // Meta Information
  createdAt: timestamp("created_at").defaultNow()
});
var insertWorkshopReportSchema = createInsertSchema(workshopReports).omit({
  id: true,
  reportNumber: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and, or, like, gte, lte, count, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  async generateReportNumber() {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const [result] = await db.select({ count: count() }).from(workshopReports).where(sql2`extract(year from created_at) = ${year}`);
    const nextCounter = (result?.count || 0) + 1;
    const paddedCounter = nextCounter.toString().padStart(3, "0");
    return `RPT-${year}-${paddedCounter}`;
  }
  async getWorkshopReport(id) {
    const [report] = await db.select().from(workshopReports).where(eq(workshopReports.id, id));
    return report || void 0;
  }
  async getAllWorkshopReports() {
    return await db.select().from(workshopReports).orderBy(desc(workshopReports.createdAt));
  }
  async createWorkshopReport(insertReport) {
    const reportNumber = await this.generateReportNumber();
    const [report] = await db.insert(workshopReports).values({
      ...insertReport,
      reportNumber
    }).returning();
    return report;
  }
  async updateWorkshopReport(id, updateData) {
    const [report] = await db.update(workshopReports).set(updateData).where(eq(workshopReports.id, id)).returning();
    return report || void 0;
  }
  async deleteWorkshopReport(id) {
    const result = await db.delete(workshopReports).where(eq(workshopReports.id, id));
    return result.rowCount > 0;
  }
  async searchWorkshopReports(filters) {
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
    const whereClause = conditions.length > 0 ? and(...conditions) : void 0;
    return await db.select().from(workshopReports).where(whereClause).orderBy(desc(workshopReports.createdAt));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllWorkshopReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });
  app2.get("/api/reports/:id", async (req, res) => {
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
  app2.post("/api/reports", async (req, res) => {
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
  app2.put("/api/reports/:id", async (req, res) => {
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
  app2.delete("/api/reports/:id", async (req, res) => {
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
  app2.get("/api/reports/search", async (req, res) => {
    try {
      const filters = {
        search: req.query.search,
        reasonForShopVisit: req.query.reasonForShopVisit,
        shopExitReason: req.query.shopExitReason,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo
      };
      const reports = await storage.searchWorkshopReports(filters);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to search reports" });
    }
  });
  app2.get("/api/stats", async (req, res) => {
    try {
      const allReports = await storage.getAllWorkshopReports();
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const thisMonthReports = allReports.filter((report) => {
        const reportDate = new Date(report.createdAt);
        return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
      });
      const componentsServiced = allReports.length;
      const stats = {
        totalReports: allReports.length,
        thisMonth: thisMonthReports.length,
        componentsServiced
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
