"use client";

/**
 * Cinematic atmosphere layer.
 * Ambient blobs + subtle vignette lighting.
 * No mouse-follow gimmicks — just still, atmospheric depth.
 */
export function AgroGreenTheme() {
  return <AmbientLighting />;
}

function AmbientLighting() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Top-center warm glow — like barn lights at dawn */}
      <div
        className="ambient-blob absolute -top-[20%] left-1/2 -translate-x-1/2 h-[70vh] w-[80vw] rounded-full opacity-[0.06] blur-[180px]"
        style={{ background: "radial-gradient(circle, oklch(0.74 0.18 85), transparent)" }}
      />

      {/* Right side green depth */}
      <div
        className="ambient-blob absolute top-[10%] -right-[15%] h-[60vh] w-[50vw] rounded-full opacity-[0.04] blur-[160px]"
        style={{
          background: "radial-gradient(circle, oklch(0.25 0.04 155), transparent)",
          animationDelay: "-8s",
        }}
      />

      {/* Bottom-left deep green */}
      <div
        className="ambient-blob absolute -bottom-[15%] -left-[10%] h-[50vh] w-[50vw] rounded-full opacity-[0.05] blur-[140px]"
        style={{
          background: "radial-gradient(circle, oklch(0.18 0.03 158), transparent)",
          animationDelay: "-18s",
        }}
      />
    </div>
  );
}
