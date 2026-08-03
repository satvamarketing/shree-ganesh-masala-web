"use client";

import { useMemo, useSyncExternalStore } from "react";
import { FREIGHT_LEAD_DAYS, festivals } from "@/data/story";

const DAY_MS = 86_400_000;

const dateFormat = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const shortFormat = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
});

/** Today at local midnight, as a millisecond value. */
function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * The countdown is a client-only value, read through useSyncExternalStore with
 * a null server snapshot.
 *
 * The home page is statically prerendered, so computing "days away" on the
 * server would bake the build date into the HTML and the number would be wrong
 * from the next day onward. Returning null on the server and the real day on
 * the client keeps it correct on every visit with no hydration mismatch.
 *
 * The snapshot is a primitive bucketed to local midnight, so it stays stable
 * across renders within a day and cannot loop.
 */
const subscribe = () => () => {};

function useToday(): number | null {
  return useSyncExternalStore(
    subscribe,
    startOfToday,
    () => null,
  );
}

/** Chapter Four's festival countdown (reference lines 216-226, 601-619). */
export function FestivalCountdown() {
  const today = useToday();

  const counted = useMemo(() => {
    if (today === null) return null;
    return festivals
      .map((f) => {
        const date = new Date(`${f.iso}T00:00:00`);
        const orderBy = new Date(date.getTime() - FREIGHT_LEAD_DAYS * DAY_MS);
        return {
          name: f.name,
          stock: f.stock,
          date: dateFormat.format(date),
          orderBy: shortFormat.format(orderBy),
          days: Math.round((date.getTime() - today) / DAY_MS),
        };
      })
      // Festivals already past are dropped rather than pinned at "0 days away",
      // which is what clamping the value at zero would do.
      .filter((f) => f.days > 0)
      .sort((a, b) => a.days - b.days)
      .slice(0, 4);
  }, [today]);

  // Reserve the row's height so the section does not jump when counts land.
  if (counted === null) {
    return (
      <div className="grid gap-[clamp(14px,1.8vw,20px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
        {festivals.slice(0, 4).map((f) => (
          <div
            key={f.name}
            className="min-h-[188px] rounded-[18px] bg-black/16 p-[clamp(20px,2.4vw,26px)]"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  if (counted.length === 0) {
    return (
      <p className="text-[15px] leading-[1.7] text-cream/72">
        The next festival dates are being confirmed. Ask us for the current
        ordering calendar and we will send it through.
      </p>
    );
  }

  return (
    <div className="grid gap-[clamp(14px,1.8vw,20px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
      {counted.map((f) => (
        <div
          key={f.name}
          className="rounded-[18px] bg-black/16 p-[clamp(20px,2.4vw,26px)]"
        >
          <div className="font-serif text-[clamp(30px,3.2vw,40px)] leading-none text-gold">
            {f.days}
          </div>
          <div className="mt-2 mb-3.5 text-[11.5px] font-extrabold tracking-[1.6px] text-cream/50 uppercase">
            {f.days === 1 ? "day away" : "days away"}
          </div>
          <div className="mb-1.5 text-[17px] font-bold">{f.name}</div>
          <div className="text-[13.5px] leading-[1.55] text-cream/70">
            {f.date} · order by {f.orderBy}
          </div>
          <div className="mt-2.5 text-[13.5px] text-gold">{f.stock}</div>
        </div>
      ))}
    </div>
  );
}
