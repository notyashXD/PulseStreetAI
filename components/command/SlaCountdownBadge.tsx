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

  const hrs = Math.floor(timeRemaining / 3600000);
  const mins = Math.floor((timeRemaining % 3600000) / 60000);
  const secs = Math.floor((timeRemaining % 60000) / 1000);
  const formatted = `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  const expired = timeRemaining === 0;

  return (
    <span
      className="mono"
      style={{
        fontSize: "11px",
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: "var(--radius-full)",
        background: expired ? "rgba(189, 86, 75, 0.12)" : "var(--bg-elevated)",
        color: expired ? "var(--coral)" : "var(--text-secondary)",
        border: `1px solid ${expired ? "rgba(189, 86, 75, 0.3)" : "var(--border-primary)"}`,
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span style={{ fontSize: "10px" }}>⏳</span>
      <span>SLA: {formatted}</span>
    </span>
  );
}
