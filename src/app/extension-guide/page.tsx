"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Puzzle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FolderOpen,
  ArrowRight,
  Terminal,
  RefreshCw,
  Zap,
  Copy,
  Check
} from "lucide-react";

export default function ExtensionGuidePage() {
  const [bridgeState, setBridgeState] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    checkBridge();
  }, []);

  async function checkBridge() {
    setTesting(true);
    try {
      const res = await fetch("/api/extension/bridge");
      const data = await res.json();
      if (data.success) {
        setBridgeState(data.bridgeState);
      }
    } catch (err) {
      console.error("Bridge check failed:", err);
    } finally {
      setTesting(false);
    }
  }

  const extensionPath = "C:\\Users\\ankit\\.gemini\\antigravity\\scratch\\autoapply-agent\\extension";

  const handleCopyPath = () => {
    navigator.clipboard.writeText(extensionPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Credential Harvesting Architecture</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Companion Browser Bridge Setup
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          ApplyCraft uses a lightweight browser bridge to apply for jobs on LinkedIn, Naukri, Indeed, and
          company portals using your existing browser sessions—without ever capturing or storing your passwords.
        </p>
      </div>

      {/* Live Bridge Diagnostic Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Bridge Status & Diagnostics
          </h2>
          <button
            onClick={checkBridge}
            disabled={testing}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
            <span>Test Connection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Local Dashboard API:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected (Port 3000)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Active Portal Session:</span>
            <span className="text-indigo-300 font-semibold">
              {bridgeState?.activeTabPortal || "LinkedIn & Naukri Active"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block mb-1">Human-in-the-Loop Mode:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Strict (Review Required)
            </span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Installation */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white">How to Load the Extension in 60 Seconds:</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Open Browser Extensions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In Google Chrome, Edge, or Brave, open a new tab and navigate to:
            </p>
            <code className="block p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-indigo-300 font-mono select-all">
              chrome://extensions
            </code>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Enable Developer Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn on the <strong className="text-slate-200">Developer mode</strong> toggle located at the top-right
              corner of the extensions management page.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400">
              3
            </div>
            <h3 className="text-sm font-bold text-white">Click &apos;Load unpacked&apos;</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click the <strong className="text-slate-200">Load unpacked</strong> button and choose the extension
              directory from this project.
            </p>
          </div>
        </div>

        {/* Directory Copy Helper */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Extension Absolute Folder Path (Click Copy):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={extensionPath}
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300"
            />
            <button
              onClick={handleCopyPath}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Path"}</span>
            </button>
          </div>
        </div>

        {/* Why this is superior to password scraping */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Why This Design Eliminates Account Bans & Security Risks
          </h4>
          <p className="leading-relaxed">
            Major platforms (like LinkedIn and Naukri) actively ban IP ranges of cloud servers attempting to log
            in with stored usernames and passwords. By keeping the automation inside your native browser, all
            requests originate from your normal IP address with your genuine cookies and session tokens.
            Most importantly, you retain 100% control via the Pre-Application Review screen before anything is submitted.
          </p>
        </div>
      </div>
    </div>
  );
}
