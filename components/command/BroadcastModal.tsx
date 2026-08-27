"use client";

import { useState } from "react";

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSent: (summary: string) => void;
}

export default function BroadcastModal({ isOpen, onClose, onBroadcastSent }: BroadcastModalProps) {
  const [selectedWard, setSelectedWard] = useState("Aundh-Baner Ward");
  const [radiusKm, setRadiusKm] = useState("1.5");
  const [channels, setChannels] = useState({ whatsapp: true, sms: true, appFeed: true });
  const [generating, setGenerating] = useState(false);
  const [advisoryContent, setAdvisoryContent] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Draft a trilingual public emergency civic advisory for ${selectedWard} within ${radiusKm}km radius regarding smoke and particulate pollution spikes.`,
            },
          ],
          aqi: 168,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAdvisoryContent(data.text);
      }
    } catch {
      setAdvisoryContent(`⚠️ StreetPulse Alert for ${selectedWard}: High PM2.5 particulate levels detected. Sensitive groups should avoid outdoor activity.`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSendBroadcast = () => {
    setSentSuccess(true);
    setTimeout(() => {
      onBroadcastSent(`Emergency Broadcast successfully pushed to 4,820 residents in ${selectedWard}.`);
      onClose();
      setSentSuccess(false);
      setAdvisoryContent(null);
    }, 1500);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "560px",
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          border: "1px solid var(--border-primary)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-xl)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          animation: "fade-in 0.25s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="label-small" style={{ marginBottom: "6px", color: "var(--coral)" }}>
              📡 Municipal Emergency Broadcast Engine
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 800 }}>Draft Civic Public Advisory</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
              Push localized health alerts to citizens in high-hazard plumes.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ fontSize: "16px" }}>
            ✕
          </button>
        </div>

        {/* Configuration Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Target Ward</label>
            <select
              className="input"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <option value="Aundh-Baner Ward">Aundh-Baner Ward</option>
              <option value="Shivajinagar Central">Shivajinagar Central</option>
              <option value="Hadapsar Industrial Zone">Hadapsar Industrial Zone</option>
              <option value="Kothrud-Bavdhan Ward">Kothrud-Bavdhan Ward</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Broadcast Radius</label>
            <select
              className="input"
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <option value="0.5">500 meters (Immediate Zone)</option>
              <option value="1.5">1.5 kilometers (Plume Dispersion)</option>
              <option value="3.0">3.0 kilometers (Ward-Wide)</option>
            </select>
          </div>
        </div>

        {/* Channel Toggles */}
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>Dispatch Channels:</div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              { key: "whatsapp" as const, label: "🟢 WhatsApp Emergency Push (~3,100 users)" },
              { key: "sms" as const, label: "📱 Municipal SMS (~1,720 citizens)" },
              { key: "appFeed" as const, label: "🔔 In-App Live Alert" },
            ].map((c) => (
              <label key={c.key} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={channels[c.key]}
                  onChange={(e) => setChannels((prev) => ({ ...prev, [c.key]: e.target.checked }))}
                  style={{ accentColor: "var(--accent)" }}
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>

        {/* Generate / Preview Box */}
        {!advisoryContent ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGenerate}
            disabled={generating}
            style={{ width: "100%", borderRadius: "var(--radius-full)", padding: "12px" }}
          >
            {generating ? "✨ Gemini Drafting Trilingual Advisory..." : "✨ Generate AI Advisory (EN/HI/MR)"}
          </button>
        ) : (
          <div
            style={{
              padding: "16px",
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-primary)",
              maxHeight: "220px",
              overflowY: "auto",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            <div className="label-small" style={{ marginBottom: "8px" }}>Generated Broadcast Draft:</div>
            <div style={{ whiteSpace: "pre-wrap" }}>{advisoryContent}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSendBroadcast}
            disabled={!advisoryContent || sentSuccess}
            style={{ flex: 2, background: "var(--coral)" }}
          >
            {sentSuccess ? "✓ Broadcast Dispatched!" : "🚨 Send Public Broadcast (4,820 Citizens)"}
          </button>
        </div>
      </div>
    </div>
  );
}
