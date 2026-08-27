# 🏙️ StreetPulse — Civic Environment Intelligence Platform

> **CleanAir & Clear Streets Hackathon Track Submission**  
> Real-time environmental hazard reporting, multimodal AI triage, and municipal command system.

---

## 🌟 Product Mission & Overview

**StreetPulse** transforms civic environmental hazard management. It empowers residents to report local hazards—garbage burning, illegal dumping, industrial smoke plumes, sewage leaks, construction dust, blocked storm drains, and litter—while providing municipal civic teams and field officers with an AI-augmented Command Centre to triage, corroborate, and resolve issues before they escalate into public health crises.

### Core Value Pillars
1. **Multimodal Citizen Reporting**: Fast 3-step reporting supporting photos, text, geolocation pin adjustments, and multi-lingual UI (English & Hindi).
2. **Gemini 2.0 Flash Intelligence**: Automated hazard classification, severity appraisal, health risk evaluation, and departmental routing.
3. **Evidence Fusion Scoring (0–100)**: Deterministic multi-factor triage combining AI confidence, spatio-temporal clustering (500m / 48h), live Open-Meteo AQI anomalies, recency decay, and community upvotes.
4. **Live Sensor & Open-Meteo Integration**: Real-time AQI, PM2.5, PM10, NO₂, temperature, humidity, and 24-hour pollutant trend forecasting.
5. **Civic Command Centre**: Map-first operator workbench with triage queues, cluster detection, assignment workflows, and resolution verification.
6. **Impact & Trend Analytics**: Ward-level leaderboard, clearance rates, and CSV export for policy makers and municipal authorities.

---

## 🏗️ Technical Architecture

```
streetpulse/
├── app/
│   ├── layout.tsx                # Global layout with DemoBanner & Navigation
│   ├── page.tsx                  # Public Home / City Pulse
│   ├── report/page.tsx           # 3-step Multimodal Incident Submission Flow
│   ├── incidents/[id]/page.tsx   # Detailed Incident View with AI Breakdown
│   ├── command/page.tsx          # Civic Operator Command Centre
│   ├── impact/page.tsx           # Impact & Trends Analytics Dashboard
│   ├── api/
│   │   ├── analyse/route.ts      # Server-side Gemini 2.0 Flash Analysis API
│   │   ├── verify-resolution/    # Before/After Resolution Verification API
│   │   ├── aqi/route.ts          # Open-Meteo AQI Proxy
│   │   └── weather/route.ts      # Open-Meteo Weather Proxy
├── components/
│   ├── aqi/                      # AQICard, AQITrend Chart
│   ├── incidents/                # IncidentCard
│   ├── layout/                   # Header, DemoBanner
│   └── map/                      # LeafletMap, LocationPickerMap
├── lib/
│   ├── demo/seed.ts              # 25 Realistic Demo Incidents for Pune, India
│   ├── firebase/                 # Firebase Client & Firestore CRUD
│   ├── services/
│   │   ├── clustering.ts         # Haversine Spatio-Temporal Clustering
│   │   ├── gemini.ts             # Gemini 2.0 Flash Multimodal Client
│   │   ├── openmeteo.ts          # Open-Meteo AQI & Weather Adapter
│   │   └── scoring.ts            # Evidence Fusion Scoring Engine
│   ├── types/                    # Zod Schemas & TypeScript Types
│   └── utils.ts                  # Color palettes, formatters, icons
└── firestore.rules               # Production-ready Security Rules
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm** or **pnpm** / **yarn**

### 2. Installation
```bash
# Clone and navigate into the project directory
cd streetpulse

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your **Gemini API Key**:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Optional: Provide Firebase keys if connecting to your live Firebase project. StreetPulse automatically operates in Demo Mode if keys are omitted).*

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the application.

---

## 🧪 Testing & Verification

Run the TypeScript type checker and linter:
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Production Build Test
npm run build
```

---

## 🛡️ Security & Privacy
- **Location Obfuscation**: Public feeds use approximate locations (~500m jitter) to protect citizen privacy.
- **EXIF Stripping**: Image uploads strip geolocation metadata before storage.
- **Strict Firestore Rules**: Role-based access control separating public report read/writes from operator-only assignment and audit logging.

---

## 🌐 Deploy to Vercel

```bash
npx vercel
```
Set `GEMINI_API_KEY` in your Vercel Project Settings for live AI multimodal classification in production.
