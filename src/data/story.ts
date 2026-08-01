/**
 * Story copy, taken from the live site's About page so nothing is invented —
 * except chapter 4, which the source design itself leaves open. See spec §9.
 */

export type Chapter = {
  id: string;
  /** Short label for the sticky rail. */
  railLabel: string;
  badge: string;
  badgeTone: "red" | "forest" | "gold";
  title: string;
  body: string;
  /** Key in src/data/images.ts, when the chapter carries an image. */
  image?: "archival1969";
  /** Rendered as a row of small cards beneath the body. */
  tiles?: string[];
};

export const chapters: Chapter[] = [
  {
    id: "ch-1",
    railLabel: "1969: Quality Vision",
    badge: "1969 · Ahmedabad",
    badgeTone: "red",
    title: "A vision he called Quality Vision",
    body: "Our founder, Shri Vrajlal Manilal Shah, was gifted with foresight and sharp business acumen. He was the first to identify the vast potential of the rapidly growing ready-masala market, and in 1969 he introduced a new product range called Shree Ganesh Masala.",
    image: "archival1969",
  },
  {
    id: "ch-2",
    railLabel: "Health Is Wealth",
    badge: "The guiding force",
    badgeTone: "forest",
    title: "Health Is Wealth",
    body: "Since the inception of the company, quality has been our guiding force. We have always focused on those golden words, believing healthy cooking is the foundation of a healthy life. Every masala carries a quality assurance for healthy cooking, without compromising on taste or aroma.",
  },
  {
    id: "ch-3",
    railLabel: "The instant era",
    badge: "A new era",
    badgeTone: "gold",
    title: "Life moves fast. So we made it instant.",
    body: "Spices, premium masalas and now instant mixes hold a special place in every customer's heart, because we understand their needs. Years ago we recognised the demand for products that keep up with changing times and increasingly demanding lifestyles, and launched Shree Ganesh Instant Mix.",
    tiles: ["Regular masalas", "Premium masalas", "Instant mixes"],
  },
  {
    id: "ch-4",
    railLabel: "Crossing the water",
    badge: "Brisbane",
    badgeTone: "forest",
    title: "The recipes cross the water",
    // TODO(client): the year, the first Queensland stockists and the history of
    // the Acacia Ridge facility are still outstanding — see ASSETS-NEEDED.md §3.
    // Written as an honest placeholder rather than invented detail.
    body: "Shree Ganesh now imports and distributes its own manufacturing from a warehouse in Acacia Ridge, supplying grocers, restaurants and caterers across Queensland. The full history of that move (the year, the first stockists, the early delivery runs) is being written with the family.",
  },
  {
    id: "ch-5",
    railLabel: "Six brands today",
    badge: "Today",
    badgeTone: "red",
    title: "Six brands, one standard",
    body: "Shree Ganesh, Amdavadi, Herbs & Spices, Dhiraj, Vipul Dudhiya Sweets and Henaa: all manufactured in Ahmedabad, all distributed from Brisbane to grocers and kitchens across Queensland. As time passes we grow stronger in our policies and persuasions, never compromising on quality or quantity.",
  },
];

export const quote = {
  text: "The way to a person's heart is through their stomach, and our masalas are crafted to create dishes that nurture one's emotions.",
  attribution: "The Shree Ganesh philosophy",
};

export const vision = {
  headline:
    "To provide quality products to end users and earn a well-deserved place in millions of hearts.",
  body: "The vision set by Shri Parmanand Shah: building the brand value of Shree Ganesh, one kitchen at a time.",
};

export const mission = {
  headline: "To lead the market by consistently delivering high-quality products.",
  body: "In a fiercely competitive market, we aim to emerge as the leader, and to expand into overseas markets in the years ahead.",
};

export const whyChooseUs = [
  {
    title: "An indispensable shelf",
    body: "Regular masalas, premium masalas and instant mixes hold their place on kitchen shelves because they earn it, every week.",
  },
  {
    title: "Rigorously tested",
    body: "Every product that reaches an end user passes rigorous testing channels with state-of-the-art technology and measurement.",
  },
  {
    title: "No compromise",
    body: "As time passes we grow stronger in our policies and persuasions, never compromising on quality or quantity.",
  },
];
