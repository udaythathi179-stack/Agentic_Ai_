import { pgTable, text, timestamp, numeric, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'produce' | 'dairy' | 'bakery' | 'meat' | 'deli'
  standardShelfLifeHours: integer("standard_shelf_life_hours").notNull(),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull().default("each"),
  optimalTempMin: numeric("optimal_temp_min", { precision: 4, scale: 1 }).notNull().default("2.0"),
  optimalTempMax: numeric("optimal_temp_max", { precision: 4, scale: 1 }).notNull().default("6.0"),
  optimalHumidityMin: integer("optimal_humidity_min").notNull().default(85),
  optimalHumidityMax: integer("optimal_humidity_max").notNull().default(95),
  ethyleneSensitivity: text("ethylene_sensitivity").notNull().default("low"), // 'high' | 'medium' | 'low' | 'emitter'
  imageUrl: text("image_url").notNull().default(""),
  carbonFootprintPerKg: numeric("carbon_footprint_per_kg", { precision: 6, scale: 2 }).notNull().default("1.80"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inventoryBatches = pgTable("inventory_batches", {
  id: uuid("id").defaultRandom().primaryKey(),
  batchNumber: text("batch_number").notNull().unique(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  initialQuantity: integer("initial_quantity").notNull(),
  currentQuantity: integer("current_quantity").notNull(),
  harvestDate: timestamp("harvest_date").notNull(),
  receivedDate: timestamp("received_date").notNull(),
  baseExpiryDate: timestamp("base_expiry_date").notNull(),
  predictedExpiryDate: timestamp("predicted_expiry_date").notNull(),
  storageZone: text("storage_zone").notNull(),
  ambientTemp: numeric("ambient_temp", { precision: 4, scale: 1 }).notNull().default("4.0"),
  ambientHumidity: integer("ambient_humidity").notNull().default(88),
  ethyleneDetectedPpm: numeric("ethylene_detected_ppm", { precision: 6, scale: 2 }).notNull().default("0.02"),
  freshnessScore: integer("freshness_score").notNull().default(100), // 0 to 100
  decayRiskLevel: text("decay_risk_level").notNull().default("nominal"), // 'pristine' | 'nominal' | 'moderate_decay' | 'critical_decay' | 'expired'
  currentPrice: numeric("current_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"), // 'active' | 'marked_down' | 'bundled' | 'donated' | 'disposed'
  lastAgentEvaluation: timestamp("last_agent_evaluation").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const priceMarkdowns = pgTable("price_markdowns", {
  id: uuid("id").defaultRandom().primaryKey(),
  batchId: uuid("batch_id").references(() => inventoryBatches.id, { onDelete: "cascade" }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }).notNull(),
  newPrice: numeric("new_price", { precision: 10, scale: 2 }).notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  triggerReason: text("trigger_reason").notNull(),
  agentName: text("agent_name").notNull().default("PricePulse-Agent"),
  status: text("status").notNull().default("applied"), // 'applied' | 'reverted' | 'expired'
  estimatedSalesVelocityLift: numeric("estimated_sales_velocity_lift", { precision: 5, scale: 2 }).notNull().default("1.50"),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
});

export const zeroWasteBundles = pgTable("zero_waste_bundles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  recipeName: text("recipe_name").notNull(),
  recipeDifficulty: text("recipe_difficulty").notNull().default("Easy"), // 'Easy' | 'Medium' | 'Quick'
  prepTimeMinutes: integer("prep_time_minutes").notNull().default(20),
  culinaryInstructions: text("culinary_instructions").notNull(),
  bundlePrice: numeric("bundle_price", { precision: 10, scale: 2 }).notNull(),
  originalTotalPrice: numeric("original_total_price", { precision: 10, scale: 2 }).notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  itemsIncluded: text("items_included").notNull(), // JSON string: [{ name, qty, unit, reason }]
  batchIds: text("batch_ids").notNull(), // JSON string: [uuid1, uuid2]
  chefAgentReasoning: text("chef_agent_reasoning").notNull(),
  status: text("status").notNull().default("active"), // 'active' | 'sold_out' | 'expired'
  mealsSaved: integer("meals_saved").notNull().default(2),
  co2SavedKg: numeric("co2_saved_kg", { precision: 6, scale: 2 }).notNull().default("3.50"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const donationManifests = pgTable("donation_manifests", {
  id: uuid("id").defaultRandom().primaryKey(),
  manifestNumber: text("manifest_number").notNull().unique(),
  charityPartner: text("charity_partner").notNull(),
  charityPartnerType: text("charity_partner_type").notNull().default("Food Bank"), // 'Food Bank' | 'Soup Kitchen' | 'Shelter'
  pickupScheduledAt: timestamp("pickup_scheduled_at").notNull(),
  totalItemsCount: integer("total_items_count").notNull(),
  totalWeightKg: numeric("total_weight_kg", { precision: 8, scale: 2 }).notNull(),
  totalRetailValue: numeric("total_retail_value", { precision: 10, scale: 2 }).notNull(),
  estimatedMealsCount: integer("estimated_meals_count").notNull(),
  co2AvoidedKg: numeric("co2_avoided_kg", { precision: 8, scale: 2 }).notNull(),
  taxDeductionValue: numeric("tax_deduction_value", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending_pickup"), // 'pending_pickup' | 'dispatched' | 'confirmed_receipt'
  agentReasoning: text("agent_reasoning").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentLogs = pgTable("agent_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: text("agent_id").notNull(), // 'sentinel-decay' | 'price-pulse' | 'chef-rescue' | 'supply-sage' | 'charity-loop'
  agentName: text("agent_name").notNull(),
  actionType: text("action_type").notNull(), // 'decay_alert' | 'price_slash' | 'recipe_bundle_created' | 'reorder_throttled' | 'donation_dispatched'
  severity: text("severity").notNull().default("info"), // 'info' | 'warning' | 'critical' | 'success'
  batchId: text("batch_id"),
  message: text("message").notNull(),
  reasoning: text("reasoning").notNull(),
  metricsDelta: text("metrics_delta"), // JSON string
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const demandForecasts = pgTable("demand_forecasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  forecastDate: timestamp("forecast_date").notNull(),
  weatherCondition: text("weather_condition").notNull(),
  temperatureForecast: numeric("temperature_forecast", { precision: 4, scale: 1 }).notNull(),
  footTrafficIndex: integer("foot_traffic_index").notNull(),
  forecastedUnits: integer("forecasted_units").notNull(),
  regularOrderUnits: integer("regular_order_units").notNull(),
  agentAdjustedOrderUnits: integer("agent_adjusted_order_units").notNull(),
  wastePreventionConfidence: numeric("waste_prevention_confidence", { precision: 5, scale: 2 }).notNull().default("94.5"),
  recommendationNotes: text("recommendation_notes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  batches: many(inventoryBatches),
  demandForecasts: many(demandForecasts),
}));

export const inventoryBatchesRelations = relations(inventoryBatches, ({ one, many }) => ({
  product: one(products, {
    fields: [inventoryBatches.productId],
    references: [products.id],
  }),
  markdowns: many(priceMarkdowns),
}));

export const priceMarkdownsRelations = relations(priceMarkdowns, ({ one }) => ({
  batch: one(inventoryBatches, {
    fields: [priceMarkdowns.batchId],
    references: [inventoryBatches.id],
  }),
}));

export const demandForecastsRelations = relations(demandForecasts, ({ one }) => ({
  product: one(products, {
    fields: [demandForecasts.productId],
    references: [products.id],
  }),
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type InventoryBatch = typeof inventoryBatches.$inferSelect;
export type NewInventoryBatch = typeof inventoryBatches.$inferInsert;
export type PriceMarkdown = typeof priceMarkdowns.$inferSelect;
export type NewPriceMarkdown = typeof priceMarkdowns.$inferInsert;
export type ZeroWasteBundle = typeof zeroWasteBundles.$inferSelect;
export type NewZeroWasteBundle = typeof zeroWasteBundles.$inferInsert;
export type DonationManifest = typeof donationManifests.$inferSelect;
export type AgentLog = typeof agentLogs.$inferSelect;
export type DemandForecast = typeof demandForecasts.$inferSelect;
