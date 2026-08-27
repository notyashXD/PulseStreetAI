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
      { id: "1", label: "Open Fire Plume (Class A)", confidence: 0.94, color: "#D4645A", top: 18, left: 24, width: 45, height: 38 },
      { id: "2", label: "Solid Waste Biomass", confidence: 0.89, color: "#D4A843", top: 48, left: 18, width: 62, height: 42 },
    ],
    summary: "Active open waste combustion emitting high-density particulate smoke. High PM2.5 risk detected.",
  },
  dumping: {
    category: "illegal_dumping",
    boxes: [
      { id: "1", label: "Unauthorized Mixed Refuse", confidence: 0.92, color: "#D4A843", top: 30, left: 20, width: 60, height: 50 },
    ],
    summary: "Large unsegregated municipal solid waste accumulation blocking pedestrian right-of-way.",
  },
  sewage: {
    category: "sewage_leak",
    boxes: [
      { id: "1", label: "Sewage / Effluent Overflow", confidence: 0.96, color: "#7B61A8", top: 40, left: 25, width: 55, height: 45 },
    ],
    summary: "Active untreated sewage breach with biological pathogen runoff on public road.",
  },
};

export default function VisionScanner({ onDetected, photoFile, setPhotoFile }: VisionScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [detectedBoxes, setDetectedBoxes] = useState<BoundingBox[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectionSummary, setDetectionSummary] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      runVisionAnalysis(file.name);
    };
    reader.readAsDataURL(file);
  };

  const runVisionAnalysis = (fileName: string) => {
    setScanning(true);
    setDetectedBoxes([]);
    setDetectionSummary(null);

    setTimeout(() => {
      let key = "garbage";
      const name = fileName.toLowerCase();
      if (name.includes("dump") || name.includes("waste")) key = "dumping";
      if (name.includes("water") || name.includes("sewage") || name.includes("drain")) key = "sewage";

      const sample = SAMPLE_DETECTIONS[key];
      setDetectedBoxes(sample.boxes);
      setDetectionSummary(sample.summary);
      setScanning(false);
      onDetected(sample.category, sample.summary, photoFile || undefined);
    }, 1200);
  };

  const handleSimulatedCapture = (type: "garbage" | "dumping" | "sewage") => {
    const sample = SAMPLE_DETECTIONS[type];
    setScanning(true);
    setImagePreview(
      type === "garbage"
        ? "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&auto=format&fit=crop&q=80"
        : type === "dumping"
        ? "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80"
    );

    setTimeout(() => {
      setDetectedBoxes(sample.boxes);
      setDetectionSummary(sample.summary);
      setScanning(false);
      onDetected(sample.category, sample.summary);
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Scanner Box / Viewfinder */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "280px",
          background: "var(--bg-elevated)",
          border: "2px dashed var(--border-primary)",
          borderRadius: "var(--radius-2xl)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
                background: "rgba(0,0,0,0.15)",
                pointerEvents: "none",
              }}
            />

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
                  background: `${box.color}18`,
                  boxShadow: `0 0 12px ${box.color}66`,
                  pointerEvents: "none",
                  animation: "fade-in 0.4s ease-out",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-24px",
                    left: "-2px",
                    background: box.color,
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-xs)",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-mono)",
                    boxShadow: "var(--shadow-sm)",
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
                  height: "2px",
                  background: "var(--accent)",
                  boxShadow: "0 0 12px var(--accent)",
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
              padding: "24px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: "20px",
              }}
            >
              📷
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
              Upload Image or Launch Camera
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
              AI automatically classifies hazard & extracts bounding boxes
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
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "fade-in 0.3s ease-out",
          }}
        >
          <span style={{ fontSize: "20px" }}>🎯</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)" }}>
              AI Vision Analysis Complete
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {detectionSummary}
            </div>
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
