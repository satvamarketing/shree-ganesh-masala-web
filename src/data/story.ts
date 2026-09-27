/**
 * Site copy for the home and About pages.
 *
 * Client round 2: all content comes from the original shreeganesh.com.au (its
 * home and About Us pages), made more precise. Nothing here is a new claim:
 * where a line is shortened, the fact is still the original's. Headings are the
 * original's own section names. House style: no em dashes in rendered copy.
 */

/** The original home page's three benefit tiles, verbatim. */
export const benefits = [
  { title: "Fast, Free Local Delivery", body: "On all orders over $500." },
  { title: "Top Quality Products", body: "Hand-selected, customer approved." },
  { title: "Unbeatable Prices", body: "Wholesale pricing for everyone." },
] as const;

/** From the About Us page's opening, shortened. */
export const welcome = [
  'Shree Ganesh was founded by Shri Vrajlal Manilal Shah, the first to see the potential of the ready masala market. In 1969 he introduced "Shree Ganesh Masala."',
  'Quality has guided us ever since, by our golden words "Health Is Wealth": healthy cooking without compromising on taste and aroma.',
] as const;

/**
 * "What we do", in Sagoon's three-pillar form, with each pillar one fact from
 * the original About Us page.
 */
export const whatWeDo = [
  {
    title: "Masalas since 1969",
    body: "Regular and premium masalas, from the range our founder introduced as Shree Ganesh Masala.",
  },
  {
    title: "Instant Mixes",
    body: 'For changing times and busy lifestyles, we launched "Shree Ganesh Instant Mix."',
  },
  {
    title: "Tested for Quality",
    body: "Every product is tested with state-of-the-art technology and measurement before it reaches you.",
  },
] as const;

/**
 * The original home page's five product rows: its headings, its subtitles, and
 * the products it featured in each (matched by `prefer`, in catalogue order).
 */
export const showcase = [
  {
    title: "Premium Snacks",
    blurb: "Amdavadi, Shree Ganesh, Lays, MoM, Sikandar and more.",
    department: "snacks",
    prefer: /^Khakhra (Chilli Coriander|Bajri|Chapat|Mathia|Chorafali|Methi|Jeera)$/,
  },
  {
    title: "Indian Sweets",
    blurb: "Ladoo, gajar halwa, kaju katli, barfi, peda and more.",
    department: "sweets-and-desserts",
    prefer:
      /^(Ganesh +Moongdal Halva|Frozen Ganesh Kesar Katli|Ganesh Motichur Laddu|Ganesh Besan Laddu|Ganesh Kaju Katli|Ganesh Kaju Roll)$/,
  },
  {
    title: "Herbs & Spices",
    blurb: "Chilli powder, salt, turmeric, cloves, cardamom and more.",
    department: "herbs-and-spices",
    prefer:
      /^Ganesh (Tea|Dabeli|Jaljeera|Biryani Pulav|Pavbhaji|Sambhar|Chat) Masala$/,
  },
  {
    title: "Authentic Pickles",
    blurb: "Mango pickle, chilli pickle, aamla pickle, garlic pickle and more.",
    department: "pickles",
    prefer:
      /^Ganesh (Mango|Gunda|Garlic|Dabla|Green Chilli|Mix|Amba Halder) Pickle$/,
  },
  {
    title: "Instant Mixes",
    blurb: "Dosa mix, gulab jamun mix, dhokla mix, juice mix and more.",
    department: "instant-food",
    prefer:
      /^Ganesh (Khaman|Idli|Rava idli|Rava Dosa|Dakor Gota|Dahiwada) Mix$/,
  },
] as const;

/** Why Choose Us, from the home and About Us pages, shortened. */
export const whyChooseUs = [
  "At Shree Ganesh, our sole objective is 100% customer satisfaction. Our regular masalas, premium masalas and instant mixes hold an indispensable place on kitchen shelves.",
  "Every product that reaches the end user passes consistent testing with state-of-the-art technology and measurement, so it never falls short of the mark we set. We never compromise on quality or quantity.",
] as const;

/* ---------------------------------- About --------------------------------- */

/** The About Us page's three paragraphs, shortened. */
export const aboutFounder = [
  'The founder of Shree Ganesh, Shri Vrajlal Manilal Shah, had a vision he called "Quality Vision." Gifted with foresight and sharp business acumen, he was the first to identify the potential of the fast-growing ready masala market. In 1969, he introduced "Shree Ganesh Masala."',
  "Since the company began, quality has been our guiding force. We believe healthy cooking is the foundation of a healthy life, and our masalas carry a Quality Assurance for healthy cooking without compromising on taste and aroma.",
  'Spices, premium masalas and instant mixes hold a special place in our customers\' hearts because we understand their needs. Recognising the demand for products that keep up with changing times and busier lifestyles, we launched "Shree Ganesh Instant Mix."',
] as const;

export const vision =
  'The vision set by our founder, Shri Parmanand Shah, is to provide quality products to end users and earn a well-deserved place in millions of hearts, establishing the brand value of "Shree Ganesh."';
