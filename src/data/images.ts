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

  /**
   * Certification and trust marks, shown in the certification strip.
   *
   * `badgeAustralianOwned` and `badgeHaccp` are licensed certification trade
   * marks — see ASSETS-NEEDED.md §4 for what each licence requires before
   * these may be published.
   */
  badgeAustralianOwnedOperated: {
    src: "/badges/australian-owned-operated.webp",
    alt: "100% Australian owned and operated",
  },
  badgeAustralianOwned: {
    src: "/badges/australian-owned.webp",
    alt: "Australian Owned certified",
  },
  badgeHaccp: {
    src: "/badges/haccp-international.webp",
    alt: "HACCP International food safety certification",
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
