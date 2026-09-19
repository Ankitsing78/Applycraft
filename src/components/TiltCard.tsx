"use client";

import React, { useRef, useState } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "neon" | "amber";
  showCorners?: boolean;
}

export function TiltCard({
  children,
  className = "",
  glowColor = "cyan",
  showCorners = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowBorderClass =
    glowColor === "cyan"
      ? "hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.22)]"
      : glowColor === "purple"
      ? "hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.22)]"
      : glowColor === "neon"
      ? "hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(0,255,136,0.22)]"
      : "hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(255,183,3,0.22)]";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      className={`relative rounded-2xl bg-[#060b19]/85 backdrop-blur-xl border border-cyan-500/20 transition-shadow duration-300 overflow-hidden ${glowBorderClass} ${className}`}
    >
      {/* Dynamic Specular Holographic Glare */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0, 240, 255, 0.45) 0%, transparent 60%)`,
        }}
      />

      {/* Sci-Fi Corner HUD Brackets */}
      {showCorners && (
        <>
          <span className="hud-corner hud-corner-tl" />
          <span className="hud-corner hud-corner-tr" />
          <span className="hud-corner hud-corner-bl" />
          <span className="hud-corner hud-corner-br" />
        </>
      )}

      {children}
    </div>
  );
}
