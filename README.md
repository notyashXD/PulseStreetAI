# PulseStreetAI — Civic Environmental Intelligence Platform

PulseStreetAI is a real-time civic environmental hazard reporting and municipal triage platform. It enables residents to capture and report environmental hazards—such as garbage burning, illegal waste dumping, industrial smoke emissions, sewage overflows, construction dust, and clogged storm drains—while providing municipal operators with a map-based Command Centre to triage, assign field crews, and optically verify remediations.

---

## Key Features

- **Multimodal Citizen Reporting**: 3-step reporting supporting camera upload with real-time computer vision classification, voice recording notes, and interactive map pin placement.
- **Computer Vision Hazard Analysis**: Powered by Gemini 2.5 Flash with real-time object detection, spatial bounding boxes, and automatic non-hazard filtering (diagrams, documents, screens).
- **Evidence Fusion Scoring (0–100)**: Multi-factor triage algorithm synthesizing visual confidence, spatio-temporal clustering (500m / 48h), live Open-Meteo atmospheric anomalies, recency decay, and citizen endorsements.
- **Atmospheric Telemetry**: Real-time AQI, PM2.5, PM10, NO₂, temperature, humidity, and 24-hour pollutant trend forecasting.
- **Municipal Command Centre**: Operator triage queue with SLA countdowns, priority filtering, squad dispatching, and trilingual citizen emergency broadcast alerts.
- **Optical Resolution Audit**: Side-by-side interactive before-and-after image comparison slider with visual remediation verification.
- **Impact & Analytics**: Ward-level performance leaderboard, resolution clearance rates, and CSV data export.
- **Role-Based Access Control**: Instant persona switching between Municipal Admin and Citizen Monitor with role-gated operator controls.

---

## Technical Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with customized design system (Warm Alabaster & Earthy Pastels)
- **AI Vision & Copilot**: Google Gemini 2.5 Flash / 1.5 Flash API with key rotation
- **Mapping**: Leaflet & React-Leaflet
- **Data & Telemetry**: Open-Meteo Air Quality & Weather APIs

---

## Project Structure

```
├── app/
│   ├── command/page.tsx          # Municipal Command & Citizen Triage Centre
│   ├── impact/page.tsx           # Environmental Impact & Ward Leaderboards
│   ├── incidents/[id]/page.tsx   # Detailed Case Record & Resolution Slider
│   ├── login/page.tsx            # Role-Based Login & Persona Switcher
│   ├── report/page.tsx           # Multimodal Hazard Reporting Workflow
│   ├── api/
│   │   ├── analyse/              # Hazard Triage Assessment API
│   │   ├── aqi/                  # Open-Meteo Air Quality Proxy
│   │   ├── copilot/              # Pulse AI Conversational Copilot API
│   │   ├── verify-resolution/    # Before/After Visual Audit API
│   │   ├── vision-scan/          # Real-time Gemini Vision Object Scanner
│   │   └── weather/              # Meteorological Telemetry API
├── components/
│   ├── aqi/                      # AQI Metric Cards & 24h Trend Chart
│   ├── command/                  # Dispatch Ticker & Broadcast Modal
│   ├── copilot/                  # Floating Pulse AI Assistant
│   ├── impact/                   # Ward Index & Citizen Leaderboard
│   ├── incidents/                # Incident Feed Cards & Resolution Slider
│   ├── layout/                   # Navigation Bar & Global Headers
│   ├── map/                      # Leaflet Interactive Maps
│   └── report/                   # Vision Scanner & Voice Recorder
├── lib/
│   ├── auth/                     # Role-Based Authentication Context
│   ├── demo/                     # City-wide Spatial Incident Dataset
│   ├── services/                 # Gemini, Open-Meteo, Clustering & Scoring
│   ├── types/                    # Zod Schemas & TypeScript Definitions
│   └── utils.ts                  # Color palettes, geometry, formatters
```

---

## Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm or pnpm

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/PulseStreetAI.git
cd PulseStreetAI

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Role-Based Credentials (Demo)

| Role | Username | Password | Default View | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Municipal Admin** | `admin` | `admin` | `/command` | Full Operator Privileges (Dispatch, SLA Triage, Optical Audit, Broadcasts) |
| **Citizen Monitor** | `user` | `user` | `/` | Resident Privileges (Hazard Reporting, AQI Telemetry, Community Feed) |

---

## Production Build

```bash
npm run build
npm run start
```
