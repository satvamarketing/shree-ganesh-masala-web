/**
 * The red scrolling strip from the design (reference lines 82-91).
 * Decorative, so it is hidden from assistive tech and freezes under
 * prefers-reduced-motion (handled in globals.css).
 *
 * Note: the design's "HACCP certified" item is deliberately replaced with
 * "Since 1969" — the certification is unverified. See spec §8.1.
 */
const ITEMS = [
  "No artificial colours",
  "Traditional recipes",
  "Batch tested",
  "Family owned",
  "Made in Ahmedabad",
  "Since 1969",
];

function Run() {
  return (
    <div className="flex items-center gap-[30px] pr-[30px] text-[13.5px] font-bold tracking-[2px] whitespace-nowrap uppercase">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-[30px]">
          {item}
          <span className="text-gold">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div
      className="overflow-hidden bg-red py-3.5 text-[#FFF1DE]"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max">
        <Run />
        <Run />
      </div>
    </div>
  );
}
