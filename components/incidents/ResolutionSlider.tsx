"use client";

import { useState } from "react";

interface ResolutionSliderProps {
  beforeUrl?: string;
  afterUrl?: string;
  category: string;
  isResolved: boolean;
}

export default function ResolutionSlider({
  beforeUrl,
  afterUrl,
  category,
  isResolved,
}: ResolutionSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const defaultBefore =
    beforeUrl ||
    (category === "garbage_burning"
      ? "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80");

  const defaultAfter =
    afterUrl ||
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80";

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <div
      className="card animate-in"
      style={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <div className="label-small" style={{ marginBottom: "4px", color: isResolved ? "var(--accent)" : "var(--text-dim)" }}>
            {isResolved ? "✓ AI Visual Clearance Verification" : "⏳ Pre-Remediation Evidence"}
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>
            {isResolved ? "Before vs. After Remediation Inspection" : "Reported Hazard Site"}
          </h3>
        </div>
        {isResolved && (
          <span
            style={{
              padding: "4px 12px",
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              color: "var(--accent)",
              borderRadius: "var(--radius-full)",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            AI Confidence: 98.4% Verified
          </span>
        )}
      </div>

      {isResolved ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            cursor: "ew-resize",
            userSelect: "none",
            border: "1px solid var(--border-primary)",
          }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={(e) => {
            if (isDragging) {
              handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
            }
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            if (touch) {
              handleMove(touch.clientX, e.currentTarget.getBoundingClientRect());
            }
          }}
        >
          {/* AFTER Image (Background) */}
          <img
            src={defaultAfter}
            alt="Site After Remediation"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              background: "rgba(0,0,0,0.75)",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
            }}
          >
            AFTER: Field Remediation
          </div>

          {/* BEFORE Image (Clipped overlay) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${sliderPos}%`,
              overflow: "hidden",
            }}
          >
            <img
              src={defaultBefore}
              alt="Site Before Remediation"
              style={{
                width: "1000px",
                maxWidth: "none",
                height: "300px",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "12px",
                background: "rgba(0,0,0,0.75)",
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
              }}
            >
              BEFORE: Citizen Report
            </div>
          </div>

          {/* Draggable Divider Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sliderPos}%`,
              width: "3px",
              background: "white",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "white",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              ↔
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "260px",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            border: "1px solid var(--border-primary)",
          }}
        >
          <img
            src={defaultBefore}
            alt="Citizen Evidence"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              background: "rgba(0,0,0,0.75)",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
            }}
          >
            Active Incident Evidence
          </div>
        </div>
      )}

      {isResolved && (
        <div className="mono" style={{ fontSize: "11px", color: "var(--text-dim)", textAlign: "center" }}>
          Drag slider horizontally to inspect before & after remediation verification
        </div>
      )}
    </div>
  );
}
