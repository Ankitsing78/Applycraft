import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { SciFiCanvas } from "@/components/SciFiCanvas";

export const metadata: Metadata = {
  title: "ApplyCraft AI — Next-Gen Autonomous Job Application Copilot",
  description:
    "Open-source AI-driven job application copilot with 3D telemetry, companion browser bridge, intelligent resume tailoring, and mandatory human-in-the-loop review.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Interactive 3D Holographic Canvas Background */}
        <SciFiCanvas />

        {/* Ambient Top Cyber Scanline Overlay */}
        <div className="fixed inset-0 pointer-events-none cyber-grid z-0 opacity-40" />

        {/* Navigation */}
        <div className="relative z-20">
          <Navbar />
        </div>

        {/* Main Application Content */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Sci-Fi Futuristic Footer */}
        <footer className="relative z-10 border-t border-cyan-500/20 bg-[#030712]/90 backdrop-blur-xl py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-400 tracking-wider">APPLYCRAFT // OS</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-[11px] text-slate-400">SYS.TELEMETRY: NORMAL // 60 FPS</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Zero Password Storage
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-medium">
                Mandatory Human Verification Gated
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
