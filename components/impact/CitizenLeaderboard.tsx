"use client";

interface CitizenUser {
  rank: number;
  name: string;
  ward: string;
  karmaPoints: number;
  reportsSubmitted: number;
  verifiedCleanups: number;
  badge: string;
  badgeColor: string;
}

const LEADERBOARD: CitizenUser[] = [
  { rank: 1, name: "Arjun Deshmukh", ward: "Aundh-Baner", karmaPoints: 480, reportsSubmitted: 22, verifiedCleanups: 18, badge: "Air Guardian", badgeColor: "var(--accent)" },
  { rank: 2, name: "Pooja Kulkarni", ward: "Kothrud", karmaPoints: 395, reportsSubmitted: 17, verifiedCleanups: 14, badge: "Rapid Responder", badgeColor: "var(--sky)" },
  { rank: 3, name: "Vikram Patil", ward: "Shivajinagar", karmaPoints: 340, reportsSubmitted: 15, verifiedCleanups: 11, badge: "Zone Champion", badgeColor: "var(--amber)" },
  { rank: 4, name: "Dr. Sneha Joshi", ward: "Hadapsar", karmaPoints: 290, reportsSubmitted: 12, verifiedCleanups: 9, badge: "Eco Sentinel", badgeColor: "var(--coral)" },
  { rank: 5, name: "Rohan Shinde", ward: "Viman Nagar", karmaPoints: 245, reportsSubmitted: 10, verifiedCleanups: 7, badge: "Civic Watch", badgeColor: "var(--violet)" },
];

export default function CitizenLeaderboard() {
  return (
    <div className="card animate-in" style={{ padding: "28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div className="label-small" style={{ marginBottom: "6px" }}>Citizen Engagement & Karma Economy</div>
          <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Community Champions Leaderboard</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
            Citizens earning Green Karma credits for verified hazard reports and community corroborations.
          </p>
        </div>
        <div className="mono" style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)", padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "11px", fontWeight: 700 }}>
          ⚡ 1,750 Total Karma Awarded This Month
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-primary)", textAlign: "left" }}>
              {["Rank", "Citizen Contributor", "Ward", "Badge", "Reports", "Verified", "Karma Score"].map((h) => (
                <th key={h} className="label-small" style={{ padding: "10px 14px", fontSize: "9px", textAlign: h === "Karma Score" ? "right" : "left" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD.map((user) => (
              <tr
                key={user.rank}
                style={{ borderBottom: "1px solid var(--border-primary)", transition: "background 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
              >
                <td style={{ padding: "12px 14px", fontWeight: 700 }}>
                  {user.rank === 1 ? "🥇 #1" : user.rank === 2 ? "🥈 #2" : user.rank === 3 ? "🥉 #3" : `#${user.rank}`}
                </td>
                <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {user.name}
                </td>
                <td className="mono" style={{ padding: "12px 14px", color: "var(--text-secondary)", fontSize: "12px" }}>
                  {user.ward}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "10px",
                      fontWeight: 700,
                      background: `color-mix(in srgb, ${user.badgeColor} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${user.badgeColor} 25%, transparent)`,
                      color: user.badgeColor,
                    }}
                  >
                    {user.badge}
                  </span>
                </td>
                <td className="mono" style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>
                  {user.reportsSubmitted}
                </td>
                <td className="mono" style={{ padding: "12px 14px", color: "var(--accent)", fontWeight: 600 }}>
                  {user.verifiedCleanups} ✓
                </td>
                <td className="mono" style={{ padding: "12px 14px", textAlign: "right", fontWeight: 800, color: "var(--text-primary)" }}>
                  +{user.karmaPoints} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
