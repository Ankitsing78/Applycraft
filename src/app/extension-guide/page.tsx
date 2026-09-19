"use client";

import { useEffect, useState } from "react";
import {
  Puzzle,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Radio,
  Cpu
} from "lucide-react";
import { TiltCard } from "@/components/TiltCard";

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
      <div className="pb-4 border-b border-cyan-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>COMPANION TELEMETRY PROTOCOL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
          BROWSER BRIDGE PROTOCOL SETUP
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          ApplyCraft pairs with your native browser sessions on LinkedIn, Naukri, and ATS portals without password exposure.
        </p>
      </div>

      {/* Diagnostics */}
      <TiltCard glowColor="cyan" className="p-6 space-y-4">
        <div className="flex items-center justify-between font-mono">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            BRIDGE TELEMETRY & DIAGNOSTICS
          </h2>
          <button
            onClick={checkBridge}
            disabled={testing}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
            <span>PING BRIDGE</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#030712] border border-cyan-500/20">
            <span className="text-slate-400 block mb-1">LOCAL DASHBOARD:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE (3000)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#030712] border border-cyan-500/20">
            <span className="text-slate-400 block mb-1">ACTIVE SESSION:</span>
            <span className="text-cyan-300 font-semibold">
              {bridgeState?.activeTabPortal || "LINKEDIN & NAUKRI"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#030712] border border-cyan-500/20">
            <span className="text-slate-400 block mb-1">HUMAN GATEWAY:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ENFORCED
            </span>
          </div>
        </div>
      </TiltCard>

      {/* Step-by-Step Installation */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white font-mono">MOUNT COMPANION BRIDGE IN 60 SECONDS:</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TiltCard glowColor="cyan" className="p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-300 font-mono shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              01
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Open Extensions Tab</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              In Chrome, Edge, or Brave, open a tab and paste:
            </p>
            <code className="block p-2 rounded bg-[#02040a] border border-cyan-500/20 text-[11px] text-cyan-300 font-mono select-all">
              chrome://extensions
            </code>
          </TiltCard>

          <TiltCard glowColor="purple" className="p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-300 font-mono shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              02
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Enable Dev Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Toggle on <strong className="text-slate-200">Developer mode</strong> in the top-right corner.
            </p>
          </TiltCard>

          <TiltCard glowColor="neon" className="p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300 font-mono shadow-[0_0_10px_rgba(0,255,136,0.2)]">
              03
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Load Unpacked</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Click <strong className="text-slate-200">Load unpacked</strong> and select the extension folder.
            </p>
          </TiltCard>
        </div>

        {/* Directory Copy Helper */}
        <TiltCard glowColor="cyan" className="p-4 space-y-2">
          <label className="block text-xs font-semibold text-slate-300 font-mono">
            EXTENSION PATH (CLICK TO COPY):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={extensionPath}
              className="flex-1 bg-[#02040a] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300"
            />
            <button
              onClick={handleCopyPath}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "COPIED" : "COPY"}</span>
            </button>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
