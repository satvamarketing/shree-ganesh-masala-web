/**
 * Site copy for the home and About pages.
 *
 * Client round 2: every word here comes from the original shreeganesh.com.au
 * (home page and About Us), tightened, with the focus on who Shree Ganesh is,
 * what it does, and what it makes. House style: no em dashes in rendered copy.
 */

/** The original home page's three benefit tiles, verbatim headings. */
export const benefits = [
  {
    title: "Fast, Free Local Delivery",
    body: "On all orders over $500 across Brisbane metro.",
  },
  {
    title: "Top Quality Products",
    body: "Hand-selected, customer approved.",
  },
  {
    title: "Unbeatable Prices",
    body: "Wholesale pricing for everyone.",
  },
] as const;

export const whoWeAre = {
  heading: "A masala house since 1969",
  body: [
    'Shree Ganesh began in Ahmedabad in 1969, when our founder, Shri Vrajlal Manilal Shah, launched "Shree Ganesh Masala." He was among the first to see how fast the ready masala market would grow.',
    "Today we make spices, snacks, pickles, sweets and instant mixes under our own brands, and distribute them across Queensland from our warehouse in Acacia Ridge, Brisbane.",
  ],
} as const;

/** Sagoon-style pillars: what the business actually does, in three parts. */
export const whatWeDo = [
  {
    title: "Manufacturing",
    body: "Our own brands are made in Ahmedabad to the original family recipes. Every product passes rigorous testing before it leaves the plant.",
  },
  {
    title: "Import & Distribution",
    body: "Stock is shipped to our Acacia Ridge warehouse and delivered to grocers, restaurants and caterers. Free Brisbane metro delivery over $500, with freight across Queensland on request.",
  },
  {
    title: "Quality",
    body: 'We cook by the golden words "Health Is Wealth." Healthy cooking without compromising taste or aroma, and never trading quality for quantity.',
  },
] as const;

/**
 * The original home page's five product rows, under its own headings. Each maps
 * to the catalogue department the products are drawn from; `prefer` picks the
 * lines that lead it (see pickShowcase for why every row sets one).
 */
export const showcase = [
  {
    title: "Premium Snacks",
    blurb: "Khakhra, chevda, sev and farsan the Amdavadi way.",
    department: "snacks",
    prefer: /khakhra|fafda|chevda|gathia/i,
  },
  {
    title: "Indian Sweets",
    blurb: "Laddu, katli, halwa and barfi for every occasion.",
    department: "sweets-and-desserts",
    prefer: /^Ganesh .*(laddu|katli|halva|roll)/i,
  },
  {
    title: "Herbs & Spices",
    blurb: "Whole and ground spices, and the masalas we started with.",
    department: "herbs-and-spices",
    prefer:
      /^(Chilli Powder Kashmiri|Coriander Cumin Powder|Turmeric Powder|Garam Masala)$/,
  },
  {
    title: "Authentic Pickles",
    blurb: "Mango, chilli, lime and gorkeri, made to home recipes.",
    department: "pickles",
    prefer: /mango|gorkeri|chilli|lime/i,
  },
  {
    title: "Instant Mixes",
    blurb: "Dhokla, khaman, handva and dosa mixes, ready in minutes.",
    department: "instant-food",
    prefer: /dhokla|khaman|handva|dosa/i,
  },
] as const;

export const whyChooseUs = [
  "At Shree Ganesh our only objective is 100% customer satisfaction. Our regular masalas, premium masalas and instant mixes hold a place on kitchen shelves because they are made to cook food people love.",
  "Every product that reaches you passes rigorous testing with modern technology and measurement, so it meets the same high standard every time. As we grow, we grow stronger in that policy, never compromising on quality or quantity.",
] as const;

/* ---------------------------------- About --------------------------------- */

export const aboutFounder = [
  'Our founder, Shri Vrajlal Manilal Shah, had a vision he called "Quality Vision." With rare foresight, he was among the first to see the potential of the ready masala market, and in 1969 he introduced "Shree Ganesh Masala."',
  'Quality has guided us ever since. We believe healthy cooking is the foundation of a healthy life, so every masala carries our assurance of healthy cooking without compromising taste or aroma.',
  'As lifestyles grew busier, customers asked for food that keeps pace. So alongside our spices and premium masalas we launched "Shree Ganesh Instant Mix": the same standard, ready in minutes.',
] as const;

export const vision =
  'The vision set by Shri Parmanand Shah is to provide quality products to every customer and earn a place in millions of hearts, building the lasting brand value of "Shree Ganesh."';
