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
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div className="pointer-events-none fixed inset-0 z-0">
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full opacity-[0.06] blur-[100px]"
        style={{
          background: "radial-gradient(circle, #eba61c, transparent)",
          x: useSpring(springX, { stiffness: 40, damping: 15 }),
          y: useSpring(springY, { stiffness: 40, damping: 15 }),
        }}
        initial={{ left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute h-[400px] w-[400px] rounded-full opacity-[0.04] blur-[80px]"
        style={{
          background: "radial-gradient(circle, #28a652, transparent)",
          x: useSpring(springX, { stiffness: 60, damping: 20 }),
          y: useSpring(springY, { stiffness: 60, damping: 20 }),
        }}
        initial={{ left: "30%", top: "60%", translateX: "-50%", translateY: "-50%" }}
      />
    </motion.div>
  );
}

function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-pulse rounded-full bg-brand-green/20 blur-[100px]" />
      <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] animate-pulse rounded-full bg-brand-gold/10 blur-[80px] delay-1000" />
    </div>
  );
}
