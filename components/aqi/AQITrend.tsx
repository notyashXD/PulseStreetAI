"use client";

import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, Line, ReferenceLine,
} from "recharts";
import { AQITrendPoint } from "@/lib/types";
import { aqiColor } from "@/lib/utils";

interface AQITrendProps { data: AQITrendPoint[]; loading?: boolean; }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const aqi = payload[0]?.value;
  const color = aqiColor(aqi);
  return (
    <div style={{
      background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
      border: "1px solid var(--border-primary)", borderRadius: "var(--radius-md)",
      padding: "10px 14px", fontSize: "12px", boxShadow: "var(--shadow-md)",
    }}>
      <div className="mono" style={{ color: "var(--text-dim)", marginBottom: "4px", fontSize: "11px" }}>{label}</div>
      <div className="mono" style={{ color, fontWeight: 700, fontSize: "20px" }}>AQI {aqi}</div>
      <div className="mono" style={{ color: "var(--text-muted)", fontSize: "11px" }}>PM2.5: {payload[1]?.value} µg/m³</div>
    </div>
  );
}

export default function AQITrend({ data, loading }: AQITrendProps) {
  if (loading) {
    return (
      <div className="card" style={{ padding: "28px" }}>
        <div className="shimmer" style={{ height: "200px", borderRadius: "var(--radius-md)" }} />
      </div>
    );
  }
  if (!data.length) return null;

  const maxAQI = Math.max(...data.map((d) => d.aqi));
  const minAQI = Math.min(...data.map((d) => d.aqi));
  const visibleTicks = data.filter((_, i) => i % 4 === 0).map((d) => d.time);

  return (
    <div className="card animate-in" style={{ padding: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>24-Hour AQI Trend</h3>
          <p style={{ fontSize: "13px", color: "var(--text-dim)" }}>Hourly air quality with PM2.5 overlay</p>
        </div>
        <div className="mono" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--severity-high)" }}>Peak {maxAQI}</span>
          {" · "}
          <span style={{ color: "var(--severity-low)" }}>Min {minAQI}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="aqiAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D5A27" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#3D5A27" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="aqiStrokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3D5A27" />
              <stop offset="40%" stopColor="#D4A843" />
              <stop offset="80%" stopColor="#D4645A" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: "#9B9B9B", fontSize: 10, fontFamily: "var(--font-mono)" }} ticks={visibleTicks} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9B9B9B", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={100} stroke="#3D5A27" strokeDasharray="4 4" strokeOpacity={0.2} />
          <ReferenceLine y={150} stroke="#D4A843" strokeDasharray="4 4" strokeOpacity={0.2} />
          <Area type="monotone" dataKey="aqi" stroke="url(#aqiStrokeGradient)" strokeWidth={2} fill="url(#aqiAreaGradient)" dot={false} activeDot={{ r: 4, fill: "#3D5A27", stroke: "#fff", strokeWidth: 2 }} />
          <Line type="monotone" dataKey="pm25" stroke="#4B8FCC" strokeWidth={1} dot={false} strokeDasharray="3 3" opacity={0.5} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mono" style={{ display: "flex", gap: "20px", marginTop: "16px", fontSize: "10px", color: "var(--text-dim)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "14px", height: "2px", background: "var(--accent)", borderRadius: "1px", display: "inline-block" }} /> AQI
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "14px", height: "2px", background: "var(--sky)", borderRadius: "1px", display: "inline-block", opacity: 0.5 }} /> PM2.5
        </span>
        <span style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <span><span style={{ color: "var(--accent)" }}>■</span> Good ≤100</span>
          <span><span style={{ color: "var(--amber)" }}>■</span> Moderate ≤150</span>
        </span>
      </div>
    </div>
  );
}
