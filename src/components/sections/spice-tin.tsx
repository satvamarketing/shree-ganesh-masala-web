"use client";

import Image from "next/image";
import { useState } from "react";
import { DABBA_IMAGE, wellHotspots } from "@/data/dabba";
import { wells } from "@/data/story";

/**
 * The dabba: a photograph of a real masala tin whose seven wells select the
 * spice described beside it.
 *
 * The hotspots are positioned from measurements of the photograph, in
 * src/data/dabba.ts. They are transparent buttons, so the tin reads as a plain
 * photo until a well is selected, hovered or focused.
 *
 * It is a radiogroup rather than seven loose buttons, so the tin is operable
 * with arrow keys and each well announces which spice it is and whether it is
 * selected. v7's own markup used bare buttons with no accessible name.
 */
export function SpiceTin() {
  const [index, setIndex] = useState(0);
  const active = wells[index];

  function move(delta: number) {
    setIndex((current) => (current + delta + wells.length) % wells.length);
  }

  return (
    <div className="grid items-center gap-[clamp(28px,3.6vw,56px)] lg:grid-cols-2">
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
          className="relative aspect-square w-[min(100%,460px)]"
        >
          {/* A neutral disc sits behind the photograph so the layout and the
              hotspots still make sense if the image ever fails to load. */}
          <div
            aria-hidden="true"
            className="absolute inset-[1%] rounded-full bg-sand-deep"
          />
          <Image
            src={DABBA_IMAGE}
            alt="A masala dabba holding turmeric, red chilli, coriander-cumin, cumin seed, mustard seed, asafoetida and garam masala"
            fill
            sizes="(max-width: 1024px) 90vw, 460px"
            priority
            // The photograph's own background and drop shadow are cut away in
            // scripts/build-dabba.mjs, so the tin is grounded here instead. Its
            // baked shadow was a warm off-white a few units lighter than this
            // section, which read as a pale box behind the tin.
            className="object-contain drop-shadow-[0_16px_26px_rgba(35,31,29,0.16)]"
          />

          {wells.map((well, i) => {
            const spot = wellHotspots[i];
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
                title={well.name}
                className="absolute cursor-pointer rounded-full transition-[box-shadow,transform] duration-200 hover:scale-[1.04]"
                style={{
                  left: `${spot.left}%`,
                  top: `${spot.top}%`,
                  width: `${spot.radius * 2}%`,
                  aspectRatio: "1",
                  transform: "translate(-50%, -50%)",
                  // Only the selected well is ringed, so the tin still reads as
                  // a photograph rather than a diagram.
                  boxShadow: on
                    ? "0 0 0 4px #CF322D, 0 0 0 11px rgba(207,50,45,0.20)"
                    : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* aria-live so keyboard and screen-reader users hear the panel change. */}
      <div aria-live="polite">
        <div className="mb-3.5 text-[11.5px] font-extrabold tracking-[2.2px] text-red uppercase">
          {active.hindi}
        </div>
        <h3 className="mb-4 font-serif text-[clamp(24px,2.6vw,38px)] leading-[1.1] font-normal text-ink">
          {active.name}
        </h3>
        <p className="mb-6 max-w-[46ch] text-[16px] leading-[1.75] text-body">
          {active.note}
        </p>

        <div className="inline-flex items-center gap-4 rounded-2xl border border-line bg-white px-4 py-3.5">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
            <Image
              src={active.image}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </span>
          <span>
            <span className="block text-[15.5px] font-bold text-ink">
              {active.product}
            </span>
            <span className="mt-0.5 block text-[13px] tracking-[1px] text-muted uppercase">
              {active.brand}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
