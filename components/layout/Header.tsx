"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "City Pulse" },
  { href: "/report", label: "Report Issue" },
  { href: "/command", label: "Command Centre" },
  { href: "/impact", label: "Impact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        background: "rgba(10,10,15,0.95)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "56px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            🏙️
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: "18px",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            StreetPulse
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
          className="desktop-nav"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#f0f0f8" : "var(--text-secondary)",
                  background: active ? "var(--bg-elevated)" : "transparent",
                  border: active ? "1px solid var(--border)" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/report" className="btn btn-primary btn-sm">
            + Report
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
