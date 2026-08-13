"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";

/**
 * Scroll reveal, ported from v7's IntersectionObserver (reference lines
 * 494-513). Fades and lifts each block in as it enters the viewport, with a
 * small stagger between siblings.
 *
 * Classes are toggled on the node directly rather than held in React state:
 * the animation is presentation only, so driving it through state would add a
 * re-render per element for no benefit.
 *
 * The hidden class is applied after mount, so with JavaScript disabled — or if
 * the observer never fires — content stays visible instead of being stranded at
 * opacity 0. v7 needed a 2.5s failsafe timer for exactly that; deferring the
 * hide removes the failure mode rather than patching it.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger in ms, for siblings revealed together. */
  delay?: number;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      timer = setTimeout(() => el.classList.add("reveal-shown"), delay);
    };

    el.classList.add("reveal");

    // Already in view on load: reveal without waiting.
    //
    // The test is the whole viewport, not a fraction of it. Anything whose top
    // edge is on screen when the page settles is something the visitor can see
    // at rest, so hiding it means shipping invisible content. This used to be
    // innerHeight * 0.9, which stranded the deliberately peeking Trending
    // section at opacity 0 on tall displays: its top lands just past the 90%
    // line, and the observer's -12% bottom margin excludes it too, so nothing
    // was painted until the first scroll. Popping in without the fade is the
    // right trade for a block that is already visible.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      show();
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show();
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <Tag ref={ref} id={id} className={className || undefined}>
      {children}
    </Tag>
  );
}
