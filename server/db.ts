import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";

// Create or open the sqlite.db file
const sqlite = new Database("sqlite.db");

// Initialize drizzle ORM with SQLite
export const db = drizzle(sqlite, { schema });
