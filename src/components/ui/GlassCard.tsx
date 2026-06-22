"use client";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  glowOnHover = true,
}: GlassCardProps) {
  return (
    <div
      className={`backdrop-blur-xl border transition-all duration-300 rounded-2xl ${
        glowOnHover
          ? "hover:border-brand-gold/40 hover:shadow-[0_0_40px_rgba(235,166,28,0.08)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
