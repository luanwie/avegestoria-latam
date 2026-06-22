"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface Hero3DProps {
  children: React.ReactNode;
}

export default function Hero3D({ children }: Hero3DProps) {
  const [isTouch, setTouch] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
    if (typeof window === "undefined") return;

    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  const layer1X = useSpring(mouseX, { stiffness: 30, damping: 30 });
  const layer1Y = useSpring(mouseY, { stiffness: 30, damping: 30 });
  const layer2X = useSpring(mouseX, { stiffness: 50, damping: 25 });
  const layer2Y = useSpring(mouseY, { stiffness: 50, damping: 25 });

  if (isTouch) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Layer 1: Grid perspective */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{ x: layer1X, y: layer1Y }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(235,166,28,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(235,166,28,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            transform: "perspective(1000px) rotateX(60deg) scale(2)",
            transformOrigin: "top center",
          }}
        />
      </motion.div>

      {/* Layer 2: Gradient */}
      <motion.div
        className="absolute inset-0 opacity-[0.15]"
        style={{ x: layer2X, y: layer2Y }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-brand-gold/20 via-brand-green/10 to-transparent blur-[120px]" />
      </motion.div>

      {/* Content layer (no motion — stays still for readability) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
