"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "📋 Generate Morning Dispatch Briefing",
  "📢 Draft Trilingual Air Quality Advisory",
  "🔥 Summarize High-Risk Garbage Burning Hotspots",
  "⚡ Which incidents exceed 24h SLA?",
];

export default function CivicCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `### 🤖 Pulse — Civic Intelligence Assistant\n\nI am Pulse, your civic intelligence assistant for StreetPulse. I monitor live environmental sensors, citizen reports, and municipal triage across Pune.\n\nAsk me anything or pick a quick action below:`,
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
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

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
          content: "⚠️ Unable to reach intelligence server. Please verify network or API keys.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 999,
          background: "var(--text-primary)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-full)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          boxShadow: "var(--shadow-lg)",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          fontWeight: 600,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          ✨
        </div>
        <span>Pulse</span>
        <span
          style={{
            background: "var(--accent-bg)",
            color: "var(--accent)",
            border: "1px solid var(--accent-border)",
            fontSize: "10px",
            padding: "2px 6px",
            borderRadius: "var(--radius-full)",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          LIVE
        </span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "84px",
            right: "28px",
            width: "440px",
            maxWidth: "calc(100vw - 40px)",
            height: "620px",
            maxHeight: "calc(100vh - 120px)",
            background: "var(--bg-card)",
            border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "var(--shadow-xl)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-primary)",
              background: "var(--bg-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--accent-bg)",
                  border: "1px solid var(--accent-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  fontSize: "16px",
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>Pulse AI</div>
                <div className="label-small" style={{ fontSize: "9px" }}>Civic Intelligence · Powered by Gemini</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm"
              style={{ padding: "4px 8px", fontSize: "16px", color: "var(--text-muted)" }}
            >
              ✕
            </button>
          </div>

          {/* Quick Prompts Ribbon */}
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid var(--border-primary)",
              background: "var(--bg-surface)",
              overflowX: "auto",
              display: "flex",
              gap: "6px",
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
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-elevated)";
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
              padding: "16px 20px",
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
                    maxWidth: "88%",
                    padding: "12px 16px",
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: isUser ? "var(--text-primary)" : "var(--bg-elevated)",
                    color: isUser ? "white" : "var(--text-primary)",
                    border: isUser ? "none" : "1px solid var(--border-primary)",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{ whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{
                      __html: m.content
                        .replace(/### (.*?)\n/g, '<div style="font-weight:700;font-size:14px;margin-bottom:6px;">$1</div>')
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
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-primary)",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                <span className="live-indicator">Analyzing municipal records...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Suggestions Chips */}
          {actionSuggestions.length > 0 && (
            <div
              style={{
                padding: "6px 14px",
                background: "var(--bg-surface)",
                display: "flex",
                gap: "6px",
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
                    fontSize: "10px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    flexShrink: 0,
                  }}
                >
                  + {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--border-primary)",
              background: "var(--bg-elevated)",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              className="input"
              style={{
                borderRadius: "var(--radius-full)",
                fontSize: "13px",
                padding: "8px 16px",
                background: "var(--bg-surface)",
              }}
              placeholder="Ask Pulse (e.g. 'Draft Hadapsar briefing')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button
              className="btn btn-primary btn-sm"
              style={{ borderRadius: "var(--radius-full)", padding: "0 16px" }}
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
