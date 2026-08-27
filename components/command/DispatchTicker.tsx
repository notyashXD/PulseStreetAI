"use client";

import { useEffect, useState } from "react";

const DISPATCH_EVENTS = [
  { time: "Just now", type: "alert", text: "PM2.5 spike (184 µg/m³) detected by sensor PMC-73 in Hadapsar Industrial Zone" },
  { time: "2m ago", type: "dispatch", text: "Field Operations Unit 4 dispatched to Sewage Outflow on Baner Link Rd" },
  { time: "6m ago", type: "verified", text: "AI Resolution Inspector confirmed cleanup at DP Road Garbage Burning Site" },
  { time: "11m ago", type: "intake", text: "Multilingual voice report logged in Marathi: Illegal excavation dust in Kothrud" },
  { time: "15m ago", type: "cluster", text: "Hotspot Alert: 4 corroborated reports within 300m radius in Shivajinagar" },
];

export default function DispatchTicker() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % DISPATCH_EVENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const event = DISPATCH_EVENTS[currentIdx];

  const typeConfig = {
    alert: { color: "var(--coral)", icon: "⚠️" },
    dispatch: { color: "var(--accent)", icon: "🚚" },
    verified: { color: "var(--accent)", icon: "✓" },
    intake: { color: "var(--sky)", icon: "🎙️" },
    cluster: { color: "var(--amber)", icon: "🎯" },
  }[event.type];

  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        borderBottom: "1px solid var(--border-primary)",
        padding: "8px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "12px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        <span className="live-indicator" style={{ fontSize: "10px" }}>DISPATCH FEED</span>
      </div>

      <div style={{ width: "1px", height: "14px", background: "var(--border-primary)" }} />

      <div
        key={currentIdx}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "slide-up 0.3s ease-out",
          flex: 1,
          minWidth: 0,
        }}
      >
        <span style={{ fontSize: "12px" }}>{typeConfig?.icon}</span>
        <span
          style={{
            fontWeight: 500,
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.text}
        </span>
        <span className="mono" style={{ fontSize: "10px", color: "var(--text-dim)", marginLeft: "auto", flexShrink: 0 }}>
          {event.time}
        </span>
      </div>
    </div>
  );
}
