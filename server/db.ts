import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

// Ensure database URL is available
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize Drizzle with our schema
export const db = drizzle(pool, { schema });