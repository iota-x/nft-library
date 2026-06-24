import React from "react";

/**
 * Global decorative background rendered once behind all content.
 * Layers: a deep base color, three slow-drifting aurora glows, a faint masked
 * grid, and a vignette to keep the edges dark and the centre readable.
 */
const AppBackground: React.FC = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: "#05060a" }}
    >
      {/* Aurora glows */}
      <div className="animate-float-a absolute -top-40 left-[12%] h-[38rem] w-[38rem] rounded-full bg-sky-500/20 blur-[130px]" />
      <div className="animate-float-b absolute top-1/3 -left-28 h-[32rem] w-[32rem] rounded-full bg-indigo-600/20 blur-[130px]" />
      <div className="animate-float-c absolute -bottom-32 right-[4%] h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/15 blur-[140px]" />

      {/* Faint grid, masked to fade toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 25%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 78%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
};

export default AppBackground;
