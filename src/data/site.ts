export const site = {
  name: "Shree Ganesh",
  legalName: "Shree Ganesh Australia",
  description:
    "Shree Ganesh Australia, a masala house since 1969. We make spices, snacks, pickles, sweets and instant mixes in Ahmedabad and distribute them from Brisbane across Queensland.",
  foundedYear: 1969,
  address: {
    street: "Unit 3/32 Success St",
    suburb: "Acacia Ridge",
    state: "QLD",
    postcode: "4110",
    country: "AU",
  },
  phone: "0490 729 900",
  phoneHref: "tel:+61490729900",
  email: "info@shreeganesh.com.au",
  hours: "Mon–Fri 9:30am – 3:30pm",
  hoursNote: "Closed weekends",
  freeDeliveryThreshold: 500,
  deliveryArea: "Brisbane metro",
  manufacturing: "Ahmedabad, India",
  distribution: "Acacia Ridge, Brisbane",
  // Empty until the client supplies real handles. The live Shopify site links
  // to facebook.com/shopify, an unreplaced default — see spec §8.4.
  social: { facebook: "", instagram: "" },
  // Empty until the client supplies it — see spec §9.
  abn: "",
} as const;

/**
 * The header nav. Round 2 of client feedback dropped the story chapters and the
 * trade account, so this is a plain distributor site: who we are, what we make,
 * how to reach us. "Enquire now" sits beside it as the one call to action.
 */
export const nav = [
  { label: "Home", href: "/" },
  { label: "Our products", href: "/range" },
  { label: "Departments", href: "/departments" },
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const enquireHref = "/contact";

/** The contact form, with its subject already filled in for this product. */
export function productEnquiryHref(title: string): string {
  return `/contact?subject=${encodeURIComponent(`Product enquiry: ${title}`)}`;
}

export function formattedAddress(): string {
  const a = site.address;
  return `${a.street}, ${a.suburb} ${a.state} ${a.postcode}`;
}
