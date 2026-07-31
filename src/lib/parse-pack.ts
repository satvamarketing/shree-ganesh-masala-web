export type Pack = {
  /** Title with the pack suffix removed, for display. Never empty. */
  name: string;
  /** Normalised unit size, e.g. "400g". Null when the title carries none. */
  size: string | null;
  /** Units in a carton, e.g. 25. Null when the title carries none. */
  unitsPerCarton: number | null;
};

const UNIT = "(?:kg|g|gm|ml|l|lt|ltr|pcs|pc)";

/** "400gx25", "5 KG X 4" — a unit size followed by a carton multiple. */
const SIZE_AND_CARTON = new RegExp(
  `\\s*(\\d+(?:\\.\\d+)?)\\s*(${UNIT})\\s*[x*]\\s*(\\d+)\\s*$`,
  "i",
);

/** "200g", "2pcs" — a trailing unit size with no carton multiple. */
const SIZE_ONLY = new RegExp(`\\s*(\\d+(?:\\.\\d+)?)\\s*(${UNIT})\\s*$`, "i");

/** Normalises unit spelling so "5 KG" and "5kg" collapse to one value. */
function normaliseUnit(unit: string): string {
  const u = unit.toLowerCase();
  if (u === "gm") return "g";
  if (u === "lt" || u === "ltr") return "l";
  if (u === "pc") return "pcs";
  return u;
}

/** Drops trailing separators left behind after the suffix is stripped. */
function cleanName(name: string, fallback: string): string {
  const cleaned = name.replace(/[\s,\-–—/]+$/, "").trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

export function parsePack(rawTitle: string): Pack {
  const title = rawTitle.trim();

  const both = title.match(SIZE_AND_CARTON);
  if (both) {
    return {
      name: cleanName(title.slice(0, both.index), title),
      size: `${both[1]}${normaliseUnit(both[2])}`,
      unitsPerCarton: Number(both[3]),
    };
  }

  const sizeOnly = title.match(SIZE_ONLY);
  if (sizeOnly) {
    return {
      name: cleanName(title.slice(0, sizeOnly.index), title),
      size: `${sizeOnly[1]}${normaliseUnit(sizeOnly[2])}`,
      unitsPerCarton: null,
    };
  }

  return { name: title, size: null, unitsPerCarton: null };
}
