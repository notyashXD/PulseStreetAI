"use client";

import { useState, useMemo } from "react";
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

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), { ssr: false });

type FilterState = { category: IssueCategory | "all"; severity: Severity | "all"; status: ReportStatus | "all"; department: string; };

export default function CommandPage() {
  const [reportsList, setReportsList] = useState<Report[]>(() => getDemoReports());
  const [filters, setFilters] = useState<FilterState>({ category: "all", severity: "all", status: "all", department: "all" });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

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

  const handleAssign = (reportId: string) => {
    setReportsList((prev) => prev.map((r) => r.id === reportId
      ? { ...r, status: "assigned", assignedTo: "Field Operations Unit 1", updatedAt: Date.now(),
          statusHistory: [...r.statusHistory, { status: "assigned", timestamp: Date.now(), note: "Dispatched to regional municipal field crew." }] }
      : r));
    setToastMessage(`Incident ${reportId} dispatched to field crew.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const kpis = [
    { label: "Active Queue", value: openCount },
    { label: "Critical Flags", value: criticalCount },
    { label: "Resolved 24h", value: resolvedToday },
    { label: "Hotspot Clusters", value: clusters.length },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--nav-height))" }}>
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

      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px",
          background: "var(--bg-card)", border: "1px solid var(--accent-border)",
          color: "var(--accent)", padding: "12px 20px",
          borderRadius: "var(--radius-lg)", fontWeight: 600, fontSize: "13px",
          boxShadow: "var(--shadow-lg)", zIndex: 1000, animation: "slide-up 0.3s ease-out",
        }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* Command Header */}
      <div className="glass-strong" style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <div className="label-small" style={{ marginBottom: "4px" }}>Municipal Dispatch HUD</div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.025em" }}>Command & Triage Center</h1>
        </div>

        {/* Center KPI readouts */}
        <div style={{ display: "flex", gap: "28px" }}>
          {kpis.map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: "22px", fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div className="label-small" style={{ fontSize: "9px", marginTop: "3px" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Action Button: Emergency Broadcast */}
        <div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setBroadcastOpen(true)}
            style={{ borderRadius: "var(--radius-full)", background: "var(--coral)", gap: "6px" }}
          >
            <span>🚨</span>
            <span>Emergency Broadcast</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div style={{ padding: "10px 28px", borderBottom: "1px solid var(--border-primary)", background: "var(--bg-surface)", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <span className="label-small" style={{ marginRight: "4px", fontSize: "9px" }}>Filters</span>
        {[
          { key: "category", value: filters.category, options: { all: "All Categories", ...CATEGORY_LABELS } },
          { key: "severity", value: filters.severity, options: { all: "All Severities", critical: "Critical", high: "High", medium: "Medium", low: "Low" } },
          { key: "status", value: filters.status, options: { all: "All Statuses", ...STATUS_LABELS } },
          { key: "department", value: filters.department, options: { all: "All Departments", ...DEPARTMENT_LABELS } },
        ].map(({ key, value, options }) => (
          <select key={key} className="input" style={{ width: "auto", padding: "6px 12px", fontSize: "12px", borderRadius: "var(--radius-full)" }} value={value} onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value as any }))}>
            {Object.entries(options).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
          </select>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ category: "all", severity: "all", status: "all", department: "all" })}>Reset</button>
        <span className="mono" style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-dim)" }}>
          Showing {filtered.length} of {reportsList.length} cases
        </span>
      </div>

      {/* Split Map + Queue View */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: "0 0 55%", borderRight: "1px solid var(--border-primary)", position: "relative" }}>
          <LeafletMap reports={filtered} clusters={clusters} center={[18.52, 73.856]} zoom={12} onReportClick={setSelectedReport} selectedId={selectedReport?.id} height="100%" />
        </div>

        <div style={{ flex: "0 0 45%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-primary)", background: "var(--bg-elevated)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700 }}>
              Action Queue <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)", fontWeight: 400 }}>· Ranked by Evidence Score</span>
            </h2>
            <span className="label-small" style={{ fontSize: "9px" }}>Auto-Priority</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-dim)", fontSize: "14px" }}>
                No incidents match current filter criteria.
              </div>
            ) : filtered.map((report, idx) => {
              const color = severityColor(report.severity);
              const isSelected = selectedReport?.id === report.id;
              return (
                <div key={report.id} onClick={() => setSelectedReport(isSelected ? null : report)} style={{
                  padding: "14px 16px", borderRadius: "var(--radius-lg)", marginBottom: "6px", cursor: "pointer",
                  background: isSelected ? "var(--accent-bg)" : "var(--bg-card)",
                  border: `1px solid ${isSelected ? "var(--accent-border)" : "var(--border-primary)"}`,
                  borderLeft: `4px solid ${color}`, transition: "all 0.2s",
                  animation: `slide-up 0.3s ease-out ${idx * 25}ms both`,
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>{categoryIcon(report.category)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}>{truncate(report.title, 50)}</div>
                      <div className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>{report.location.ward ?? "Pune Central"} · {formatRelativeTime(report.createdAt)}</div>
                    </div>
                    {report.evidenceScore && (
                      <div style={{ flexShrink: 0, textAlign: "right" }}>
                        <div className="mono" style={{ fontSize: "18px", fontWeight: 800, color, lineHeight: 1 }}>{report.evidenceScore.total}</div>
                        <div className="label-small" style={{ fontSize: "8px", marginTop: "2px" }}>Score</div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <span className={`badge badge-${report.severity}`}>{report.severity}</span>
                    <span className={`badge badge-${report.status}`}>{STATUS_LABELS[report.status]}</span>
                    <span className="mono" style={{ marginLeft: "auto", fontSize: "10px", color: "var(--text-dim)" }}>{DEPARTMENT_LABELS[report.department]}</span>
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--border-primary)", animation: "fade-in 0.2s ease-out" }}>
                      {report.aiAnalysis && (
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "10px", lineHeight: 1.5 }}>
                          <span style={{ color: "var(--accent)", fontWeight: 700 }}>Assessment: </span>{report.aiAnalysis.reason}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Link href={`/incidents/${report.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: "center" }}>Case Record →</Link>
                        {report.status !== "assigned" && (
                          <button className="btn btn-accent btn-sm" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); handleAssign(report.id); }}>Dispatch Field Crew</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
