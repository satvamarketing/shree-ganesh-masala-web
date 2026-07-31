import type { Product } from "@/data/catalog";

export const PAGE_SIZE = 48;

/** Sentinel brand value covering every non-house-brand line. See spec §5. */
export const IMPORTED = "imported";

export type Query = {
  q?: string;
  department?: string;
  brand?: string;
  page?: number;
};

export type Result = {
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
};

export function queryProducts(all: Product[], query: Query): Result {
  const q = query.q?.trim().toLowerCase() ?? "";
  const department = query.department?.trim() ?? "";
  const brand = query.brand?.trim() ?? "";

  // An unknown department or brand is ignored rather than filtering to zero,
  // so a stale bookmark degrades to the full catalog instead of a dead end.
  const departmentIsReal =
    department !== "" && all.some((p) => p.departments.includes(department));
  const brandIsReal =
    brand === IMPORTED ||
    (brand !== "" && all.some((p) => p.isHouseBrand && p.brand === brand));

  const filtered = all.filter((p) => {
    if (departmentIsReal && !p.departments.includes(department)) return false;
    if (brandIsReal) {
      if (brand === IMPORTED) {
        if (p.isHouseBrand) return false;
      } else if (p.brand !== brand) return false;
    }
    if (q !== "") {
      const haystack = `${p.title} ${p.rawTitle} ${p.brand}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(
    Math.max(1, Math.trunc(query.page ?? 1) || 1),
    pageCount,
  );
  const start = (page - 1) * PAGE_SIZE;

  return { items: filtered.slice(start, start + PAGE_SIZE), total, page, pageCount };
}

export function brandFilterOptions(
  all: Product[],
): { value: string; label: string }[] {
  const houseBrands = [
    ...new Set(all.filter((p) => p.isHouseBrand).map((p) => p.brand)),
  ].sort();
  return [
    { value: "all", label: "All products" },
    ...houseBrands.map((b) => ({ value: b, label: b })),
    { value: IMPORTED, label: "Imported brands" },
  ];
}
