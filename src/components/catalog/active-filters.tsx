"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useFilterNav } from "@/components/catalog/use-filter-nav";

export function ActiveFilters({
  applied,
}: {
  applied: { param: string; label: string }[];
}) {
  const navigate = useFilterNav();
  if (applied.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-[13px] font-bold tracking-[1.5px] text-faint uppercase">
        Filtered by
      </span>
      {applied.map((f) => (
        <button
          key={`${f.param}:${f.label}`}
          type="button"
          onClick={() => navigate(f.param, null)}
          className="flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-teal bg-teal px-4 py-2 text-[13px] font-bold text-cream hover:bg-red hover:border-red"
        >
          {f.label}
          <X size={14} aria-hidden="true" />
          <span className="sr-only-label">Remove filter</span>
        </button>
      ))}
      <Link
        href="/range"
        className="text-[13.5px] font-bold text-red underline decoration-2 underline-offset-4 hover:text-red-dark"
      >
        Clear all
      </Link>
    </div>
  );
}
