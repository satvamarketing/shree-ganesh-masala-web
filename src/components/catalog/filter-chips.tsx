"use client";

import { useFilterNav } from "@/components/catalog/use-filter-nav";

export type ChipOption = { value: string; label: string };

/** The design's filter chip (reference line 755), driven by a search param. */
export function FilterChips({
  options,
  active,
  param,
  label,
}: {
  options: ChipOption[];
  /** Current value; "" or "all" means the first (unfiltered) option. */
  active: string;
  param: string;
  label: string;
}) {
  const navigate = useFilterNav();
  const current = active === "" ? "all" : active;

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const on = option.value === current;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() => navigate(param, option.value)}
            className={`cursor-pointer rounded-full border-[1.5px] px-5 py-[11px] text-sm font-bold transition-all duration-[180ms] ${
              on
                ? "border-ink bg-ink text-white"
                : "border-line-deep bg-white text-ink hover:border-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
