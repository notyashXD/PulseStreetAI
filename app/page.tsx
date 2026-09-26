"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Report, AQITrendPoint } from "@/lib/types";
import { AQIData, WeatherData } from "@/lib/services/openmeteo";
import { getDemoReports } from "@/lib/demo/seed";
import { fetchAQITrend } from "@/lib/services/openmeteo";
import { buildHotspotClusters } from "@/lib/services/clustering";
import { sortByPriority } from "@/lib/services/scoring";
import { categoryIcon, severityColor, formatRelativeTime } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/types";
import dynamic from "next/dynamic";
import IncidentCard from "@/components/incidents/IncidentCard";
import AQICard from "@/components/aqi/AQICard";
import AQITrend from "@/components/aqi/AQITrend";
import { useAuth } from "@/lib/auth/AuthContext";
import ScrollVideoShowcase from "@/components/showcase/ScrollVideoShowcase";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), { ssr: false });

const DEFAULT_LAT = 18.52;
const DEFAULT_LNG = 73.856;

const PUNE_WARDS = [
  { id: "all", name: "All Municipal Wards", icon: "🏙️", lat: 18.5204, lng: 73.8567, zoom: 12 },
  { id: "hadapsar", name: "Hadapsar Industrial", icon: "🏭", lat: 18.5089, lng: 73.9260, zoom: 14 },
  { id: "kothrud", name: "Kothrud", icon: "🏘️", lat: 18.5074, lng: 73.8077, zoom: 14 },
  { id: "shivajinagar", name: "Shivajinagar Central", icon: "🏛️", lat: 18.5314, lng: 73.8446, zoom: 14 },
  { id: "aundh", name: "Aundh-Baner", icon: "🌳", lat: 18.5602, lng: 73.8031, zoom: 14 },
  { id: "viman", name: "Viman Nagar & Kharadi", icon: "✈️", lat: 18.5679, lng: 73.9143, zoom: 14 },
  { id: "hinjewadi", name: "Hinjewadi-Pimpri", icon: "💻", lat: 18.5913, lng: 73.7489, zoom: 13 },
  { id: "swargate", name: "Swargate-Katraj", icon: "🚌", lat: 18.4984, lng: 73.8582, zoom: 14 },
];

export default function HomePage() {
  const { currentUser, isAdmin, switchRole } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [aqi, setAqi] = useState<AQIData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [trend, setTrend] = useState<AQITrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeWard, setActiveWard] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simActive, setSimActive] = useState<"fire" | "wind" | "hotspot" | null>(null);

  useEffect(() => {
    const seedReports = getDemoReports();
    setReports(sortByPriority(seedReports));
    const loadTelemetry = async () => {
      try {
        const [aqiRes, weatherRes] = await Promise.all([
          fetch(`/api/aqi?lat=${DEFAULT_LAT}&lng=${DEFAULT_LNG}`),
          fetch(`/api/weather?lat=${DEFAULT_LAT}&lng=${DEFAULT_LNG}`),
        ]);
        if (aqiRes.ok) setAqi(await aqiRes.json());
        if (weatherRes.ok) setWeather(await weatherRes.json());
        const trendData = await fetchAQITrend(DEFAULT_LAT, DEFAULT_LNG);
        setTrend(trendData);
      } catch { }
      finally { setLoading(false); }
    };
    loadTelemetry();
  }, []);

  // Filter reports by selected ward
  const filteredReports = useMemo(() => {
    if (activeWard === "all") return reports;
    if (activeWard === "hadapsar") {
      return reports.filter((r) => {
        const w = (r.location.ward || "").toLowerCase();
        return w.includes("hadapsar") || w.includes("magarpatta") || w.includes("mundhwa");
      });
    }
    if (activeWard === "kothrud") {
      return reports.filter((r) => {
        const w = (r.location.ward || "").toLowerCase();
        return w.includes("kothrud") || w.includes("karve") || w.includes("bavdhan");
      });
    }
    if (activeWard === "shivajinagar") {
      return reports.filter((r) => {
        const w = (r.location.ward || "").toLowerCase();
        return w.includes("shivajinagar") || w.includes("deccan");
      });
    }
    if (activeWard === "aundh") {
      return reports.filter((r) => {
        const w = (r.location.ward || "").toLowerCase();
        return w.includes("aundh") || w.includes("baner") || w.includes("balewadi");
      });
    }
    if (activeWard === "viman") {
      return reports.filter((r) => {
        const w = (r.location.ward || "").toLowerCase();
        return w.includes("viman") || w.includes("kharadi");
      });
    }
    if (activeWard === "hinjewadi") {
      return reports.filter((r) => {
        const w = (r.location.ward || "").toLowerCase();
        return w.includes("hinjewadi") || w.includes("pimpri") || w.includes("wakad") || w.includes("bhosari");
      });
    }
    if (activeWard === "swargate") {
      return reports.filter((r) => {
        const w = (r.location.ward || "").toLowerCase();
        return w.includes("swargate") || w.includes("katraj") || w.includes("koregaon");
      });
    }
    return reports.filter((r) => (r.location.ward || "").toLowerCase().includes(activeWard));
  }, [reports, activeWard]);

  const selectedWardMeta = PUNE_WARDS.find((w) => w.id === activeWard) || PUNE_WARDS[0];
  const clusters = buildHotspotClusters(filteredReports);
  const priorityReports = sortByPriority(filteredReports).slice(0, 6);
  const resolvedCount = filteredReports.filter((r) => r.status === "resolved").length;
  const criticalCount = filteredReports.filter((r) => r.severity === "critical" || r.severity === "high").length;

  const handleSimulate = (type: "fire" | "wind" | "hotspot") => {
    setSimActive(type);
    if (type === "fire") {
      setAqi((prev) => prev ? { ...prev, aqi: Math.min(285, prev.aqi + 72), pm25: prev.pm25 + 68, category: "Hazardous" } : null);
      setToastMessage("🔥 Simulated Biomass Smoke Spike: PM2.5 +68 µg/m³ recorded in Hadapsar Industrial Zone.");
    } else if (type === "wind") {
      setWeather((prev) => prev ? { ...prev, windSpeed: 24.5 } : null);
      setToastMessage("💨 Wind Vector Shift: Downwind smoke plume redirected NE towards Residential Corridor.");
    } else if (type === "hotspot") {
      setToastMessage("🎯 4 Corroborated Reports Clustered within 300m in Kothrud — Auto-triaged to High Priority.");
    }
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleResetSim = () => {
    setSimActive(null);
    setAqi((prev) => prev ? { ...prev, aqi: 142, pm25: 48.2, category: "Moderate" } : null);
    setToastMessage("🔄 Environmental sensors reset to baseline live telemetry.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const spotlight = priorityReports[0] || reports[0];

  const stats = [
    { label: "Active Incidents", value: filteredReports.filter((r) => r.status !== "resolved").length, sub: "Under Municipal SLA" },
    { label: "Verified Cleanups", value: resolvedCount, sub: "Audited by AI Vision" },
    { label: "High Risk Flags", value: criticalCount, sub: "Immediate Response" },
    { label: "Hotspot Clusters", value: clusters.length, sub: "Corroborated Zones" },
  ];

  return (
    <div>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: "fixed", bottom: "32px", right: "32px",
          background: "var(--bg-card)", border: "1px solid var(--accent-border)",
          color: "var(--text-primary)", padding: "14px 22px",
          borderRadius: "var(--radius-xl)", fontWeight: 600, fontSize: "13px",
          boxShadow: "var(--shadow-xl)", zIndex: 1200, animation: "slide-up 0.3s ease-out",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Apple-style Scroll-Driven Video Showcase */}
      <ScrollVideoShowcase />

      {/* Hero section & Civic Command Hub */}
      <div id="civic-dashboard" style={{ padding: "72px clamp(20px, 3vw, 48px) 0", maxWidth: "var(--container-width)", width: "100%", margin: "0 auto" }}>
        <div className="animate-in" style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          gap: "48px", flexWrap: "wrap", marginBottom: "40px",
        }}>
          <div style={{ flex: "1 1 560px", minWidth: "300px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "4px 12px", background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)", borderRadius: "var(--radius-full)",
                fontSize: "11px", fontWeight: 700, color: "var(--accent)",
              }}>
                <span>🏛️ Pune Municipal Corporation (PMC)</span>
                <span>·</span>
                <span>Live Sensor Grid</span>
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "4px 12px",
                background: isAdmin ? "rgba(140, 94, 60, 0.09)" : "rgba(85, 110, 70, 0.1)",
                border: `1px solid ${isAdmin ? "var(--accent-border)" : "var(--pastel-sage-border)"}`,
                borderRadius: "var(--radius-full)",
                fontSize: "11px", fontWeight: 700,
                color: isAdmin ? "var(--accent)" : "var(--pastel-sage)",
              }}>
                <span>{currentUser.avatar}</span>
                <span>{isAdmin ? `Admin: ${currentUser.name}` : `Citizen: ${currentUser.name}`}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = isAdmin ? "user" : "admin";
                    switchRole(next);
                    setToastMessage(`Switched to ${next === "admin" ? "Municipal Admin" : "Citizen"} view`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    textDecoration: "underline",
                    color: "inherit",
                    cursor: "pointer",
                    padding: "0 2px",
                    marginLeft: "2px",
                  }}
                  title="Switch between Admin and Citizen persona"
                >
                  Switch
                </button>
              </div>
            </div>
            <h1 style={{
              fontSize: "clamp(38px, 5.2vw, 58px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              marginBottom: "0",
            }}>
              Cleaner cities.{" "}
              <br />
              <span className="muted-heading">
                Smarter response.{" "}
                <br />
                Better air quality.
              </span>
            </h1>
          </div>
          <div style={{ flex: "0 1 380px", minWidth: "260px", paddingTop: "8px" }}>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>
              Real-time civic environmental intelligence for Indian cities. Fusing multimodal citizen voice & vision reports with live atmospheric IoT telemetry.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/report" className="btn btn-primary btn-lg">
                📸 Report an Issue
              </Link>
              <Link href="/command" className="btn btn-secondary btn-lg">
                🚨 Command Center
              </Link>
            </div>
          </div>
        </div>

        {/* Live Simulator Toolbar Strip */}
        <div style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-primary)",
          borderRadius: "var(--radius-2xl)",
          padding: "14px 20px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>🎮</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>Interactive Scenario Simulator</div>
              <div className="label-small" style={{ fontSize: "9px" }}>Test live telemetry & plume dispersion engine</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleSimulate("fire")}
              style={{
                background: simActive === "fire" ? "var(--pastel-terracotta-bg)" : "var(--bg-surface)",
                borderColor: simActive === "fire" ? "var(--pastel-terracotta)" : "var(--border-primary)",
                color: simActive === "fire" ? "var(--pastel-terracotta)" : "var(--text-primary)",
              }}
            >
              🔥 Simulate Fire Spike (+68 PM2.5)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleSimulate("wind")}
              style={{
                background: simActive === "wind" ? "var(--pastel-slate-bg)" : "var(--bg-surface)",
                borderColor: simActive === "wind" ? "var(--pastel-slate)" : "var(--border-primary)",
                color: simActive === "wind" ? "var(--pastel-slate)" : "var(--text-primary)",
              }}
            >
              💨 Shift Wind Direction
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleSimulate("hotspot")}
              style={{
                background: simActive === "hotspot" ? "var(--pastel-amber-bg)" : "var(--bg-surface)",
                borderColor: simActive === "hotspot" ? "var(--pastel-amber)" : "var(--border-primary)",
                color: simActive === "hotspot" ? "var(--pastel-amber)" : "var(--text-primary)",
              }}
            >
              🎯 Cluster Corroboration
            </button>
            {simActive && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleResetSim}
                style={{ color: "var(--text-muted)" }}
              >
                Reset ↺
              </button>
            )}
          </div>
        </div>

        {/* Pune Ward Selector Capsule Strip */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "12px", marginBottom: "20px" }}>
          {PUNE_WARDS.map((w) => {
            const isSelected = activeWard === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setActiveWard(w.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  background: isSelected ? "var(--text-primary)" : "var(--bg-card)",
                  color: isSelected ? "#FAF7F2" : "var(--text-secondary)",
                  border: `1px solid ${isSelected ? "var(--text-primary)" : "var(--border-primary)"}`,
                  fontSize: "12px",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  boxShadow: isSelected ? "var(--shadow-sm)" : "none",
                  transition: "all 0.2s",
                }}
              >
                <span>{w.icon}</span>
                <span>{w.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Geospatial Hazard Map & Plume Layer */}
      <div style={{ padding: "0 clamp(20px, 3vw, 48px)", maxWidth: "var(--container-width)", width: "100%", margin: "0 auto 56px" }}>
        <div className="card" style={{
          overflow: "hidden", borderRadius: "var(--radius-3xl)",
          animation: "fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards",
          opacity: 0,
        }}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "540px" }}>
              <LeafletMap
                reports={filteredReports} clusters={clusters}
                center={[selectedWardMeta.lat, selectedWardMeta.lng]} zoom={selectedWardMeta.zoom}
                onReportClick={setSelectedReport} selectedId={selectedReport?.id} height="540px"
              />
            </div>

            {/* Severity Legend */}
            <div style={{
              position: "absolute", bottom: "16px", left: "16px",
              background: "rgba(250, 247, 242, 0.94)", backdropFilter: "blur(12px)",
              borderRadius: "var(--radius-lg)", padding: "12px 16px",
              border: "1px solid var(--border-primary)", zIndex: 500,
              fontSize: "11px", color: "var(--text-muted)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div className="label-small" style={{ marginBottom: "8px", fontSize: "10px" }}>Severity Triage</div>
              {[
                { label: "Critical Hazard", color: "var(--severity-critical)" },
                { label: "High Risk Plume", color: "var(--severity-high)" },
                { label: "Medium Priority", color: "var(--severity-medium)" },
                { label: "Low Severity", color: "var(--severity-low)" },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <span className="severity-dot" style={{ background: color }} />
                  <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Stats overlay */}
            <div style={{
              position: "absolute", bottom: "16px", right: "16px",
              background: "rgba(250, 247, 242, 0.94)", backdropFilter: "blur(12px)",
              borderRadius: "var(--radius-lg)", padding: "12px 16px",
              border: "1px solid var(--border-primary)", zIndex: 500,
              boxShadow: "var(--shadow-sm)",
            }}>
              <div className="mono" style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>
                {filteredReports.length} incidents · {clusters.length} spatial clusters in {selectedWardMeta.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: 0 }}>
        {/* KPI stat cards row */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px", marginBottom: "var(--section-spacing)",
        }}>
          {stats.map(({ label, value, sub }, i) => (
            <div
              key={label}
              className="stat-card"
              style={{
                opacity: 0,
                animation: `fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms forwards`,
              }}
            >
              <div className="label-small">{label}</div>
              <div className="stat-value">{value}</div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "2px" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* AQI + 24h Trend Grid */}
        <div style={{ marginBottom: "var(--section-spacing)" }}>
          <div className="label-small" style={{ marginBottom: "12px" }}>Atmospheric Telemetry & Trends</div>
          <div style={{
            display: "grid", gridTemplateColumns: "400px 1fr",
            gap: "20px",
          }} className="main-grid">
            <AQICard aqi={aqi} weather={weather} loading={loading} />
            <AQITrend data={trend} loading={loading && trend.length === 0} />
          </div>
        </div>

        {/* Featured Live Incident Spotlight Card */}
        {spotlight && (
          <div style={{ marginBottom: "var(--section-spacing)" }}>
            <div className="label-small" style={{ marginBottom: "12px" }}>Priority Incident Spotlight</div>
            <div className="card" style={{
              padding: "32px",
              borderLeft: `5px solid ${severityColor(spotlight.severity)}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}>
              <div style={{ flex: "1 1 480px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
                  <span className="live-indicator">ACTIVE DISPATCH REQUIRED</span>
                  <span className={`badge badge-${spotlight.severity}`}>{spotlight.severity}</span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "6px" }}>
                  {categoryIcon(spotlight.category)} {spotlight.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "14px" }}>
                  {spotlight.description}
                </p>
                <div className="mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  📍 {spotlight.location.ward} · Logged {formatRelativeTime(spotlight.createdAt)} · {spotlight.supportCount} endorsements
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}>
                <Link href={`/incidents/${spotlight.id}`} className="btn btn-primary" style={{ padding: "12px 24px" }}>
                  Inspect Full Case Record →
                </Link>
                <Link href="/command" className="btn btn-secondary" style={{ padding: "10px 20px" }}>
                  Dispatch Municipal Crew
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Hazard Categories distribution */}
        <div style={{ marginBottom: "var(--section-spacing)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <div className="label-small" style={{ marginBottom: "8px" }}>Hazard Breakdown</div>
              <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.025em" }}>
                Active environmental{" "}
                <br />
                <span className="muted-heading">risks by category</span>
              </h2>
            </div>
            <Link href="/impact" className="btn btn-secondary btn-sm">
              All analytics →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
            {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
              const count = filteredReports.filter((r) => r.category === cat).length;
              if (count === 0) return null;
              const pct = Math.round((count / (filteredReports.length || 1)) * 100);
              return (
                <div key={cat} className="card" style={{ padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "20px" }}>{categoryIcon(cat)}</span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
                      <div className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>{count} reports</div>
                    </div>
                    <div className="mono" style={{ marginLeft: "auto", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {pct}%
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: "var(--accent)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority incidents list */}
        <div style={{ marginBottom: "var(--section-spacing)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <div className="label-small" style={{ marginBottom: "8px" }}>Priority Queue</div>
              <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.025em" }}>
                Top reported{" "}
                <span className="muted-heading">incidents</span>
              </h2>
            </div>
            <Link href="/command" className="btn btn-secondary btn-sm">
              Open Command Triage →
            </Link>
          </div>

          <div className="grid-auto">
            {priorityReports.map((report, i) => (
              <div key={report.id} style={{
                opacity: 0,
                animation: `fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms forwards`,
              }}>
                <IncidentCard report={report} />
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div style={{
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius-3xl)",
          padding: "56px 48px",
          marginBottom: "40px",
          border: "1px solid var(--border-primary)",
        }}>
          <div className="label-small" style={{ marginBottom: "12px" }}>System Architecture</div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: "12px" }}>
            Environmental Intelligence Engine{" "}
            <span className="muted-heading">behind StreetPulse</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "640px", marginBottom: "40px", fontSize: "15px", lineHeight: 1.6 }}>
            Fusing citizen multimodal inputs, atmospheric IoT sensors, spatial plume modeling, and rapid municipal field routing.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { title: "Multimodal Intake", icon: "🎙️", desc: "Geo-tagged photo evidence and trilingual voice notes in English, Hindi, and Marathi." },
              { title: "Gemini 2.0 AI Triage", icon: "🤖", desc: "Automated vision hazard classification, confidence scoring, and department assignment." },
              { title: "Atmospheric Telemetry", icon: "📡", desc: "Live Open-Meteo AQI, PM2.5, PM10, NO₂, and live wind vector dispersion modeling." },
              { title: "Citizen Karma Economy", icon: "🏅", desc: "Community engagement incentives awarding Green Credits for verified municipal reporting." },
            ].map(({ title, icon, desc }) => (
              <div key={title} className="card" style={{ padding: "24px" }}>
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>{icon}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>{title}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
