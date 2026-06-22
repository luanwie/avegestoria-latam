"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;  // max degrees of rotation
  scale?: number;     // scale on hover
  glow?: boolean;     // golden glow effect
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  scale = 1.02,
  glow = false,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setTouch] = useState(true);

  useState(() => {
    setTouch(typeof window !== "undefined" && window.matchMedia("(hover: none)").matches);
  });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  if (isTouch) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateY.set(((x - centerX) / centerX) * maxTilt);
    rotateX.set(-((y - centerY) / centerY) * maxTilt);
    glowX.set((x / rect.width) * 100);
    glowY.set((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
    >
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-inherit opacity-30 transition-opacity duration-300 group-hover:opacity-50"
          style={{
            background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, rgba(235,166,28,0.4), transparent 60%)`,
            borderRadius: "inherit",
          }}
        />
      )}
      <div style={{ transform: "translateZ(10px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
