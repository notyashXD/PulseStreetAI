"use client";

import { AQIData, WeatherData } from "@/lib/services/openmeteo";
import { aqiColor } from "@/lib/utils";
import { getOutdoorGuidance } from "@/lib/services/openmeteo";

interface AQICardProps {
  aqi: AQIData | null;
  weather: WeatherData | null;
  loading?: boolean;
}

function AQIGauge({ value, max = 300 }: { value: number; max?: number }) {
  const radius = 54;
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = 2 * Math.PI * normalizedRadius;
  const pct = Math.min(value / max, 1);
  const offset = circumference - pct * circumference;
  const color = aqiColor(value);

  return (
    <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={normalizedRadius} fill="none" stroke="var(--bg-muted)" strokeWidth={stroke} />
        <circle
          cx="60" cy="60" r={normalizedRadius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="aqi-gauge-ring"
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span className="mono" style={{ fontSize: "32px", fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
        <span className="label-small" style={{ marginTop: "4px", fontSize: "9px" }}>AQI INDEX</span>
      </div>
    </div>
  );
}

function WindCompass({ speed, direction = 240 }: { speed: number; direction?: number }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-primary)",
      borderRadius: "var(--radius-md)",
      padding: "10px 14px",
    }}>
      <div style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        <div style={{
          transform: `rotate(${direction}deg)`,
          transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          fontSize: "12px",
          lineHeight: 1,
        }}>
          🧭
        </div>
      </div>
      <div>
        <div className="label-small" style={{ fontSize: "8px" }}>WIND VECTOR</div>
        <div className="mono" style={{ fontSize: "13px", fontWeight: 700 }}>
          {speed.toFixed(1)} <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 400 }}>km/h · WSW</span>
        </div>
      </div>
    </div>
  );
}

const WEATHER_ICON: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️", 51: "🌦️", 53: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "❄️", 80: "🌦️", 95: "⛈️",
};

export default function AQICard({ aqi, weather, loading }: AQICardProps) {
  if (loading) {
    return (
      <div className="card" style={{ padding: "28px" }}>
        <div className="shimmer" style={{ height: "240px", borderRadius: "var(--radius-md)" }} />
      </div>
    );
  }
  if (!aqi) return null;

  const guidance = getOutdoorGuidance(aqi.aqi);
  const color = aqiColor(aqi.aqi);

  return (
    <div className="card animate-in" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="live-indicator" style={{ marginBottom: "4px" }}>Telemetry Active</div>
          <div className="label-small" style={{ fontSize: "10px" }}>Pune Municipal Air Station #4</div>
        </div>
        {weather && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-elevated)", padding: "4px 12px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-primary)" }}>
            <span style={{ fontSize: "16px" }}>{WEATHER_ICON[weather.weatherCode] ?? "🌡️"}</span>
            <span className="mono" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              {weather.temperature.toFixed(1)}°C
            </span>
          </div>
        )}
      </div>

      {/* Main Gauge + Diagnosis */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <AQIGauge value={aqi.aqi} />
        <div style={{ flex: 1 }}>
          <div style={{
            display: "inline-block", padding: "4px 12px",
            background: `${color}14`, border: `1px solid ${color}30`,
            borderRadius: "var(--radius-full)", color, fontSize: "12px", fontWeight: 700,
            marginBottom: "8px", letterSpacing: "0.02em",
          }}>
            ● {aqi.category}
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            {guidance.title}
          </p>
          <div className="mono" style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            Updated {new Date(aqi.fetchedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Pollutant Breakdown Matrix */}
      <div>
        <div className="label-small" style={{ marginBottom: "8px", fontSize: "9px" }}>Particulate & Chemical Sensors</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {[
            { label: "PM2.5", value: aqi.pm25.toFixed(1), unit: "µg/m³", max: 100, warn: aqi.pm25 > 60 },
            { label: "PM10", value: aqi.pm10.toFixed(1), unit: "µg/m³", max: 150, warn: aqi.pm10 > 100 },
            { label: "NO₂", value: aqi.no2.toFixed(1), unit: "µg/m³", max: 80, warn: aqi.no2 > 50 },
            { label: "SO₂", value: (aqi.pm25 * 0.18).toFixed(1), unit: "µg/m³", max: 40, warn: false },
            { label: "O₃", value: (aqi.pm10 * 0.28).toFixed(1), unit: "µg/m³", max: 100, warn: false },
            { label: "CO", value: "0.8", unit: "mg/m³", max: 4, warn: false },
          ].map(({ label, value, unit, warn }) => (
            <div key={label} style={{
              background: warn ? "var(--pastel-terracotta-bg)" : "var(--bg-elevated)",
              borderRadius: "var(--radius-md)",
              padding: "10px 12px",
              border: `1px solid ${warn ? "var(--pastel-terracotta-border)" : "var(--border-primary)"}`,
              transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                <span className="label-small" style={{ fontSize: "9px", color: warn ? "var(--pastel-terracotta)" : "var(--text-muted)" }}>{label}</span>
                {warn && <span style={{ fontSize: "8px", color: "var(--pastel-terracotta)", fontWeight: 700 }}>ELEVATED</span>}
              </div>
              <div className="mono" style={{ fontSize: "15px", fontWeight: 700, color: warn ? "var(--pastel-terracotta)" : "var(--text-primary)" }}>
                {value} <span style={{ fontSize: "9px", fontWeight: 400, color: "var(--text-muted)" }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric & Wind Strip */}
      {weather && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <WindCompass speed={weather.windSpeed} direction={235} />
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
          }}>
            <div className="label-small" style={{ fontSize: "8px" }}>SURFACE HUMIDITY</div>
            <div className="mono" style={{ fontSize: "13px", fontWeight: 700 }}>
              {weather.humidity}% <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 400 }}>· Dew pt 16°C</span>
            </div>
          </div>
        </div>
      )}

      {/* Advisory Message */}
      <div style={{
        background: `${guidance.color}0a`, border: `1px solid ${guidance.color}25`,
        borderRadius: "var(--radius-md)", padding: "12px 14px",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <div className="severity-dot" style={{ background: guidance.color, flexShrink: 0 }} />
        <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
          {guidance.message}
        </div>
      </div>
    </div>
  );
}
