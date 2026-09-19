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
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard", icon: Sparkles },
    { href: "/profile", label: "Master Profile", icon: User },
    { href: "/portals", label: "Connected Portals", icon: Globe },
    { href: "/apply", label: "Tailor & Apply", icon: Send },
    { href: "/review", label: "Pre-Apply Review", icon: FileCheck2 },
    { href: "/tracker", label: "Job Tracker", icon: Kanban },
    { href: "/extension-guide", label: "Browser Bridge", icon: Puzzle },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                ApplyCraft <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 -mt-0.5">Open Source Job Agent</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {item.href === "/review" && (
                    <span className="ml-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Status Badges */}
          <div className="flex items-center gap-3">
            <Link
              href="/extension-guide"
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors"
              title="Browser Bridge Active - Direct session sync without passwords"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium hidden sm:inline">Bridge Connected</span>
            </Link>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Human-in-Loop</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
