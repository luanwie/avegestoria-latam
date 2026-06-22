"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  originalX: number;
  originalY: number;
}

function getParticleCount(width: number): number {
  if (width < 640) return 0;        // mobile — zero
  if (width < 1024) return 40;       // tablet — light
  return Math.min(150, Math.floor((width * window.innerHeight) / 15000)); // desktop — dense
}

function getInteractionRadius(width: number): number {
  if (width < 640) return 80;
  if (width < 1024) return 120;
  return 180;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, 2)); // cap at 2x for performance
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentParticles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      // Recreate particles on resize
      const count = getParticleCount(window.innerWidth);
      currentParticles = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        currentParticles.push({
          x, y,
          vx: 0, vy: 0,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.3 + 0.05,
          originalX: x,
          originalY: y,
        });
      }
      particlesRef.current = currentParticles;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Only add mousemove if not touch
    if (!window.matchMedia("(hover: none)").matches) {
      window.addEventListener("mousemove", handleMouse);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const radius = getInteractionRadius(window.innerWidth);

      for (const p of currentParticles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius && dist > 0) {
          const force = (radius - dist) / radius;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.3;
          p.vy += Math.sin(angle) * force * 0.3;
        }

        // Return to origin
        p.vx += (p.originalX - p.x) * 0.008;
        p.vy += (p.originalY - p.y) * 0.008;

        // Damping
        p.vx *= 0.94;
        p.vy *= 0.94;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 166, 28, ${p.alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [dpr]);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      className="pointer-events-none fixed inset-0 z-0 hidden sm:block"
    />
  );
}
