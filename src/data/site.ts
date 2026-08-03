export const site = {
  name: "Shree Ganesh",
  legalName: "Shree Ganesh Australia",
  tagline: "Anyone can sell you a carton.",
  pullLine: "We grind what's in it.",
  description:
    "Shree Ganesh Australia, a masala house since 1969. Wholesale trade accounts for grocers, restaurants and caterers across Queensland.",
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
 * v7's nav is the five story chapters plus About. The catalogue links are ours:
 * v7 drops the range entirely, but the 1174-product catalogue is the site's
 * strongest indexable surface, so it stays reachable.
 */
export const storyNav = [
  { label: "The house", href: "/#ch-1" },
  { label: "The dabba", href: "/#ch-2" },
  { label: "Trade school", href: "/#ch-3" },
] as const;

export const catalogNav = [
  { label: "Our range", href: "/range" },
  { label: "Departments", href: "/departments" },
] as const;

export const nav = [
  ...storyNav,
  ...catalogNav,
  { label: "About us", href: "/about" },
] as const;

export function formattedAddress(): string {
  const a = site.address;
  return `${a.street}, ${a.suburb} ${a.state} ${a.postcode}`;
}
