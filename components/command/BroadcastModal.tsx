"use client";

import { useState } from "react";

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSent: (summary: string) => void;
}

const PRESET_ADVISORIES = {
  en: "⚠️ PMC AIR ADVISORY: High PM2.5 particulate plume detected across Aundh-Baner Corridor due to active biomass burning. Citizens, children, and elderly are advised to wear N95 masks and keep windows closed.",
  hi: "⚠️ पुणे मनपा वायु परामर्श: औंध-बाणेर क्षेत्र में कचरा जलने के कारण वायु गुणवत्ता अत्यंत खराब हो गई है। नागरिक, विशेषकर बच्चे एवं बुजुर्ग, बाहर जाने से बचें और मास्क पहनें।",
  mr: "⚠️ पुणे मनपा आरोग्य सूचना: औंध-बाणेर परिसरात कचरा जाळल्यामुळे हवेची गुणवत्ता खालावली आहे. लहान मुले व ज्येष्ठ नागरिकांनी घरातच थांबावे व खिडक्या बंद ठेवाव्यात.",
};

export default function BroadcastModal({ isOpen, onClose, onBroadcastSent }: BroadcastModalProps) {
  const [selectedWard, setSelectedWard] = useState("Aundh-Baner Ward");
  const [radiusKm, setRadiusKm] = useState("1.5");
  const [previewLang, setPreviewLang] = useState<"en" | "hi" | "mr">("en");
  const [channels, setChannels] = useState({ whatsapp: true, sms: true, appFeed: true });
  const [generating, setGenerating] = useState(false);
  const [advisoryContent, setAdvisoryContent] = useState<string | null>(PRESET_ADVISORIES.en);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLangSwitch = (lang: "en" | "hi" | "mr") => {
    setPreviewLang(lang);
    setAdvisoryContent(PRESET_ADVISORIES[lang]);
  };

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
              content: `Draft a concise 2-sentence public emergency civic advisory in ${previewLang === "mr" ? "Marathi" : previewLang === "hi" ? "Hindi" : "English"} for ${selectedWard} within ${radiusKm}km radius regarding smoke and particulate pollution spikes.`,
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
      setAdvisoryContent(PRESET_ADVISORIES[previewLang]);
    } finally {
      setGenerating(false);
    }
  };

  const handleSendBroadcast = () => {
    setSentSuccess(true);
    setTimeout(() => {
      onBroadcastSent(`Emergency Public Broadcast pushed to 4,820 residents across ${selectedWard}.`);
      onClose();
      setSentSuccess(false);
    }, 1200);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(42, 33, 27, 0.45)",
        backdropFilter: "blur(10px)",
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "780px",
          maxWidth: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          border: "1px solid var(--border-primary)",
          borderRadius: "var(--radius-3xl)",
          boxShadow: "var(--shadow-xl)",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          animation: "fade-in 0.25s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="label-small" style={{ marginBottom: "6px", color: "var(--pastel-terracotta)" }}>
              📡 Emergency Dispatch & Citizen Broadcast Studio
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Publish Public Health Advisory</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
              Broadcast real-time plume warnings directly to citizens' WhatsApp, SMS, and in-app feeds.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ fontSize: "16px", borderRadius: "50%", width: "32px", height: "32px", padding: 0 }}>
            ✕
          </button>
        </div>

        {/* Split Configuration & Mobile Preview */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px", alignItems: "start" }}>
          {/* Left: Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>Target Ward</label>
                <select
                  className="input"
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  style={{ borderRadius: "var(--radius-md)", fontSize: "13px" }}
                >
                  <option value="Aundh-Baner Ward">Aundh-Baner Ward</option>
                  <option value="Shivajinagar Central">Shivajinagar Central</option>
                  <option value="Hadapsar Industrial Zone">Hadapsar Industrial Zone</option>
                  <option value="Kothrud-Bavdhan Ward">Kothrud-Bavdhan Ward</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>Plume Radius</label>
                <select
                  className="input"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  style={{ borderRadius: "var(--radius-md)", fontSize: "13px" }}
                >
                  <option value="0.5">500m (Immediate Zone)</option>
                  <option value="1.5">1.5 km (Plume Dispersion)</option>
                  <option value="3.0">3.0 km (Ward-Wide)</option>
                </select>
              </div>
            </div>

            {/* Language Switcher for Advisory */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>Advisory Language</label>
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { id: "en" as const, label: "English 🇬🇧" },
                  { id: "hi" as const, label: "हिंदी 🇮🇳" },
                  { id: "mr" as const, label: "मराठी 🚩" },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => handleLangSwitch(l.id)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${previewLang === l.id ? "var(--accent)" : "var(--border-primary)"}`,
                      background: previewLang === l.id ? "var(--accent-bg)" : "var(--bg-elevated)",
                      color: previewLang === l.id ? "var(--accent)" : "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: previewLang === l.id ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dispatch Channels */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>Broadcast Channels:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { key: "whatsapp" as const, label: "🟢 WhatsApp Emergency Push (~3,100 citizens)" },
                  { key: "sms" as const, label: "📱 Municipal SMS Broadcast (~1,720 citizens)" },
                  { key: "appFeed" as const, label: "🔔 In-App Emergency Banner" },
                ].map((c) => (
                  <label key={c.key} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    fontSize: "12px", cursor: "pointer", padding: "8px 12px",
                    background: "var(--bg-elevated)", borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-primary)",
                  }}>
                    <input
                      type="checkbox"
                      checked={channels[c.key]}
                      onChange={(e) => setChannels((prev) => ({ ...prev, [c.key]: e.target.checked }))}
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <span style={{ fontWeight: 500 }}>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleGenerate}
              disabled={generating}
              style={{ width: "100%", borderRadius: "var(--radius-full)", padding: "10px" }}
            >
              {generating ? "✨ Gemini Drafting Localization..." : "✨ Regenerate Advisory with Gemini AI"}
            </button>
          </div>

          {/* Right: Smartphone Mockup Preview */}
          <div style={{
            background: "#2A211B",
            borderRadius: "32px",
            padding: "16px 14px",
            boxShadow: "var(--shadow-xl)",
            border: "4px solid #3F332B",
            color: "#FAF7F2",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            {/* Phone Top Notch */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px", fontSize: "11px", color: "#A3978B", fontFamily: "var(--font-mono)" }}>
              <span>12:45</span>
              <div style={{ width: "40px", height: "4px", background: "#3F332B", borderRadius: "2px" }} />
              <span>5G 🔋</span>
            </div>

            {/* Notification Bubble */}
            <div style={{
              background: "#1F1916",
              borderRadius: "18px",
              padding: "14px",
              border: "1px solid #3F332B",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: "var(--pastel-terracotta)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: "11px",
                }}>
                  🚨
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#FAF7F2" }}>
                  PMC Emergency Alert
                </div>
                <span className="mono" style={{ fontSize: "9px", color: "#8C7E72", marginLeft: "auto" }}>
                  Just Now
                </span>
              </div>

              <div style={{
                fontSize: "12px",
                lineHeight: 1.45,
                color: "#E5DCCF",
                background: "rgba(255,255,255,0.04)",
                padding: "10px 12px",
                borderRadius: "12px",
                borderLeft: "3px solid var(--pastel-terracotta)",
              }}>
                {advisoryContent}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "#8C7E72" }}>
                <span>✓ Delivered via WhatsApp</span>
                <span style={{ color: "var(--pastel-sage)" }}>● Verified PMC Bulletin</span>
              </div>
            </div>

            <div className="mono" style={{ fontSize: "10px", textAlign: "center", color: "#8C7E72" }}>
              Simulated Citizen Smartphone Display
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", borderTop: "1px solid var(--border-primary)", paddingTop: "16px" }}>
          <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSendBroadcast}
            disabled={sentSuccess}
            style={{ flex: 2, background: "var(--pastel-terracotta)", gap: "8px" }}
          >
            <span>🚨</span>
            <span>{sentSuccess ? "✓ Broadcast Sent to 4,820 Citizens!" : "Push Emergency Advisory (4,820 Citizens)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
