"use client";

import Link from "next/link";
import { Report, CATEGORY_LABELS, STATUS_LABELS } from "@/lib/types";
import { severityColor, categoryIcon, formatRelativeTime, truncate } from "@/lib/utils";

interface IncidentCardProps { report: Report; compact?: boolean; }

export default function IncidentCard({ report, compact }: IncidentCardProps) {
  const color = severityColor(report.severity);

  return (
    <Link href={`/incidents/${report.id}`} style={{ display: "block", textDecoration: "none" }}>
      <div className="card" style={{
        padding: compact ? "16px 18px" : "22px 24px",
        cursor: "pointer",
        borderLeft: `3px solid ${color}`,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: compact ? "8px" : "14px" }}>
          {report.photoUrls && report.photoUrls.length > 0 ? (
            <div style={{
              width: compact ? "40px" : "50px",
              height: compact ? "40px" : "50px",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              flexShrink: 0,
              border: "1px solid var(--border-primary)",
              background: "var(--bg-elevated)",
              boxShadow: "var(--shadow-xs)",
            }}>
              <img
                src={report.photoUrls[0]}
                alt={report.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
              />
            </div>
          ) : (
            <span style={{ fontSize: compact ? "16px" : "20px", lineHeight: 1, flexShrink: 0, marginTop: "2px" }}>
              {categoryIcon(report.category)}
            </span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: compact ? "13px" : "15px", fontWeight: 700,
              color: "var(--text-primary)", marginBottom: "3px", lineHeight: 1.3,
            }}>
              {truncate(report.title, compact ? 60 : 80)}
            </h3>
            <p className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>
              {report.location.ward ?? "Pune Central"} · {formatRelativeTime(report.createdAt)}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span className={`badge badge-${report.severity}`}>{report.severity}</span>
          <span className={`badge badge-${report.status}`}>{STATUS_LABELS[report.status]}</span>
          {!compact && (
            <span style={{ fontSize: "12px", color: "var(--text-dim)", marginLeft: "auto" }}>
              {CATEGORY_LABELS[report.category]}
            </span>
          )}
        </div>

        {!compact && report.evidenceScore && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span className="label-small" style={{ fontSize: "9px" }}>Evidence Score</span>
              <span className="mono" style={{ fontSize: "13px", fontWeight: 700, color }}>{report.evidenceScore.total}/100</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${report.evidenceScore.total}%`, background: color }} />
            </div>
          </div>
        )}

        {!compact && report.supportCount > 0 && (
          <div className="mono" style={{ marginTop: "10px", fontSize: "11px", color: "var(--text-dim)" }}>
            {report.supportCount} endorsements
          </div>
        )}
      </div>
    </Link>
  );
}
