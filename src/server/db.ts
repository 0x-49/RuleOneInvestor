import 'dotenv/config';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from "@shared/schema";

// Only import ws in Node.js environment (not in browser)
if (typeof window === 'undefined') {
  // Use dynamic import to prevent bundling issues
  import('ws').then(ws => {
    neonConfig.webSocketConstructor = ws.default;
  }).catch(err => {
    console.error('Failed to import WebSocket:', err);
  });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });