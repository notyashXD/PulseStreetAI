"use client";

import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export default function DemoBanner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isFirebaseConfigured) return null;

  return (
    <div className="demo-banner" role="banner" aria-label="Demo mode notice">
      🌐 <strong>City Preview Mode</strong> — Showing Pune civic dataset. Connect Firebase & Gemini in <code>.env.local</code> for live persistence.
    </div>
  );
}
