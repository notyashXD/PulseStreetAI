"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Report", href: "/report" },
  { label: "Command", href: "/command" },
  { label: "Impact", href: "/impact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="nav-blur" style={{
      position: "sticky",
      top: 0,
      zIndex: 900,
      height: "var(--nav-height)",
      display: "flex",
      alignItems: "center",
      padding: "0 32px",
    }}>
      <div style={{
        maxWidth: "var(--container-width)",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="#080808" strokeWidth="2"/>
              <circle cx="14" cy="14" r="4" fill="#3D5A27"/>
              <line x1="14" y1="2" x2="14" y2="8" stroke="#080808" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14" y1="20" x2="14" y2="26" stroke="#080808" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="14" x2="8" y2="14" stroke="#080808" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="14" x2="26" y2="14" stroke="#080808" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            StreetPulse
          </span>
        </Link>

        {/* Center links */}
        <div style={{ display: "flex", gap: "4px" }}>
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  background: isActive ? "var(--bg-elevated)" : "transparent",
                  transition: "all 0.2s",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="live-indicator">Live</div>
          <Link href="/report" className="btn btn-primary btn-sm">
            Report Issue
          </Link>
        </div>
      </div>
    </nav>
  );
}
