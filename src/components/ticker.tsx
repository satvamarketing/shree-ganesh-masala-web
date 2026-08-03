/**
 * The red scrolling ticker (reference lines 72-81). Decorative, so it is
 * hidden from assistive tech and freezes under prefers-reduced-motion.
 */
const ITEMS = [
  "Made in Ahmedabad",
  "Shipped from Acacia Ridge",
  "Trade only",
  "HACCP certified",
  "Six house brands",
  "No minimum first order",
];

function Run() {
  return (
    <div className="flex items-center gap-[30px] pr-[30px] text-[13px] font-extrabold tracking-[2.2px] whitespace-nowrap uppercase">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-[30px]">
          {item}
          <span className="text-white/72">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Ticker() {
  return (
    <div className="overflow-hidden bg-red py-3.5 text-white" aria-hidden="true">
      <div className="animate-marquee flex w-max">
        <Run />
        <Run />
      </div>
    </div>
  );
}
