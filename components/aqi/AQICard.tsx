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
  const stroke = 5;
  const normalizedRadius = radius - stroke;
  const circumference = 2 * Math.PI * normalizedRadius;
  const pct = Math.min(value / max, 1);
  const offset = circumference - pct * circumference;
  const color = aqiColor(value);

  return (
    <div style={{ position: "relative", width: "120px", height: "120px" }}>
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
        <span className="mono" style={{ fontSize: "32px", fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
        <span className="label-small" style={{ marginTop: "4px", fontSize: "9px" }}>AQI</span>
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
        <div className="shimmer" style={{ height: "200px", borderRadius: "var(--radius-md)" }} />
      </div>
    );
  }
  if (!aqi) return null;

  const guidance = getOutdoorGuidance(aqi.aqi);
  const color = aqiColor(aqi.aqi);

  return (
    <div className="card animate-in" style={{ padding: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <div className="live-indicator" style={{ marginBottom: "6px" }}>Live</div>
          <div className="label-small" style={{ fontSize: "10px" }}>Open-Meteo Telemetry</div>
        </div>
        {weather && (
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "20px" }}>{WEATHER_ICON[weather.weatherCode] ?? "🌡️"}</span>
            <div className="mono" style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              {weather.temperature.toFixed(1)}°C
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
        <AQIGauge value={aqi.aqi} />
        <div style={{ flex: 1 }}>
          <div style={{
            display: "inline-block", padding: "3px 10px",
            background: `${color}10`, border: `1px solid ${color}25`,
            borderRadius: "var(--radius-full)", color, fontSize: "12px", fontWeight: 600,
            marginBottom: "8px",
          }}>
            {aqi.category}
          </div>
          <div className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>
            {new Date(aqi.fetchedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "PM2.5", value: aqi.pm25.toFixed(1), unit: "µg/m³" },
          { label: "PM10", value: aqi.pm10.toFixed(1), unit: "µg/m³" },
          { label: "NO₂", value: aqi.no2.toFixed(1), unit: "µg/m³" },
        ].map(({ label, value, unit }) => (
          <div key={label} style={{
            background: "var(--bg-elevated)", borderRadius: "var(--radius-md)",
            padding: "12px", border: "1px solid var(--border-primary)",
          }}>
            <div className="label-small" style={{ fontSize: "9px", marginBottom: "4px" }}>{label}</div>
            <div className="mono" style={{ fontSize: "16px", fontWeight: 600 }}>{value}</div>
            <div style={{ fontSize: "10px", color: "var(--text-dim)" }}>{unit}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: `${guidance.color}08`, border: `1px solid ${guidance.color}18`,
        borderRadius: "var(--radius-md)", padding: "12px 14px",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <div className="severity-dot" style={{ background: guidance.color, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: guidance.color }}>{guidance.title}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "1px" }}>{guidance.message}</div>
        </div>
      </div>

      {weather && (
        <div className="mono" style={{ marginTop: "14px", display: "flex", gap: "16px", fontSize: "11px", color: "var(--text-dim)" }}>
          <span>Humidity {weather.humidity}%</span>
          <span>Wind {weather.windSpeed.toFixed(1)} km/h</span>
        </div>
      )}
    </div>
  );
}
