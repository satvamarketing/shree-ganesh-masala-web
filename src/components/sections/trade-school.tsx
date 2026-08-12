"use client";

import { useState } from "react";
import { tradeSchoolFacts } from "@/data/story";

/**
 * The trade-school accordion (reference lines 157-170, 583-599).
 * One panel open at a time, first open by default, as in the design.
 */
export function TradeSchool() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="grid max-w-[900px] gap-3">
      {tradeSchoolFacts.map((fact, i) => {
        const isOpen = open === i;
        const panelId = `fact-panel-${i}`;
        const buttonId = `fact-button-${i}`;

        return (
          <div
            key={fact.q}
            className="overflow-hidden rounded-[18px] border border-line bg-white"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full cursor-pointer items-center gap-4.5 border-0 bg-transparent px-[clamp(20px,2.4vw,30px)] py-[clamp(20px,2.4vw,28px)] text-left font-sans"
              >
                <span className="shrink-0 font-serif text-[19px] text-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[clamp(16px,1.5vw,19px)] font-bold text-ink">
                  {fact.q}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[22px] leading-none text-faint"
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>

            {isOpen ? (
              <p
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="m-0 max-w-[68ch] pr-[clamp(20px,2.4vw,30px)] pb-[clamp(24px,2.6vw,30px)] pl-[clamp(56px,5vw,68px)] text-base leading-[1.75] text-body"
              >
                {fact.a}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
