/**
 * The scrolling marquee. Decorative, so it is hidden from assistive tech and
 * freezes under prefers-reduced-motion.
 *
 * It sits at the very top of every page, above the sticky header, on client
 * request. The deeper red is load-bearing rather than decorative: the header is
 * brand red, and in the same red the two strips merge into one 114px slab before
 * any content appears. Its height is mirrored by --sg-fold-chrome in globals.css,
 * which the hero uses to size the fold; keep the two in step.
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

/**
 * Copies of the strip in the track. Must be even, so the animation's slide of
 * half the track width lands an identical copy exactly where the previous one
 * began and the loop is seamless.
 *
 * Six rather than two because the slide is half the track: no gap appears only
 * while that half is at least as wide as the viewport. One copy is about 1550px,
 * so two copies left a blank sweeping across any display wider than that, which
 * was 1014px of empty red at 2560. Three copies a half covers about 4600px, past
 * any display this will be read on. It only became visible once the marquee moved
 * to the top of the page.
 */
const COPIES = 6;

export function Ticker() {
  return (
    <div
      className="overflow-hidden bg-red-deeper py-3.5 text-white"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max">
        {Array.from({ length: COPIES }, (_, i) => (
          <Run key={i} />
        ))}
      </div>
    </div>
  );
}
