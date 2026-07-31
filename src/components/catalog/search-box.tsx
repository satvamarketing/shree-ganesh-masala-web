"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFilterNav } from "@/components/catalog/use-filter-nav";

/**
 * Debounced catalog search. Owns its own value so it keeps focus and text
 * across the navigations it triggers — it is never remounted by the result.
 */
export function SearchBox({
  initial,
  total,
}: {
  initial: string;
  total: number;
}) {
  const navigate = useFilterNav();
  const [value, setValue] = useState(initial);
  const dirty = useRef(false);

  useEffect(() => {
    if (!dirty.current) return;
    const id = setTimeout(() => navigate("q", value.trim() || null), 300);
    return () => clearTimeout(id);
  }, [value, navigate]);

  return (
    <div className="relative w-full max-w-[420px]">
      <label htmlFor="catalog-search" className="sr-only-label">
        Search products
      </label>
      <Search
        size={18}
        className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-faint"
        aria-hidden="true"
      />
      <input
        id="catalog-search"
        type="search"
        value={value}
        onChange={(e) => {
          dirty.current = true;
          setValue(e.target.value);
        }}
        placeholder={`Search ${total.toLocaleString("en-AU")} products`}
        className="w-full rounded-full border-[1.5px] border-line-deep bg-white py-4 pr-12 pl-12 text-base text-ink outline-none focus:border-ink"
      />
      {value !== "" ? (
        <button
          type="button"
          onClick={() => {
            dirty.current = true;
            setValue("");
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-faint hover:text-ink"
        >
          <X size={18} />
        </button>
      ) : null}
    </div>
  );
}
