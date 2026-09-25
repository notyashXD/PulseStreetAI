"use client";

import { useState } from "react";

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

const REWARDS_CATALOGUE = [
  { id: "metro", title: "PMPML Metro & Bus Pass 25% Off", cost: 200, icon: "🚌", category: "Public Transit", discount: "25% Rebate" },
  { id: "tree", title: "Pune Green Tree Plantation Certificate", cost: 150, icon: "🌳", category: "Eco Initiative", discount: "Adopt a Tree" },
  { id: "tax", title: "PMC Property Tax Green Rebate Token", cost: 400, icon: "🏛️", category: "Municipal Rebate", discount: "₹500 Tax Credit" },
  { id: "cafe", title: "Eco-Friendly Organic Cafe Voucher", cost: 100, icon: "☕", category: "Local Merchant", discount: "₹150 Coupon" },
];

export default function CitizenLeaderboard() {
  const [userBalance, setUserBalance] = useState(480);
  const [redeemedVouchers, setRedeemedVouchers] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const handleRedeem = (id: string, cost: number, title: string) => {
    if (userBalance < cost) {
      setToast("⚠️ Insufficient Karma points. Submit more verified reports to earn credits!");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setUserBalance((prev) => prev - cost);
    setRedeemedVouchers((prev) => [...prev, id]);
    setToast(`🎉 Successfully redeemed: ${title}! Voucher sent to your mobile.`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "32px", right: "32px",
          background: "var(--bg-card)", border: "1px solid var(--accent-border)",
          color: "var(--text-primary)", padding: "14px 22px",
          borderRadius: "var(--radius-xl)", fontWeight: 700, fontSize: "13px",
          boxShadow: "var(--shadow-xl)", zIndex: 1200, animation: "slide-up 0.3s ease-out",
        }}>
          {toast}
        </div>
      )}

      {/* Citizen Tier Progression & Karma Wallet Bar */}
      <div className="card animate-in" style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
          <div>
            <div className="label-small" style={{ marginBottom: "4px" }}>Gamified Civic Engagement</div>
            <h2 style={{ fontSize: "22px", fontWeight: 800 }}>Citizen Karma Tier Progression</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
              Level up your civic status by reporting hazards, corroborating local sensors, and verifying cleanups.
            </p>
          </div>

          <div style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border-primary)",
            padding: "12px 20px", borderRadius: "var(--radius-2xl)",
            display: "flex", alignItems: "center", gap: "14px",
          }}>
            <span style={{ fontSize: "28px" }}>⭐</span>
            <div>
              <div className="label-small" style={{ fontSize: "9px" }}>Your Karma Wallet</div>
              <div className="mono" style={{ fontSize: "22px", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>
                {userBalance} <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 400 }}>pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progression Bar */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
            <span style={{ fontWeight: 700, color: "var(--accent)" }}>Level 3: Silver Air Guardian</span>
            <span className="mono" style={{ color: "var(--text-muted)" }}>{userBalance}/600 pts to Gold Civic Champion</span>
          </div>
          <div className="progress-bar" style={{ height: "8px" }}>
            <div className="progress-fill" style={{ width: `${Math.min(100, (userBalance / 600) * 100)}%`, background: "var(--accent)" }} />
          </div>
        </div>

        {/* Tier Milestones */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", fontSize: "11px" }}>
          {[
            { level: "Level 1", name: "Eco Scout", pts: "0+", active: true },
            { level: "Level 2", name: "Air Watcher", pts: "200+", active: true },
            { level: "Level 3", name: "Air Guardian", pts: "400+", active: true },
            { level: "Level 4", name: "Urban Hero", pts: "600+", active: false },
          ].map((tier) => (
            <div key={tier.level} style={{
              background: tier.active ? "var(--accent-bg)" : "var(--bg-elevated)",
              border: `1px solid ${tier.active ? "var(--accent-border)" : "var(--border-primary)"}`,
              borderRadius: "var(--radius-lg)", padding: "8px 12px",
            }}>
              <div className="mono" style={{ fontSize: "9px", color: tier.active ? "var(--accent)" : "var(--text-dim)", fontWeight: 700 }}>{tier.level}</div>
              <div style={{ fontWeight: 700, color: tier.active ? "var(--text-primary)" : "var(--text-muted)", marginTop: "2px" }}>{tier.name}</div>
              <div className="mono" style={{ fontSize: "10px", color: "var(--text-dim)" }}>{tier.pts}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalogue Store */}
      <div className="card animate-in" style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div className="label-small" style={{ marginBottom: "4px" }}>Redeemable Municipal Benefits</div>
            <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Green Karma Rewards Store</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
              Convert verified civic contributions into real municipal transit discounts & eco-perks.
            </p>
          </div>
          <div className="mono" style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700 }}>
            Official PMC Civic Rewards Partner
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
          {REWARDS_CATALOGUE.map((reward) => {
            const isRedeemed = redeemedVouchers.includes(reward.id);
            const canAfford = userBalance >= reward.cost;
            return (
              <div key={reward.id} style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-2xl)",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ fontSize: "28px" }}>{reward.icon}</span>
                  <div>
                    <span className="label-small" style={{ fontSize: "8px" }}>{reward.category}</span>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.3, marginTop: "2px" }}>{reward.title}</h3>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-primary)", paddingTop: "12px" }}>
                  <div className="mono" style={{ fontSize: "14px", fontWeight: 800, color: "var(--accent)" }}>
                    {reward.cost} pts
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={isRedeemed || !canAfford}
                    onClick={() => handleRedeem(reward.id, reward.cost, reward.title)}
                    style={{
                      background: isRedeemed ? "var(--pastel-sage-bg)" : canAfford ? "var(--text-primary)" : "var(--bg-muted)",
                      color: isRedeemed ? "var(--pastel-sage)" : canAfford ? "#FAF7F2" : "var(--text-dim)",
                      border: isRedeemed ? "1px solid var(--pastel-sage-border)" : "none",
                      fontSize: "11px",
                      padding: "6px 14px",
                    }}
                  >
                    {isRedeemed ? "✓ Claimed" : canAfford ? "Redeem Token" : "Need Points"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Champions Leaderboard */}
      <div className="card animate-in" style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="label-small" style={{ marginBottom: "4px" }}>Community Champions</div>
            <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Pune Citizen Leaderboard</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
              Top contributors leading municipal hazard reporting and air quality vigilance this month.
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
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "10px",
                        fontWeight: 700,
                        background: "var(--accent-bg)",
                        border: "1px solid var(--accent-border)",
                        color: "var(--accent)",
                      }}
                    >
                      {user.badge}
                    </span>
                  </td>
                  <td className="mono" style={{ padding: "12px 14px", color: "var(--text-secondary)" }}>
                    {user.reportsSubmitted}
                  </td>
                  <td className="mono" style={{ padding: "12px 14px", color: "var(--pastel-sage)", fontWeight: 700 }}>
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
    </div>
  );
}
