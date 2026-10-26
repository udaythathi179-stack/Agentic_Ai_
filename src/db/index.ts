import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import {
  initialProducts,
  initialBatches,
  initialBundles,
  initialDonations,
  initialLogs,
  initialDemandForecasts,
  InitialBatch,
  InitialProduct,
} from "./initial-data";

// In-Memory store fallback so the user can interactively test the entire agentic system immediately
export class GrocerStateStore {
  products: InitialProduct[] = [...initialProducts];
  batches: InitialBatch[] = [...initialBatches];
  bundles = [...initialBundles];
  donations = [...initialDonations];
  logs = [...initialLogs];
  demandForecasts = [...initialDemandForecasts];

  getBatches() {
    return this.batches;
  }

  getProducts() {
    return this.products;
  }

  getBundles() {
    return this.bundles;
  }

  getDonations() {
    return this.donations;
  }

  getLogs() {
    return this.logs;
  }

  getDemandForecasts() {
    return this.demandForecasts;
  }

  updateBatch(id: string, updates: Partial<InitialBatch>) {
    const idx = this.batches.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.batches[idx] = { ...this.batches[idx], ...updates };
      return this.batches[idx];
    }
    return null;
  }

  addBatch(batch: InitialBatch) {
    this.batches.unshift(batch);
    return batch;
  }

  addBundle(bundle: (typeof initialBundles)[0]) {
    this.bundles.unshift(bundle);
    return bundle;
  }

  addDonation(donation: (typeof initialDonations)[0]) {
    this.donations.unshift(donation);
    return donation;
  }

  addLog(log: (typeof initialLogs)[0]) {
    this.logs.unshift(log);
    return log;
  }

  reset() {
    this.products = [...initialProducts];
    this.batches = JSON.parse(JSON.stringify(initialBatches));
    this.bundles = JSON.parse(JSON.stringify(initialBundles));
    this.donations = JSON.parse(JSON.stringify(initialDonations));
    this.logs = JSON.parse(JSON.stringify(initialLogs));
    this.demandForecasts = JSON.parse(JSON.stringify(initialDemandForecasts));
  }
}

// Global singleton for Next.js hot reload safety
const globalForGrocer = globalThis as unknown as {
  grocerState: GrocerStateStore | undefined;
  drizzleClient: ReturnType<typeof drizzle> | undefined;
};

export const memoryStore = globalForGrocer.grocerState ?? new GrocerStateStore();
if (process.env.NODE_ENV !== "production") globalForGrocer.grocerState = memoryStore;

// PostgreSQL / Supabase Drizzle ORM client
let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDrizzleDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!dbInstance) {
    try {
      const client = postgres(connectionString, { prepare: false });
      dbInstance = drizzle(client, { schema });
    } catch (err) {
      console.warn("Could not connect to PostgreSQL via DATABASE_URL:", err);
      return null;
    }
  }

  return dbInstance;
}

export const db = getDrizzleDb();
