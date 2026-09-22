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
      low: "#556E46",
      medium: "#B38038",
      high: "#B65545",
      critical: "#7E5B72",
    }[severity] ?? "#8C7E72"
  );
}

export function severityBg(severity: string): string {
  return (
    {
      low: "bg-[#556E46]/10 text-[#556E46] border-[#556E46]/20",
      medium: "bg-[#B38038]/10 text-[#B38038] border-[#B38038]/20",
      high: "bg-[#B65545]/10 text-[#B65545] border-[#B65545]/20",
      critical: "bg-[#7E5B72]/10 text-[#7E5B72] border-[#7E5B72]/20",
    }[severity] ?? "bg-[#8C7E72]/10 text-[#8C7E72] border-[#8C7E72]/20"
  );
}

export function statusBg(status: string): string {
  return (
    {
      reported: "bg-[#4E6F87]/10 text-[#4E6F87] border-[#4E6F87]/20",
      triaged: "bg-[#B38038]/10 text-[#B38038] border-[#B38038]/20",
      verified: "bg-[#4E6F87]/10 text-[#4E6F87] border-[#4E6F87]/20",
      assigned: "bg-[#8C5E3C]/10 text-[#8C5E3C] border-[#8C5E3C]/20",
      in_progress: "bg-[#B38038]/10 text-[#B38038] border-[#B38038]/20",
      resolved: "bg-[#556E46]/10 text-[#556E46] border-[#556E46]/20",
      rejected: "bg-[#8C7E72]/10 text-[#8C7E72] border-[#8C7E72]/20",
    }[status] ?? "bg-[#8C7E72]/10 text-[#8C7E72] border-[#8C7E72]/20"
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
  if (aqi <= 50) return "#556E46";
  if (aqi <= 100) return "#6B7F52";
  if (aqi <= 150) return "#B38038";
  if (aqi <= 200) return "#B65545";
  if (aqi <= 300) return "#7E5B72";
  return "#5E3A4E";
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "…";
}
