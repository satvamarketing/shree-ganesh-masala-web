export type ImageSlot = {
  /** Root-relative path, or "" when no usable asset exists yet. */
  src: string;
  alt: string;
  /** True when the client still owes a real asset for this slot. */
  needsReal?: boolean;
};

/**
 * Every non-catalog image on the site resolves through this map, so a real
 * photograph replaces a designed placeholder by editing one entry. Slots with
 * an empty `src` render a DesignedPanel instead — never an empty <Image>.
 * Slots flagged needsReal are listed in ASSETS-NEEDED.md. See spec §6.
 */
export const images: Record<string, ImageSlot> = {
  logo: { src: "/logo/shree-ganesh.webp", alt: "Shree Ganesh" },

  masalaFeature: {
    src: "/banners/masala-lineup.webp",
    alt: "Shree Ganesh masala packets with whole spices and ground spice bowls",
  },
  pickleFeature: {
    src: "/banners/pickle-range.webp",
    alt: "The Shree Ganesh pickle range — mixed, green chilli, gorkeri, mango, kerda and thokku mango",
  },

  // The client owns this badge, but it could not be pulled through the design
  // MCP's 256 KiB file cap intact. Drop the file in and set src to enable the
  // badge in the certification section. See ASSETS-NEEDED.md.
  badgeAustralianOwned: {
    src: "",
    alt: "100% Australian owned and operated",
    needsReal: true,
  },

  // Awaiting client photography. Until then these render as designed panels,
  // never as stock photography that would misrepresent the business.
  hero: { src: "", alt: "Shree Ganesh pantry staples", needsReal: true },
  founder: {
    src: "",
    alt: "Shri Vrajlal Manilal Shah, founder",
    needsReal: true,
  },
  warehouse: { src: "", alt: "The Acacia Ridge warehouse", needsReal: true },
  archival1969: {
    src: "",
    alt: "The original Ahmedabad masala shop, 1969",
    needsReal: true,
  },
  qualityLine: { src: "", alt: "The Ahmedabad packing line", needsReal: true },
};
