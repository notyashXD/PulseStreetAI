"use client";

import dynamic from "next/dynamic";
import { Report } from "@/lib/types";
import { HotspotCluster } from "@/lib/types";

// Dynamic client-side import for Leaflet map component

const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg-card)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: "14px",
        gap: "8px",
      }}
    >
      <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
      Loading map…
    </div>
  ),
});

interface LeafletMapProps {
  reports?: Report[];
  clusters?: HotspotCluster[];
  center?: [number, number];
  zoom?: number;
  onReportClick?: (report: Report) => void;
  height?: string;
  interactive?: boolean;
  selectedId?: string;
}

export default function LeafletMap(props: LeafletMapProps) {
  return <LeafletMapInner {...props} />;
}
