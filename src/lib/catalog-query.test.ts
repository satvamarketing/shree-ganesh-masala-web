import { describe, expect, it } from "vitest";
import type { Product } from "@/data/catalog";
import { brandFilterOptions, PAGE_SIZE, queryProducts } from "./catalog-query";

function p(over: Partial<Product> & { handle: string }): Product {
  return {
    title: over.handle,
    rawTitle: over.handle,
    brand: "Shree Ganesh",
    isHouseBrand: true,
    departments: [],
    size: null,
    unitsPerCarton: null,
    image: null,
    description: "",
    ...over,
  };
}

const all: Product[] = [
  p({
    handle: "tea-masala",
    title: "Ganesh Tea Masala",
    brand: "Shree Ganesh",
    departments: ["herbs-and-spices"],
  }),
  p({
    handle: "khakhra",
    title: "Chilli Khakhra",
    brand: "Amdavadi",
    departments: ["snacks"],
  }),
  p({
    handle: "maggi",
    title: "Maggi Noodles",
    brand: "Maggi",
    isHouseBrand: false,
    departments: ["noodles"],
  }),
  p({
    handle: "lays",
    title: "Lays Classic",
    brand: "Lays",
    isHouseBrand: false,
    departments: ["snacks"],
  }),
];

describe("queryProducts", () => {
  it("returns everything, paginated, with no filters", () => {
    const r = queryProducts(all, {});
    expect(r.total).toBe(4);
    expect(r.items).toHaveLength(4);
    expect(r.page).toBe(1);
    expect(r.pageCount).toBe(1);
  });

  it("filters by department", () => {
    const r = queryProducts(all, { department: "snacks" });
    expect(r.items.map((x) => x.handle)).toEqual(["khakhra", "lays"]);
  });

  it("filters by a house brand", () => {
    const r = queryProducts(all, { brand: "Amdavadi" });
    expect(r.items.map((x) => x.handle)).toEqual(["khakhra"]);
  });

  it("groups every third-party line under 'imported'", () => {
    const r = queryProducts(all, { brand: "imported" });
    expect(r.items.map((x) => x.handle)).toEqual(["maggi", "lays"]);
  });

  it("searches title, raw title and brand, case-insensitively", () => {
    expect(queryProducts(all, { q: "masala" }).items.map((x) => x.handle)).toEqual([
      "tea-masala",
    ]);
    expect(queryProducts(all, { q: "LAYS" }).items.map((x) => x.handle)).toEqual([
      "lays",
    ]);
  });

  it("combines filters", () => {
    const r = queryProducts(all, { department: "snacks", brand: "imported" });
    expect(r.items.map((x) => x.handle)).toEqual(["lays"]);
  });

  it("returns an empty result rather than throwing when nothing matches", () => {
    const r = queryProducts(all, { q: "nothing-matches-this" });
    expect(r.items).toEqual([]);
    expect(r.total).toBe(0);
    expect(r.pageCount).toBe(1);
  });

  it("paginates and clamps out-of-range pages", () => {
    const many = Array.from({ length: PAGE_SIZE + 5 }, (_, i) =>
      p({ handle: `x${i}` }),
    );
    expect(queryProducts(many, {}).items).toHaveLength(PAGE_SIZE);
    expect(queryProducts(many, { page: 2 }).items).toHaveLength(5);
    expect(queryProducts(many, { page: 99 }).page).toBe(2);
    expect(queryProducts(many, { page: 0 }).page).toBe(1);
    expect(queryProducts(many, { page: -3 }).page).toBe(1);
  });

  it("ignores an unknown brand or department rather than returning nothing", () => {
    // A stale bookmarked URL should still show the catalog, not a dead end.
    expect(queryProducts(all, { brand: "Nonexistent" }).total).toBe(4);
    expect(queryProducts(all, { department: "nope" }).total).toBe(4);
  });
});

describe("brandFilterOptions", () => {
  it("lists house brands present in the data, then a single imported option", () => {
    const opts = brandFilterOptions(all);
    expect(opts[0]).toEqual({ value: "all", label: "All products" });
    expect(opts.map((o) => o.value)).toContain("Shree Ganesh");
    expect(opts.map((o) => o.value)).toContain("Amdavadi");
    expect(opts.map((o) => o.value)).not.toContain("Maggi");
    expect(opts.at(-1)).toEqual({ value: "imported", label: "Imported brands" });
  });
});
