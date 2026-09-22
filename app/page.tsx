"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Report, AQITrendPoint } from "@/lib/types";
import { AQIData, WeatherData } from "@/lib/services/openmeteo";
import { getDemoReports } from "@/lib/demo/seed";
import { fetchAQITrend } from "@/lib/services/openmeteo";
import { buildHotspotClusters } from "@/lib/services/clustering";
import { sortByPriority } from "@/lib/services/scoring";
import { categoryIcon } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/types";
import dynamic from "next/dynamic";
import IncidentCard from "@/components/incidents/IncidentCard";
import AQICard from "@/components/aqi/AQICard";
import AQITrend from "@/components/aqi/AQITrend";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), { ssr: false });

const DEFAULT_LAT = 18.52;
const DEFAULT_LNG = 73.856;

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [aqi, setAqi] = useState<AQIData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [trend, setTrend] = useState<AQITrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

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

  const clusters = buildHotspotClusters(reports);
  const priorityReports = sortByPriority(reports).slice(0, 6);
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const criticalCount = reports.filter((r) => r.severity === "critical" || r.severity === "high").length;

  const stats = [
    { label: "Active Incidents", value: reports.filter((r) => r.status !== "resolved").length },
    { label: "Resolved", value: resolvedCount },
    { label: "High Risk Flags", value: criticalCount },
    { label: "Hotspot Clusters", value: clusters.length },
  ];

  return (
    <div>
      {/* Hero section */}
      <div style={{ padding: "80px 32px 0", maxWidth: "var(--container-width)", margin: "0 auto" }}>
        <div className="animate-in" style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          gap: "48px", flexWrap: "wrap", marginBottom: "48px",
        }}>
          <div style={{ flex: "1 1 560px", minWidth: "300px" }}>
            <h1 style={{
              fontSize: "clamp(36px, 5vw, 56px)",
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
          <div style={{ flex: "0 1 360px", minWidth: "260px", paddingTop: "8px" }}>
            <p style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>
              Real-time municipal environmental intelligence for Pune. Report hazards, track air quality, and accelerate civic dispatch.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/report" className="btn btn-primary">
                Report an Issue
              </Link>
              <Link href="/command" className="btn btn-secondary">
                Command Centre
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Map hero image */}
      <div style={{ padding: "0 32px", maxWidth: "var(--container-width)", margin: "0 auto 64px" }}>
        <div className="card" style={{
          overflow: "hidden", borderRadius: "var(--radius-2xl)",
          animation: "fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards",
          opacity: 0,
        }}>
          <div style={{ position: "relative" }}>
            <div style={{ height: "480px" }}>
              <LeafletMap
                reports={reports} clusters={clusters}
                center={[DEFAULT_LAT, DEFAULT_LNG]} zoom={12}
                onReportClick={setSelectedReport} selectedId={selectedReport?.id} height="480px"
              />
            </div>
            {/* Legend overlay */}
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
                { label: "Critical", color: "var(--severity-critical)" },
                { label: "High", color: "var(--severity-high)" },
                { label: "Medium", color: "var(--severity-medium)" },
                { label: "Low", color: "var(--severity-low)" },
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
                {reports.length} incidents · {clusters.length} clusters
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: 0 }}>
        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px", marginBottom: "var(--section-spacing)",
        }}>
          {stats.map(({ label, value }, i) => (
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
            </div>
          ))}
        </div>

        {/* AQI + Sidebar */}
        <div style={{ marginBottom: "var(--section-spacing)" }}>
          <div className="label-small" style={{ marginBottom: "12px" }}>Air Quality Monitoring</div>
          <div style={{
            display: "grid", gridTemplateColumns: "380px 1fr",
            gap: "20px",
          }} className="main-grid">
            <AQICard aqi={aqi} weather={weather} loading={loading} />
            <AQITrend data={trend} loading={loading && trend.length === 0} />
          </div>
        </div>

        {/* Hazard distribution */}
        <div style={{ marginBottom: "var(--section-spacing)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <div className="label-small" style={{ marginBottom: "12px" }}>Hazard Categories</div>
              <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.025em" }}>
                Active environmental{" "}
                <br />
                <span className="muted-heading">risks by category</span>
              </h2>
            </div>
            <Link href="/impact" className="btn btn-secondary btn-sm">
              All analytics
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
            {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
              const count = reports.filter((r) => r.category === cat).length;
              if (count === 0) return null;
              const pct = Math.round((count / reports.length) * 100);
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

        {/* Priority incidents */}
        <div style={{ marginBottom: "var(--section-spacing)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <div className="label-small" style={{ marginBottom: "12px" }}>Priority Queue</div>
              <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.025em" }}>
                Top reported{" "}
                <span className="muted-heading">incidents</span>
              </h2>
            </div>
            <Link href="/command" className="btn btn-secondary btn-sm">
              View all
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
          borderRadius: "var(--radius-2xl)",
          padding: "56px 48px",
          marginBottom: "40px",
        }}>
          <div className="label-small" style={{ marginBottom: "12px" }}>How It Works</div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: "12px" }}>
            System architecture{" "}
            <span className="muted-heading">behind StreetPulse</span>
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", marginBottom: "40px", fontSize: "15px", lineHeight: 1.6 }}>
            Fusing citizen reports, atmospheric telemetry, and spatial clustering to deliver actionable municipal intelligence.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { title: "Multimodal Capture", desc: "Geo-tagged reports with photo evidence and multi-lingual input from citizens." },
              { title: "AI Assessment", desc: "Gemini-powered classification of environmental risks and municipal routing." },
              { title: "Atmospheric Data", desc: "Live Open-Meteo AQI, PM2.5, PM10, and NO\u2082 integration with 24h trends." },
              { title: "Cluster Intelligence", desc: "Spatial proximity grouping highlighting emerging municipal hotspots." },
            ].map(({ title, desc }) => (
              <div key={title} className="card" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>{title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
