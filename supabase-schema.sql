-- Zero-Waste Grocery AI - Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor if setting up from scratch

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('produce', 'dairy', 'bakery', 'meat', 'deli')),
  standard_shelf_life_hours INTEGER NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'each',
  optimal_temp_min NUMERIC(4, 1) NOT NULL DEFAULT 2.0,
  optimal_temp_max NUMERIC(4, 1) NOT NULL DEFAULT 6.0,
  optimal_humidity_min INTEGER NOT NULL DEFAULT 85,
  optimal_humidity_max INTEGER NOT NULL DEFAULT 95,
  ethylene_sensitivity TEXT NOT NULL DEFAULT 'low',
  image_url TEXT NOT NULL DEFAULT '',
  carbon_footprint_per_kg NUMERIC(6, 2) NOT NULL DEFAULT 1.80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Inventory Batches Table (with live shelf-life and decay telemetry)
CREATE TABLE IF NOT EXISTS inventory_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number TEXT UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  initial_quantity INTEGER NOT NULL,
  current_quantity INTEGER NOT NULL,
  harvest_date TIMESTAMP WITH TIME ZONE NOT NULL,
  received_date TIMESTAMP WITH TIME ZONE NOT NULL,
  base_expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  predicted_expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  storage_zone TEXT NOT NULL,
  ambient_temp NUMERIC(4, 1) NOT NULL DEFAULT 4.0,
  ambient_humidity INTEGER NOT NULL DEFAULT 88,
  ethylene_detected_ppm NUMERIC(6, 2) NOT NULL DEFAULT 0.02,
  freshness_score INTEGER NOT NULL DEFAULT 100,
  decay_risk_level TEXT NOT NULL DEFAULT 'nominal',
  current_price NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  last_agent_evaluation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Dynamic Price Markdowns Table
CREATE TABLE IF NOT EXISTS price_markdowns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES inventory_batches(id) ON DELETE CASCADE,
  original_price NUMERIC(10, 2) NOT NULL,
  new_price NUMERIC(10, 2) NOT NULL,
  discount_percentage INTEGER NOT NULL,
  trigger_reason TEXT NOT NULL,
  agent_name TEXT NOT NULL DEFAULT 'PricePulse-Agent',
  status TEXT NOT NULL DEFAULT 'applied',
  estimated_sales_velocity_lift NUMERIC(5, 2) NOT NULL DEFAULT 1.50,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Zero-Waste Recipe Bundles Table
CREATE TABLE IF NOT EXISTS zero_waste_bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  recipe_name TEXT NOT NULL,
  recipe_difficulty TEXT NOT NULL DEFAULT 'Easy',
  prep_time_minutes INTEGER NOT NULL DEFAULT 20,
  culinary_instructions TEXT NOT NULL,
  bundle_price NUMERIC(10, 2) NOT NULL,
  original_total_price NUMERIC(10, 2) NOT NULL,
  discount_percentage INTEGER NOT NULL,
  items_included TEXT NOT NULL,
  batch_ids TEXT NOT NULL,
  chef_agent_reasoning TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  meals_saved INTEGER NOT NULL DEFAULT 2,
  co2_saved_kg NUMERIC(6, 2) NOT NULL DEFAULT 3.50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Food Bank & Circular Rescue Manifests Table
CREATE TABLE IF NOT EXISTS donation_manifests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manifest_number TEXT UNIQUE NOT NULL,
  charity_partner TEXT NOT NULL,
  charity_partner_type TEXT NOT NULL DEFAULT 'Food Bank',
  pickup_scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  total_items_count INTEGER NOT NULL,
  total_weight_kg NUMERIC(8, 2) NOT NULL,
  total_retail_value NUMERIC(10, 2) NOT NULL,
  estimated_meals_count INTEGER NOT NULL,
  co2_avoided_kg NUMERIC(8, 2) NOT NULL,
  tax_deduction_value NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_pickup',
  agent_reasoning TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Autonomous Agent Activity & Audit Logs Table
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  batch_id TEXT,
  message TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  metrics_delta TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Demand Forecasts & Smart Restocking Table
CREATE TABLE IF NOT EXISTS demand_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  forecast_date TIMESTAMP WITH TIME ZONE NOT NULL,
  weather_condition TEXT NOT NULL,
  temperature_forecast NUMERIC(4, 1) NOT NULL,
  foot_traffic_index INTEGER NOT NULL,
  forecasted_units INTEGER NOT NULL,
  regular_order_units INTEGER NOT NULL,
  agent_adjusted_order_units INTEGER NOT NULL,
  waste_prevention_confidence NUMERIC(5, 2) NOT NULL DEFAULT 94.5,
  recommendation_notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_markdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE zero_waste_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_manifests ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_forecasts ENABLE ROW LEVEL SECURITY;

-- Allow read access for public demo
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read inventory" ON inventory_batches FOR SELECT USING (true);
CREATE POLICY "Public read markdowns" ON price_markdowns FOR SELECT USING (true);
CREATE POLICY "Public read bundles" ON zero_waste_bundles FOR SELECT USING (true);
CREATE POLICY "Public read donations" ON donation_manifests FOR SELECT USING (true);
CREATE POLICY "Public read logs" ON agent_logs FOR SELECT USING (true);
CREATE POLICY "Public read forecasts" ON demand_forecasts FOR SELECT USING (true);
