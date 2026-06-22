"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function AgroGreenTheme() {
  return (
    <>
      <AnimatedBlobs />
      <MouseGlow />
    </>
  );
}

function AnimatedBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="animated-blob absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-brand-green/15 blur-[120px]" />
      <div className="animated-blob absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-gold/6 blur-[100px]" style={{ animationDelay: "-10s" }} />
      <div className="animated-blob absolute top-1/2 left-1/2 h-[400px] w-[400px] rounded-full bg-brand-green/10 blur-[100px]" style={{ animationDelay: "-5s" }} />
    </div>
  );
}

function MouseGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

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
        className="absolute h-[400px] w-[400px] rounded-full opacity-[0.06] blur-[80px]"
        style={{
          background: "radial-gradient(circle, #eba61c, transparent)",
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </motion.div>
  );
}
