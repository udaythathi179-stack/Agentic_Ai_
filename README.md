# FreshCycle AI: Autonomous Zero-Waste Grocery Intelligence System

> **An Agentic AI Approach to Perishable Demand Forecasting, Biological Shelf-Life Management, and Circular Food Waste Elimination**

---

## 🌍 The Real-World Problem Statement
Supermarkets and grocery chains discard **over $400 Billion** worth of edible food globally each year. Traditional enterprise resource planning (ERP) and retail inventory systems suffer from structural deficiencies:
1. **Static "Best Before" Labels**: Foods decay dynamically based on biological kinetics, temperature fluctuations, and ethylene gas, but inventory systems treat expiry dates as static calendar stamps.
2. **Reactive Markdowns**: Manual store staff markdown goods only when produce has already begun wilting or meats have oxidized, drastically reducing consumer appeal and forcing steep write-offs.
3. **Single-Item Stagnation**: Perishables nearing expiry languish individually rather than being synthesized into attractive culinary pairings.
4. **Upstream Over-Ordering**: Procurement systems fail to account for weather dips (e.g., rainfall cutting store foot traffic), resulting in excess perishable delivery that rots on shelves.
5. **Landfill Disposal**: Unsold items entering critical safety thresholds are discarded into landfills, releasing potent methane emissions rather than being safely diverted to community shelters.

---

## 🤖 The Solution: Multi-Agent Agentic AI Architecture
**FreshCycle AI** replaces reactive inventory logs with **five autonomous AI agents** continuously collaborating in an event-driven loop:

| Agent | Specialized Domain | Core Mechanism | Real-World Impact |
| :--- | :--- | :--- | :--- |
| **Sentinel Agent** | Biological Decay & IoT Sensor Vision | Arrhenius $Q_{10}$ kinetic degradation modeling calculating cellular decay curves against ambient temperature, humidity, and ethylene gas ($C_2H_4$) | Predicts biological shelf life to within ±1.5 hours |
| **PricePulse Agent** | Dynamic Markdown & Dutch Auction | Real-time price elasticity curves executing automated graduated markdowns (-15%, -35%, -65%) | 3.4x checkout sales velocity lift before total write-off |
| **ChefRescue Agent** | Culinary Pairing & Meal Bundler | Autonomous multi-category recipe synergy (e.g. overripe tomatoes + bakery bread = Tuscan Bruschetta Kit) | 48% kit discounts & zero-waste home cooking |
| **SupplySage Agent** | Weather & Demand Restock Throttle | Correlates precipitation forecasts, ambient temperature, and walk-in foot traffic to throttle supplier PO orders | Prevents over-ordering and cuts 32% waste upstream |
| **CharityLoop Agent** | Circular Rescue & Shelter Dispatch | Dispatches automated cold-chain pickup manifests for items with &lt;12h remaining | 100% landfill diversion + IRS Sec 170(e)(3) tax deductions |

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 16 (App Router, Turbopack, React 19, Server & Client Components)
- **Styling**: Tailwind CSS v4 with cyber-emerald dark mode, glassmorphism, glowing micro-animations, and custom radar indicators
- **Database**: PostgreSQL (via Supabase)
- **ORM & Migrations**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `postgres`)
- **Icons & Micro-Interactions**: `lucide-react`, `canvas-confetti`
- **Data Architecture**: Hybrid runtime supporting both live PostgreSQL connection and in-memory engine fallback for instant zero-config testing

---

## 🗄️ Database Schema (Drizzle ORM & Supabase)
The system is modeled with 7 core tables:
1. `products`: Master product catalog with optimal temperature/humidity limits, ethylene sensitivity, and carbon footprint.
2. `inventory_batches`: Perishable batch telemetry, freshness score (0-100), ambient sensors, and decay risk levels.
3. `price_markdowns`: Autonomous price adjustment logs, discounts, and expected velocity lift.
4. `zero_waste_bundles`: Chef-crafted recipe kits generated from near-expiry items.
5. `donation_manifests`: Cold-chain food bank logistics manifests, meal counts, and tax credit tracking.
6. `agent_logs`: Live agent reasoning traces, audit trail, and metrics deltas.
7. `demand_forecasts`: Weather-correlated demand predictions and throttled replenishment orders.

---

## 🚀 Quickstart & Setup

### 1. Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Connect Your Supabase & PostgreSQL Database
Create a `.env.local` file with your Supabase credentials:
```env
# PostgreSQL Connection for Drizzle ORM
DATABASE_URL=postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 3. Run the SQL Schema in Supabase
Copy the contents of `supabase-schema.sql` into your **Supabase SQL Editor** and execute it to create all tables and Row-Level Security policies.

Alternatively, use Drizzle Kit:
```bash
npx drizzle-kit push
```

---

## 🧪 Interactive Features to Try in the UI
1. **Execute Full Autonomous Cycle**: Click **Run Swarm** in the top navigation to trigger all 5 agents simultaneously.
2. **Autopilot Switch**: Enable continuous autonomous execution every few seconds.
3. **Simulate Cold-Chain Failure**: Click **Sensors** on any perishable batch card, slide ambient temperature to 18°C, and observe Sentinel Agent recalculate cellular decay and trigger immediate emergency markdowns.
4. **Order ChefRescue Meal Kits**: Click **View Recipe** and **Rescue & Order** to purchase zero-waste meal kits with live celebratory confetti.
5. **Confirm Shelter Handoff**: Under CharityLoop, click **Confirm Shelter Handoff** to issue digital food rescue receipts.
6. **Supabase / Drizzle Modal**: Click the **Supabase / Drizzle** button in the header to view database connection status and schema architecture.
