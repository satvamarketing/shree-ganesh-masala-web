/** The slow red radial glows behind v7's dark sections (reference 47-50). */
export function Glow({ opacity = 0.4 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ opacity }}
      aria-hidden="true"
    >
      <div
        className="animate-pulse-glow absolute top-[22%] left-[12%] h-[420px] w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(207,50,45,0.55), transparent 68%)",
        }}
      />
      <div
        className="animate-pulse-glow-slow absolute -bottom-[8%] right-[6%] h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(207,50,45,0.4), transparent 68%)",
        }}
      />
    </div>
  );
}
