"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/data/story";
import { images } from "@/data/images";
import { quote } from "@/data/story";
import { DesignedPanel } from "@/components/ui";

const BADGE_TONES = {
  red: "bg-red text-white",
  forest: "bg-forest text-[#E9F3E4]",
  gold: "bg-gold text-ink",
} as const;

/**
 * Distance from the top at which a chapter counts as the active one. Must sit
 * comfortably below where `scroll-mt` parks a chapter after a rail click —
 * chapters were landing at 224-261px, so the design's 260 left a click on the
 * boundary highlighting the *previous* chapter.
 */
const ACTIVE_OFFSET = 320;

/**
 * Ports the design's scroll-spy (reference lines 734-751). Chapter prose is
 * passed in as props from the server, so it is not shipped as JS — only the
 * highlight logic runs on the client.
 */
export function StoryChapters({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    function recompute() {
      let next = 0;
      refs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) next = i;
      });
      setActive((current) => (current === next ? current : next));
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        recompute();
      });
    }

    // Run once on mount so a deep link or a restored scroll position
    // highlights the right chapter immediately.
    recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="shell grid items-start gap-[clamp(28px,5vw,70px)] py-[clamp(56px,7vw,96px)] lg:[grid-template-columns:minmax(0,240px)_minmax(0,1fr)]">
      <div className="sticky top-[110px] hidden gap-1 lg:grid">
        <div className="mb-3.5 text-[11.5px] font-extrabold tracking-[2.5px] text-red uppercase">
          The Journey
        </div>
        {chapters.map((c, i) => {
          const on = i === active;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              // Highlight immediately on click rather than waiting for the
              // scroll handler, so the rail never lags behind the user.
              onClick={() => setActive(i)}
              className={`flex items-center gap-3 py-2.25 text-[14.5px] transition-colors ${
                on ? "font-bold text-ink" : "font-medium text-faint hover:text-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className={`shrink-0 rounded-full transition-all duration-200 ${
                  on ? "h-[11px] w-[11px] bg-red" : "h-[7px] w-[7px] bg-[#DDCDB4]"
                }`}
              />
              <span className="min-w-0">{c.railLabel}</span>
            </a>
          );
        })}
      </div>

      <div className="grid min-w-0 gap-[clamp(40px,5vw,72px)]">
        {chapters.map((c, i) => (
          <div key={c.id}>
            <div
              id={c.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="relative scroll-mt-28"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8.5 right-0 font-serif text-[120px] leading-none text-[#F2E6D0] select-none"
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="relative">
                <div
                  className={`mb-4 inline-block rounded-full px-3.5 py-[7px] text-xs font-extrabold tracking-[2px] uppercase ${BADGE_TONES[c.badgeTone]}`}
                >
                  {c.badge}
                </div>
                <h2
                  className="mb-4 font-serif text-[clamp(28px,3.2vw,42px)] leading-[1.1] font-normal text-ink"
                  style={{ textWrap: "pretty" }}
                >
                  {c.title}
                </h2>
                <p className="mb-4.5 text-[16.5px] leading-[1.8] text-body">
                  {c.body}
                </p>

                {c.tiles ? (
                  <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(130px,1fr))]">
                    {c.tiles.map((t) => (
                      <div
                        key={t}
                        className="rounded-[14px] border border-line bg-white px-4.5 py-4 text-[14.5px] font-bold text-ink"
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                ) : null}

                {c.image ? (
                  <div className="relative h-[220px] overflow-hidden rounded-[18px] bg-sand-deep">
                    {images[c.image].src ? (
                      <Image
                        src={images[c.image].src}
                        alt={images[c.image].alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 720px"
                        className="object-cover"
                      />
                    ) : (
                      <DesignedPanel label={images[c.image].alt} />
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* The design places the pull-quote after the second chapter. */}
            {i === 1 ? (
              <blockquote className="relative mt-[clamp(40px,5vw,72px)] overflow-hidden rounded-[24px] bg-red p-[clamp(32px,4vw,56px)] text-[#FFF1DE]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[-10px] left-6 font-serif text-[180px] leading-none text-white/12 select-none"
                >
                  &ldquo;
                </div>
                <p
                  className="relative mb-4.5 font-serif text-[clamp(24px,2.8vw,36px)] leading-[1.4]"
                  style={{ textWrap: "pretty" }}
                >
                  {quote.text}
                </p>
                <footer className="relative text-[12.5px] font-extrabold tracking-[2px] text-[#FBD9DB] uppercase">
                  {quote.attribution}
                </footer>
              </blockquote>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
