"use client";

import { useState } from "react";
import { wells } from "@/data/story";

/**
 * The dabba: a spice tin whose seven wells select the masala described beside
 * it (reference lines 126-146, 557-581).
 *
 * v7 renders the wells as bare <button> elements with no accessible text and
 * no keyboard affordance beyond focus. Here they are a radiogroup, so the tin
 * is operable with arrow keys and each well announces which spice it is and
 * whether it is selected.
 */
export function SpiceTin() {
  const [index, setIndex] = useState(0);
  const active = wells[index];

  function move(delta: number) {
    setIndex((current) => (current + delta + wells.length) % wells.length);
  }

  return (
    <div className="grid items-center gap-[clamp(32px,5vw,72px)] lg:grid-cols-2">
      <div className="flex justify-center">
        <div
          role="radiogroup"
          aria-label="Choose a spice from the tin"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              move(1);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              move(-1);
            }
          }}
          className="relative aspect-square w-[min(100%,440px)] rounded-full border-[10px] border-[#5A6A71] shadow-float"
          style={{
            background: "linear-gradient(145deg, #4C5C63, #22333B)",
            boxShadow:
              "0 30px 60px rgba(0,0,0,0.45), inset 0 2px 12px rgba(255,255,255,0.12)",
          }}
        >
          {wells.map((well, i) => {
            // Seven wells evenly spaced on a circle, first one at the top.
            const angle = (i / wells.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 31;
            const left = 50 + Math.cos(angle) * radius;
            const top = 50 + Math.sin(angle) * radius;
            const on = i === index;

            return (
              <button
                key={well.name}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={well.name}
                tabIndex={on ? 0 : -1}
                onClick={() => setIndex(i)}
                className="absolute aspect-square w-[25%] cursor-pointer rounded-full p-0 transition-[transform,box-shadow,border-color] duration-[250ms]"
                style={{
                  left: `${left.toFixed(2)}%`,
                  top: `${top.toFixed(2)}%`,
                  transform: `translate(-50%, -50%)${on ? " scale(1.14)" : ""}`,
                  background: well.colour,
                  border: on
                    ? "4px solid #FBCF00"
                    : "3px solid rgba(255,255,255,0.16)",
                  boxShadow: on
                    ? "0 0 0 6px rgba(207,50,45,0.22), inset 0 4px 12px rgba(0,0,0,0.35)"
                    : "inset 0 4px 12px rgba(0,0,0,0.4)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* aria-live so keyboard and screen-reader users hear the panel change. */}
      <div aria-live="polite">
        <div className="mb-3.5 text-[11.5px] font-extrabold tracking-[2.2px] text-gold uppercase">
          {active.hindi}
        </div>
        <h3 className="mb-4.5 font-serif text-[clamp(28px,3.4vw,46px)] leading-[1.1] font-normal">
          {active.name}
        </h3>
        <p className="mb-6.5 text-[16.5px] leading-[1.75] text-cream/82">
          {active.note}
        </p>
        <div className="inline-flex items-center gap-3.5 rounded-2xl border border-red/30 bg-cream/7 px-5.5 py-4">
          <span
            className="h-10 w-10 shrink-0 rounded-full"
            style={{ background: active.colour }}
            aria-hidden="true"
          />
          <span>
            <span className="block text-[15.5px] font-bold">
              {active.product}
            </span>
            <span className="mt-0.5 block text-[13px] tracking-[1px] text-cream/55 uppercase">
              {active.brand}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
