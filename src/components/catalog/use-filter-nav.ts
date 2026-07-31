"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/** Rewrites one search param, preserving the rest and resetting pagination. */
export function useFilterNav() {
  const router = useRouter();
  const params = useSearchParams();

  return useCallback(
    (key: string, value: string | null, opts: { keepPage?: boolean } = {}) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "" || value === "all") next.delete(key);
      else next.set(key, value);
      if (!opts.keepPage) next.delete("page");
      const qs = next.toString();
      router.push(qs ? `/range?${qs}` : "/range", { scroll: false });
    },
    [params, router],
  );
}
