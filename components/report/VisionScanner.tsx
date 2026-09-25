"use client";

import { useState, useRef } from "react";
import { IssueCategory } from "@/lib/types";

interface VisionScannerProps {
  onDetected: (category: IssueCategory, description: string, imageFile?: File) => void;
  photoFile: File | null;
  setPhotoFile: (f: File | null) => void;
}

interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  color: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

const SAMPLE_DETECTIONS: Record<string, { category: IssueCategory; boxes: BoundingBox[]; summary: string }> = {
  garbage: {
    category: "garbage_burning",
    boxes: [
      { id: "1", label: "Open Fire Plume (Class A)", confidence: 0.94, color: "#B65545", top: 18, left: 24, width: 45, height: 38 },
      { id: "2", label: "Solid Waste Biomass", confidence: 0.89, color: "#B38038", top: 48, left: 18, width: 62, height: 42 },
    ],
    summary: "Active open waste combustion emitting high-density particulate smoke. High PM2.5 risk detected.",
  },
  dumping: {
    category: "illegal_dumping",
    boxes: [
      { id: "1", label: "Unauthorized Mixed Refuse", confidence: 0.92, color: "#B38038", top: 30, left: 20, width: 60, height: 50 },
    ],
    summary: "Large unsegregated municipal solid waste accumulation blocking pedestrian right-of-way.",
  },
  sewage: {
    category: "sewage_leak",
    boxes: [
      { id: "1", label: "Sewage / Effluent Overflow", confidence: 0.96, color: "#7E5B72", top: 40, left: 25, width: 55, height: 45 },
    ],
    summary: "Active untreated sewage breach with biological pathogen runoff on public road.",
  },
};

export default function VisionScanner({ onDetected, photoFile, setPhotoFile }: VisionScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [detectedBoxes, setDetectedBoxes] = useState<BoundingBox[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectionSummary, setDetectionSummary] = useState<string | null>(null);
  const [detectionLabel, setDetectionLabel] = useState<string | null>(null);
  const [isHazardResult, setIsHazardResult] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeImageBase64 = async (base64Data: string, mimeType: string, fileRef?: File) => {
    setScanning(true);
    setDetectedBoxes([]);
    setDetectionSummary(null);
    setDetectionLabel(null);
    setIsHazardResult(null);

    try {
      const res = await fetch("/api/vision-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType,
        }),
      });

      if (!res.ok) {
        throw new Error("Scan request failed");
      }

      const data = await res.json();
      setScanning(false);
      setIsHazardResult(Boolean(data.isHazard));
      setDetectionLabel(data.label || (data.isHazard ? "Civic Hazard Detected" : "Non-Hazard Image"));
      setDetectionSummary(data.summary);
      setDetectedBoxes(data.boxes || []);

      if (data.isHazard) {
        onDetected(data.category, data.summary, fileRef);
      } else {
        onDetected("other", data.summary, fileRef);
      }
    } catch (err) {
      console.error("Vision scan failed:", err);
      setScanning(false);
      setIsHazardResult(false);
      setDetectionLabel("Analysis Inconclusive");
      setDetectionSummary("Could not parse image. Please select the hazard category manually or retake photo.");
      onDetected("other", "Image analysis inconclusive. Please review category.", fileRef);
    }
  };

  const processImage = (file: File) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      analyzeImageBase64(result, file.type || "image/jpeg", file);
    };
    reader.readAsDataURL(file);
  };

  const handleSimulatedCapture = async (type: "garbage" | "dumping" | "sewage") => {
    const path =
      type === "garbage"
        ? "/images/remediation/garbage_burning_before.jpg"
        : type === "dumping"
        ? "/images/remediation/illegal_dumping_before.jpg"
        : "/images/remediation/sewage_leak_before.jpg";

    setImagePreview(path);
    setScanning(true);

    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        analyzeImageBase64(result, blob.type || "image/jpeg");
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("Error loading sample image:", e);
      setScanning(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Scanner Box / Viewfinder */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "320px",
          background: "var(--bg-elevated)",
          border: "2px dashed var(--border-primary)",
          borderRadius: "var(--radius-3xl)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* AR Corner Reticle Brackets */}
        <div style={{ position: "absolute", top: 12, left: 12, width: 20, height: 20, borderTop: "2.5px solid var(--accent)", borderLeft: "2.5px solid var(--accent)", pointerEvents: "none", zIndex: 10 }} />
        <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderTop: "2.5px solid var(--accent)", borderRight: "2.5px solid var(--accent)", pointerEvents: "none", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 12, left: 12, width: 20, height: 20, borderBottom: "2.5px solid var(--accent)", borderLeft: "2.5px solid var(--accent)", pointerEvents: "none", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 12, right: 12, width: 20, height: 20, borderBottom: "2.5px solid var(--accent)", borderRight: "2.5px solid var(--accent)", pointerEvents: "none", zIndex: 10 }} />

        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt="Hazard scan preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Dark gradient overlay for bounding boxes */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(42, 33, 27, 0.12)",
                pointerEvents: "none",
              }}
            />

            {/* Viewfinder HUD Stamp */}
            <div style={{
              position: "absolute", top: "16px", left: "20px",
              background: "rgba(42, 33, 27, 0.75)", backdropFilter: "blur(8px)",
              padding: "4px 10px", borderRadius: "var(--radius-full)",
              color: "#FAF7F2", fontSize: "11px", fontWeight: 700,
              fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "6px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--pastel-terracotta)" }} />
              GEMINI VISION 2.0 HUD
            </div>

            {/* Clear Photo Action Button */}
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setDetectedBoxes([]);
                setDetectionSummary(null);
                setPhotoFile(null);
              }}
              style={{
                position: "absolute", top: "16px", right: "20px",
                background: "rgba(42, 33, 27, 0.75)", backdropFilter: "blur(8px)",
                border: "none", borderRadius: "var(--radius-full)",
                color: "#FAF7F2", padding: "4px 12px", fontSize: "11px",
                cursor: "pointer", fontWeight: 600,
              }}
            >
              ✕ Retake
            </button>

            {/* Bounding Box Annotations */}
            {detectedBoxes.map((box) => (
              <div
                key={box.id}
                style={{
                  position: "absolute",
                  top: `${box.top}%`,
                  left: `${box.left}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                  border: `2px solid ${box.color}`,
                  borderRadius: "var(--radius-xs)",
                  background: `${box.color}25`,
                  boxShadow: `0 0 16px ${box.color}88`,
                  pointerEvents: "none",
                  animation: "fade-in 0.4s ease-out",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-26px",
                    left: "-2px",
                    background: box.color,
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "var(--radius-xs)",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-mono)",
                    boxShadow: "var(--shadow-sm)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {box.label} · {Math.round(box.confidence * 100)}%
                </div>
              </div>
            ))}

            {/* Scanning Laser Animation */}
            {scanning && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "var(--accent)",
                  boxShadow: "0 0 16px var(--accent)",
                  animation: "laser-scan 1.2s ease-in-out infinite alternate",
                }}
              />
            )}
          </>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              textAlign: "center",
              cursor: "pointer",
              padding: "32px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                fontSize: "24px",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              📸
            </div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
              Launch Camera or Upload Field Photo
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", maxWidth: "340px", margin: "4px auto 0" }}>
              Gemini Vision automatically classifies the hazard, detects bounding boxes, and estimates particulate risk.
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processImage(file);
          }}
        />
      </div>

      {/* Detection Result Banner */}
      {detectionSummary && (
        <div
          style={{
            padding: "14px 18px",
            background: isHazardResult === false ? "var(--pastel-amber-bg)" : "var(--pastel-sage-bg)",
            border: `1px solid ${isHazardResult === false ? "var(--pastel-amber-border)" : "var(--pastel-sage-border)"}`,
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            animation: "fade-in 0.3s ease-out",
          }}
        >
          <span style={{ fontSize: "22px", flexShrink: 0, marginTop: "1px" }}>
            {isHazardResult === false ? "⚠️" : "🎯"}
          </span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: isHazardResult === false ? "var(--pastel-amber)" : "var(--pastel-sage)",
              }}
            >
              {detectionLabel || (isHazardResult === false ? "Non-Hazard Image Detected" : "AI Vision Analysis Complete")}
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "3px", lineHeight: 1.45 }}>
              {detectionSummary}
            </div>
            {isHazardResult === false && (
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "6px" }}>
                💡 <em>Tip: StreetPulse inspects municipal environmental hazards (garbage burning, sewage overflows, illegal dumps, smoke plumes, dust clouds). Please upload a photo of an outdoor civic issue.</em>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Demo Test Presets */}
      <div>
        <div className="label-small" style={{ marginBottom: "8px", fontSize: "10px" }}>
          ⚡ Test with Pre-Loaded Field Samples:
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSimulatedCapture("garbage")}
            disabled={scanning}
          >
            🔥 Garbage Burning Sample
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSimulatedCapture("dumping")}
            disabled={scanning}
          >
            🗑️ Illegal Dumping Sample
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleSimulatedCapture("sewage")}
            disabled={scanning}
          >
            🌊 Sewage Leak Sample
          </button>
        </div>
      </div>

      <style>{`
        @keyframes laser-scan {
          0% { top: 10%; }
          100% { top: 90%; }
        }
      `}</style>
    </div>
  );
}
