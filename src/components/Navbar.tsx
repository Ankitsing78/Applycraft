"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  User,
  Globe,
  FileCheck2,
  Send,
  Kanban,
  Puzzle,
  ShieldCheck,
  Radio
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard", icon: Sparkles },
    { href: "/profile", label: "Master Profile", icon: User },
    { href: "/portals", label: "Portals Hub", icon: Globe },
    { href: "/apply", label: "Tailor & Apply", icon: Send },
    { href: "/review", label: "Pre-Apply Review", icon: FileCheck2 },
    { href: "/tracker", label: "Job Tracker", icon: Kanban },
    { href: "/extension-guide", label: "Bridge Sync", icon: Puzzle },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/25 bg-[#030712]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Futuristic Holographic Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 text-cyan-100" />
              <div className="absolute -inset-0.5 rounded-xl bg-cyan-400 opacity-20 blur-sm group-hover:opacity-60 transition-opacity" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-wider text-white flex items-center gap-1.5 font-mono">
                APPLYCRAFT <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">AI // OS</span>
              </span>
              <p className="text-[9px] text-cyan-400/70 font-mono tracking-widest -mt-0.5 uppercase">
                Autonomous Job Copilot
              </p>
            </div>
          </Link>

          {/* Sci-Fi Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                      : "text-slate-300 hover:text-cyan-200 hover:bg-slate-900/60 hover:border hover:border-cyan-500/20"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.href === "/review" && (
                    <span className="ml-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Futuristic Telemetry Status */}
          <div className="flex items-center gap-3">
            <Link
              href="/extension-guide"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-900/40 hover:border-cyan-400/60 transition-all shadow-[0_0_12px_rgba(0,240,255,0.15)]"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold hidden sm:inline">BRIDGE: ONLINE</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-950/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-mono text-[11px] text-purple-300">HUMAN-IN-LOOP</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
