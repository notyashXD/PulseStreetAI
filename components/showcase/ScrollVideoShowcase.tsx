"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function ScrollVideoShowcase({ onExploreClick }: { onExploreClick?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scene Opacity Crossfades
  const scene1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.38], [1, 1, 0]);
  const scene2Opacity = useTransform(scrollYProgress, [0.3, 0.42, 0.65, 0.75], [0, 1, 1, 0]);
  const scene3Opacity = useTransform(scrollYProgress, [0.68, 0.78, 1], [0, 1, 1]);

  // Cinematic Parallax Scales
  const scene1Scale = useTransform(scrollYProgress, [0, 0.35], [1, 1.08]);
  const scene2Scale = useTransform(scrollYProgress, [0.35, 0.72], [1, 1.06]);
  const scene3Scale = useTransform(scrollYProgress, [0.72, 1], [1, 1.05]);

  // Phase Card Opacities & Transforms
  const card1Y = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  const card1Opacity = useTransform(scrollYProgress, [0, 0.22, 0.3], [1, 1, 0]);

  const card2Y = useTransform(scrollYProgress, [0.33, 0.45, 0.65], [40, 0, -40]);
  const card2Opacity = useTransform(scrollYProgress, [0.32, 0.42, 0.62, 0.7], [0, 1, 1, 0]);

  const card3Y = useTransform(scrollYProgress, [0.68, 0.8], [40, 0]);
  const card3Opacity = useTransform(scrollYProgress, [0.68, 0.78, 1], [0, 1, 1]);

  // Scrubber Progress Indicator Width
  const scrubberWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const scrollToPhase = (progress: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: containerTop + containerHeight * progress,
      behavior: "smooth",
    });
  };

  const handleSkipToDashboard = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const target = document.getElementById("civic-dashboard");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", height: "260vh", background: "#0D0B0A" }}>
      {/* Sticky Cinematic Screen Frame */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Background Visual Layers */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {/* Scene 1: Pune Skyline Dawn with Atmospheric Smog */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: scene1Opacity,
              scale: scene1Scale,
              backgroundImage: "url('/images/showcase/scene1_skyline.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Scene 2: AI Bounding Box HUD Detection */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: scene2Opacity,
              scale: scene2Scale,
              backgroundImage: "url('/images/showcase/scene2_hud.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Scene 3: Remediated Clean Boulevard */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: scene3Opacity,
              scale: scene3Scale,
              backgroundImage: "url('/images/showcase/scene3_clean.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Gradient Ambient Vignette Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at center, transparent 40%, rgba(13, 11, 10, 0.72) 100%), linear-gradient(to top, rgba(13, 11, 10, 0.85) 0%, transparent 40%, rgba(13, 11, 10, 0.6) 100%)",
            }}
          />
        </div>

        {/* Top Header Floating Badge */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "24px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "var(--container-width)",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "var(--radius-full)",
              fontSize: "12px",
              fontWeight: 600,
              color: "#FAF7F2",
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 10px #22c55e" }} />
            <span>Autonomous Civic Intelligence Architecture</span>
          </div>

          <button
            type="button"
            onClick={handleSkipToDashboard}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              borderRadius: "var(--radius-full)",
              color: "white",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>Skip to Live Map</span>
            <span>↓</span>
          </button>
        </div>

        {/* Middle Stage: Dynamic Scrollytelling Cards */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "var(--container-width)",
            width: "100%",
            margin: "0 auto",
            padding: "0 clamp(20px, 3.5vw, 48px)",
          }}
        >
          {/* Phase 1 Text Card */}
          <motion.div
            style={{
              opacity: card1Opacity,
              y: card1Y,
              display: "flex",
              flexDirection: "column",
              maxWidth: "680px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "4px 10px",
                background: "rgba(235, 130, 60, 0.2)",
                border: "1px solid rgba(235, 130, 60, 0.4)",
                borderRadius: "var(--radius-full)",
                color: "#F39C12",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "12px",
                width: "fit-content",
              }}
            >
              Phase 1 · Urban Telemetry Scan
            </div>
            <h1
              style={{
                fontSize: "clamp(34px, 4.8vw, 56px)",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "16px",
                textShadow: "0 4px 24px rgba(0, 0, 0, 0.5)",
              }}
            >
              When cities pulse with <br />
              <span style={{ color: "#E09E6B" }}>invisible atmospheric hazards.</span>
            </h1>
            <p
              style={{
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 1.6,
                maxWidth: "540px",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
              }}
            >
              StreetPulse continuously digests open atmospheric sensor feeds across Pune, mapping PM2.5 anomalies before toxic smoke disperses.
            </p>
          </motion.div>

          {/* Phase 2 Text Card */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              opacity: card2Opacity,
              y: card2Y,
              display: "flex",
              flexDirection: "column",
              maxWidth: "680px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "4px 10px",
                background: "rgba(34, 197, 94, 0.2)",
                border: "1px solid rgba(34, 197, 94, 0.4)",
                borderRadius: "var(--radius-full)",
                color: "#4ADE80",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "12px",
                width: "fit-content",
              }}
            >
              Phase 2 · Autonomous Multimodal Vision
            </div>
            <h2
              style={{
                fontSize: "clamp(34px, 4.8vw, 56px)",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "16px",
                textShadow: "0 4px 24px rgba(0, 0, 0, 0.5)",
              }}
            >
              Gemini 2.5 Flash locks in <br />
              <span style={{ color: "#4ADE80" }}>under 800 milliseconds.</span>
            </h2>
            <p
              style={{
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 1.6,
                maxWidth: "540px",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
              }}
            >
              Citizens snap an image or voice note. Autonomous computer vision classifies hazard severity, calculates bounding coordinates, and triggers immediate field dispatch.
            </p>
          </motion.div>

          {/* Phase 3 Text Card */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              opacity: card3Opacity,
              y: card3Y,
              display: "flex",
              flexDirection: "column",
              maxWidth: "680px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "4px 10px",
                background: "rgba(59, 130, 246, 0.2)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                borderRadius: "var(--radius-full)",
                color: "#60A5FA",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "12px",
                width: "fit-content",
              }}
            >
              Phase 3 · Optical Remediation Audit
            </div>
            <h2
              style={{
                fontSize: "clamp(34px, 4.8vw, 56px)",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "16px",
                textShadow: "0 4px 24px rgba(0, 0, 0, 0.5)",
              }}
            >
              Verifiable remediation. <br />
              <span style={{ color: "#60A5FA" }}>Zero ghost closures.</span>
            </h2>
            <p
              style={{
                fontSize: "clamp(15px, 1.8vw, 18px)",
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 1.6,
                maxWidth: "540px",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
              }}
            >
              Before & After photo verification ensures field contractors physically resolve the hazard before closing municipal tickets.
            </p>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleSkipToDashboard}
                className="btn btn-primary"
                style={{ padding: "12px 28px", fontSize: "14px", fontWeight: 700 }}
              >
                Explore Live Civic Map ↓
              </button>
              <Link
                href="/report"
                className="btn btn-secondary"
                style={{ padding: "12px 24px", fontSize: "14px", color: "white", borderColor: "rgba(255,255,255,0.3)" }}
              >
                📸 Test AI Vision Report
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom Interactive Timeline Scrubber (Apple Style) */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "24px clamp(20px, 3.5vw, 48px) 36px",
            maxWidth: "var(--container-width)",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Scrubber Progress Bar */}
          <div
            style={{
              position: "relative",
              height: "4px",
              background: "rgba(255, 255, 255, 0.16)",
              borderRadius: "2px",
              marginBottom: "14px",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #F39C12 0%, #22c55e 50%, #3B82F6 100%)",
                width: scrubberWidth,
              }}
            />
          </div>

          {/* Phase Control Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
            }}
          >
            {[
              { num: 1, label: "Telemetry Ingestion", range: 0.15 },
              { num: 2, label: "AI Hazard Lock-On", range: 0.5 },
              { num: 3, label: "Remediation Audit", range: 0.9 },
            ].map((phase) => (
              <button
                key={phase.num}
                type="button"
                onClick={() => scrollToPhase(phase.range)}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "var(--radius-lg)",
                  padding: "10px 14px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#FAF7F2",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.2s",
                }}
              >
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  {phase.num}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {phase.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
