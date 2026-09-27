export type Brand = {
  name: string;
  slug: string;
  /**
   * Null when no usable logo file exists. Consumers must fall back to a
   * typographic wordmark rather than rendering an empty <Image>.
   */
  logo: string | null;
  bg: string;
  blurb: string;
};

/**
 * Blurbs describe what each brand's lines in the catalogue actually are (client
 * round 2: all content from the original site). Two v7 blurbs were wrong: the
 * Herbs & Spices brand is herbal powders, and Henaa is incense and basmati
 * rice, not henna.
 */
export const brands: Brand[] = [
  {
    name: "Shree Ganesh",
    slug: "shree-ganesh",
    logo: "/brands/shree-ganesh.webp",
    bg: "#FFF8EE",
    blurb:
      "Masalas, spices, pickles, instant mixes, khakhra and sweets.",
  },
  {
    name: "Amdavadi",
    slug: "amdavadi",
    logo: "/brands/amdavadi.25ab697e.webp",
    bg: "#FFF8EE",
    blurb:
      "Farsan, chevda, gathia, sev and mukhvas.",
  },
  {
    name: "Herbs & Spices",
    slug: "herbs-and-spices",
    logo: "/brands/herbs-and-spices.webp",
    bg: "#FFF8EE",
    blurb: "Herbal powders: amla, ashwagandha, neem, shikakai, triphala and more.",
  },
  {
    name: "Dhiraj",
    slug: "dhiraj",
    logo: "/brands/dhiraj.webp",
    bg: "#414735",
    // Corrected: the design described Dhiraj as "flours, dals and rice", but
    // all five Dhiraj lines in the real catalog are cookies. See spec §8.2.
    blurb:
      "Cookies: cashew, chocolate, coconut, Surti jeera butter and nankhati.",
  },
  {
    name: "Vipul Dudhiya",
    slug: "vipul-dudhiya",
    logo: "/brands/vipul-dudhiya.636be747.webp",
    bg: "#FFF8EE",
    blurb: "Frozen sweets: kaju katli, gajar halva, ghari, milk cake and more.",
  },
  {
    name: "Henaa",
    slug: "henaa",
    logo: "/brands/henaa.6b2b9239.webp",
    bg: "#FBF3E4",
    blurb: "Incense sticks and basmati rice.",
  },
];
