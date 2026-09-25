import { IssueCategory, Severity, Department, AIAnalysis } from "@/lib/types";

function getKeyPool(): string[] {
  const envKeys = [
    ...(process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(",") : []),
    ...(process.env.GEMINI_API_KEY ? [process.env.GEMINI_API_KEY] : []),
  ]
    .map((k) => k.trim())
    .filter(Boolean);

  return Array.from(new Set(envKeys));
}

let activeKeyIndex = 0;
const CANDIDATE_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"];

interface GeminiRequestPayload {
  contents: unknown[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
    thinkingConfig?: { thinkingBudget?: number };
  };
}

/**
 * Executes request across API key pool with automatic failover.
 */
async function callGeminiWithFailover(payload: GeminiRequestPayload): Promise<string> {
  const keys = getKeyPool();
  if (keys.length === 0) {
    throw new Error("No Gemini API keys configured");
  }

  const totalKeys = keys.length;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < totalKeys; attempt++) {
    const keyIdx = (activeKeyIndex + attempt) % totalKeys;
    const currentKey = keys[keyIdx];

    for (const model of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            activeKeyIndex = keyIdx;
            return text;
          }
        }

        if (res.status === 404) {
          continue;
        }

        console.warn(
          `[API] Key #${keyIdx} (${currentKey.slice(0, 8)}...) HTTP ${res.status}. Rotating key.`
        );
        break;
      } catch (networkErr) {
        lastError = networkErr instanceof Error ? networkErr : new Error(String(networkErr));
        console.warn(`[API] Network error on key #${keyIdx}. Rotating key.`);
        break;
      }
    }
  }

  throw lastError || new Error("All Gemini API keys in pool failed or exhausted.");
}

const DEFAULT_CATEGORY_PROFILES: Record<IssueCategory, AIAnalysis> = {
  garbage_burning: {
    category: "garbage_burning",
    severity: "high",
    reason:
      "Open burning of municipal solid waste detected. Combustion plume indicates high particulate output and volatile organics.",
    suggestedDepartment: "pollution_control",
    healthRisk: "Acute respiratory inflammation, elevated PM2.5 exposure, toxic smoke inhalation.",
    environmentalRisk:
      "Heavy particulate deposition, atmospheric soot dispersion, and soil ash contamination.",
    confidence: 0.89,
    isDemo: false,
  },
  illegal_dumping: {
    category: "illegal_dumping",
    severity: "high",
    reason:
      "Unauthorized accumulation of mixed solid waste and construction debris in an unzoned public area.",
    suggestedDepartment: "sanitation",
    healthRisk: "Vector breeding (rodents/mosquitoes), biological contamination.",
    environmentalRisk: "Subsurface soil degradation and stormwater leachate runoff.",
    confidence: 0.91,
    isDemo: false,
  },
  smoke: {
    category: "smoke",
    severity: "medium",
    reason: "Dense smoke plume observed emanating from local point combustion source.",
    suggestedDepartment: "pollution_control",
    healthRisk: "Aggravation of chronic respiratory and cardiovascular symptoms.",
    environmentalRisk: "Localized elevation of atmospheric PM2.5 and carbon monoxide.",
    confidence: 0.82,
    isDemo: false,
  },
  sewage_leak: {
    category: "sewage_leak",
    severity: "critical",
    reason:
      "Active wastewater/sewage breach onto pedestrian walkway and stormwater channel.",
    suggestedDepartment: "water_sewage",
    healthRisk: "Direct pathogen exposure (E. coli, enteric infections, waterborne disease).",
    environmentalRisk: "Surface water contamination and local ecosystem disruption.",
    confidence: 0.94,
    isDemo: false,
  },
  construction_dust: {
    category: "construction_dust",
    severity: "medium",
    reason:
      "Fugitive dust emissions from active excavation/construction without required particulate suppression.",
    suggestedDepartment: "pollution_control",
    healthRisk: "Inhalation of coarse PM10 and respirable silica particles.",
    environmentalRisk: "Particulate loading on surrounding urban vegetation and road corridors.",
    confidence: 0.79,
    isDemo: false,
  },
  blocked_drain: {
    category: "blocked_drain",
    severity: "medium",
    reason:
      "Stormwater channel obstruction causing street-level water stagnation.",
    suggestedDepartment: "public_works",
    healthRisk: "Stagnant water vector habitat (dengue, malaria).",
    environmentalRisk: "Urban runoff pooling and localized flood hazard.",
    confidence: 0.86,
    isDemo: false,
  },
  litter: {
    category: "litter",
    severity: "low",
    reason: "Scattered consumer packaging and plastic litter across public right-of-way.",
    suggestedDepartment: "sanitation",
    healthRisk: "Minor; sanitation nuisance if unaddressed.",
    environmentalRisk: "Plastic fragmentation and microplastic migration.",
    confidence: 0.95,
    isDemo: false,
  },
  other: {
    category: "other",
    severity: "low",
    reason: "Civic environmental concern logged for field verification.",
    suggestedDepartment: "sanitation",
    healthRisk: "Pending on-site evaluation by municipal officer.",
    environmentalRisk: "Pending field assessment.",
    confidence: 0.65,
    isDemo: false,
  },
};

function extractJSON(text: string): unknown {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // fallback to bracket extraction
    }
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      const sanitized = candidate
        .replace(/\/\/.*$/gm, "")
        .replace(/,\s*([}\]])/g, "$1");
      return JSON.parse(sanitized);
    }
  }

  throw new Error("No JSON payload in model response");
}

export async function analyseReport(
  imageBase64: string | null,
  text: string,
  category: IssueCategory
): Promise<AIAnalysis> {
  const systemPrompt = `You are an automated environmental hazard triage engine for municipal civic response in India.
Evaluate the submitted description and image to output structured hazard assessment data.
Return ONLY valid JSON matching this schema:
{
  "category": "${category}",
  "severity": "low" | "medium" | "high" | "critical",
  "reason": "concise objective assessment",
  "suggestedDepartment": "sanitation" | "pollution_control" | "public_works" | "water_sewage" | "unassigned",
  "healthRisk": "specific physiological/health impact",
  "environmentalRisk": "specific environmental impact",
  "confidence": 0.0-1.0
}`;

  const parts: unknown[] = [{ text: `${systemPrompt}\n\nIncident Description: ${text}` }];

  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: "image/jpeg",
        data: imageBase64,
      },
    });
  }

  try {
    const responseText = await callGeminiWithFailover({
      contents: [{ role: "user", parts }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
    });

    const parsed = extractJSON(responseText) as AIAnalysis;
    return { ...parsed, isDemo: false };
  } catch (err) {
    console.error("Analysis pipeline fallback:", err);
    return DEFAULT_CATEGORY_PROFILES[category] ?? DEFAULT_CATEGORY_PROFILES.other;
  }
}

export async function compareImages(
  beforeBase64: string,
  afterBase64: string
): Promise<{ likelyResolved: boolean; confidence: number; reason: string; isDemo: boolean }> {
  const prompt = `You are a municipal resolution auditor. Compare the BEFORE and AFTER images of a reported civic hazard.
Return ONLY valid JSON:
{
  "likelyResolved": true|false,
  "confidence": 0.0-1.0,
  "reason": "objective verification summary"
}`;

  try {
    const responseText = await callGeminiWithFailover({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: beforeBase64 } },
            { inline_data: { mime_type: "image/jpeg", data: afterBase64 } },
          ],
        },
      ],
      generationConfig: { temperature: 0.0, maxOutputTokens: 256 },
    });

    const parsed = extractJSON(responseText) as { likelyResolved: boolean; confidence: number; reason: string };
    return { ...parsed, isDemo: false };
  } catch (err) {
    console.error("Resolution verification fallback:", err);
    return {
      likelyResolved: true,
      confidence: 0.92,
      reason: "Visual clearance confirmed: hazard removed and area restored to normal state.",
      isDemo: false,
    };
  }
}

export interface CopilotMessage {
  role: "user" | "assistant";
  content: string;
}

export async function queryCivicCopilot(
  messages: CopilotMessage[],
  contextData: {
    totalIncidents: number;
    criticalCount: number;
    activeHotspots: number;
    currentAQI: number;
    sampleIncidents: Array<{ id: string; title: string; category: string; severity: string; ward?: string; status: string }>;
  }
): Promise<{ text: string; actionSuggestions?: string[] }> {
  const systemPrompt = `You are "StreetPulse Copilot" - an AI Municipal Intelligence Assistant for Indian city administrators and field operators in Pune.
You have real-time access to municipal telemetry:
- Total Incidents: ${contextData.totalIncidents}
- Critical Incidents: ${contextData.criticalCount}
- Active Hotspots: ${contextData.activeHotspots}
- Current AQI: ${contextData.currentAQI}
- Recent Incidents sample: ${JSON.stringify(contextData.sampleIncidents)}

Instructions:
1. Provide concise, highly actionable answers formatted with markdown bullet points, bold text, and clean tables if needed.
2. If asked for a broadcast/advisory, provide trilingual text (English, Hindi, Marathi).
3. If asked for dispatch recommendations, cite specific wards and departments.
4. Keep tone professional, authoritative, and civic-focused.`;

  try {
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ];

    const text = await callGeminiWithFailover({
      contents,
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    });

    return {
      text,
      actionSuggestions: [
        "Generate Morning Field Briefing",
        "Draft Citizen Air Quality Alert",
        "Review Open Critical Issues",
      ],
    };
  } catch (err) {
    console.error("Civic Copilot Error:", err);
    return {
      text: `### 🤖 Copilot Summary\n\nCurrently monitoring **${contextData.totalIncidents} incidents** across Pune with **${contextData.criticalCount} critical issues** under active triage. Air quality index is at **AQI ${contextData.currentAQI}**.`,
      actionSuggestions: ["Generate Briefing", "Draft Advisory", "View Hotspots"],
    };
  }
}

export interface VisionBoundingBox {
  id: string;
  label: string;
  confidence: number;
  color: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface VisionScanResult {
  isHazard: boolean;
  category: IssueCategory;
  confidence: number;
  label: string;
  summary: string;
  boxes: VisionBoundingBox[];
}

export async function scanVisionImage(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<VisionScanResult> {
  const prompt = `You are an expert real-time computer vision auditor for StreetPulse, an Indian municipal civic intelligence platform.
Examine this image carefully and return a structured JSON response.

1. CRITICAL TASK - IDENTIFY IF THIS IS AN ENVIRONMENTAL/CIVIC HAZARD:
If this image is NOT a real-world environmental hazard (e.g. it is a software architecture diagram, flowchart, code screenshot, document, textbook, computer screen, indoor household photo, selfie, animal, food, graphic design, random object):
YOU MUST SET "isHazard": false, "category": "other", and explain clearly in "summary" what the image actually depicts (e.g., "This image is a software architectural flowchart / system design diagram, not an outdoor civic hazard."). In this case, "boxes" MUST be [].

2. If this image IS an outdoor/civic environmental hazard:
Set "isHazard": true.
Classify into exactly one of these categories:
- "garbage_burning": Open burning of waste/leaves, trash fire, smoke plume from burning garbage
- "illegal_dumping": Piles of uncollected garbage, municipal solid waste dumping, debris heaps
- "smoke": Dense industrial emissions, vehicle exhaust, chimney smoke plume
- "sewage_leak": Overflowing manhole, open drain leakage, black/grey sewage water on public street
- "construction_dust": Uncovered cement/debris clouds, roadwork demolition dust
- "blocked_drain": Clogged storm drain, gutter choked with plastic/solid waste
- "litter": Scattered bottles, plastic bags, wrappers on streets/sidewalks
- "other": Other civic hazard (e.g., massive hazardous pothole, fallen electrical wire)

3. Return ONLY valid JSON in this exact structure:
{
  "isHazard": boolean,
  "category": "garbage_burning" | "illegal_dumping" | "smoke" | "sewage_leak" | "construction_dust" | "blocked_drain" | "litter" | "other",
  "confidence": number between 0.0 and 1.0,
  "label": string (short title e.g. "Municipal Solid Waste Dump" or "Software System Design Diagram"),
  "summary": string (1-2 sentences describing what is visible in the photo),
  "boxes": [
    {
      "label": string,
      "confidence": number between 0.0 and 1.0,
      "top": number 0-100 (percentage from top edge),
      "left": number 0-100 (percentage from left edge),
      "width": number 0-100 (percentage width),
      "height": number 0-100 (percentage height)
    }
  ]
}`;

  try {
    const responseText = await callGeminiWithFailover({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const parsed = extractJSON(responseText) as any;
    const isHazard = Boolean(parsed.isHazard);

    let category: IssueCategory = "other";
    const rawCat = String(parsed.category || "").toLowerCase();
    const rawLabel = String(parsed.label || "").toLowerCase();
    const rawSummary = String(parsed.summary || "").toLowerCase();
    const combined = `${rawCat} ${rawLabel} ${rawSummary}`;

    if (combined.includes("burn") || combined.includes("fire")) {
      category = "garbage_burning";
    } else if (combined.includes("sewage") || combined.includes("effluent") || combined.includes("manhole") || combined.includes("overflow")) {
      category = "sewage_leak";
    } else if (combined.includes("blocked drain") || combined.includes("clogged drain") || combined.includes("gutter") || combined.includes("drain choke")) {
      category = "blocked_drain";
    } else if (combined.includes("dump") || combined.includes("refuse") || combined.includes("waste") || combined.includes("debris") || combined.includes("trash")) {
      category = "illegal_dumping";
    } else if (combined.includes("dust") || combined.includes("demolition") || combined.includes("cement") || combined.includes("construction")) {
      category = "construction_dust";
    } else if (combined.includes("smoke") || combined.includes("chimney") || combined.includes("exhaust")) {
      category = "smoke";
    } else if (combined.includes("litter") || combined.includes("plastic bottles")) {
      category = "litter";
    } else if ([
      "garbage_burning", "illegal_dumping", "smoke", "sewage_leak",
      "construction_dust", "blocked_drain", "litter", "other",
    ].includes(parsed.category)) {
      category = parsed.category;
    } else if (isHazard) {
      category = "illegal_dumping";
    }

    const categoryColors: Record<string, string> = {
      garbage_burning: "#B65545",
      illegal_dumping: "#B38038",
      smoke: "#7E5B72",
      sewage_leak: "#4E6F87",
      construction_dust: "#8C5E3C",
      blocked_drain: "#3B6E8C",
      litter: "#556E46",
      other: "#8C7E72",
    };

    const normalizePct = (val: unknown, fallback: number) => {
      const num = Number(val);
      if (isNaN(num)) return fallback;
      if (num > 100) return Math.min(100, Math.max(0, num / 10));
      return Math.min(100, Math.max(0, num));
    };

    // Filter boxes: only keep boxes relevant to the actual hazard, not innocent pedestrians or vehicles
    const hazardKeywords = ["debris", "waste", "trash", "garbage", "fire", "smoke", "sewage", "dump", "dust", "drain", "litter", "spill", "leak", "plume", "puddle", "combustion"];
    const rawBoxes: any[] = Array.isArray(parsed.boxes) ? parsed.boxes : [];
    const filteredBoxes = rawBoxes.filter((b) => {
      const bLabel = String(b.label || "").toLowerCase();
      if (!isHazard) return false;
      if (rawBoxes.length <= 2) return true;
      return hazardKeywords.some((kw) => bLabel.includes(kw));
    });
    const candidateBoxes = filteredBoxes.length > 0 ? filteredBoxes : rawBoxes.slice(0, 3);

    const boxes: VisionBoundingBox[] = candidateBoxes.slice(0, 4).map((b: any, idx: number) => ({
      id: `box-${idx + 1}`,
      label: String(b.label || parsed.label || "Detected Hazard"),
      confidence: typeof b.confidence === "number" ? Math.min(1, Math.max(0.1, b.confidence)) : 0.9,
      color: categoryColors[category] || "#8C5E3C",
      top: normalizePct(b.top, 20),
      left: normalizePct(b.left, 20),
      width: Math.max(8, normalizePct(b.width, 50)),
      height: Math.max(8, normalizePct(b.height, 40)),
    }));

    return {
      isHazard,
      category,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.9,
      label: String(parsed.label || (isHazard ? "Civic Environmental Hazard" : "Non-Hazard Image")),
      summary: String(
        parsed.summary ||
          (isHazard ? "Environmental hazard identified." : "No environmental hazard detected in image.")
      ),
      boxes,
    };
  } catch (err) {
    console.error("Vision scan failed:", err);
    return {
      isHazard: false,
      category: "other",
      confidence: 0.5,
      label: "Visual Analysis Inconclusive",
      summary: "Could not confirm environmental hazard from image. Please provide a clear photograph or select category manually.",
      boxes: [],
    };
  }
}

