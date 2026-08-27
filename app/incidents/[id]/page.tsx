"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Report } from "@/lib/types";
import { CATEGORY_LABELS, STATUS_LABELS, DEPARTMENT_LABELS } from "@/lib/types";
import {
  categoryIcon,
  formatRelativeTime,
  formatDateTime,
  severityColor,
} from "@/lib/utils";
import { getDemoReports } from "@/lib/demo/seed";
import { scoreLabelColor } from "@/lib/services/scoring";
import dynamic from "next/dynamic";
import ResolutionSlider from "@/components/incidents/ResolutionSlider";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), { ssr: false });

export default function IncidentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const all = getDemoReports();
    const found = all.find((r) => r.id === id);
    if (found) {
      setReport(found);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 32px" }}>
        <div className="shimmer" style={{ height: "400px", borderRadius: "var(--radius-2xl)" }} />
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Incident Not Found</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>The requested incident ID does not exist or has been archived.</p>
        <Link href="/" className="btn btn-primary">Return to Overview</Link>
      </div>
    );
  }

  const color = severityColor(report.severity);
  const score = report.evidenceScore;
  const isResolved = report.status === "resolved";

  return (
    <div className="page-container" style={{ maxWidth: "1000px" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: "13px", color: "var(--text-dim)", marginBottom: "24px", display: "flex", gap: "8px", alignItems: "center" }}>
        <Link href="/" style={{ color: "var(--text-muted)" }}>Overview</Link>
        <span>→</span>
        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{report.title}</span>
      </div>

      {/* Header */}
      <div
        className="card animate-in"
        style={{
          padding: "32px",
          marginBottom: "24px",
          borderLeft: `4px solid ${color}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <span style={{ fontSize: "36px", flexShrink: 0 }}>{categoryIcon(report.category)}</span>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "6px", lineHeight: 1.2 }}>
                {report.title}
              </h1>
              <p className="mono" style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                {report.location.ward ?? "Pune Central"}
                {report.location.landmark ? ` · ${report.location.landmark}` : ""}
                {" · "}
                Logged {formatDateTime(report.createdAt)}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end", flexShrink: 0 }}>
            <span className={`badge badge-${report.severity}`}>{report.severity}</span>
            <span className={`badge badge-${report.status}`}>{STATUS_LABELS[report.status]}</span>
          </div>
        </div>

        {report.description && (
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>
            {report.description}
          </p>
        )}

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            type="button"
            className={`btn btn-sm ${supported ? "btn-accent" : "btn-secondary"}`}
            onClick={() => setSupported(!supported)}
          >
            {supported ? "✓ Endorsed (+5 Karma)" : "+ Endorse Issue (+5 Karma)"}
          </button>
          <span className="mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {report.supportCount + (supported ? 1 : 0)} citizen endorsements
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-dim)", marginLeft: "auto" }}>
            {CATEGORY_LABELS[report.category]}
          </span>
        </div>
      </div>

      {/* Interactive Resolution Comparison Slider */}
      <div style={{ marginBottom: "24px" }}>
        <ResolutionSlider
          category={report.category}
          isResolved={isResolved}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }} className="main-grid">
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Analysis */}
          {report.aiAnalysis && (
            <div className="card animate-in" style={{ padding: "28px" }}>
              <div className="label-small" style={{ marginBottom: "16px" }}>Assessment Summary</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "14px", border: "1px solid var(--border-primary)" }}>
                  <div className="label-small" style={{ marginBottom: "6px", fontSize: "9px" }}>Calculated Severity</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color }}>
                    {report.aiAnalysis.severity.toUpperCase()}
                  </div>
                </div>
                <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "14px", border: "1px solid var(--border-primary)" }}>
                  <div className="label-small" style={{ marginBottom: "6px", fontSize: "9px" }}>Designated Department</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {DEPARTMENT_LABELS[report.aiAnalysis.suggestedDepartment]}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <div className="label-small" style={{ fontSize: "9px", marginBottom: "6px" }}>Triage Assessment</div>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{report.aiAnalysis.reason}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "var(--coral-bg)", borderRadius: "var(--radius-md)", padding: "14px", border: "1px solid rgba(212,100,90,0.15)" }}>
                  <div className="label-small" style={{ color: "var(--coral)", marginBottom: "4px", fontSize: "9px" }}>Health Risk Profile</div>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>{report.aiAnalysis.healthRisk}</p>
                </div>
                <div style={{ background: "var(--accent-bg)", borderRadius: "var(--radius-md)", padding: "14px", border: "1px solid var(--accent-border)" }}>
                  <div className="label-small" style={{ color: "var(--accent)", marginBottom: "4px", fontSize: "9px" }}>Environmental Risk</div>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>{report.aiAnalysis.environmentalRisk}</p>
                </div>
              </div>
            </div>
          )}

          {/* Evidence Score */}
          {score && (
            <div className="card animate-in" style={{ padding: "28px" }}>
              <div className="label-small" style={{ marginBottom: "16px" }}>Evidence Fusion Score</div>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: `conic-gradient(${scoreLabelColor(score.label)} ${score.total * 3.6}deg, var(--bg-muted) 0deg)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "50%",
                      background: "var(--bg-card)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: 800,
                      color: scoreLabelColor(score.label),
                    }}
                  >
                    {score.total}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "4px", color: scoreLabelColor(score.label) }}>
                    {score.label.replace("_", " ").toUpperCase()} CONFIDENCE
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    Composite evidence score across 5 telemetry factors
                  </div>
                </div>
              </div>

              {/* Factor bars */}
              {[
                { label: "Classification Confidence", value: score.aiConfidence, max: 40, color: "var(--accent)" },
                { label: "Spatio-Temporal Proximity", value: score.nearbyCorroboration, max: 25, color: "var(--sky)" },
                { label: "Atmospheric Anomaly", value: score.environmentalAnomaly, max: 20, color: "var(--amber)" },
                { label: "Recency Decay Index", value: score.recency, max: 10, color: "var(--text-primary)" },
                { label: "Citizen Endorsements", value: score.citizenCorroboration, max: 5, color: "var(--coral)" },
              ].map(({ label, value, max, color: c }) => (
                <div key={label} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                    <span className="mono" style={{ color: c, fontWeight: 600 }}>{value}/{max}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(value / max) * 100}%`, background: c }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          <div className="card animate-in" style={{ padding: "28px" }}>
            <div className="label-small" style={{ marginBottom: "16px" }}>Incident Timeline</div>
            <div style={{ position: "relative" }}>
              {report.statusHistory.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "14px",
                    marginBottom: i < report.statusHistory.length - 1 ? "18px" : "0",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: i === report.statusHistory.length - 1 ? "var(--text-primary)" : "var(--accent)",
                        flexShrink: 0,
                        marginTop: "4px",
                      }}
                    />
                    {i < report.statusHistory.length - 1 && (
                      <div style={{ width: "1px", flex: 1, background: "var(--border-primary)", marginTop: "4px" }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span className={`badge badge-${entry.status}`} style={{ fontSize: "10px" }}>
                        {STATUS_LABELS[entry.status]}
                      </span>
                      <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                        {formatRelativeTime(entry.timestamp)}
                      </span>
                    </div>
                    {entry.note && (
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{entry.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental snapshot */}
          {report.environmentalContext && (
            <div className="card animate-in" style={{ padding: "28px" }}>
              <div className="label-small" style={{ marginBottom: "16px" }}>Environmental Telemetry (At Intake)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { label: "AQI", value: report.environmentalContext.aqi, unit: "" },
                  { label: "PM2.5", value: report.environmentalContext.pm25?.toFixed(1), unit: "µg/m³" },
                  { label: "PM10", value: report.environmentalContext.pm10?.toFixed(1), unit: "µg/m³" },
                  { label: "Temperature", value: report.environmentalContext.temperature, unit: "°C" },
                  { label: "Wind Speed", value: report.environmentalContext.windSpeed?.toFixed(1), unit: "km/h" },
                  { label: "Humidity", value: report.environmentalContext.humidity, unit: "%" },
                ].map(({ label, value, unit }) => (
                  <div key={label} style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "12px", border: "1px solid var(--border-primary)" }}>
                    <div className="label-small" style={{ fontSize: "9px", marginBottom: "2px" }}>{label}</div>
                    <div className="mono" style={{ fontSize: "16px", fontWeight: 700 }}>{value ?? "—"}<span style={{ fontSize: "11px", color: "var(--text-dim)", marginLeft: "2px" }}>{unit}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Map + details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Map */}
          <div className="card animate-in" style={{ overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-primary)" }}>
              <div className="label-small">Location Map</div>
            </div>
            <div style={{ height: "240px" }}>
              <LeafletMap
                reports={[report]}
                center={[report.location.lat, report.location.lng]}
                zoom={15}
                interactive={false}
                height="240px"
              />
            </div>
            <div className="mono" style={{ padding: "14px 20px", borderTop: "1px solid var(--border-primary)", fontSize: "12px", color: "var(--text-dim)" }}>
              {report.location.lat.toFixed(5)}, {report.location.lng.toFixed(5)}
              {report.location.ward && ` · ${report.location.ward}`}
            </div>
          </div>

          {/* Resolution Note */}
          {report.status === "resolved" && report.resolutionNote && (
            <div
              className="card animate-in"
              style={{
                padding: "24px",
                background: "var(--accent-bg)",
                borderColor: "var(--accent-border)",
              }}
            >
              <div className="label-small" style={{ color: "var(--accent)", marginBottom: "8px" }}>Resolution Confirmed</div>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {report.resolutionNote}
              </p>
              {report.resolvedAt && (
                <p className="mono" style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "8px" }}>
                  {formatDateTime(typeof report.resolvedAt === "number" ? report.resolvedAt : parseInt(report.resolvedAt, 10))}
                </p>
              )}
            </div>
          )}

          {/* Details */}
          <div className="card animate-in" style={{ padding: "24px" }}>
            <div className="label-small" style={{ marginBottom: "16px" }}>Case Metadata</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              {[
                { label: "Category", value: CATEGORY_LABELS[report.category] },
                { label: "Jurisdiction", value: DEPARTMENT_LABELS[report.department] },
                { label: "Intake Timestamp", value: formatDateTime(report.createdAt) },
                { label: "Last State Update", value: formatRelativeTime(report.updatedAt) },
                { label: "Reporter Privacy", value: report.reporterAnonymous ? "Anonymized" : "Registered User" },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-muted)" }}>{label}</span>
                  <span className="mono" style={{ color: "var(--text-primary)", fontWeight: 500, textAlign: "right", maxWidth: "160px", fontSize: "12px" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link href="/command" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
              Open in Command Centre
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
              ← Return to Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
