"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState, useRef, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Report", href: "/report" },
  { label: "Command", href: "/command", badge: "Officer" },
  { label: "Impact", href: "/impact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, role, isAdmin, switchRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="nav-blur" style={{
      position: "sticky",
      top: 0,
      zIndex: 900,
      height: "var(--nav-height)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      borderBottom: "1px solid var(--border-primary)",
      background: "rgba(250, 247, 242, 0.88)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
    }}>
      <div style={{
        maxWidth: "var(--container-width)",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, rgba(140, 94, 60, 0.14) 0%, rgba(182, 85, 69, 0.12) 100%)",
            border: "1px solid var(--accent-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-xs)",
          }}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
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
            <span className="mono" style={{ fontSize: "9px", color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              Civic Intelligence
            </span>
          </div>
        </Link>

        {/* Center links */}
        <div style={{
          display: "flex",
          gap: "4px",
          background: "var(--bg-elevated)",
          padding: "4px",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-primary)",
        }}>
          {NAV_ITEMS.map(({ label, href, badge }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  background: isActive ? "var(--bg-surface)" : "transparent",
                  boxShadow: isActive ? "var(--shadow-xs)" : "none",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  textDecoration: "none",
                }}
              >
                <span>{label}</span>
                {badge && !isAdmin && (
                  <span style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "1px 5px",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(140, 94, 60, 0.12)",
                    color: "var(--accent)",
                  }}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right CTA & Role Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Live Pulse Indicator */}
          <div className="live-indicator" style={{ display: "none" }}>
            Pune LIVE
          </div>

          {/* Interactive Role Switcher Capsule */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                background: isAdmin ? "var(--accent-bg)" : "var(--pastel-sage-bg)",
                border: `1px solid ${isAdmin ? "var(--accent-border)" : "var(--pastel-sage-border)"}`,
                color: isAdmin ? "var(--accent)" : "var(--pastel-sage)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title="Click to switch role or sign in"
            >
              <span>{currentUser.avatar}</span>
              <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {isAdmin ? "Admin (PMC)" : "Citizen"}
              </span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.7, transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "260px",
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-primary)",
                boxShadow: "var(--shadow-xl)",
                padding: "12px",
                zIndex: 1000,
                animation: "fadeIn 0.15s ease-out",
              }}>
                <div style={{ padding: "4px 8px 8px", borderBottom: "1px solid var(--border-primary)", marginBottom: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Active Persona
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    {currentUser.title}
                  </div>
                </div>

                {/* Quick Toggle Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      switchRole("admin");
                      setMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: isAdmin ? "var(--accent-bg)" : "transparent",
                      color: isAdmin ? "var(--accent)" : "var(--text-secondary)",
                      fontWeight: isAdmin ? 700 : 500,
                      fontSize: "12px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>👑</span>
                      <span>Municipal Admin</span>
                    </span>
                    {isAdmin && <span style={{ fontSize: "11px" }}>✓</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchRole("user");
                      setMenuOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: !isAdmin ? "var(--pastel-sage-bg)" : "transparent",
                      color: !isAdmin ? "var(--pastel-sage)" : "var(--text-secondary)",
                      fontWeight: !isAdmin ? 700 : 500,
                      fontSize: "12px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>👤</span>
                      <span>Resident Citizen</span>
                    </span>
                    {!isAdmin && <span style={{ fontSize: "11px" }}>✓</span>}
                  </button>
                </div>

                <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--border-primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontSize: "11px",
                      color: "var(--accent)",
                      fontWeight: 600,
                      textDecoration: "none",
                      padding: "4px",
                    }}
                  >
                    🔑 Sign In Page (admin / user)
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Report CTA */}
          <Link
            href="/report"
            className="btn btn-primary btn-sm"
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-full)",
              fontSize: "12.5px",
              fontWeight: 700,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            + Report Hazard
          </Link>
        </div>
      </div>
    </nav>
  );
}
