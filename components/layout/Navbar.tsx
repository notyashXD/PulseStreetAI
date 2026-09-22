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
            width: "32px",
            height: "32px",
            borderRadius: "var(--radius-md)",
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="var(--accent)" strokeWidth="2.5"/>
              <circle cx="14" cy="14" r="4.5" fill="var(--accent)"/>
              <line x1="14" y1="2" x2="14" y2="7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="14" y1="21" x2="14" y2="26" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="2" y1="14" x2="7" y2="14" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="21" y1="14" x2="26" y2="14" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-primary)", lineHeight: 1.1 }}>
              StreetPulse
            </span>
            <span className="mono" style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Civic Intelligence
            </span>
          </div>
        </Link>

        {/* Center links */}
        <div style={{ display: "flex", gap: "4px", background: "var(--bg-elevated)", padding: "4px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-primary)" }}>
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "6px 16px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  background: isActive ? "var(--bg-surface)" : "transparent",
                  boxShadow: isActive ? "var(--shadow-xs)" : "none",
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
          <div className="live-indicator">Pune LIVE</div>
          <Link href="/report" className="btn btn-primary btn-sm" style={{ padding: "8px 18px", borderRadius: "var(--radius-full)" }}>
            + Report Hazard
          </Link>
        </div>
      </div>
    </nav>
  );
}
