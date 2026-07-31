import { describe, expect, it } from "vitest";
import { parsePack } from "./parse-pack";

describe("parsePack", () => {
  it("splits size and carton quantity, and strips the suffix from the name", () => {
    expect(parsePack("Ganesh Aara Flour 400gx25")).toEqual({
      name: "Ganesh Aara Flour",
      size: "400g",
      unitsPerCarton: 25,
    });
  });

  it("handles ml, kg and spaced/uppercase separators", () => {
    expect(parsePack("Castor Oil 50mlx12")).toEqual({
      name: "Castor Oil",
      size: "50ml",
      unitsPerCarton: 12,
    });
    expect(parsePack("Dhiraj Surti Jeera Butter Cookies 400gx12")).toEqual({
      name: "Dhiraj Surti Jeera Butter Cookies",
      size: "400g",
      unitsPerCarton: 12,
    });
    expect(parsePack("Premium Basmati 5 KG X 4")).toEqual({
      name: "Premium Basmati",
      size: "5kg",
      unitsPerCarton: 4,
    });
  });

  it("keeps a bare size when there is no carton quantity", () => {
    expect(parsePack("Suterfeni 200g")).toEqual({
      name: "Suterfeni",
      size: "200g",
      unitsPerCarton: null,
    });
  });

  it("returns nulls when the title carries no pack information", () => {
    expect(parsePack("Diwali Wagli Diya")).toEqual({
      name: "Diwali Wagli Diya",
      size: null,
      unitsPerCarton: null,
    });
  });

  it("does not mistake a trailing piece count for a carton quantity", () => {
    // "2pcs" is the product's own contents, not a carton multiple.
    expect(parsePack("Diya Metal 2pcs")).toEqual({
      name: "Diya Metal",
      size: "2pcs",
      unitsPerCarton: null,
    });
  });

  it("never empties the name", () => {
    expect(parsePack("500gx20").name).toBe("500gx20");
  });

  it("trims stray punctuation left behind by stripping", () => {
    expect(parsePack("Tamarind, 500gx20").name).toBe("Tamarind");
  });
});
