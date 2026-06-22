"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  blur?: boolean;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  blur = true,
  duration = 0.7,
  className = "",
  once = true,
  amount = 0.12,
}: ScrollRevealProps) {
  const directionMap = {
    up: { y: 60, x: 0 },
    left: { y: 0, x: -60 },
    right: { y: 0, x: 60 },
    none: { y: 0, x: 0 },
  };

  const { x, y } = directionMap[direction];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
        x,
        filter: blur ? "blur(8px)" : undefined,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        filter: "blur(0px)",
        scale: 1,
      }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({
  children,
  staggerDelay = 0.08,
  className = "",
}: {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <ScrollReveal key={i} delay={i * staggerDelay} direction="up">
              {child}
            </ScrollReveal>
          ))
        : children}
    </div>
  );
}
