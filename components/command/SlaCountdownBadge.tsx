"use client";

import { useState, useEffect } from "react";
import { Severity } from "@/lib/types";

interface SlaCountdownBadgeProps {
  createdAt: number;
  severity: Severity;
}

export default function SlaCountdownBadge({ createdAt, severity }: SlaCountdownBadgeProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    const limit = severity === "critical" ? 4 * 3600 * 1000 : 12 * 3600 * 1000;
    return Math.max(0, limit - (Date.now() - createdAt));
  });

  useEffect(() => {
    const limit = severity === "critical" ? 4 * 3600 * 1000 : 12 * 3600 * 1000;
    const update = () => {
      setTimeRemaining(Math.max(0, limit - (Date.now() - createdAt)));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [createdAt, severity]);

  const limit = severity === "critical" ? 4 * 3600 * 1000 : 12 * 3600 * 1000;
  const elapsed = Date.now() - createdAt;
  const isOverdue = elapsed > limit;
  const overdueMs = elapsed - limit;
  const overdueHrs = Math.floor(overdueMs / 3600000);
  const overdueMins = Math.floor((overdueMs % 3600000) / 60000);

  const hrs = Math.floor(timeRemaining / 3600000);
  const mins = Math.floor((timeRemaining % 3600000) / 60000);

  return (
    <span
      className="mono"
      style={{
        fontSize: "11px",
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: "var(--radius-full)",
        background: isOverdue ? "rgba(189, 86, 75, 0.12)" : "var(--pastel-amber-bg)",
        color: isOverdue ? "var(--coral)" : "var(--pastel-amber)",
        border: `1px solid ${isOverdue ? "rgba(189, 86, 75, 0.3)" : "var(--pastel-amber-border)"}`,
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span style={{ fontSize: "10px" }}>{isOverdue ? "⚠️" : "⏳"}</span>
      <span>{isOverdue ? `Overdue (+${overdueHrs}h ${overdueMins}m)` : `SLA: ${hrs}h ${mins}m left`}</span>
    </span>
  );
}
