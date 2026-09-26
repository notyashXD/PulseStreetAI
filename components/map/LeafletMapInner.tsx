"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Circle, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Report, HotspotCluster } from "@/lib/types";
import { severityColor, categoryIcon, formatRelativeTime, truncate } from "@/lib/utils";
import Link from "next/link";

function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const prevRef = useRef<{ lat: number; lng: number; zoom: number }>({
    lat: center[0],
    lng: center[1],
    zoom,
  });

  useEffect(() => {
    const dLat = Math.abs(prevRef.current.lat - center[0]);
    const dLng = Math.abs(prevRef.current.lng - center[1]);
    const dZoom = Math.abs(prevRef.current.zoom - zoom);

    if (dLat > 0.0005 || dLng > 0.0005 || dZoom > 0.1) {
      prevRef.current = { lat: center[0], lng: center[1], zoom };
      map.flyTo(center, zoom, { duration: 0.8 });
    }
  }, [center, zoom, map]);

  return null;
}

interface Props {
  reports?: Report[];
  clusters?: HotspotCluster[];
  center?: [number, number];
  zoom?: number;
  onReportClick?: (report: Report) => void;
  height?: string;
  interactive?: boolean;
  selectedId?: string;
}

const DEFAULT_CENTER: [number, number] = [18.52, 73.856];
const DEFAULT_ZOOM = 12;

// Sample Pune Ward Polygon Geometries
const PUNE_WARDS = [
  {
    name: "Aundh-Baner Ward",
    aqi: 158,
    color: "#D4A843",
    coords: [
      [18.555, 73.785],
      [18.575, 73.815],
      [18.555, 73.835],
      [18.535, 73.805],
    ] as [number, number][],
  },
  {
    name: "Shivajinagar Central",
    aqi: 182,
    color: "#D4645A",
    coords: [
      [18.535, 73.835],
      [18.545, 73.865],
      [18.515, 73.865],
      [18.510, 73.835],
    ] as [number, number][],
  },
  {
    name: "Hadapsar Industrial Zone",
    aqi: 215,
    color: "#7B61A8",
    coords: [
      [18.485, 73.895],
      [18.525, 73.895],
      [18.525, 73.945],
      [18.485, 73.945],
    ] as [number, number][],
  },
  {
    name: "Kothrud-Bavdhan Ward",
    aqi: 94,
    color: "#3D5A27",
    coords: [
      [18.515, 73.785],
      [18.515, 73.825],
      [18.485, 73.825],
      [18.485, 73.785],
    ] as [number, number][],
  },
  {
    name: "Viman Nagar & Kharadi Hub",
    aqi: 164,
    color: "#B38038",
    coords: [
      [18.550, 73.895],
      [18.580, 73.895],
      [18.580, 73.955],
      [18.540, 73.955],
    ] as [number, number][],
  },
  {
    name: "Hinjewadi & Pimpri MIDC",
    aqi: 220,
    color: "#B65545",
    coords: [
      [18.570, 73.715],
      [18.615, 73.715],
      [18.615, 73.775],
      [18.570, 73.775],
    ] as [number, number][],
  },
  {
    name: "Swargate & Katraj Corridor",
    aqi: 148,
    color: "#D4A843",
    coords: [
      [18.455, 73.845],
      [18.505, 73.845],
      [18.505, 73.875],
      [18.455, 73.875],
    ] as [number, number][],
  },
];

// Helper to compute a wind dispersion cone polygon given origin and wind vector
function calculatePlumeCone(lat: number, lng: number, windBearingDeg: number = 65, lengthKm: number = 1.2): [number, number][] {
  const earthRadiusKm = 6371;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const deg = (r: number) => (r * 180) / Math.PI;

  const destPoint = (origLat: number, origLng: number, brng: number, dist: number) => {
    const lat1 = rad(origLat);
    const lon1 = rad(origLng);
    const rBrng = rad(brng);
    const dR = dist / earthRadiusKm;

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dR) + Math.cos(lat1) * Math.sin(dR) * Math.cos(rBrng));
    const lon2 = lon1 + Math.atan2(Math.sin(rBrng) * Math.sin(dR) * Math.cos(lat1), Math.cos(dR) - Math.sin(lat1) * Math.sin(lat2));

    return [deg(lat2), deg(lon2)] as [number, number];
  };

  const p1: [number, number] = [lat, lng];
  const p2 = destPoint(lat, lng, windBearingDeg - 25, lengthKm);
  const p3 = destPoint(lat, lng, windBearingDeg, lengthKm * 1.3);
  const p4 = destPoint(lat, lng, windBearingDeg + 25, lengthKm);

  return [p1, p2, p3, p4];
}

export default function LeafletMapInner({
  reports = [],
  clusters = [],
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onReportClick,
  height = "100%",
  interactive = true,
  selectedId,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    incidents: true,
    clusters: true,
    plumes: true,
    wards: false,
  });
  const [timeFilter, setTimeFilter] = useState<"24h" | "48h" | "all">("all");
  const [windInfo] = useState({ speed: 13.4, direction: 68, label: "ENE (68°)" });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter reports based on time scrubber (memoized)
  const displayedReports = useMemo(() => {
    const now = Date.now();
    return reports.filter((r) => {
      if (timeFilter === "24h") return now - r.createdAt <= 86_400_000;
      if (timeFilter === "48h") return now - r.createdAt <= 172_800_000;
      return true;
    });
  }, [reports, timeFilter]);

  // Critical burning/smoke reports generate dispersion plumes (memoized)
  const plumeSources = useMemo(() => {
    return displayedReports.filter(
      (r) => (r.category === "garbage_burning" || r.category === "smoke") && (r.severity === "high" || r.severity === "critical")
    );
  }, [displayedReports]);

  if (!mounted) {
    return (
      <div style={{ width: "100%", height, background: "var(--bg-elevated)", minHeight: "300px" }} />
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: "100%", height, minHeight: "300px" }}
        zoomControl={interactive}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
          opacity={0.88}
        />
        <MapRecenter center={center} zoom={zoom} />

        {/* Layer 1: Ward Air Quality Chloropleth Polygons */}
        {activeLayers.wards &&
          PUNE_WARDS.map((w) => (
            <Polygon
              key={w.name}
              positions={w.coords}
              pathOptions={{
                color: w.color,
                fillColor: w.color,
                fillOpacity: 0.15,
                weight: 2,
                dashArray: "3 3",
              }}
            >
              <Popup>
                <div style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px" }}>{w.name}</div>
                  <div className="mono" style={{ fontSize: "12px", color: w.color, fontWeight: 700, marginTop: "2px" }}>
                    Average AQI {w.aqi}
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* Layer 2: Smoke & Dust Atmospheric Dispersion Plumes */}
        {activeLayers.plumes &&
          plumeSources.map((r) => {
            const coneCoords = calculatePlumeCone(r.location.lat, r.location.lng, windInfo.direction, 1.4);
            return (
              <Polygon
                key={`plume-${r.id}`}
                positions={coneCoords}
                pathOptions={{
                  color: "#D4645A",
                  fillColor: "#D4645A",
                  fillOpacity: 0.22,
                  weight: 1,
                  dashArray: "4 2",
                }}
              >
                <Popup>
                  <div style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)", minWidth: "180px" }}>
                    <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--coral)" }}>
                      💨 Dispersion Plume Model
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Wind {windInfo.speed} km/h toward {windInfo.label}. Particulate downwind exposure ~1.4 km radius.
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* Layer 3: Hotspot Clusters */}
        {activeLayers.clusters &&
          clusters.map((cluster) => (
            <Circle
              key={cluster.id}
              center={[cluster.centroidLat, cluster.centroidLng]}
              radius={cluster.radius}
              pathOptions={{
                color: severityColor(cluster.severity),
                fillColor: severityColor(cluster.severity),
                fillOpacity: 0.12,
                weight: 1.5,
                opacity: 0.7,
                dashArray: "4 4",
              }}
            >
              <Popup>
                <div style={{ color: "var(--text-primary)", minWidth: "180px", fontFamily: "var(--font-sans)" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>
                    🎯 Hotspot: {cluster.category.replace("_", " ")}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {cluster.reportCount} reports in 500m proximity cluster
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Layer 4: Incident Markers */}
        {activeLayers.incidents &&
          displayedReports.map((report) => {
            const color = severityColor(report.severity);
            const isSelected = report.id === selectedId;
            return (
              <CircleMarker
                key={report.id}
                center={[report.location.lat, report.location.lng]}
                radius={isSelected ? 12 : report.severity === "critical" ? 10 : 8}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.95 : 0.8,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => onReportClick?.(report),
                }}
              >
                <Popup>
                  <div style={{ color: "var(--text-primary)", minWidth: "200px", fontFamily: "var(--font-sans)" }}>
                    <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>
                      {categoryIcon(report.category)} {truncate(report.title, 50)}
                    </div>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                        borderRadius: "100px",
                        fontSize: "11px",
                        color,
                        marginBottom: "6px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {report.severity}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px" }}>
                      {formatRelativeTime(report.createdAt)} · {report.location.ward ?? "Unknown ward"}
                    </div>
                    <Link
                      href={`/incidents/${report.id}`}
                      style={{
                        display: "block",
                        padding: "7px 12px",
                        background: "var(--text-primary)",
                        color: "white",
                        borderRadius: "var(--radius-full)",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      View Details →
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {/* Layer Control Panel Floating Widget */}
      {interactive && (
        <div
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 500,
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(16px)",
            borderRadius: "var(--radius-xl)",
            padding: "12px 16px",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div className="label-small" style={{ fontSize: "9px" }}>Geospatial Layers</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { key: "incidents" as const, label: "📍 Incident Markers" },
              { key: "clusters" as const, label: "🎯 Hotspot Clusters" },
              { key: "plumes" as const, label: "💨 Smoke Dispersion Plumes" },
              { key: "wards" as const, label: "🏙️ Ward Heat Boundaries" },
            ].map((layer) => (
              <label
                key={layer.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: activeLayers[layer.key] ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                <input
                  type="checkbox"
                  checked={activeLayers[layer.key]}
                  onChange={(e) => setActiveLayers((prev) => ({ ...prev, [layer.key]: e.target.checked }))}
                  style={{ accentColor: "var(--accent)" }}
                />
                {layer.label}
              </label>
            ))}
          </div>

          {/* Live Wind Direction Indicator */}
          <div
            style={{
              marginTop: "4px",
              paddingTop: "8px",
              borderTop: "1px solid var(--border-primary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotate(${windInfo.direction}deg)`,
                fontSize: "10px",
              }}
            >
              ↑
            </div>
            <div className="mono" style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
              Wind: {windInfo.speed} km/h {windInfo.label}
            </div>
          </div>
        </div>
      )}

      {/* Time-Scrubber Control Widget (Bottom Center) */}
      {interactive && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 500,
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(16px)",
            borderRadius: "var(--radius-full)",
            padding: "4px 8px",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            gap: "4px",
          }}
        >
          {[
            { id: "24h" as const, label: "Last 24h" },
            { id: "48h" as const, label: "Last 48h" },
            { id: "all" as const, label: "All Incidents" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeFilter(t.id)}
              style={{
                padding: "4px 12px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: "pointer",
                background: timeFilter === t.id ? "var(--text-primary)" : "transparent",
                color: timeFilter === t.id ? "white" : "var(--text-muted)",
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
