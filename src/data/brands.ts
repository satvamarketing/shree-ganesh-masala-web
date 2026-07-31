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

export const brands: Brand[] = [
  {
    name: "Shree Ganesh",
    slug: "shree-ganesh",
    logo: "/brands/shree-ganesh.webp",
    bg: "#FFF8EE",
    blurb:
      "The flagship — masalas, pickles, instant mixes and mithai to the original family recipes.",
  },
  {
    name: "Amdavadi",
    slug: "amdavadi",
    logo: "/brands/amdavadi.webp",
    bg: "#FFF8EE",
    blurb:
      "Gujarati snacks — khakhra, chevda and farsan the way Ahmedabad's old city makes them.",
  },
  {
    name: "Herbs & Spices",
    slug: "herbs-and-spices",
    // The source logo could not be retrieved intact — see ASSETS-NEEDED.md.
    logo: null,
    bg: "#FFF8EE",
    blurb: "Whole and ground spices, herbs and seasonings for everyday cooking.",
  },
  {
    name: "Dhiraj",
    slug: "dhiraj",
    logo: "/brands/dhiraj.webp",
    bg: "#414735",
    // Corrected: the design described Dhiraj as "flours, dals and rice", but
    // all five Dhiraj lines in the real catalog are cookies. See spec §8.2.
    blurb:
      "Biscuits and cookies — coconut, chocolate, cashew, and Surti jeera butter and nankhati.",
  },
  {
    name: "Vipul Dudhiya",
    slug: "vipul-dudhiya",
    logo: "/brands/vipul-dudhiya.webp",
    bg: "#FFF8EE",
    blurb: "Traditional mithai, made to the same recipes for decades.",
  },
  {
    name: "Henaa",
    slug: "henaa",
    logo: "/brands/henaa.webp",
    bg: "#FBF3E4",
    blurb: "Henna and personal-care lines, stocked alongside the pantry range.",
  },
];
