"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The home page's opening banner slider, from the original Shopify site.
 *
 * Client round 2 asked for the original's product banners back at the top, in
 * place of v7's typographic hero. They are the client's own artwork, pulled
 * from shreeganesh.com.au at full resolution, and each one links to the
 * department it shows.
 *
 * The track is a native horizontal scroll-snap container, so touch swipe and
 * trackpad scroll work with no gesture code. Autoplay, the arrows and the dots
 * all just scroll it; the active dot is derived from the scroll position, so
 * however the visitor moves it, the dots agree. Autoplay pauses on hover and
 * focus, and never starts under prefers-reduced-motion.
 *
 * The banners carry their own lettering, so they are shown whole at their
 * native ~2.92:1 rather than cropped to a taller box on phones.
 */
const SLIDES = [
  {
    src: "/banners/masala-lineup.webp",
    alt: "Shree Ganesh masala packets: Kashmiri chilli, chilli, turmeric, coriander and coriander-cumin powders, with whole spices",
    href: "/range?department=herbs-and-spices",
    label: "Herbs & Spices",
  },
  {
    src: "/banners/pickle-range.webp",
    alt: "Authentic pickle made by Shree Ganesh: mixed, green chilli, gorkeri, mango, kerda and thokku mango pickles",
    href: "/range?department=pickles",
    label: "Pickles",
  },
  {
    src: "/banners/snack-range.webp",
    alt: "Anytime ready to munch: Shree Ganesh khari and khakhra, and Amdavadi fafda, gathiya, sing bhujiya and sev",
    href: "/range?department=snacks",
    label: "Snacks",
  },
  {
    src: "/banners/sweets-range.webp",
    alt: "Vipul Dudhiya Sweets range: moong dal halwa, motichur laddu, kaju katli, mohanthal, kaju roll and more",
    href: "/range?department=sweets-and-desserts",
    label: "Sweets",
  },
] as const;

const INTERVAL_MS = 5000;

export function BannerSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + SLIDES.length) % SLIDES.length;
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  }, []);

  // Keep the dots in step with wherever the track actually is.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      setActive(Math.min(Math.max(index, 0), SLIDES.length - 1));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => goTo(active + 1), INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, goTo]);

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-card transition-colors hover:bg-red hover:text-white sm:flex";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Our product ranges"
      className="bg-sand"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-[1600px]">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SLIDES.map((slide, i) => (
            <Link
              key={slide.src}
              href={slide.href}
              aria-roledescription="slide"
              aria-label={`${slide.label}, ${i + 1} of ${SLIDES.length}`}
              tabIndex={i === active ? 0 : -1}
              className="relative aspect-[1400/479] w-full shrink-0 snap-start"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 1600px) 100vw, 1600px"
                // Every slide loads up front. Lazy loading would hold back
                // the slides parked off to the side of the track until
                // autoplay reached them, and they would pop in blank.
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                className="object-cover"
              />
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous banner"
          onClick={() => goTo(active - 1)}
          className={`${arrow} left-[clamp(12px,2vw,24px)]`}
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next banner"
          onClick={() => goTo(active + 1)}
          className={`${arrow} right-[clamp(12px,2vw,24px)]`}
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      </div>

      <div className="flex justify-center gap-1 py-2.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show ${slide.label} banner`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => goTo(i)}
            className="group flex h-6 w-6 cursor-pointer items-center justify-center"
          >
            <span
              className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${
                i === active
                  ? "w-5 bg-red"
                  : "w-2 bg-line-deep group-hover:bg-muted"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
