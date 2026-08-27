import { Report, ScoreBreakdown } from "@/lib/types";

export function computeEvidenceScore(
  report: Partial<Report>,
  nearbyCount: number = 0,
  aqiAnomalyScore: number = 0
): ScoreBreakdown {
  const rawConf = report.aiAnalysis?.confidence ?? 0;
  const aiConfidence = Math.round(rawConf * 40);

  const nearbyCorroboration = Math.min(25, nearbyCount * 5);
  const environmentalAnomaly = Math.min(20, Math.round(aqiAnomalyScore));

  const now = Date.now();
  const ageHours = (now - (report.createdAt ?? now)) / 3_600_000;
  const recency = Math.round(Math.max(0, 10 * Math.exp(-ageHours / 48)));

  const citizenCorroboration = Math.min(5, Math.floor((report.supportCount ?? 0) / 2));

  const total = Math.min(
    100,
    aiConfidence + nearbyCorroboration + environmentalAnomaly + recency + citizenCorroboration
  );

  let label: ScoreBreakdown["label"] = "low";
  if (total >= 75) label = "very_high";
  else if (total >= 55) label = "high";
  else if (total >= 35) label = "moderate";

  return {
    aiConfidence,
    nearbyCorroboration,
    environmentalAnomaly,
    recency,
    citizenCorroboration,
    total,
    label,
  };
}

export function sortByPriority(reports: Report[]): Report[] {
  const severityWeight: Record<string, number> = {
    critical: 40,
    high: 25,
    medium: 12,
    low: 4,
  };
  return [...reports].sort((a, b) => {
    const scoreA =
      (a.evidenceScore?.total ?? 0) + (severityWeight[a.severity] ?? 0);
    const scoreB =
      (b.evidenceScore?.total ?? 0) + (severityWeight[b.severity] ?? 0);
    return scoreB - scoreA;
  });
}

export function scoreLabelColor(label: ScoreBreakdown["label"]): string {
  return {
    low: "#6b7280",
    moderate: "#f59e0b",
    high: "#ef4444",
    very_high: "#7c3aed",
  }[label];
}

export function scoreToPercent(score: number): number {
  return Math.min(100, Math.max(0, score));
}
