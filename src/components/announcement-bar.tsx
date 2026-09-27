"use client";

import Link from "next/link";
import { Amphora, Cookie, Sprout } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * The strip above the header, on every page.
 *
 * Client round 2 asked for "the scroller on the top" to match the original
 * Shopify site. That site does not scroll a marquee: it shows one message at a
 * time in brand red, changing every 3 seconds, each with a small icon. These
 * are its three messages, verbatim, with its seedling, cookie and jar icons
 * (lucide has no jar, so the amphora stands in). Each links to its department.
 *
 * Messages sit stacked in one grid cell, so the bar is exactly one line tall
 * whichever is showing. Hidden ones are `inert` so keyboard focus only lands on
 * the visible link. Hovering or focusing the bar pauses it. Under
 * prefers-reduced-motion the message still changes, but without the slide.
 */
const MESSAGES = [
  {
    label: "Shree Ganesh Herbs & Spices",
    href: "/range?department=herbs-and-spices",
    Icon: Sprout,
  },
  {
    label: "Traditional Amdavadi Snacks",
    href: "/range?department=snacks",
    Icon: Cookie,
  },
  {
    label: "Shree Ganesh Pickles & Chutneys",
    href: "/range?department=pickles",
    Icon: Amphora,
  },
] as const;

const INTERVAL_MS = 3000;

export function AnnouncementBar() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % MESSAGES.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="bg-red-deeper text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="shell grid h-10 place-items-center overflow-hidden">
        {MESSAGES.map(({ label, href, Icon }, i) => {
          const shown = i === active;
          return (
            <Link
              key={label}
              href={href}
              inert={!shown}
              aria-hidden={!shown}
              className={`col-start-1 row-start-1 flex items-center gap-2.5 text-[12.5px] font-extrabold tracking-[1.6px] whitespace-nowrap uppercase transition-[opacity,transform] duration-500 ease-out hover:text-gold motion-reduce:transition-none ${
                shown
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0 motion-reduce:translate-y-0"
              }`}
            >
              <Icon size={16} aria-hidden="true" className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
