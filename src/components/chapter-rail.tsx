"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const CHAPTERS = [
  { num: "01", label: "The house" },
  { num: "02", label: "The dabba" },
  { num: "03", label: "Trade school" },
  { num: "04", label: "The rhythm" },
  { num: "05", label: "The aisle" },
] as const;

/**
 * Sticky chapter rail with scroll-spy (reference lines 84-93, 515-528).
 *
 * The threshold is 220px rather than v7's 200: the rail sits directly under a
 * 74px header and is itself 56px tall, so a chapter scrolled to via an anchor
 * lands around 130px and needs headroom above the trigger point, otherwise
 * clicking a chapter leaves the previous one highlighted.
 */
const ACTIVE_OFFSET = 220;

export function ChapterRail() {
  const [active, setActive] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    function recompute() {
      let next = 0;
      CHAPTERS.forEach((_, i) => {
        const el = document.getElementById(`ch-${i + 1}`);
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) next = i;
      });
      setActive((current) => (current === next ? current : next));
    }

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        recompute();
      });
    }

    recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-[66px] z-40 border-b border-line bg-white/94 backdrop-blur-[10px]">
      <nav
        aria-label="Chapters"
        className="shell flex h-[52px] items-center gap-[clamp(14px,2.4vw,34px)] overflow-x-auto"
      >
        {CHAPTERS.map((c, i) => {
          const on = i === active;
          return (
            <Link
              key={c.num}
              href={`/#ch-${i + 1}`}
              onClick={() => setActive(i)}
              aria-current={on ? "true" : undefined}
              className={`flex items-center gap-2.5 border-b-2 py-1.5 text-[13.5px] whitespace-nowrap transition-colors ${
                on
                  ? "border-red font-bold text-red"
                  : "border-transparent font-semibold text-muted hover:text-red"
              }`}
            >
              <span className="font-serif text-[15px]">{c.num}</span>
              <span>{c.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
