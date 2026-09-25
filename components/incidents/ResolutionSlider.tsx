"use client";

import { useState } from "react";

interface ResolutionSliderProps {
  beforeUrl?: string;
  afterUrl?: string;
  category: string;
  isResolved: boolean;
  onSimulateResolution?: () => void;
}

import { CATEGORY_REMEDIATION_PAIRS } from "@/lib/constants/remediation";

export default function ResolutionSlider({
  beforeUrl,
  afterUrl,
  category,
  isResolved: initialIsResolved,
  onSimulateResolution,
}: ResolutionSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [simulatedResolved, setSimulatedResolved] = useState(initialIsResolved);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(98.4);

  const pair = CATEGORY_REMEDIATION_PAIRS[category] || CATEGORY_REMEDIATION_PAIRS.other;
  const defaultBefore = beforeUrl || pair.before;
  const defaultAfter = afterUrl || pair.after;

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const runSimulatedVerification = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setSimulatedResolved(true);
      setConfidenceScore(98.4);
      if (onSimulateResolution) {
        onSimulateResolution();
      }
    }, 1200);
  };

  const isResolved = simulatedResolved || initialIsResolved;

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div className="label-small" style={{ marginBottom: "4px", color: isResolved ? "var(--accent)" : "var(--text-dim)" }}>
            {isResolved ? "✓ AI Visual Clearance Verification" : "⏳ Pre-Remediation Evidence"}
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>
            {isResolved ? "Before vs. After Remediation Inspection" : "Reported Hazard Site Evidence"}
          </h3>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {!isResolved && (
            <button
              type="button"
              className="btn btn-accent btn-sm"
              onClick={runSimulatedVerification}
              disabled={isAnalyzing}
              style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "var(--radius-full)" }}
            >
              {isAnalyzing ? (
                <>
                  <span className="live-pulse-dot" style={{ background: "var(--accent)" }} />
                  Running AI Optical Audit...
                </>
              ) : (
                "🧪 Simulate Crew Resolution Upload"
              )}
            </button>
          )}

          {isResolved && (
            <span
              style={{
                padding: "6px 14px",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                color: "var(--accent)",
                borderRadius: "var(--radius-full)",
                fontSize: "12px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span className="live-pulse-dot" style={{ background: "var(--accent)" }} />
              Gemini Vision: {confidenceScore}% Verified Clean
            </span>
          )}
        </div>
      </div>

      {isResolved ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "320px",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            cursor: "ew-resize",
            userSelect: "none",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-md)",
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
              bottom: "14px",
              right: "14px",
              background: "rgba(42, 33, 27, 0.85)",
              backdropFilter: "blur(6px)",
              color: "#FAF7F2",
              fontSize: "11px",
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {pair.afterLabel}
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
                height: "320px",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "14px",
                left: "14px",
                background: "rgba(42, 33, 27, 0.85)",
                backdropFilter: "blur(6px)",
                color: "#FAF7F2",
                fontSize: "11px",
                fontWeight: 700,
                padding: "5px 12px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {pair.beforeLabel}
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
              background: "#FAF7F2",
              boxShadow: "0 0 12px rgba(0,0,0,0.5)",
              transform: "translateX(-50%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#FAF7F2",
                border: "2px solid var(--accent)",
                boxShadow: "var(--shadow-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
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
            height: "280px",
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

          {isAnalyzing && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(42, 33, 27, 0.6)",
                backdropFilter: "blur(3px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                color: "#FAF7F2",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "3px solid rgba(255,255,255,0.2)",
                  borderTopColor: "var(--accent)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <div className="mono" style={{ fontSize: "13px", fontWeight: 700 }}>
                Auditing site geometry with Gemini Vision...
              </div>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "14px",
              background: "rgba(42, 33, 27, 0.85)",
              backdropFilter: "blur(6px)",
              color: "#FAF7F2",
              fontSize: "11px",
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
            }}
          >
            Active Incident Evidence
          </div>
        </div>
      )}

      {isResolved && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted)" }}>
          <span className="mono">Drag slider horizontally to inspect before & after remediation</span>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>{pair.statusText}</span>
        </div>
      )}
    </div>
  );
}
