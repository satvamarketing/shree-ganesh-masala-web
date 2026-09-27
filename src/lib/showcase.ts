import type { Product } from "@/data/catalog";

const ROW = 4;

/**
 * The products for one home-page showcase row.
 *
 * House-brand lines only, and only those with a real photograph, since the row
 * is there to show the product. Each title appears once, so the row reads as a
 * spread of the range rather than one line in four pack sizes. Lines matching
 * `prefer` fill the row first, in catalogue order, and the rest of the
 * department only tops it up if too few match.
 *
 * `prefer` matters: the imported catalogue marks some third-party lines as
 * house brand (Century masalas, Aji No Moto, Tata Salt), so a row left to
 * catalogue order alone can lead with products Shree Ganesh does not make.
 */
export function pickShowcase(
  products: Product[],
  department: string,
  prefer: RegExp | null,
): Product[] {
  const seen = new Set<string>();
  const pool: Product[] = [];
  for (const p of products) {
    if (!p.isHouseBrand || !p.image || !p.departments.includes(department)) {
      continue;
    }
    if (seen.has(p.title)) continue;
    seen.add(p.title);
    pool.push(p);
  }

  const preferred = prefer ? pool.filter((p) => prefer.test(p.title)) : [];
  const others = pool.filter((p) => !preferred.includes(p));

  return [...preferred, ...others].slice(0, ROW);
}
