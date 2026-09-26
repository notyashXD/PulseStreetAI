"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "📋 Morning Dispatch Briefing",
  "📢 Trilingual Air Quality Advisory",
  "🔥 Summarize High-Risk Hotspots",
  "⚡ Incidents Exceeding SLA",
];

export default function CivicCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `### 🤖 Pulse — Civic Intelligence Assistant\n\nI am **Pulse**, your municipal intelligence assistant for StreetPulse. I synthesize live environmental telemetry (Open-Meteo AQI & wind), incoming citizen hazard reports, and algorithmic triage priority across Pune.\n\nAsk me anything or select a rapid operations action below:`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionSuggestions, setActionSuggestions] = useState<string[]>([
    "Generate Field Briefing",
    "Draft Citizen SMS",
    "Identify Hotspots",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => {
        const next = !prev;
        window.dispatchEvent(new CustomEvent(next ? "open-pulse-copilot" : "close-pulse-copilot"));
        return next;
      });
    };
    window.addEventListener("toggle-pulse-copilot", handleToggle);
    return () => window.removeEventListener("toggle-pulse-copilot", handleToggle);
  }, []);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent("close-pulse-copilot"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const closePanel = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("close-pulse-copilot"));
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, aqi: 142 }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
        if (data.actionSuggestions) {
          setActionSuggestions(data.actionSuggestions);
        }
      } else {
        throw new Error("Copilot response error");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Unable to reach intelligence server. Please verify network connectivity or API credentials.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={closePanel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(42, 33, 27, 0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 1190,
          animation: "fade-in 0.2s ease-out",
        }}
      />

      {/* Slide-over Right Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "460px",
          maxWidth: "100vw",
          height: "100vh",
          background: "#FAF7F2",
          borderLeft: "1px solid var(--border-primary)",
          boxShadow: "-12px 0 36px rgba(42, 33, 27, 0.18)",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Panel Header */}
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid var(--border-primary)",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
                fontSize: "18px",
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)" }}>
                  Pulse AI
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                    color: "var(--accent)",
                  }}
                >
                  GEMINI 2.5
                </span>
              </div>
              <div className="label-small" style={{ fontSize: "10px", marginTop: "1px", color: "var(--text-muted)" }}>
                Autonomous Municipal Intelligence
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Live Telemetry Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 8px",
                borderRadius: "var(--radius-full)",
                background: "rgba(212, 168, 67, 0.12)",
                border: "1px solid rgba(212, 168, 67, 0.3)",
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--amber)",
              }}
            >
              <span className="live-pulse-dot" style={{ width: "5px", height: "5px", background: "var(--amber)" }} />
              <span>AQI 142</span>
            </div>

            {/* Close Button */}
            <button
              onClick={closePanel}
              className="btn btn-ghost btn-sm"
              style={{
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                color: "var(--text-muted)",
              }}
              title="Close panel (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Quick Prompts Ribbon */}
        <div
          style={{
            padding: "10px 18px",
            borderBottom: "1px solid var(--border-primary)",
            background: "var(--bg-canvas)",
            overflowX: "auto",
            display: "flex",
            gap: "8px",
            whiteSpace: "nowrap",
          }}
        >
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              style={{
                padding: "5px 12px",
                background: "#FFFFFF",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-full)",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                flexShrink: 0,
                transition: "all 0.15s ease",
                boxShadow: "0 1px 2px rgba(42, 33, 27, 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-primary)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Container */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                  padding: "12px 16px",
                  borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: isUser ? "var(--accent)" : "#FFFFFF",
                  color: isUser ? "#FFFFFF" : "var(--text-primary)",
                  border: isUser ? "none" : "1px solid var(--border-primary)",
                  boxShadow: isUser ? "0 2px 8px rgba(140, 94, 60, 0.25)" : "0 1px 3px rgba(42, 33, 27, 0.04)",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{
                    __html: m.content
                      .replace(/### (.*?)\n/g, '<div style="font-weight:700;font-size:14px;margin-bottom:6px;color:var(--text-primary);">$1</div>')
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/> (.*?)\n/g, '<blockquote style="border-left:2px solid var(--accent);padding-left:8px;margin:6px 0;color:var(--text-muted);">$1</blockquote>'),
                  }}
                />
              </div>
            );
          })}

          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                padding: "12px 16px",
                borderRadius: "16px 16px 16px 4px",
                background: "#FFFFFF",
                border: "1px solid var(--border-primary)",
                fontSize: "12px",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="live-pulse-dot" style={{ background: "var(--accent)" }} />
              <span>Analyzing live Pune telemetry and generating operational assessment...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Suggestions Chips */}
        {actionSuggestions.length > 0 && (
          <div
            style={{
              padding: "8px 18px",
              background: "#FFFFFF",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              borderTop: "1px solid var(--border-primary)",
            }}
          >
            {actionSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                disabled={loading}
                style={{
                  padding: "4px 10px",
                  background: "var(--accent-bg)",
                  border: "1px solid var(--accent-border)",
                  color: "var(--accent)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                }}
              >
                + {s}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Input Area */}
        <div
          style={{
            padding: "14px 18px",
            borderTop: "1px solid var(--border-primary)",
            background: "#FFFFFF",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <input
            className="input"
            style={{
              borderRadius: "var(--radius-full)",
              fontSize: "13px",
              padding: "10px 16px",
              background: "var(--bg-canvas)",
              flex: 1,
            }}
            placeholder="Ask Pulse (e.g. 'Draft Hadapsar briefing')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            className="btn btn-primary btn-sm"
            style={{ borderRadius: "var(--radius-full)", padding: "10px 18px", fontSize: "12.5px", fontWeight: 700 }}
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
