export const site = {
  name: "Shree Ganesh",
  legalName: "Shree Ganesh Australia",
  tagline: "Stock the taste your customers grew up with.",
  description:
    "Indian pantry staples made in Ahmedabad, distributed across Queensland. Wholesale masalas, snacks, sweets and pickles for grocers, restaurants and caterers.",
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
  // Empty until the client supplies real handles. The live Shopify site
  // links to facebook.com/shopify, an unreplaced default — see spec §8.4.
  social: { facebook: "", instagram: "" },
  // Empty until the client supplies it — see spec §9.
  abn: "",
} as const;

export const nav = [
  { label: "Our Range", href: "/range" },
  { label: "Departments", href: "/departments" },
  { label: "Our Story", href: "/story" },
  { label: "Contact", href: "/contact" },
] as const;

export function formattedAddress(): string {
  const a = site.address;
  return `${a.street}, ${a.suburb} ${a.state} ${a.postcode}`;
}
