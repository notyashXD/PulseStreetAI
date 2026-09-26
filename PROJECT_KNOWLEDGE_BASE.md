# PulseStreetAI (StreetPulse) — Complete Technical Knowledge Base & Project Blueprint

> **Document Purpose**: This comprehensive master document contains every architectural, algorithmic, operational, and code-level detail of **StreetPulse** (also known as **PulseStreetAI**). It is designed to be fed into any AI model (ChatGPT, Claude, Gemini, DeepSeek, etc.) as an authoritative reference manual for questions, feature expansions, debugging, pitch preparation, or technical evaluations.

---

## 1. Executive Summary & Identity

* **Project Name**: StreetPulse (PulseStreetAI)
* **Tagline**: *Autonomous Multimodal AI for Real-Time Civic Environmental Hazard Reporting, Municipal Triage & Remediation Verification*
* **Primary Mission**: Bridge the gap between citizen reporting and municipal response by combining Google Gemini Multimodal AI, atmospheric environmental telemetry (AQI, PM2.5, NO₂), spatio-temporal clustering, and automated optical remediation verification into an autonomous nervous system for cities.
* **Target Geographic Prototype**: Pune Metropolitan Area, Maharashtra, India (wards: Kothrud, Shivajinagar, Hadapsar, Viman Nagar, Baner, Kasba Peth, Hinjawadi, etc.).
* **Target Audience**:
  1. **Citizens / Residents**: Fast, multimodal, frictionless hazard reporting (camera, voice in 3 languages, pin on map) with complete tracking transparency.
  2. **Municipal Authorities & Field Operators** (e.g., Pune Municipal Corporation - PMC, State Pollution Control Board - SPCB, Public Works Department - PWD): Automated triage queue, algorithmic priority scoring, automated squad dispatch, trilingual citizen emergency broadcasts, and AI-verified closure audit.
  3. **Urban Planners & Environmental Officers**: Hyper-local atmospheric telemetry correlation, ward-level hazard density leaderboards, and CSV reporting.

---

## 2. Problem Statement & Civic Context

### The Challenge with Existing Municipal Complaint Portals (e.g., CPGRAMS, Swachhata App, local ward portals)
1. **Friction-Heavy Reporting**: Citizens are forced to navigate 8 to 15-step bureaucratic forms, select obscure bureaucratic department codes, and type lengthy descriptions.
2. **No Automated Hazard Verification / Triage**: Portals accept irrelevant images (selfies, documents, indoor photos, spam), flooding human operators with noise.
3. **No Dynamic Telemetry Cross-Referencing**: Garbage burning or dust emissions are reported without correlating to real-time atmospheric sensor data (PM2.5, wind speed, AQI spikes).
4. **Duplicate & Fragmented Complaints**: A single roadside trash blaze generates dozens of isolated complaints without spatio-temporal deduplication or clustering.
5. **Zero Remediation Accountability ("Ghost Closures")**: Field contractors mark tickets as "Resolved" without verifiable proof that the debris was cleared or the fire extinguished.

### The StreetPulse Solution
* **800ms Gemini 2.5 Flash Multimodal Vision**: Automatically parses photo uploads, determines if it is a genuine outdoor hazard (rejecting diagrams, documents, selfies), draws spatial bounding boxes, tags the category, and assigns severity.
* **Trilingual Voice Reporting**: Speech note capture with automated entity extraction in English, Hindi (हिन्दी), and Marathi (मराठी).
* **Evidence Fusion Scoring (0–100)**: Proprietary multi-factor triage algorithm synthesizing AI visual confidence, spatio-temporal neighborhood clustering (500m / 48h), live atmospheric sensor anomalies, time decay, and citizen endorsements.
* **Real-Time Atmospheric Telemetry**: Integrated Open-Meteo air quality and weather APIs mapping live PM2.5, PM10, NO₂, humidity, and wind vectors.
* **Autonomous Optical Resolution Verification**: Side-by-side Before/After computer vision cross-examination that verifies if the hazard was physically remediated before closing the ticket.
* **Conversational Municipal Copilot ("Pulse AI")**: Natural language operations assistant providing real-time briefing generation, trilingual advisory drafting, and SLA bottleneck detection.

---

## 3. Complete Technology Stack

| Layer | Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.3.2` | Server & client components, Turbopack, edge-ready API routes |
| **Runtime / Library**| React | `19.2.8` | Latest React concurrent features and streaming UI |
| **Language** | TypeScript | `^5` | Strict type safety across Zod schemas, API contracts, and domain models |
| **Styling & Theme** | Vanilla CSS + Tailwind CSS | Tailwind `^4` | Bespoke Warm Alabaster & Earthy Pastels design system, glassmorphism, zero layout shift |
| **AI Multimodal Core**| Google Gemini API (`@google/generative-ai`) | `0.24.1` / REST | Gemini 2.5 Flash & 1.5 Flash for vision scanning, triage, before/after audit, and copilot |
| **API Resilience** | Multi-Key Pool Failover | Custom In-House | Seamless failover across key pool with automatic quota rotation and model fallback |
| **Spatial Mapping** | Leaflet & React-Leaflet | `1.9.4` / `5.0.0` | Open-source interactive maps, custom SVG hazard pins, heat circles, and coordinate pickers |
| **Atmospheric Telemetry**| Open-Meteo Air Quality & Weather API | REST / Free Tier | Real-time PM2.5, PM10, NO₂, Ozone, temperature, wind, and 24h pollutant trends |
| **Database / Backend**| Firebase Firestore | `12.18.0` | Real-time document database with fallback to in-memory seed dataset for offline resilience |
| **Data Visualization**| Recharts | `3.10.1` | Ward performance area charts, category pie breakdowns, and 24-hour AQI trend curves |
| **Data Validation** | Zod | `4.4.3` | End-to-end schema validation for forms, API bodies, and database payloads |
| **Icons & Fonts** | Lucide React / Google Fonts | Lucide `1.33.0` | Plus Jakarta Sans (UI body/headers) and JetBrains Mono (data/coordinates) |

---

## 4. Repository & Project Directory Architecture

```
streetpulse/
├── README.md                          # Quickstart documentation & overview
├── VIDEO_PITCH_SCRIPT.md              # 3-minute hackathon demo script & timeline
├── PROJECT_KNOWLEDGE_BASE.md          # Master reference document (THIS FILE)
├── firestore.rules                    # Security rules for public feeds & RBAC operator controls
├── package.json                       # Dependencies and npm run scripts
├── tsconfig.json                      # Strict TypeScript compiler options
├── next.config.ts                     # Next.js runtime configurations
├── postcss.config.mjs                 # PostCSS setup with Tailwind v4
│
├── app/
│   ├── layout.tsx                     # Root HTML layout with Navbar and CivicCopilot modal
│   ├── globals.css                    # Complete CSS tokens, color variables, animations, components
│   ├── page.tsx                       # Homepage: Civic overview, interactive Leaflet map, filters, feed
│   ├── login/
│   │   └── page.tsx                   # Role-Based login (Municipal Admin vs. Citizen Monitor)
│   ├── report/
│   │   └── page.tsx                   # 3-step multimodal reporting workflow (Vision, Voice, Map Pin)
│   ├── command/
│   │   └── page.tsx                   # Operator Command Centre: SLA queue, crew dispatch, trilingual alert
│   ├── impact/
│   │   └── page.tsx                   # Analytics: Ward leaderboards, clearance metrics, CSV export
│   ├── incidents/[id]/
│   │   └── page.tsx                   # Incident detail page: telemetry, timeline, optical before/after slider
│   └── api/
│       ├── analyse/route.ts           # Gemini hazard classification & severity assessment endpoint
│       ├── aqi/route.ts               # Open-Meteo air quality proxy
│       ├── copilot/route.ts           # Municipal Pulse AI Copilot conversation API
│       ├── verify-resolution/route.ts # Gemini visual before/after remediation audit endpoint
│       ├── vision-scan/route.ts       # Real-time computer vision bounding-box scanner endpoint
│       └── weather/route.ts           # Open-Meteo meteorological telemetry endpoint
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                 # Persistent navigation bar, persona switcher badge, quick links
│   │   └── Header.tsx                 # Header component
│   ├── map/
│   │   ├── LeafletMap.tsx             # Dynamic client wrapper (SSR disabled)
│   │   ├── LeafletMapInner.tsx        # Map implementation with custom category markers & cluster radii
│   │   └── LocationPickerMap.tsx      # Interactive pin-drop map for citizen reporting step 2
│   ├── report/
│   │   ├── VisionScanner.tsx          # Camera capture, bounding-box renderer, hazard vs non-hazard badge
│   │   └── VoiceRecorder.tsx          # Trilingual voice recording (EN/HI/MR) with waveform animation
│   ├── incidents/
│   │   ├── IncidentCard.tsx           # Feed card with severity pill, evidence score, upvote button
│   │   └── ResolutionSlider.tsx       # Interactive Before/After split slider with Gemini audit stamp
│   ├── command/
│   │   ├── DispatchTicker.tsx         # Live scrolling marquee of municipal dispatches & resolutions
│   │   └── BroadcastModal.tsx         # Modal for composing trilingual citizen emergency broadcasts
│   ├── aqi/
│   │   ├── AQICard.tsx                # Metric widget for AQI, PM2.5, PM10, NO₂, and health guidance
│   │   └── AQITrend.tsx               # 24-hour historical pollutant graph powered by Recharts
│   ├── impact/
│   │   └── CitizenLeaderboard.tsx     # Citizen reporter ranking, points, badges, verified fixes
│   └── copilot/
│       └── CivicCopilot.tsx           # Floating conversational AI drawer with telemetry injection
│
├── lib/
│   ├── types/
│   │   └── index.ts                   # Master TypeScript interfaces, Zod schemas, label mappings
│   ├── services/
│   │   ├── gemini.ts                  # Gemini API wrapper: failover pool, vision scan, triage, copilot
│   │   ├── scoring.ts                 # Evidence Fusion Score algorithm & priority sorting functions
│   │   ├── clustering.ts              # Haversine spatial distance, hotspot clustering, location masking
│   │   └── openmeteo.ts               # Open-Meteo AQI & Weather fetchers, PM2.5 conversion, health guidance
│   ├── constants/
│   │   └── remediation.ts             # Curated Before/After photographic pairs for category verification
│   ├── demo/
│   │   └── seed.ts                    # 20+ realistic Pune civic incident records across diverse wards
│   ├── auth/
│   │   └── AuthContext.tsx            # Context provider for Admin/Resident roles & persona switching
│   ├── firebase/
│   │   ├── config.ts                  # Firebase app initialization with environment checks
│   │   ├── auth.ts                    # Authentication helper methods
│   │   └── reports.ts                 # Firestore CRUD: createReport, getReports, updateReport, comments
│   └── utils.ts                       # Helpers: category icons, date formatters, relative time, colors
│
└── public/
    └── images/remediation/            # High-resolution Before/After photo assets for each hazard category
```

---

## 5. Domain Models, Data Schemas & TypeScript Definitions

All schemas are strictly defined using **Zod** in `lib/types/index.ts`.

### 5.1 Categorization Enums
```typescript
export const IssueCategorySchema = z.enum([
  "garbage_burning",    // Open combustion of municipal solid waste / dry leaves
  "illegal_dumping",    // Unauthorized dumping of trash heaps / debris
  "smoke",              // Industrial emissions, vehicle exhaust, chimney plumes
  "sewage_leak",        // Burst pipe, overflowing manhole, open drain leakage
  "construction_dust",  // Fugitive dust from roadwork / construction without water suppression
  "blocked_drain",      // Stormwater gutter choked with plastic / solid waste
  "litter",             // Scattered plastic packaging, bottles, wrappers
  "other",              // Uncategorized hazards (e.g., massive potholes, fallen electrical lines)
]);

export const SeveritySchema = z.enum(["low", "medium", "high", "critical"]);

export const ReportStatusSchema = z.enum([
  "reported",   // Citizen logged incident
  "triaged",    // AI assessed and verified
  "verified",   // Corroborated by sensor anomaly / operator confirmation
  "assigned",   // Dispatched to field response squad
  "resolved",   // Remediated and verified via Before/After optical audit
  "rejected",   // Deemed non-hazard, spam, or duplicate
]);

export const DepartmentSchema = z.enum([
  "sanitation",        // Solid waste & street sweeping
  "pollution_control", // State Pollution Control Board (air & hazardous waste)
  "public_works",      // Road repair & drainage infrastructure
  "water_sewage",      // Water supply & sewage pipeline management
  "unassigned",        // Newly arrived ticket pending classification
]);
```

### 5.2 Core Incident Report Schema (`Report`)
```typescript
export interface Report {
  id: string;
  category: IssueCategory;
  severity: Severity;
  status: ReportStatus;
  title: string;
  description: string;
  language: "en" | "hi";
  location: {
    lat: number;
    lng: number;
    address?: string;
    landmark?: string;
    ward?: string;
  };
  publicLocation: {        // Masked coordinate for citizen privacy
    lat: number;
    lng: number;
    ward?: string;
  };
  photoUrls: string[];
  afterPhotoUrls?: string[];
  voiceNoteUrl?: string;
  reporterId?: string;
  reporterAnonymous: boolean;
  aiAnalysis: AIAnalysis | null;
  evidenceScore: ScoreBreakdown | null;
  environmentalContext: EnvironmentalSnapshot | null;
  department: Department;
  assignedTo?: string;
  operatorNotes?: string;
  statusHistory: StatusHistoryEntry[];
  supportCount: number;    // Upvotes / citizen endorsements
  commentCount: number;
  hotspotClusterId?: string;
  isDemo: boolean;
  resolvedAt?: number | string;
  resolutionNote?: string;
  resolutionVerified: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### 5.3 AI Analysis Output Schema (`AIAnalysis`)
```typescript
export interface AIAnalysis {
  category: IssueCategory;
  severity: Severity;
  reason: string;                 // Objective explanation of classification
  suggestedDepartment: Department;// Recommended dispatch authority
  healthRisk: string;             // Physiological risk (e.g. PM2.5 inhalation, pathogen exposure)
  environmentalRisk: string;      // Ecological impact (e.g. soil leachate, soot dispersion)
  confidence: number;             // 0.00 to 1.00
  isDemo: boolean;
}
```

---

## 6. Core Algorithms & Mathematical Formulations

### 6.1 The Evidence Fusion Scoring Algorithm (0–100)
Implemented in `lib/services/scoring.ts`. Rather than relying solely on user claims or single sensor readings, StreetPulse fuses five independent signals into a consolidated 0–100 index:

$$\text{Evidence Score} = S_{\text{AI}} + S_{\text{Spatial}} + S_{\text{Env}} + S_{\text{Recency}} + S_{\text{Citizen}}$$

1. **AI Visual Confidence ($S_{\text{AI}}$, max 40 points)**:
   $$S_{\text{AI}} = \text{round}(\text{confidence} \times 40)$$
   Where $\text{confidence} \in [0.0, 1.0]$ is returned by Gemini Vision.
2. **Nearby Spatial Corroboration ($S_{\text{Spatial}}$, max 25 points)**:
   $$S_{\text{Spatial}} = \min(25, N_{\text{nearby}} \times 5)$$
   Counts other active reports of the same category within $500\text{m}$ logged in the last $48\text{hours}$.
3. **Atmospheric Telemetry Anomaly ($S_{\text{Env}}$, max 20 points)**:
   $$S_{\text{Env}} = \min(20, \text{round}(\text{AQI Anomaly Score}))$$
   Correlates local micro-sensor deviation against regional baselines.
4. **Temporal Recency Decay ($S_{\text{Recency}}$, max 10 points)**:
   $$S_{\text{Recency}} = \text{round}\left(10 \times \exp\left(-\frac{\Delta t}{48}\right)\right)$$
   Where $\Delta t$ is the age of the report in hours. Recent incidents carry full weight; stale incidents decay smoothly over a 48-hour half-life.
5. **Citizen Endorsements ($S_{\text{Citizen}}$, max 5 points)**:
   $$S_{\text{Citizen}} = \min\left(5, \left\lfloor\frac{\text{supportCount}}{2}\right\rfloor\right)$$
   Community upvotes provide crowdsourced confirmation.

**Score Tiers**:
* `0 – 34`: **Low Evidence** (Grey badge)
* `35 – 54`: **Moderate Evidence** (Amber badge)
* `55 – 74`: **High Evidence** (Coral badge)
* `75 – 100`: **Very High Evidence** (Violet badge)

### 6.2 Priority Ranking Formula
For municipal triage in the Command Centre (`sortByPriority`):
$$\text{Priority Index} = \text{Evidence Score} + W_{\text{severity}}$$
Where $W_{\text{severity}}$ weights are:
* **Critical**: $+40$
* **High**: $+25$
* **Medium**: $+12$
* **Low**: $+4$

This guarantees that an imminent sewage outbreak or commercial tire fire with high evidence immediately floats to the very top of the municipal dispatch queue.

### 6.3 Spatio-Temporal Clustering (Haversine & Hotspots)
Implemented in `lib/services/clustering.ts`:
1. **Haversine Distance**:
   $$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)$$
   $$d = 2 R \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
   Where $R = 6,371,000\text{ m}$.
2. **Hotspot Grouping**:
   * Evaluates unresolved reports within a $72\text{-hour}$ window.
   * Clusters reports with the identical category within $500\text{m}$ radius.
   * Computes centroid: $(\bar{\text{lat}}, \bar{\text{lng}}) = \left(\frac{1}{k}\sum \text{lat}_i, \frac{1}{k}\sum \text{lng}_i\right)$.
   * Sets cluster severity to the highest severity among member incidents.
3. **Citizen Privacy Location Obscuration (`obscureLocation`)**:
   * Public-facing feeds do not display the exact doorstep GPS pin of citizen reporters.
   * A randomized polar offset of $0.003^\circ$ ($\approx 300\text{m}$) is applied to generate `publicLocation`.

### 6.4 AQI & PM2.5 Breakpoint Formula
Implemented in `lib/services/openmeteo.ts` (based on standard US-EPA/CPCB piecewise linear interpolation):
* $\text{PM}_{2.5} \le 12.0 \ \mu\text{g/m}^3 \implies \text{AQI} = \text{round}\left(\frac{\text{PM}_{2.5}}{12} \times 50\right)$
* $12.1 \le \text{PM}_{2.5} \le 35.4 \implies \text{AQI} = \text{round}\left(50 + \frac{\text{PM}_{2.5} - 12}{23.4} \times 50\right)$
* $35.5 \le \text{PM}_{2.5} \le 55.4 \implies \text{AQI} = \text{round}\left(100 + \frac{\text{PM}_{2.5} - 35.4}{20} \times 50\right)$
* $55.5 \le \text{PM}_{2.5} \le 150.4 \implies \text{AQI} = \text{round}\left(150 + \frac{\text{PM}_{2.5} - 55.4}{95} \times 50\right)$
* $> 150.4 \implies \text{AQI} = \min\left(500, \text{round}\left(200 + \frac{\text{PM}_{2.5} - 150.4}{100} \times 100\right)\right)$

---

## 7. Multimodal AI Integrations & Prompt Engineering

All Google Gemini integrations reside in `lib/services/gemini.ts`. The system uses a **Key Pool with Failover Mechanism**: it reads `GEMINI_API_KEYS` (comma-separated) or `GEMINI_API_KEY`, attempting requests across keys and falling back between `gemini-2.5-flash` and `gemini-1.5-flash`.

### 7.1 Real-Time Vision Scanner (`scanVisionImage`)
* **Endpoint**: `/api/vision-scan`
* **Trigger**: Triggered instantly when a user uploads or snaps an image on `/report`.
* **Critical Innovation**: The prompt forces Gemini to check whether the image is actually an outdoor environmental hazard or an irrelevant indoor photo/document/diagram:
  ```text
  If this image is NOT a real-world environmental hazard (e.g. it is a software
  architecture diagram, flowchart, code screenshot, document, textbook, computer screen,
  indoor household photo, selfie, animal, food, graphic design, random object):
  YOU MUST SET "isHazard": false, "category": "other", and explain clearly in "summary"
  what the image actually depicts. "boxes" MUST be [].
  ```
* **Output Structure**:
  ```json
  {
    "isHazard": true,
    "category": "garbage_burning",
    "confidence": 0.94,
    "label": "Open Waste Fire Plume",
    "summary": "Active open waste combustion emitting high-density particulate smoke.",
    "boxes": [
      {
        "label": "Open Fire Plume (Class A)",
        "confidence": 0.94,
        "top": 18.0,
        "left": 24.0,
        "width": 45.0,
        "height": 38.0
      }
    ]
  }
  ```
* **Bounding Box Normalization**: Normalizes percentage coordinates (`top`, `left`, `width`, `height`) and filters out bounding boxes of innocent pedestrians or normal vehicles, highlighting only the physical hazard.

### 7.2 Full Incident Triage Assessment (`analyseReport`)
* **Endpoint**: `/api/analyse`
* **Role**: Evaluates the image base64 together with the user description to output an objective civic risk assessment.
* **Returns**: Suggested municipal department, physiological health risk (e.g., *acute respiratory inflammation, PM2.5 inhalation*), environmental risk (e.g., *groundwater leachate, soot deposition*), and calibrated confidence score.

### 7.3 Optical Before/After Resolution Verification (`compareImages`)
* **Endpoint**: `/api/verify-resolution`
* **Trigger**: When field crews complete a task or when inspecting an incident on `/incidents/[id]`.
* **Mechanism**: Takes two images simultaneously into Gemini's multimodal prompt: the initial citizen report (`beforeBase64`) and the completed remediation photo (`afterBase64`).
* **Evaluation**: Gemini checks for physical clearance:
  - Did the garbage pile disappear?
  - Has the fire been quenched with no lingering plume?
  - Has the sewage water drained and the manhole been sealed?
* **Returns**:
  ```json
  {
    "likelyResolved": true,
    "confidence": 0.92,
    "reason": "Visual clearance confirmed: hazard removed and area restored to normal state."
  }
  ```

### 7.4 Conversational Municipal Copilot (`queryCivicCopilot`)
* **Endpoint**: `/api/copilot`
* **Component**: Floating UI drawer accessible from any page (`CivicCopilot.tsx`).
* **Context Injection**: Each query dynamically injects live Pune municipal telemetry:
  - Total active incidents
  - Count of critical tickets
  - Active spatial hotspot count
  - Current outdoor AQI
  - Sample of the 8 latest incident titles, categories, and wards
* **Capabilities**:
  1. *Morning Dispatch Briefings*: Summarizes where crews should be sent based on air quality and critical flags.
  2. *Trilingual Citizen SMS / WhatsApp Broadcasts*: Generates ready-to-publish alerts translated across English, Hindi, and Marathi.
  3. *SLA Expiry Audit*: Identifies tickets lingering past municipal time limits.

---

## 8. Complete API Specifications

### 1. `POST /api/vision-scan`
* **Content-Type**: `application/json` or `multipart/form-data`
* **Payload**: `{ "imageBase64": "...", "mimeType": "image/jpeg" }` OR file upload.
* **Response**: `VisionScanResult` object with `isHazard`, `category`, `confidence`, `label`, `summary`, and `boxes[]`.

### 2. `POST /api/analyse`
* **Content-Type**: `application/json`
* **Payload**:
  ```json
  {
    "category": "garbage_burning",
    "text": "Huge plastic blaze behind residential society",
    "imageBase64": "..."
  }
  ```
* **Response**: `AIAnalysis` object with `suggestedDepartment`, `healthRisk`, `environmentalRisk`, and `confidence`.

### 3. `POST /api/verify-resolution`
* **Content-Type**: `application/json`
* **Payload**:
  ```json
  {
    "beforeBase64": "data:image/jpeg;base64,...",
    "afterBase64": "data:image/jpeg;base64,..."
  }
  ```
* **Response**:
  ```json
  {
    "likelyResolved": true,
    "confidence": 0.95,
    "reason": "Debris pile completely removed. Road sanitized."
  }
  ```

### 4. `POST /api/copilot`
* **Content-Type**: `application/json`
* **Payload**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "Which wards require urgent water tankers?" }
    ],
    "aqi": 148
  }
  ```
* **Response**: `{ "text": "markdown string", "actionSuggestions": ["..."] }`

### 5. `GET /api/aqi?lat=18.5204&lng=73.8567`
* **Response**: Real-time atmospheric metrics (`aqi`, `pm25`, `pm10`, `no2`, `o3`, `category`, `fetchedAt`).

### 6. `GET /api/weather?lat=18.5204&lng=73.8567`
* **Response**: Weather conditions (`temperature`, `humidity`, `windSpeed`, `windDirection`, `weatherCode`, `description`).

---

## 9. User Journeys & Frontend Pages

### 9.1 Homepage (`/`) — Civic Overview & Community Hub
* **Hero Banner**: High-level telemetry bar (Pune AQI status, active incident counter, resolved today counter).
* **Interactive Leaflet Map**:
  - Color-coded hazard pins matching category pastels.
  - Glowing red hotspot cluster circles indicating recurring hazard zones.
  - Clicking any pin opens a preview popup with evidence score and direct navigation to `/incidents/[id]`.
* **Category & Urgency Filter Bar**: Filter by all 8 hazard categories, severity levels (Critical, High, Medium, Low), or resolution status.
* **Incident Feed**: Grid of `IncidentCard` items with upvoting, time-ago badges, and ward markers.

### 9.2 Multimodal Reporting Wizard (`/report`)
* **Step 1: Capture & Classification**:
  - **AI Vision Scanner tab**: Drag-and-drop or camera snap $\to$ auto bounding-box detection in 800ms.
  - **Voice Note tab**: One-click audio recording with animated audio levels; supports pre-recorded voice samples in English, Hindi, and Marathi; auto-extracts incident category and landmark.
  - **Category Grid tab**: 8 intuitive cards for manual selection.
* **Step 2: Geolocation & Landmark**:
  - Interactive Leaflet pin-drop map (`LocationPickerMap`).
  - "Use My Current Location" button with browser GPS fallback.
  - Landmark text field (e.g. *Opposite Balewadi Stadium*).
* **Step 3: AI Review & Confirmation**:
  - Displays instant Gemini triage preview (Suggested Department, Health Impact, Environmental Risk).
  - One-click submission that logs report and navigates to the incident case file.

### 9.3 Municipal Command Centre (`/command`)
* **Role-Gated**: Intended for Municipal Admins (`admin` / `admin`). Non-admin visitors see an informational banner with an instant "Switch to Operator" button.
* **Top Metric Ticker**: Real-time KPI counts (Active Queue, Critical Flags, 24h Resolved, Hotspot Clusters).
* **Dynamic SLA Countdown**: Live timer ticking down to 24-hour target remediation deadlines.
* **Dispatch Modal**: Assign tickets to specialized response squads:
  1. *PMC Rapid Waste & Burn Response Unit #2* (Heavy Mist Sprayer + Tipper)
  2. *Kothrud-Karve Rd Environmental Patrol* (Mobile Sensor + Water Tanker)
  3. *Hadapsar Industrial Compliance Squad* (Inspection Van)
  4. *Smart City Drainage & Sanitation Force* (Suction Jetting Unit)
* **Trilingual Broadcast Alert Modal**: Compose emergency advisories that auto-render in English, Hindi, and Marathi with ward-level dispatching.

### 9.4 Detailed Incident Case Record (`/incidents/[id]`)
* **Full Case File**: High-resolution image view, exact address, ward, logged timestamp, and reporter anonymity flag.
* **Evidence Breakdown Progress Bars**: Displays points earned across AI confidence, nearby corroboration, atmospheric anomaly, recency, and upvotes.
* **Microclimate Snapshot**: Shows local weather and AQI at the exact hour the incident was logged.
* **Interactive Optical Resolution Slider (`ResolutionSlider.tsx`)**:
  - For resolved incidents, displays a draggable split-view comparison between "BEFORE" and "AFTER" remediation photos.
  - Features the official **"Verified by Pulse AI Vision"** green certification stamp.
* **Audit Trail**: Chronological lifecycle history from `reported` $\to$ `triaged` $\to$ `assigned` $\to$ `resolved`.

### 9.5 Impact & Analytics Dashboard (`/impact`)
* **Macro KPIs**: Resolution Clearance Rate (e.g., 68%), Active In-Flight Remediations, Average Response Speed (28.4h), AI Evaluations Conducted.
* **Interactive Recharts**:
  - Donut chart: Incident distribution by environmental category.
  - Area chart: Weekly volume curve comparing newly logged vs. remediated tickets.
  - Ward clearance table: Compares performance across Hadapsar, Kothrud, Baner, Shivajinagar, etc.
* **Citizen Leaderboard (`CitizenLeaderboard.tsx`)**: Gamified civic engagement featuring top citizen monitors, impact points, and verified fix badges.
* **CSV Data Export**: One-click download of the complete municipal civic dataset for urban planning and government audit compliance.

---

## 10. Design System & Aesthetic Tokens

The design uses an **Artisan Earth & Warm Alabaster** aesthetic system (defined in `app/globals.css`), intentionally steering away from generic corporate blues or cold dark themes in favor of warmth, civic trust, and tactile clarity.

### Color Tokens
* **Canvas Base**: `#FAF7F2` (Warm Alabaster / Oat Linen)
* **Elevated Cards**: `#FFFFFF` / `#F3ECE2` (Soft Stone)
* **Primary Text**: `#2A211B` (Deep Espresso Roast — avoids harsh `#000000`)
* **Secondary Text**: `#5E5147` (Warm Taupe)
* **Brand Accent**: `#8C5E3C` (Warm Terracotta / Chestnut)

### Category Color Palette
* **Garbage Burning**: `#B65545` (Smoldering Terracotta)
* **Illegal Dumping**: `#B38038` (Ochre Amber)
* **Smoke & Emissions**: `#7E5B72` (Dusty Mauve)
* **Sewage Leak**: `#4E6F87` (Deep Slate Teal)
* **Construction Dust**: `#8C5E3C` (Earthy Sand)
* **Blocked Drain**: `#3B6E8C` (Ocean Indigo)
* **Litter & Plastic**: `#556E46` (Forest Sage)

### Typography
* **Primary Sans**: `Plus Jakarta Sans`, `-apple-system`, `sans-serif` (weights: 400, 500, 600, 700, 800)
* **Telemetry & Coordinates Mono**: `JetBrains Mono`, `monospace`

---

## 11. Security, Roles & Access Control

### 11.1 Role Matrix & Default Personas
| Role | Persona Name | Username / Password | Default Route | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Municipal Admin (Operator)** | **Yash Mishra** (Chief Municipal Response Officer) | `admin` / `admin` | `/command` | Full dispatch privileges, SLA queue management, emergency trilingual broadcasts, incident status editing, resolution verification audit. |
| **Citizen Monitor (Resident)** | **Palak Khare** (Verified Resident, Kothrud Ward) | `user` / `user` | `/` | Multimodal hazard reporting, upvoting, community comments, atmospheric air quality telemetry, leaderboard view. |

### 11.2 Firestore Security Rules (`firestore.rules`)
* `reports`: Public read for civic transparency. Anyone can create reports with valid categories. Residents can update `supportCount` (upvotes) and `commentCount`. Only authenticated operators can change status, department assignments, and resolution fields.
* `comments`: Public read, authenticated or rate-limited create ($\le 500$ chars), operator delete.
* `clusters` & `auditLogs`: Read-only for citizens, read/write for operators.

---

## 12. Local Setup & Environment Variables

### 12.1 Prerequisites
* Node.js `18.18+` or `20+`
* npm, pnpm, or yarn

### 12.2 Configuration (`.env.local`)
Create a `.env.local` file in the `streetpulse/` root:
```env
# Gemini API Key (Required for AI Vision, Triage, Verification & Copilot)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Multiple keys for automatic failover rotation under high load
# GEMINI_API_KEYS=key_one,key_two,key_three

# Optional: Firebase Firestore (if omitted, seamlessly runs in offline Demo Seed mode)
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
# NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 12.3 Installation & Execution
```bash
# Navigate to project directory
cd streetpulse

# Install dependencies
npm install

# Run development server with Turbopack
npm run dev

# Open in browser: http://localhost:3000
```

---

## 13. How to Use This Document with Other AIs

When providing this document to other AI assistants (ChatGPT, Claude, Gemini, etc.), use the following framing prompts:

### Prompt 1: For Developing New Features
> *"I am working on StreetPulse, an autonomous municipal environmental hazard triage platform. Attached is our master project blueprint (`PROJECT_KNOWLEDGE_BASE.md`). Please review the data models in Section 5 and the scoring formula in Section 6. I want to add [Feature X, e.g., an automated SMS notification webhook for field workers]. Write the production TypeScript code matching our existing architecture."*

### Prompt 2: For Pitching & Hackathon Judges
> *"Here is the complete technical documentation for our hackathon project StreetPulse. Based on Section 2 (Problem Statement) and Section 6 (Proprietary Algorithms), generate a compelling 5-slide pitch deck structure highlighting our competitive edge against legacy municipal portals."*

### Prompt 3: For Debugging or Refactoring
> *"Review the Gemini failover implementation in Section 7 and the API routes in Section 8. I am seeing [Issue Y]. How does this interact with our existing `callGeminiWithFailover` service?"*
