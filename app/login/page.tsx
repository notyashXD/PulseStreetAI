"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, PRESET_USERS, UserRole } from "@/lib/auth/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole, currentUser } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleTabSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin");
    } else {
      setUsername("user");
      setPassword("user");
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const res = login(username, password);
      setLoading(false);
      if (res.success) {
        if (username.trim().toLowerCase() === "admin") {
          router.push("/command");
        } else {
          router.push("/");
        }
      } else {
        setError(res.error || "Login failed");
      }
    }, 300);
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    if (role === "admin") {
      router.push("/command");
    } else {
      router.push("/");
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - var(--nav-height) - 40px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
    }}>
      <div style={{ maxWidth: "560px", width: "100%" }} className="animate-in">
        {/* Card */}
        <div className="card" style={{
          padding: "40px 36px",
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-3xl)",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-primary)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 14px",
              borderRadius: "var(--radius-full)",
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: "14px",
            }}>
              <span>🔐 Role-Based Access Control</span>
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
              Sign In to StreetPulse
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Choose your role to access municipal operator controls or citizen hazard reporting tools.
            </p>
          </div>

          {/* Role selector tabs */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            background: "var(--bg-elevated)",
            padding: "6px",
            borderRadius: "var(--radius-xl)",
            marginBottom: "28px",
            border: "1px solid var(--border-primary)",
          }}>
            <button
              type="button"
              onClick={() => handleRoleTabSelect("admin")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "12px 14px",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: selectedRole === "admin" ? "var(--bg-surface)" : "transparent",
                color: selectedRole === "admin" ? "var(--accent)" : "var(--text-muted)",
                boxShadow: selectedRole === "admin" ? "var(--shadow-sm)" : "none",
                fontWeight: selectedRole === "admin" ? 700 : 500,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: "20px" }}>👑</span>
              <span>Municipal Admin</span>
              <span style={{ fontSize: "10px", color: "var(--text-dim)", fontWeight: 500 }}>All Access & Command</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabSelect("user")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "12px 14px",
                borderRadius: "var(--radius-lg)",
                border: "none",
                background: selectedRole === "user" ? "var(--bg-surface)" : "transparent",
                color: selectedRole === "user" ? "var(--pastel-sage)" : "var(--text-muted)",
                boxShadow: selectedRole === "user" ? "var(--shadow-sm)" : "none",
                fontWeight: selectedRole === "user" ? 700 : 500,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: "20px" }}>👤</span>
              <span>Resident Citizen</span>
              <span style={{ fontSize: "10px", color: "var(--text-dim)", fontWeight: 500 }}>Reporting & Feed</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username ('admin' or 'user')"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-primary)",
                  background: "var(--bg-base)",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password ('admin' or 'user')"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-primary)",
                  background: "var(--bg-base)",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                background: "var(--pastel-terracotta-bg)",
                border: "1px solid var(--pastel-terracotta-border)",
                color: "var(--pastel-terracotta)",
                fontSize: "12px",
                fontWeight: 600,
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "var(--radius-xl)",
                fontSize: "14px",
                fontWeight: 700,
                marginTop: "4px",
              }}
            >
              {loading ? "Authenticating..." : `Sign in as ${selectedRole === "admin" ? "Municipal Admin" : "Citizen"}`}
            </button>
          </form>

          {/* Quick 1-Click login buttons */}
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed var(--border-primary)" }}>
            <div className="label-small" style={{ textAlign: "center", marginBottom: "12px", fontSize: "10px" }}>
              ⚡ 1-Click Demo Access
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="btn btn-secondary btn-sm"
                style={{
                  padding: "10px",
                  fontSize: "12px",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  borderColor: "var(--accent-border)",
                  color: "var(--accent)",
                }}
              >
                <span>👑</span>
                <span>Demo Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("user")}
                className="btn btn-secondary btn-sm"
                style={{
                  padding: "10px",
                  fontSize: "12px",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  borderColor: "var(--pastel-sage-border)",
                  color: "var(--pastel-sage)",
                }}
              >
                <span>👤</span>
                <span>Demo Citizen</span>
              </button>
            </div>
          </div>

          {/* Role Comparison Table */}
          <div style={{
            marginTop: "24px",
            background: "var(--bg-elevated)",
            padding: "16px",
            borderRadius: "var(--radius-xl)",
            fontSize: "12px",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-primary)",
          }}>
            <div style={{ fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
              {selectedRole === "admin" ? "👑 Admin Permissions" : "👤 Citizen Permissions"}
            </div>
            {selectedRole === "admin" ? (
              <ul style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "11.5px" }}>
                <li><strong>Command Center:</strong> Full map triage, SLA countdowns, priority filter.</li>
                <li><strong>Squad Dispatch:</strong> Mobilize water misting & hazmat teams with ETAs.</li>
                <li><strong>AI Visual Audit:</strong> Before/After remediation verification with Gemini.</li>
                <li><strong>Broadcasts:</strong> Send trilingual WhatsApp/SMS alerts to residents.</li>
              </ul>
            ) : (
              <ul style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "11.5px" }}>
                <li><strong>Hazard Reporting:</strong> 3-step reporting with camera AI classification.</li>
                <li><strong>Live AQI Telemetry:</strong> Hyper-local PM2.5, PM10 & weather forecasts.</li>
                <li><strong>Citizen Feed:</strong> Community upvoting and status progress tracking.</li>
                <li><strong>Ward Leaderboards:</strong> Track cleanliness rankings across Pune.</li>
              </ul>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", fontWeight: 600 }}>
            ← Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
