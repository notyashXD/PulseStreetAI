import { Report, IssueCategory, HotspotCluster, Severity } from "@/lib/types";

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6_371_000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function obscureLocation(lat: number, lng: number): { lat: number; lng: number } {
  const offsetDeg = 0.003;
  const angle = Math.random() * 2 * Math.PI;
  const magnitude = (0.5 + Math.random() * 0.5) * offsetDeg;
  return {
    lat: lat + magnitude * Math.cos(angle),
    lng: lng + magnitude * Math.sin(angle),
  };
}

const CLUSTER_RADIUS_M = 500;
const CLUSTER_WINDOW_MS = 72 * 60 * 60 * 1000;

export function buildHotspotClusters(reports: Report[]): HotspotCluster[] {
  const now = Date.now();
  const recent = reports.filter(
    (r) => r.status !== "resolved" && now - r.createdAt < CLUSTER_WINDOW_MS
  );

  const used = new Set<string>();
  const clusters: HotspotCluster[] = [];

  for (const seed of recent) {
    if (used.has(seed.id)) continue;

    const peers = recent.filter(
      (r) =>
        !used.has(r.id) &&
        r.category === seed.category &&
        haversineDistance(seed.location.lat, seed.location.lng, r.location.lat, r.location.lng) <=
          CLUSTER_RADIUS_M
    );

    if (peers.length < 2) continue;

    peers.forEach((r) => used.add(r.id));

    const centroidLat = peers.reduce((s, r) => s + r.location.lat, 0) / peers.length;
    const centroidLng = peers.reduce((s, r) => s + r.location.lng, 0) / peers.length;

    const maxRadius = Math.max(
      ...peers.map((r) =>
        haversineDistance(centroidLat, centroidLng, r.location.lat, r.location.lng)
      )
    );

    const severityOrder: Severity[] = ["critical", "high", "medium", "low"];
    const maxSeverity =
      severityOrder.find((s) => peers.some((r) => r.severity === s)) ?? "low";

    clusters.push({
      id: `cluster_${seed.id}`,
      category: seed.category as IssueCategory,
      reportIds: peers.map((r) => r.id),
      centroidLat,
      centroidLng,
      radius: Math.max(maxRadius, 50),
      severity: maxSeverity,
      reportCount: peers.length,
      isActive: true,
      createdAt: Math.min(...peers.map((r) => r.createdAt)),
      updatedAt: now,
      isDemo: peers.some((r) => r.isDemo),
    });
  }

  return clusters;
}

export const clusterReports = buildHotspotClusters;

export function findNearbyReports(
  report: Report,
  allReports: Report[],
  radiusM = 500,
  windowMs = 48 * 60 * 60 * 1000
): Report[] {
  const now = Date.now();
  return allReports.filter(
    (r) =>
      r.id !== report.id &&
      r.category === report.category &&
      now - r.createdAt < windowMs &&
      haversineDistance(report.location.lat, report.location.lng, r.location.lat, r.location.lng) <=
        radiusM
  );
}
