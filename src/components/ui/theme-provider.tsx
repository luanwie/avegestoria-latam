"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function AgroGreenTheme() {
  return (
    <>
      <MouseGlow />
      <BackgroundBlobs />
    </>
  );
}

function MouseGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: useSpring(springX, { stiffness: 50, damping: 20 }).get()
          ? undefined
          : undefined,
      }}
    >
      <motion.div
        className="absolute h-[600px] w-[600px] rounded-full opacity-[0.08] blur-[120px]"
        style={{
          background: "radial-gradient(circle, #4ade80, transparent)",
          left: springX.get() - 300,
          top: springY.get() - 300,
          x: springX,
          y: springY,
        }}
      />
    </motion.div>
  );
}

function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-emerald-900/20 blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] animate-pulse rounded-full bg-teal-900/20 blur-[80px] delay-1000" />
    </div>
  );
}
