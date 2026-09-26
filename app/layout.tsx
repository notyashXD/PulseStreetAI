import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import CivicCopilot from "@/components/copilot/CivicCopilot";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ThemeProvider } from "@/lib/theme/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StreetPulse — Civic Environment Intelligence",
    template: "%s | StreetPulse",
  },
  description:
    "StreetPulse helps residents report local environmental hazards and helps civic teams triage, verify, and resolve them. Real-time AQI, AI evidence analysis, and community signal clustering for Indian cities.",
  keywords: ["civic tech", "air quality", "environment", "India", "reporting", "AQI"],
  openGraph: {
    title: "StreetPulse — Civic Environment Intelligence",
    description: "Report and resolve environmental hazards with AI-powered evidence fusion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('streetpulse_theme_preference');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main style={{ position: "relative", zIndex: 1 }}>
              {children}
            </main>
            <CivicCopilot />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
