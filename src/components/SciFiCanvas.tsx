"use client";

import { useEffect, useRef } from "react";

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
}

export function SciFiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    // Create 3D particles
    const particleCount = 85;
    const particles: Particle3D[] = [];
    const colors = ["#00f0ff", "#a855f7", "#00ff88", "#38bdf8"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1200,
        z: Math.random() * 1000 - 500,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) * 0.0008;
      mouseY = (e.clientY - height / 2) * 0.0008;
      targetRotY = mouseX;
      targetRotX = mouseY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    let angle = 0;

    const render = () => {
      angle += 0.002;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep space atmospheric glow
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, "rgba(10, 20, 48, 0.45)");
      grad.addColorStop(0.5, "rgba(4, 8, 22, 0.75)");
      grad.addColorStop(1, "rgba(2, 4, 12, 0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const fov = 450;
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw futuristic holographic orbital rings in center background
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, 320, 120, rotY + angle, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(168, 85, 247, 0.07)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 480, 160, -rotX - angle * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Project and draw 3D particles
      const projected: { x: number; y: number; z: number; size: number; color: string }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particles
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Boundary wrap
        if (p.x < -800) p.x = 800;
        if (p.x > 800) p.x = -800;
        if (p.y < -600) p.y = 600;
        if (p.y > 600) p.y = -600;
        if (p.z < -500) p.z = 500;
        if (p.z > 500) p.z = -500;

        // 3D Rotation (Y axis & X axis)
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const y1 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Perspective projection
        const scale = fov / (fov + z2 + 500);
        if (scale > 0) {
          const projX = x1 * scale + centerX;
          const projY = y1 * scale + centerY;
          const projSize = Math.max(0.6, p.size * scale);

          projected.push({
            x: projX,
            y: projY,
            z: z2,
            size: projSize,
            color: p.color
          });

          // Draw particle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
          ctx.fill();

          // Particle glow aura
          if (scale > 0.8) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(projX, projY, projSize * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw constellation grid lines between close particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
