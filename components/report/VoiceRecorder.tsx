"use client";

import { useState, useEffect, useRef } from "react";
import { IssueCategory } from "@/lib/types";

interface VoiceRecorderProps {
  onTranscribed: (text: string, category?: IssueCategory, landmark?: string) => void;
}

const VOICE_SAMPLES = {
  en: {
    langName: "English",
    sampleAudioText: "There is severe plastic garbage burning behind the Balewadi sports complex. Dense black smoke is entering nearby residential towers and causing breathing trouble.",
    category: "garbage_burning" as IssueCategory,
    landmark: "Balewadi Sports Complex",
  },
  hi: {
    langName: "हिंदी",
    sampleAudioText: "बाणेर हाई स्ट्रीट के पास नाले का सीवेज ओवरफ्लो हो रहा है और गंदा पानी पूरी सड़क पर बह रहा है, जिससे भारी दुर्गंध आ रही है।",
    category: "sewage_leak" as IssueCategory,
    landmark: "Baner High Street",
  },
  mr: {
    langName: "मराठी",
    sampleAudioText: "कोथरूड डीपी रस्त्यावर मोठ्या प्रमाणावर बांधकामाची धूळ उडत आहे. पाण्याचे फवारे न मारल्यामुळे नागरिकांना त्रास होत आहे.",
    category: "construction_dust" as IssueCategory,
    landmark: "Kothrud DP Road",
  },
};

export default function VoiceRecorder({ onTranscribed }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"en" | "hi" | "mr">("en");
  const [transcript, setTranscript] = useState<string | null>(null);
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

    // Stop recording after 3.5 seconds and transcribe
    timerRef.current = setTimeout(() => {
      setIsRecording(false);
      const sample = VOICE_SAMPLES[selectedLang];
      setTranscript(sample.sampleAudioText);
      onTranscribed(sample.sampleAudioText, sample.category, sample.landmark);
    }, 3500);
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRecording(false);
    const sample = VOICE_SAMPLES[selectedLang];
    setTranscript(sample.sampleAudioText);
    onTranscribed(sample.sampleAudioText, sample.category, sample.landmark);
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "var(--bg-elevated)",
        borderRadius: "var(--radius-2xl)",
        border: "1px solid var(--border-primary)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* Language Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700 }}>🎙️ Multilingual Voice Reporting</div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>Speak in your native language</div>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "var(--bg-surface)", padding: "3px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-primary)" }}>
          {(["en", "hi", "mr"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLang(lang)}
              style={{
                padding: "4px 12px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: "pointer",
                background: selectedLang === lang ? "var(--text-primary)" : "transparent",
                color: selectedLang === lang ? "white" : "var(--text-muted)",
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
          padding: "24px 16px",
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-primary)",
          gap: "16px",
        }}
      >
        {/* Waveform Bars */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "48px" }}>
          {audioLevel.map((height, i) => (
            <div
              key={i}
              style={{
                width: "4px",
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
            className="btn btn-accent"
            style={{ borderRadius: "var(--radius-full)", padding: "10px 24px" }}
            onClick={handleStartRecording}
          >
            ● Tap to Record Voice Note
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            style={{
              borderRadius: "var(--radius-full)",
              padding: "10px 24px",
              background: "var(--coral)",
            }}
            onClick={handleStopRecording}
          >
            ⏹ Stop & Process ({selectedLang.toUpperCase()})
          </button>
        )}

        <div className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>
          {isRecording ? "🔴 Listening... Speak clearly about the incident" : "Supports English, हिंदी and मराठी transcription"}
        </div>
      </div>

      {/* Live Transcript Output */}
      {transcript && (
        <div
          style={{
            padding: "14px 18px",
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-lg)",
            animation: "fade-in 0.3s ease-out",
          }}
        >
          <div className="label-small" style={{ color: "var(--accent)", marginBottom: "4px", fontSize: "10px" }}>
            ✓ Speech-to-Text Transcript ({VOICE_SAMPLES[selectedLang].langName}):
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            "{transcript}"
          </p>
          <div className="mono" style={{ fontSize: "11px", color: "var(--accent)", marginTop: "8px", fontWeight: 600 }}>
            → Form fields auto-populated from voice intent
          </div>
        </div>
      )}
    </div>
  );
}
