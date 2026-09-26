"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Report, IssueCategory, Severity, ReportStatus } from "@/lib/types";
import { CATEGORY_LABELS, STATUS_LABELS, DEPARTMENT_LABELS } from "@/lib/types";
import { getDemoReports } from "@/lib/demo/seed";
import { sortByPriority } from "@/lib/services/scoring";
import { clusterReports } from "@/lib/services/clustering";
import { categoryIcon, formatRelativeTime, severityColor, truncate } from "@/lib/utils";
import dynamic from "next/dynamic";
import DispatchTicker from "@/components/command/DispatchTicker";
import BroadcastModal from "@/components/command/BroadcastModal";
import SlaCountdownBadge from "@/components/command/SlaCountdownBadge";
import { useAuth } from "@/lib/auth/AuthContext";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), { ssr: false });

type FilterState = {
  category: IssueCategory | "all";
  severity: Severity | "all";
  status: ReportStatus | "all";
  department: string;
};

const DEFAULT_COMMAND_CENTER: [number, number] = [18.52, 73.856];

const DISPATCH_CREWS = [
  { id: "crew-1", name: "PMC Rapid Waste & Burn Response Unit #2", eta: "12 mins", status: "Available", vehicle: "Heavy Mist Sprayer + Tipper" },
  { id: "crew-2", name: "Kothrud-Karve Rd Environmental Patrol", eta: "18 mins", status: "Available", vehicle: "Mobile Sensor + Water Tanker" },
  { id: "crew-3", name: "Hadapsar Industrial Compliance Squad", eta: "25 mins", status: "En Route", vehicle: "Inspection Van" },
  { id: "crew-4", name: "Smart City Drainage & Sanitation Force", eta: "15 mins", status: "Available", vehicle: "Suction Jetting Unit" },
];

export default function CommandPage() {
  const { isAdmin, isUser, switchRole } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [reportsList, setReportsList] = useState<Report[]>(() => getDemoReports());

  useEffect(() => {
    setMounted(true);
  }, []);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    severity: "all",
    status: "all",
    department: "all",
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [dispatchModalReport, setDispatchModalReport] = useState<Report | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<string>(DISPATCH_CREWS[0].id);

  const filtered = useMemo(() => {
    let r = reportsList;
    if (filters.category !== "all") r = r.filter((x) => x.category === filters.category);
    if (filters.severity !== "all") r = r.filter((x) => x.severity === filters.severity);
    if (filters.status !== "all") r = r.filter((x) => x.status === filters.status);
    if (filters.department !== "all") r = r.filter((x) => x.department === filters.department);
    return sortByPriority(r);
  }, [reportsList, filters]);

  const clusters = useMemo(() => clusterReports(reportsList), [reportsList]);

  const mapCenter = useMemo<[number, number]>(() => {
    if (selectedReport) {
      return [selectedReport.location.lat, selectedReport.location.lng];
    }
    return DEFAULT_COMMAND_CENTER;
  }, [selectedReport]);

  const openCount = useMemo(() => reportsList.filter((r) => !["resolved", "rejected"].includes(r.status)).length, [reportsList]);
  const criticalCount = useMemo(() => reportsList.filter((r) => r.severity === "critical").length, [reportsList]);
  const resolvedToday = useMemo(() => reportsList.filter((r) => r.status === "resolved" && Date.now() - r.updatedAt < 86_400_000).length, [reportsList]);

  const handleConfirmDispatch = (crewName: string) => {
    if (!dispatchModalReport) return;
    const reportId = dispatchModalReport.id;
    setReportsList((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: "assigned",
              assignedTo: crewName,
              updatedAt: Date.now(),
              statusHistory: [
                ...r.statusHistory,
                {
                  status: "assigned",
                  timestamp: Date.now(),
                  note: `Dispatched to ${crewName}. Live telemetry stream connected.`,
                },
              ],
            }
          : r
      )
    );
    setToastMessage(`Incident #${reportId} dispatched to ${crewName}`);
    setDispatchModalReport(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const hasActiveFilters = filters.category !== "all" || filters.severity !== "all" || filters.status !== "all" || filters.department !== "all";

  return (
    <div
      suppressHydrationWarning
      style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--nav-height))", background: "var(--bg-canvas)", overflow: "hidden" }}
    >
      {/* Live Dispatch Ticker */}
      <DispatchTicker />

      {/* Broadcast Modal */}
      <BroadcastModal
        isOpen={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        onBroadcastSent={(msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* Dispatch Assignment Modal */}
      {dispatchModalReport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(42, 33, 27, 0.65)",
            backdropFilter: "blur(8px)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setDispatchModalReport(null)}
        >
          <div
            className="card animate-in"
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "28px",
              boxShadow: "var(--shadow-xl)",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-2xl)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <div className="label-small" style={{ color: "var(--accent)", marginBottom: "4px" }}>
                  Rapid Field Crew Assignment
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 800 }}>
                  Dispatch Unit to #{dispatchModalReport.id}
                </h3>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDispatchModalReport(null)}
                style={{ fontSize: "16px", borderRadius: "50%", width: "32px", height: "32px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                background: "var(--bg-elevated)",
                padding: "12px 16px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-primary)",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>
                {dispatchModalReport.title}
              </div>
              <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {dispatchModalReport.location.ward ?? "Pune Central"} · {dispatchModalReport.location.landmark ?? "Roadway"}
              </div>
            </div>

            <div className="label-small" style={{ marginBottom: "10px" }}>Select Municipal Field Crew</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {DISPATCH_CREWS.map((crew) => {
                const isPicked = selectedCrew === crew.id;
                return (
                  <div
                    key={crew.id}
                    onClick={() => setSelectedCrew(crew.id)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "var(--radius-lg)",
                      border: `1.5px solid ${isPicked ? "var(--accent)" : "var(--border-primary)"}`,
                      background: isPicked ? "var(--accent-bg)" : "var(--bg-card)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {crew.name}
                      </div>
                      <div className="mono" style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "2px" }}>
                        Equipment: {crew.vehicle}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                          background: isPicked ? "var(--accent)" : "var(--bg-elevated)",
                          border: `1px solid ${isPicked ? "var(--accent)" : "var(--border-primary)"}`,
                          color: isPicked ? "#FFFFFF" : "var(--text-secondary)",
                        }}
                      >
                        ETA {crew.eta}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => setDispatchModalReport(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 2, justifyContent: "center" }}
                onClick={() => {
                  const c = DISPATCH_CREWS.find((x) => x.id === selectedCrew);
                  handleConfirmDispatch(c ? c.name : "Field Operations Unit 1");
                }}
              >
                Confirm Field Crew Dispatch →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            background: "var(--bg-card)",
            border: "1px solid var(--accent-border)",
            color: "var(--accent)",
            padding: "12px 22px",
            borderRadius: "var(--radius-xl)",
            fontWeight: 700,
            fontSize: "13px",
            boxShadow: "var(--shadow-xl)",
            zIndex: 1200,
            animation: "slide-up 0.3s ease-out",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span className="live-pulse-dot" style={{ background: "var(--accent)" }} />
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* Streamlined Command Deck Header */}
      <div
        style={{
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
              <span className="label-small" style={{ color: "var(--accent)", fontSize: "10px", letterSpacing: "0.06em" }}>
                MUNICIPAL OPERATIONS CENTER
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "var(--accent)",
                  background: "var(--accent-bg)",
                  border: "1px solid var(--accent-border)",
                  padding: "1px 7px",
                  borderRadius: "var(--radius-full)",
                }}
              >
                <span className="live-pulse-dot" style={{ width: "5px", height: "5px", background: "var(--accent)" }} />
                LIVE PMC TELEMETRY
              </span>
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              Command & Citizen Triage Center
            </h1>
          </div>
        </div>

        {/* Polished KPI Metric Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-canvas)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <span className="mono" style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
              {openCount}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Active Queue
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "rgba(189, 86, 75, 0.08)",
              border: "1px solid rgba(189, 86, 75, 0.25)",
            }}
          >
            <span className="mono" style={{ fontSize: "16px", fontWeight: 800, color: "var(--coral)" }}>
              {criticalCount}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--coral)" }}>
              Critical Flags
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "var(--pastel-sage-bg)",
              border: "1px solid var(--pastel-sage-border)",
            }}
          >
            <span className="mono" style={{ fontSize: "16px", fontWeight: 800, color: "var(--accent)" }}>
              {resolvedToday}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent)" }}>
              Resolved (24h)
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "rgba(179, 128, 56, 0.08)",
              border: "1px solid rgba(179, 128, 56, 0.25)",
            }}
          >
            <span className="mono" style={{ fontSize: "16px", fontWeight: 800, color: "var(--amber)" }}>
              {clusters.length}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--amber)" }}>
              Hotspot Clusters
            </span>
          </div>
        </div>

        {/* Action Button: Emergency Broadcast */}
        <div>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              if (!isAdmin) {
                setToastMessage("Admin privileges required to trigger citywide broadcasts (Sign in as admin / Yash Mishra)");
                setTimeout(() => setToastMessage(null), 3500);
                return;
              }
              setBroadcastOpen(true);
            }}
            style={{
              borderRadius: "var(--radius-full)",
              background: isAdmin ? "linear-gradient(135deg, #BD564B 0%, #A34439 100%)" : "var(--bg-elevated)",
              color: isAdmin ? "#FFFFFF" : "var(--text-muted)",
              border: isAdmin ? "none" : "1px solid var(--border-primary)",
              boxShadow: isAdmin ? "0 2px 10px rgba(189, 86, 75, 0.3)" : "none",
              gap: "8px",
              padding: "8px 18px",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span>{isAdmin ? "🚨" : "🔒"}</span>
            <span>{isAdmin ? "Trigger Citizen Broadcast" : "Broadcast (Admin Only)"}</span>
          </button>
        </div>
      </div>

      {/* Citizen Access Mode Banner if logged in as resident */}
      {isUser && (
        <div
          style={{
            background: "var(--pastel-amber-bg)",
            borderBottom: "1px solid var(--pastel-amber-border)",
            padding: "8px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-primary)" }}>
            <span style={{ fontSize: "15px" }}>👤</span>
            <span>
              <strong>Resident Citizen View:</strong> You are browsing Pune's live civic triage stream in read-only mode. Field squad dispatch, SLA reassignment, and emergency broadcasts are reserved for Municipal Operators.
            </span>
          </div>
          <button
            type="button"
            onClick={() => switchRole("admin")}
            style={{
              background: "var(--accent)",
              color: "#FFF",
              padding: "4px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              whiteSpace: "nowrap",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            👑 Switch to Admin (Yash Mishra)
          </button>
        </div>
      )}

      {/* Modern Filter Ribbon */}
      <div
        style={{
          padding: "8px 24px",
          borderBottom: "1px solid var(--border-primary)",
          background: "var(--bg-canvas)",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "4px" }}>
          <span style={{ fontSize: "12px" }}>🔍</span>
          <span className="label-small" style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Filter Deck:
          </span>
        </div>

        {[
          {
            key: "category",
            value: filters.category,
            options: { all: "All Categories", ...CATEGORY_LABELS },
          },
          {
            key: "severity",
            value: filters.severity,
            options: { all: "All Severities", critical: "Critical", high: "High", medium: "Medium", low: "Low" },
          },
          {
            key: "status",
            value: filters.status,
            options: { all: "All Statuses", ...STATUS_LABELS },
          },
          {
            key: "department",
            value: filters.department,
            options: { all: "All Departments", ...DEPARTMENT_LABELS },
          },
        ].map(({ key, value, options }) => (
          <select
            key={key}
            style={{
              width: "auto",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "var(--radius-full)",
              background: value !== "all" ? "var(--accent-bg)" : "var(--bg-surface)",
              border: `1px solid ${value !== "all" ? "var(--accent-border)" : "var(--border-primary)"}`,
              color: value !== "all" ? "var(--accent)" : "var(--text-primary)",
              cursor: "pointer",
              outline: "none",
              transition: "all 0.15s ease",
            }}
            value={value}
            onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value as any }))}
          >
            {Object.entries(options).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        ))}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => setFilters({ category: "all", severity: "all", status: "all", department: "all" })}
            style={{
              padding: "5px 12px",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "var(--radius-full)",
              background: "rgba(189, 86, 75, 0.08)",
              border: "1px solid rgba(189, 86, 75, 0.25)",
              color: "var(--coral)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>✕</span>
            <span>Reset Filters</span>
          </button>
        )}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="live-pulse-dot" style={{ width: "6px", height: "6px", background: "var(--accent)" }} />
          <span className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
            Showing {filtered.length} of {reportsList.length} cases
          </span>
        </div>
      </div>

      {/* Split View: Map (52%) + Incident Action Queue (48%) */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Side: Map with Hotspots and Atmospheric Dispersion */}
        <div style={{ flex: "0 0 52%", borderRight: "1px solid var(--border-primary)", position: "relative", overflow: "hidden", height: "100%" }}>
          <LeafletMap
            reports={filtered}
            clusters={clusters}
            center={mapCenter}
            zoom={12}
            onReportClick={setSelectedReport}
            selectedId={selectedReport?.id}
            height="100%"
          />
        </div>

        {/* Right Side: Incident Action Queue Deck */}
        <div style={{ flex: "0 0 48%", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-base)" }}>
          {/* Queue Sub-Header */}
          <div
            style={{
              padding: "10px 20px",
              borderBottom: "1px solid var(--border-primary)",
              background: "var(--bg-surface)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                Action Queue
              </h2>
              <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 400 }}>
                · Ranked by Evidence Score
              </span>
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--accent)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
              }}
            >
              Priority Algorithmic Triage
            </span>
          </div>

          {/* Cards List Container */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  color: "var(--text-dim)",
                  fontSize: "13px",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px dashed var(--border-primary)",
                  margin: "20px 0",
                }}
              >
                No incidents match current filter criteria. Click "Reset Filters" to view all records.
              </div>
            ) : (
              filtered.map((report) => {
                const color = severityColor(report.severity);
                const isSelected = selectedReport?.id === report.id;
                const isUnresolved = !["resolved", "rejected"].includes(report.status);

                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(isSelected ? null : report)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "var(--radius-xl)",
                      cursor: "pointer",
                      background: isSelected ? "var(--accent-bg)" : "var(--bg-card)",
                      borderTop: `1px solid ${isSelected ? "var(--accent-border)" : "var(--border-primary)"}`,
                      borderRight: `1px solid ${isSelected ? "var(--accent-border)" : "var(--border-primary)"}`,
                      borderBottom: `1px solid ${isSelected ? "var(--accent-border)" : "var(--border-primary)"}`,
                      borderLeft: `4px solid ${color}`,
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: isSelected ? "var(--shadow-md)" : "0 1px 3px rgba(42, 33, 27, 0.04)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "var(--bg-canvas)",
                          border: "1px solid var(--border-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          flexShrink: 0,
                        }}
                      >
                        {categoryIcon(report.category)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px", lineHeight: 1.3 }}>
                          {truncate(report.title, 52)}
                        </div>
                        <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }} suppressHydrationWarning>
                          {report.location.ward ?? "Pune Central"} · {formatRelativeTime(report.createdAt)}
                        </div>
                      </div>

                      {report.evidenceScore && (
                        <div
                          style={{
                            flexShrink: 0,
                            textAlign: "center",
                            background: "var(--bg-canvas)",
                            border: "1px solid var(--border-primary)",
                            padding: "4px 8px",
                            borderRadius: "var(--radius-md)",
                          }}
                        >
                          <div className="mono" style={{ fontSize: "15px", fontWeight: 800, color, lineHeight: 1 }}>
                            {report.evidenceScore.total}
                          </div>
                          <div className="label-small" style={{ fontSize: "8px", marginTop: "2px", color: "var(--text-dim)" }}>
                            CONFIDENCE
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tags row */}
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                      <span className={`badge badge-${report.severity}`}>{report.severity}</span>
                      <span className={`badge badge-${report.status}`}>{STATUS_LABELS[report.status]}</span>

                      {/* Self-contained SLA countdown badge that never triggers page re-renders */}
                      {isUnresolved && (
                        <SlaCountdownBadge createdAt={report.createdAt} severity={report.severity} />
                      )}

                      <span className="mono" style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-dim)" }}>
                        {DEPARTMENT_LABELS[report.department]}
                      </span>
                    </div>

                    {/* Expanded details tray when card is selected */}
                    {isSelected && (
                      <div
                        style={{
                          marginTop: "14px",
                          paddingTop: "14px",
                          borderTop: "1px solid var(--border-primary)",
                          animation: "fade-in 0.2s ease-out",
                        }}
                      >
                        {report.aiAnalysis && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--text-secondary)",
                              marginBottom: "12px",
                              lineHeight: 1.5,
                              background: "#FFFFFF",
                              padding: "10px 14px",
                              borderRadius: "var(--radius-lg)",
                              border: "1px solid var(--border-primary)",
                            }}
                          >
                            <span style={{ color: "var(--accent)", fontWeight: 700 }}>AI Assessment: </span>
                            {report.aiAnalysis.reason}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Link
                            href={`/incidents/${report.id}`}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, justifyContent: "center", borderRadius: "var(--radius-full)" }}
                          >
                            Case Record Details →
                          </Link>
                          {report.status !== "assigned" && (
                            isAdmin ? (
                              <button
                                type="button"
                                className="btn btn-accent btn-sm"
                                style={{ flex: 1, justifyContent: "center", borderRadius: "var(--radius-full)" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDispatchModalReport(report);
                                }}
                              >
                                🚚 Dispatch Crew
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  opacity: 0.85,
                                  fontSize: "12px",
                                  borderRadius: "var(--radius-full)",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setToastMessage("Admin privileges required to dispatch crew (Sign in as admin / Yash Mishra)");
                                  setTimeout(() => setToastMessage(null), 3500);
                                }}
                                title="Admin privileges required"
                              >
                                🔒 Dispatch (Admin Only)
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
