import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function severityColor(severity: string): string {
  return (
    {
      low: "#3D5A27",
      medium: "#D4A843",
      high: "#D4645A",
      critical: "#7B61A8",
    }[severity] ?? "#6B6B6B"
  );
}

export function severityBg(severity: string): string {
  return (
    {
      low: "bg-green-500/15 text-green-400 border-green-500/30",
      medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      high: "bg-red-500/15 text-red-400 border-red-500/30",
      critical: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    }[severity] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30"
  );
}

export function statusBg(status: string): string {
  return (
    {
      reported: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      triaged: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      verified: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
      assigned: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      in_progress: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      resolved: "bg-green-500/15 text-green-400 border-green-500/30",
      rejected: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    }[status] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30"
  );
}

export function categoryIcon(category: string): string {
  return (
    {
      garbage_burning: "🔥",
      illegal_dumping: "🗑️",
      smoke: "💨",
      sewage_leak: "🚿",
      construction_dust: "🏗️",
      blocked_drain: "🌊",
      litter: "♻️",
      other: "⚠️",
    }[category] ?? "⚠️"
  );
}

export function aqiColor(aqi: number): string {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#84cc16";
  if (aqi <= 150) return "#f59e0b";
  if (aqi <= 200) return "#ef4444";
  if (aqi <= 300) return "#a855f7";
  return "#991b1b";
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "…";
}
