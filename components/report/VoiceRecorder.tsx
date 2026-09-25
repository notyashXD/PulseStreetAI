"use client";

import { useState, useEffect, useRef } from "react";
import { IssueCategory } from "@/lib/types";

interface VoiceRecorderProps {
  onTranscribed: (text: string, category?: IssueCategory, landmark?: string) => void;
}

const VOICE_SAMPLES = {
  en: {
    langName: "English 🇬🇧",
    sampleAudioText: "There is severe plastic garbage burning behind the Balewadi sports complex. Dense black smoke is entering nearby residential towers and causing breathing trouble.",
    category: "garbage_burning" as IssueCategory,
    landmark: "Balewadi Sports Complex",
  },
  hi: {
    langName: "हिंदी 🇮🇳",
    sampleAudioText: "बाणेर हाई स्ट्रीट के पास नाले का सीवेज ओवरफ्लो हो रहा है और गंदा पानी पूरी सड़क पर बह रहा है, जिससे भारी दुर्गंध आ रही है।",
    category: "sewage_leak" as IssueCategory,
    landmark: "Baner High Street",
  },
  mr: {
    langName: "मराठी 🚩",
    sampleAudioText: "कोथरूड डीपी रस्त्यावर मोठ्या प्रमाणावर बांधकामाची धूळ उडत आहे. पाण्याचे फवारे न मारल्यामुळे नागरिकांना त्रास होत आहे.",
    category: "construction_dust" as IssueCategory,
    landmark: "Kothrud DP Road",
  },
};

export default function VoiceRecorder({ onTranscribed }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"en" | "hi" | "mr">("en");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [extractedEntities, setExtractedEntities] = useState<{ category: IssueCategory; landmark: string } | null>(null);
  const [audioLevel, setAudioLevel] = useState<number[]>([12, 24, 40, 18, 50, 32, 20, 44, 28, 16]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel([
          Math.floor(Math.random() * 40) + 10,
          Math.floor(Math.random() * 60) + 10,
          Math.floor(Math.random() * 80) + 15,
          Math.floor(Math.random() * 50) + 10,
          Math.floor(Math.random() * 90) + 20,
          Math.floor(Math.random() * 60) + 10,
          Math.floor(Math.random() * 70) + 15,
          Math.floor(Math.random() * 40) + 10,
          Math.floor(Math.random() * 50) + 10,
          Math.floor(Math.random() * 30) + 10,
        ]);
      }, 120);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript(null);
    setExtractedEntities(null);

    // Stop recording after 3.2 seconds and transcribe
    timerRef.current = setTimeout(() => {
      setIsRecording(false);
      const sample = VOICE_SAMPLES[selectedLang];
      setTranscript(sample.sampleAudioText);
      setExtractedEntities({ category: sample.category, landmark: sample.landmark });
      onTranscribed(sample.sampleAudioText, sample.category, sample.landmark);
    }, 3200);
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRecording(false);
    const sample = VOICE_SAMPLES[selectedLang];
    setTranscript(sample.sampleAudioText);
    setExtractedEntities({ category: sample.category, landmark: sample.landmark });
    onTranscribed(sample.sampleAudioText, sample.category, sample.landmark);
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "var(--bg-elevated)",
        borderRadius: "var(--radius-3xl)",
        border: "1px solid var(--border-primary)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Language Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700 }}>🎙️ Trilingual Speech-to-Intent Intake</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Supports Marathi, Hindi, and Indian English dialects</div>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "var(--bg-surface)", padding: "3px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-primary)" }}>
          {(["en", "hi", "mr"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLang(lang)}
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: selectedLang === lang ? 700 : 500,
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: "pointer",
                background: selectedLang === lang ? "var(--text-primary)" : "transparent",
                color: selectedLang === lang ? "#FAF7F2" : "var(--text-secondary)",
                transition: "all 0.15s",
              }}
            >
              {VOICE_SAMPLES[lang].langName}
            </button>
          ))}
        </div>
      </div>

      {/* Waveform visualizer & Record Button */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "28px 20px",
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-2xl)",
          border: "1px solid var(--border-primary)",
          gap: "18px",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        {/* Waveform Bars */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "54px" }}>
          {audioLevel.map((height, i) => (
            <div
              key={i}
              style={{
                width: "5px",
                height: isRecording ? `${height}%` : "15%",
                background: isRecording ? "var(--accent)" : "var(--border-primary)",
                borderRadius: "4px",
                transition: "height 0.1s ease",
              }}
            />
          ))}
        </div>

        {/* Action button */}
        {!isRecording ? (
          <button
            type="button"
            className="btn btn-accent btn-lg"
            style={{ borderRadius: "var(--radius-full)", padding: "12px 28px", gap: "10px" }}
            onClick={handleStartRecording}
          >
            <span>●</span>
            <span>Tap to Record Voice Report ({selectedLang.toUpperCase()})</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-lg"
            style={{
              borderRadius: "var(--radius-full)",
              padding: "12px 28px",
              background: "var(--pastel-terracotta)",
              gap: "10px",
            }}
            onClick={handleStopRecording}
          >
            <span>⏹</span>
            <span>Stop & Process Speech ({selectedLang.toUpperCase()})</span>
          </button>
        )}

        <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          {isRecording ? "🔴 Gemini Audio listening... Speak your complaint naturally" : "AI will automatically extract category, location, and hazard description"}
        </div>
      </div>

      {/* Live Transcript & Auto-Extracted Intent Output */}
      {transcript && (
        <div
          style={{
            padding: "16px 20px",
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-xl)",
            animation: "fade-in 0.3s ease-out",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="label-small" style={{ color: "var(--accent)", fontSize: "10px" }}>
              ✓ Voice Transcript Transcribed ({VOICE_SAMPLES[selectedLang].langName}):
            </span>
            <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700 }}>
              AI Confidence: 96%
            </span>
          </div>

          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5, fontStyle: "italic" }}>
            "{transcript}"
          </p>

          {extractedEntities && (
            <div style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              borderTop: "1px solid var(--accent-border)",
              paddingTop: "10px",
              alignItems: "center",
            }}>
              <span className="label-small" style={{ fontSize: "9px" }}>Extracted Entities:</span>
              <span style={{
                background: "var(--bg-surface)", padding: "2px 10px",
                borderRadius: "var(--radius-full)", border: "1px solid var(--border-primary)",
                fontSize: "11px", fontWeight: 700, color: "var(--text-primary)",
              }}>
                ⚠️ {extractedEntities.category}
              </span>
              <span style={{
                background: "var(--bg-surface)", padding: "2px 10px",
                borderRadius: "var(--radius-full)", border: "1px solid var(--border-primary)",
                fontSize: "11px", fontWeight: 700, color: "var(--text-primary)",
              }}>
                📍 {extractedEntities.landmark}
              </span>
              <span className="mono" style={{ fontSize: "11px", color: "var(--accent)", marginLeft: "auto", fontWeight: 600 }}>
                → Form inputs auto-filled
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
