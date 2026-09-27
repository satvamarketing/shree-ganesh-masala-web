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

  // Real banners from the live site. The home page's banner slider shows these
  // two plus the snack and sweets banners; see banner-slider.tsx.
  masalaFeature: {
    src: "/banners/masala-lineup.webp",
    alt: "Shree Ganesh masala packets with whole spices and ground spice bowls",
  },
  pickleFeature: {
    src: "/banners/pickle-range.webp",
    alt: "The Shree Ganesh pickle range: mixed, green chilli, gorkeri, mango, kerda and thokku mango",
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

  /**
   * The original site's spice flat-lay, used beside "Who we are" and on the
   * About page until the founder photograph below arrives.
   */
  spiceSpoons: {
    src: "/photos/spice-spoons.webp",
    alt: "Whole and ground spices on silver spoons: turmeric, chilli, cumin, coriander, mustard seed, cardamom and star anise",
  },

  // Awaiting client photography. Until it arrives, the About page shows the
  // spice photograph above instead.
  founder: {
    src: "",
    alt: "Shri Vrajlal Manilal Shah, founder of Shree Ganesh",
    needsReal: true,
  },
};
