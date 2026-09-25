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
import { useAuth } from "@/lib/auth/AuthContext";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), { ssr: false });

type FilterState = {
  category: IssueCategory | "all";
  severity: Severity | "all";
  status: ReportStatus | "all";
  department: string;
};

const DISPATCH_CREWS = [
  { id: "crew-1", name: "PMC Rapid Waste & Burn Response Unit #2", eta: "12 mins", status: "Available", vehicle: "Heavy Mist Sprayer + Tipper" },
  { id: "crew-2", name: "Kothrud-Karve Rd Environmental Patrol", eta: "18 mins", status: "Available", vehicle: "Mobile Sensor + Water Tanker" },
  { id: "crew-3", name: "Hadapsar Industrial Compliance Squad", eta: "25 mins", status: "En Route", vehicle: "Inspection Van" },
  { id: "crew-4", name: "Smart City Drainage & Sanitation Force", eta: "15 mins", status: "Available", vehicle: "Suction Jetting Unit" },
];

export default function CommandPage() {
  const { isAdmin, isUser, switchRole } = useAuth();
  const [reportsList, setReportsList] = useState<Report[]>(() => getDemoReports());
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

  // Dynamic SLA countdown ticker
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    let r = reportsList;
    if (filters.category !== "all") r = r.filter((x) => x.category === filters.category);
    if (filters.severity !== "all") r = r.filter((x) => x.severity === filters.severity);
    if (filters.status !== "all") r = r.filter((x) => x.status === filters.status);
    if (filters.department !== "all") r = r.filter((x) => x.department === filters.department);
    return sortByPriority(r);
  }, [reportsList, filters]);

  const clusters = useMemo(() => clusterReports(reportsList), [reportsList]);
  const openCount = reportsList.filter((r) => !["resolved", "rejected"].includes(r.status)).length;
  const criticalCount = reportsList.filter((r) => r.severity === "critical").length;
  const resolvedToday = reportsList.filter((r) => r.status === "resolved" && Date.now() - r.updatedAt < 86_400_000).length;

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
    setToastMessage(`Incident ${reportId} dispatched to ${crewName}`);
    setDispatchModalReport(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const kpis = [
    { label: "Active Queue", value: openCount, badge: "Live" },
    { label: "Critical Flags", value: criticalCount, color: "var(--coral)" },
    { label: "Resolved (24h)", value: resolvedToday, color: "var(--accent)" },
    { label: "Hotspot Clusters", value: clusters.length, color: "var(--amber)" },
  ];

  const calculateSLA = (report: Report) => {
    const slaLimitMs = report.severity === "critical" ? 4 * 3600 * 1000 : 12 * 3600 * 1000;
    const elapsed = currentTime - report.createdAt;
    const remaining = Math.max(0, slaLimitMs - elapsed);
    const hrs = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return {
      expired: remaining === 0,
      formatted: `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--nav-height))", background: "var(--bg-canvas)" }}>
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
            background: "rgba(42, 33, 27, 0.6)",
            backdropFilter: "blur(6px)",
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
                style={{ fontSize: "16px" }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                background: "var(--bg-elevated)",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
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
                      background: isPicked ? "var(--accent-bg)" : "var(--bg-elevated)",
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
                          padding: "3px 8px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-primary)",
                          color: "var(--accent)",
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

      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "var(--bg-card)",
            border: "1px solid var(--accent-border)",
            color: "var(--accent)",
            padding: "12px 20px",
            borderRadius: "var(--radius-lg)",
            fontWeight: 700,
            fontSize: "13px",
            boxShadow: "var(--shadow-lg)",
            zIndex: 1200,
            animation: "slide-up 0.3s ease-out",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span className="live-pulse-dot" style={{ background: "var(--accent)" }} />
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* Command Header */}
      <div
        className="glass-strong"
        style={{
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          borderBottom: "1px solid var(--border-primary)",
        }}
      >
        <div>
          <div className="label-small" style={{ marginBottom: "4px", color: "var(--accent)" }}>
            Municipal Operations Center
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.025em" }}>
            Command & Citizen Triage Center
          </h1>
        </div>

        {/* Center KPI readouts */}
        <div style={{ display: "flex", gap: "28px" }}>
          {kpis.map(({ label, value, color: c }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                className="mono"
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  lineHeight: 1,
                  color: c || "var(--text-primary)",
                }}
              >
                {value}
              </div>
              <div className="label-small" style={{ fontSize: "9px", marginTop: "3px" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button: Emergency Broadcast */}
        <div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (!isAdmin) {
                setToastMessage("Admin privileges required to trigger citywide broadcasts (Sign in as admin)");
                setTimeout(() => setToastMessage(null), 3500);
                return;
              }
              setBroadcastOpen(true);
            }}
            style={{
              borderRadius: "var(--radius-full)",
              background: isAdmin ? "var(--terracotta)" : "var(--bg-elevated)",
              color: isAdmin ? "#FFFFFF" : "var(--text-muted)",
              border: isAdmin ? "none" : "1px solid var(--border-primary)",
              gap: "8px",
              padding: "8px 18px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <span>{isAdmin ? "🚨" : "🔒"}</span>
            <span>{isAdmin ? "Trigger Citizen Broadcast" : "Broadcast (Admin Only)"}</span>
          </button>
        </div>
      </div>

      {/* Citizen Access Mode Banner if logged in as user */}
      {isUser && (
        <div
          style={{
            background: "var(--pastel-amber-bg)",
            borderBottom: "1px solid var(--pastel-amber-border)",
            padding: "9px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            fontSize: "12.5px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-primary)" }}>
            <span style={{ fontSize: "16px" }}>👤</span>
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
            👑 Switch to Admin (admin / admin)
          </button>
        </div>
      )}

      {/* Filter Ribbon */}
      <div
        style={{
          padding: "10px 28px",
          borderBottom: "1px solid var(--border-primary)",
          background: "var(--bg-surface)",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span className="label-small" style={{ marginRight: "4px", fontSize: "10px" }}>
          Filters
        </span>
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
            className="input"
            style={{
              width: "auto",
              padding: "6px 14px",
              fontSize: "12px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-card)",
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
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setFilters({ category: "all", severity: "all", status: "all", department: "all" })}
        >
          Reset Filters
        </button>
        <span className="mono" style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-dim)" }}>
          Showing {filtered.length} of {reportsList.length} cases
        </span>
      </div>

      {/* Split Map + Queue View */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Side: Map with Hotspots */}
        <div style={{ flex: "0 0 54%", borderRight: "1px solid var(--border-primary)", position: "relative" }}>
          <LeafletMap
            reports={filtered}
            clusters={clusters}
            center={[18.52, 73.856]}
            zoom={12}
            onReportClick={setSelectedReport}
            selectedId={selectedReport?.id}
            height="100%"
          />
        </div>

        {/* Right Side: Action Queue */}
        <div style={{ flex: "0 0 46%", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-surface)" }}>
          <div
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--border-primary)",
              background: "var(--bg-elevated)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Action Queue</span>
              <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 400 }}>
                · Ranked by Evidence Score
              </span>
            </h2>
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

          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-dim)", fontSize: "14px" }}>
                No incidents match current filter criteria.
              </div>
            ) : (
              filtered.map((report, idx) => {
                const color = severityColor(report.severity);
                const isSelected = selectedReport?.id === report.id;
                const sla = calculateSLA(report);
                const isUnresolved = !["resolved", "rejected"].includes(report.status);

                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(isSelected ? null : report)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "var(--radius-lg)",
                      cursor: "pointer",
                      background: isSelected ? "var(--accent-bg)" : "var(--bg-card)",
                      borderTop: `1px solid ${isSelected ? "var(--accent-border)" : "var(--border-primary)"}`,
                      borderRight: `1px solid ${isSelected ? "var(--accent-border)" : "var(--border-primary)"}`,
                      borderBottom: `1px solid ${isSelected ? "var(--accent-border)" : "var(--border-primary)"}`,
                      borderLeft: `4px solid ${color}`,
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      animation: `slide-up 0.3s ease-out ${idx * 25}ms both`,
                      boxShadow: isSelected ? "var(--shadow-md)" : "var(--shadow-sm)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "1px" }}>
                        {categoryIcon(report.category)}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "3px" }}>
                          {truncate(report.title, 48)}
                        </div>
                        <div className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                          {report.location.ward ?? "Pune Central"} · {formatRelativeTime(report.createdAt)}
                        </div>
                      </div>

                      {report.evidenceScore && (
                        <div style={{ flexShrink: 0, textAlign: "right" }}>
                          <div className="mono" style={{ fontSize: "18px", fontWeight: 800, color, lineHeight: 1 }}>
                            {report.evidenceScore.total}
                          </div>
                          <div className="label-small" style={{ fontSize: "8px", marginTop: "2px" }}>
                            Confidence
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                      <span className={`badge badge-${report.severity}`}>{report.severity}</span>
                      <span className={`badge badge-${report.status}`}>{STATUS_LABELS[report.status]}</span>

                      {/* SLA Timer Pill */}
                      {isUnresolved && (
                        <span
                          className="mono"
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                            background: sla.expired ? "var(--coral-bg)" : "var(--bg-elevated)",
                            color: sla.expired ? "var(--coral)" : "var(--text-muted)",
                            border: `1px solid ${sla.expired ? "rgba(189,86,75,0.3)" : "var(--border-primary)"}`,
                          }}
                        >
                          ⏳ SLA: {sla.formatted}
                        </span>
                      )}

                      <span className="mono" style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-dim)" }}>
                        {DEPARTMENT_LABELS[report.department]}
                      </span>
                    </div>

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
                              background: "var(--bg-elevated)",
                              padding: "10px 12px",
                              borderRadius: "var(--radius-md)",
                              border: "1px solid var(--border-primary)",
                            }}
                          >
                            <span style={{ color: "var(--accent)", fontWeight: 700 }}>AI Assessment: </span>
                            {report.aiAnalysis.reason}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Link
                            href={`/incidents/${report.id}`}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, justifyContent: "center" }}
                          >
                            Case Record Details →
                          </Link>
                          {report.status !== "assigned" && (
                            isAdmin ? (
                              <button
                                type="button"
                                className="btn btn-accent btn-sm"
                                style={{ flex: 1, justifyContent: "center" }}
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
                                  opacity: 0.8,
                                  fontSize: "12px",
                                  background: "var(--bg-elevated)",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setToastMessage("Admin privileges required to dispatch crew (Sign in as admin / admin)");
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
