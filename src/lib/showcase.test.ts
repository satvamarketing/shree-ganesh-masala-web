import { describe, expect, it } from "vitest";
import type { Product } from "@/data/catalog";
import { pickShowcase } from "./showcase";

function product(over: Partial<Product>): Product {
  return {
    handle: over.title?.toLowerCase().replace(/\W+/g, "-") ?? "x",
    title: "Item",
    rawTitle: "Item",
    brand: "Shree Ganesh",
    isHouseBrand: true,
    departments: ["snacks"],
    size: null,
    unitsPerCarton: null,
    image: "/catalog/x.webp",
    description: "",
    ...over,
  };
}

describe("pickShowcase", () => {
  it("keeps only house-brand lines with a photo in the department", () => {
    const picked = pickShowcase(
      [
        product({ title: "A" }),
        product({ title: "B", isHouseBrand: false }),
        product({ title: "C", image: null }),
        product({ title: "D", departments: ["pickles"] }),
      ],
      "snacks",
      null,
    );
    expect(picked.map((p) => p.title)).toEqual(["A"]);
  });

  it("shows each title once, however many pack sizes it comes in", () => {
    const picked = pickShowcase(
      [product({ title: "A", handle: "a-1" }), product({ title: "A", handle: "a-2" }), product({ title: "B" })],
      "snacks",
      null,
    );
    expect(picked.map((p) => p.handle)).toEqual(["a-1", "b"]);
  });

  it("fills the row with preferred lines first, in catalogue order", () => {
    const picked = pickShowcase(
      [
        product({ title: "Sev" }),
        product({ title: "Khakhra Jeera" }),
        product({ title: "Chevda" }),
        product({ title: "Khakhra Methi" }),
        product({ title: "Khakhra Plain" }),
        product({ title: "Gathia" }),
      ],
      "snacks",
      /khakhra/i,
    );
    expect(picked.map((p) => p.title)).toEqual([
      "Khakhra Jeera",
      "Khakhra Methi",
      "Khakhra Plain",
      "Sev",
    ]);
  });

  it("keeps catalogue order when there is no preference", () => {
    const picked = pickShowcase(
      ["E", "D", "C", "B", "A"].map((title) => product({ title })),
      "snacks",
      null,
    );
    expect(picked.map((p) => p.title)).toEqual(["E", "D", "C", "B"]);
  });
});
