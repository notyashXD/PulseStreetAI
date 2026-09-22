"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getDemoReports } from "@/lib/demo/seed";
import { CATEGORY_LABELS } from "@/lib/types";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import CitizenLeaderboard from "@/components/impact/CitizenLeaderboard";

const CATEGORY_COLORS: Record<string, string> = {
  garbage_burning: "#B65545",
  illegal_dumping: "#B38038",
  smoke: "#7E5B72",
  sewage_leak: "#4E6F87",
  construction_dust: "#8C5E3C",
  blocked_drain: "#3B6E8C",
  litter: "#556E46",
  other: "#8C7E72",
};

export default function ImpactPage() {
  const reports = useMemo(() => getDemoReports(), []);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7d" | "30d" | "all">("30d");

  const totalReports = reports.length;
  const resolvedReports = reports.filter((r) => r.status === "resolved");
  const inProgressReports = reports.filter((r) => ["assigned", "in_progress", "verified"].includes(r.status));
  const resolutionRate = Math.round((resolvedReports.length / totalReports) * 100);
  const avgResolutionHours = 28.4;
  const verifiedAiCount = reports.filter((r) => r.aiAnalysis).length;

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1; });
    return Object.entries(counts).map(([cat, count]) => ({
      name: CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] || cat,
      categoryKey: cat, count,
      color: CATEGORY_COLORS[cat] || "#3D5A27",
    })).sort((a, b) => b.count - a.count);
  }, [reports]);

  const wardData = useMemo(() => {
    const counts: Record<string, { total: number; resolved: number; critical: number }> = {};
    reports.forEach((r) => {
      const ward = r.location.ward || "Other";
      if (!counts[ward]) counts[ward] = { total: 0, resolved: 0, critical: 0 };
      counts[ward].total += 1;
      if (r.status === "resolved") counts[ward].resolved += 1;
      if (r.severity === "critical" || r.severity === "high") counts[ward].critical += 1;
    });
    return Object.entries(counts).map(([ward, data]) => ({
      ward, ...data,
      clearanceRate: Math.round((data.resolved / data.total) * 100),
    })).sort((a, b) => b.total - a.total);
  }, [reports]);

  const weeklyTimelineData = [
    { day: "Mon", reported: 4, resolved: 2 },
    { day: "Tue", reported: 7, resolved: 5 },
    { day: "Wed", reported: 5, resolved: 4 },
    { day: "Thu", reported: 9, resolved: 6 },
    { day: "Fri", reported: 6, resolved: 7 },
    { day: "Sat", reported: 8, resolved: 5 },
    { day: "Sun", reported: 4, resolved: 4 },
  ];

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Category", "Severity", "Status", "Ward", "Department", "Evidence Score", "Created At"];
    const rows = reports.map((r) => [
      r.id, `"${r.title.replace(/"/g, '""')}"`, r.category, r.severity, r.status,
      r.location.ward || "N/A", r.department || "unassigned",
      r.evidenceScore?.total ?? "N/A", new Date(r.createdAt).toISOString(),
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `streetpulse_civic_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const kpis = [
    { label: "Resolution Clearance", value: `${resolutionRate}%`, sub: `${resolvedReports.length} of ${totalReports} closed`, color: "var(--accent)" },
    { label: "Active In-Flight", value: `${inProgressReports.length}`, sub: "Under remediation", color: "var(--text-primary)" },
    { label: "Avg Response Speed", value: `${avgResolutionHours}h`, sub: "Median time to triage", color: "var(--sky)" },
    { label: "AI Evaluations", value: `${verifiedAiCount}`, sub: "Multimodal assessments", color: "var(--amber)" },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="animate-in" style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        marginBottom: "40px", flexWrap: "wrap", gap: "20px",
      }}>
        <div>
          <div className="label-small" style={{ marginBottom: "12px" }}>Municipal Telemetry & Citizen Impact</div>
          <h1 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Impact & Intelligence{" "}
            <br />
            <span className="muted-heading">Pune Municipal Corporation</span>
          </h1>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ display: "flex", background: "var(--bg-elevated)", borderRadius: "var(--radius-full)", border: "1px solid var(--border-primary)", padding: "3px" }}>
            {(["7d", "30d", "all"] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setSelectedTimeframe(tf)}
                style={{
                  padding: "6px 14px", fontSize: "12px", fontWeight: 600,
                  borderRadius: "var(--radius-full)", border: "none", cursor: "pointer",
                  background: selectedTimeframe === tf ? "var(--text-primary)" : "transparent",
                  color: selectedTimeframe === tf ? "#ffffff" : "var(--text-muted)",
                  transition: "all 0.15s", fontFamily: "var(--font-sans)",
                }}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
          <button type="button" onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px", marginBottom: "40px",
      }}>
        {kpis.map(({ label, value, sub, color }, i) => (
          <div
            key={label}
            className="stat-card"
            style={{
              opacity: 0,
              animation: `fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms forwards`,
            }}
          >
            <div className="label-small">{label}</div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "2px" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{
        display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "40px",
      }} className="impact-charts-grid">
        {/* Area chart */}
        <div className="card animate-in" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700 }}>Weekly Intake vs. Clearance</h2>
              <p style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "2px" }}>
                Incoming citizen submissions vs field crew verified remediations
              </p>
            </div>
            <div className="mono" style={{ display: "flex", gap: "16px", fontSize: "11px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-primary)" }}>
                <span style={{ width: "10px", height: "3px", borderRadius: "1px", background: "var(--text-primary)", display: "inline-block" }} /> Reported
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)" }}>
                <span style={{ width: "10px", height: "3px", borderRadius: "1px", background: "var(--accent)", display: "inline-block" }} /> Resolved
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2A211B" stopOpacity={0.16} />
                  <stop offset="95%" stopColor="#2A211B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#556E46" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#556E46" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#8C7E72", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8C7E72", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(250, 247, 242, 0.96)", backdropFilter: "blur(12px)", border: "1px solid var(--border-primary)", borderRadius: "12px", color: "var(--text-primary)", fontSize: "12px", boxShadow: "var(--shadow-md)" }} />
              <Area type="monotone" dataKey="reported" stroke="#2A211B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReported)" />
              <Area type="monotone" dataKey="resolved" stroke="#556E46" strokeWidth={2.5} fillOpacity={1} fill="url(#colorResolved)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="card animate-in" style={{ padding: "28px", display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>Category Distribution</h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>Active environmental risks</p>

          <div style={{ flex: 1, minHeight: "180px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryData} dataKey="count" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3} strokeWidth={0}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(250, 247, 242, 0.96)", backdropFilter: "blur(12px)", border: "1px solid var(--border-primary)", borderRadius: "12px", color: "var(--text-primary)", fontSize: "12px", boxShadow: "var(--shadow-md)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "11px", marginTop: "12px" }}>
            {categoryData.slice(0, 6).map((c) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                <span className="mono" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.name} ({c.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Citizen Leaderboard */}
      <div style={{ marginBottom: "40px" }}>
        <CitizenLeaderboard />
      </div>

      {/* Ward table */}
      <div className="card animate-in" style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>Ward Resolution Index</h2>
            <p style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "2px" }}>
              Comparative municipal performance across wards
            </p>
          </div>
          <Link href="/command" className="btn btn-secondary btn-sm">Triage →</Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-primary)", textAlign: "left" }}>
                {["Ward", "Reports", "Critical", "Resolved", "Clearance", "Status"].map((h) => (
                  <th key={h} className="label-small" style={{
                    padding: "12px 16px", fontSize: "10px",
                    textAlign: h === "Status" ? "right" : "left",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wardData.map((w) => {
                const statusColor = w.clearanceRate >= 50 ? "var(--accent)" : w.clearanceRate >= 25 ? "var(--amber)" : "var(--coral)";
                const statusLabel = w.clearanceRate >= 50 ? "Healthy" : w.clearanceRate >= 25 ? "Moderate" : "Action Needed";
                return (
                  <tr
                    key={w.ward}
                    style={{
                      borderBottom: "1px solid var(--border-primary)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {w.ward}
                    </td>
                    <td className="mono" style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>{w.total}</td>
                    <td className="mono" style={{ padding: "14px 16px" }}>
                      {w.critical > 0 ? (
                        <span style={{ color: "var(--coral)", fontWeight: 600 }}>{w.critical}</span>
                      ) : (
                        <span style={{ color: "var(--text-dim)" }}>0</span>
                      )}
                    </td>
                    <td className="mono" style={{ padding: "14px 16px", color: "var(--accent)", fontWeight: 600 }}>{w.resolved}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="progress-bar" style={{ width: "80px" }}>
                          <div className="progress-fill" style={{ width: `${w.clearanceRate}%`, background: statusColor }} />
                        </div>
                        <span className="mono" style={{ fontSize: "12px", color: statusColor, fontWeight: 700 }}>
                          {w.clearanceRate}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px",
                        borderRadius: "var(--radius-full)", fontSize: "11px", fontWeight: 600,
                        background: `color-mix(in srgb, ${statusColor} 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${statusColor} 20%, transparent)`,
                        color: statusColor,
                      }}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
