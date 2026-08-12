/**
 * Narrative copy for the Trade v7 home page and About page.
 *
 * Verbatim from the design except where the em dashes were rewritten (house
 * style: none in rendered copy) and where hardcoded counts now derive from the
 * catalogue data.
 */

export const houseCards = [
  {
    title: "We are the maker",
    body: "Every one of our six brands is manufactured by us in Ahmedabad. You buy at maker price, not at a reseller's markup on someone else's label.",
  },
  {
    title: "Tested, batch by batch",
    body: "Every product that reaches an end user passes rigorous testing with current-standard technology and measurement before it leaves the plant.",
  },
  {
    title: "Quality and quantity",
    body: "The recipes stay traditional and the fill weights stay honest. As we grow, we grow stronger in that policy. We don't trim it.",
  },
];

/** The seven wells of the dabba, in the order they sit in the tin. */
export const wells = [
  {
    name: "Turmeric",
    hindi: "Haldi · હળદર",
    colour: "#E8A20C",
    product: "Ganesh Turmeric Powder",
    brand: "Herbs & Spice",
    note: "The colour every curry is judged by. Ours is single-origin and ground fine enough to bloom in oil in seconds, not minutes.",
    image: "/dabba/spice-turmeric.webp",
  },
  {
    name: "Red chilli",
    hindi: "Lal mirch · લાલ મરચું",
    colour: "#CF322D",
    product: "Ganesh Chilli Powder",
    brand: "Herbs & Spice",
    note: "Heat is easy. Colour without bitterness is the hard part, which is why we blend two chilli varieties instead of one.",
    image: "/dabba/spice-red-chilli.webp",
  },
  {
    name: "Coriander-cumin",
    hindi: "Dhana jeeru · ધાણાજીરું",
    colour: "#8A6B3A",
    product: "Ganesh Dhana Jeeru",
    brand: "Shree Ganesh",
    note: "The Gujarati household blend. Two parts coriander to one cumin, roasted separately then ground together, and the order matters.",
    image: "/dabba/spice-dhana-jeeru.webp",
  },
  {
    name: "Cumin seed",
    hindi: "Jeeru · જીરું",
    colour: "#7A5C34",
    product: "Ganesh Whole Cumin",
    brand: "Herbs & Spice",
    note: "Sold whole because it should be. A cumin seed keeps its oil for months; cumin powder loses it in weeks.",
    image: "/dabba/spice-cumin.webp",
  },
  {
    name: "Mustard seed",
    hindi: "Rai · રાઈ",
    colour: "#5E5326",
    product: "Ganesh Mustard Seed",
    brand: "Herbs & Spice",
    note: "The first thing into the pan and the sound a Gujarati kitchen starts with. Graded so the whole spoonful pops together.",
    image: "/dabba/spice-mustard.webp",
  },
  {
    name: "Asafoetida",
    hindi: "Hing · હીંગ",
    colour: "#D9B65C",
    product: "Ganesh Compounded Hing",
    brand: "Shree Ganesh",
    note: "A pinch does the work of an onion. Compounded to a consistent strength so a recipe behaves the same in every kitchen.",
    image: "/dabba/spice-hing.webp",
  },
  {
    name: "Garam masala",
    hindi: "Garam masala · ગરમ મસાલો",
    colour: "#4A2E1E",
    product: "Ganesh Garam Masala",
    brand: "Shree Ganesh",
    note: "The 1969 recipe, unchanged. Whole spices roasted in small runs so the oils are still in the powder when the carton reaches your shelf.",
    image: "/dabba/spice-garam-masala.webp",
  },
];

export const tradeSchoolFacts = [
  {
    q: "How do you tell a fresh grind from a stale one?",
    a: "Rub a pinch between your palms. Fresh ground masala warms and releases oil you can smell on your skin; stale powder just smells dusty. It is the single fastest quality check you can do at a counter, and it works in front of a customer.",
  },
  {
    q: "Why does the same recipe taste different in two kitchens?",
    a: "Almost always the tempering, not the masala. Spices need fat at the right heat to release their oils. Too cool and the flavour stays locked in the powder, too hot and it burns bitter in seconds. Tell a customer to wait for the mustard seeds to pop and half their complaints disappear.",
  },
  {
    q: "Whole or ground: what should you actually stock?",
    a: "Both, but rotate them differently. Whole spices hold their oils for months, ground loses aroma in weeks. Stock ground in the sizes that sell through fast and let the whole spices carry the long tail. Anything ground sitting past six months is costing you a repeat customer.",
  },
  {
    q: "When should festival stock actually land?",
    a: "Six weeks before, not two. Ocean freight from Ahmedabad plus clearance means the order you place in September is the shelf you are selling from in November. Sweets and snack lines move first; masala and staples carry the fortnight after.",
  },
];

export const rhythmDays = [
  {
    day: "Monday",
    title: "Order by noon",
    body: "Reorder your last cart in three clicks, or send the list by WhatsApp.",
  },
  {
    day: "Tuesday",
    title: "Picked & checked",
    body: "Picked at Acacia Ridge, checked against your invoice before it's sealed.",
  },
  {
    day: "Wednesday",
    title: "On your shelf",
    body: "Brisbane metro delivery, free over $500. QLD freight quoted on request.",
  },
];

export const sampleTin = {
  day: "Every quarter",
  title: "The sample tin",
  body: "New blends land at your counter before they hit the catalogue. Taste first, stock second.",
};

/**
 * Festival dates drive the countdown in Chapter Four.
 *
 * TODO(client): the design carries the note "Confirm festival dates against
 * your 2026-27 calendar before publishing." These are the dates as drawn and
 * have not been verified against an almanac. See ASSETS-NEEDED.md.
 */
export const festivals = [
  {
    name: "Ganesh Chaturthi",
    iso: "2026-09-14",
    stock: "Modak, mithai, sweet trays",
  },
  {
    name: "Navratri begins",
    iso: "2026-10-11",
    stock: "Farali snacks, fasting flours",
  },
  { name: "Diwali", iso: "2026-11-08", stock: "Sweets, gift boxes, ghee" },
  { name: "Holi", iso: "2027-03-03", stock: "Gulab jamun, thandai masala" },
];

/** Lead time from placing an order in Ahmedabad to stock landing, in days. */
export const FREIGHT_LEAD_DAYS = 42;

export const withoutUs = [
  "Five importers, five minimum orders",
  "Spices from one, snacks from another, sweets nowhere",
  "Six-week gaps when a line runs out",
  "Reseller markup on every carton",
  "No idea what to stock before Diwali",
];

export const withOneAccount = (departmentCount: number, brandCount: number) => [
  "One supplier, no minimum first order",
  `${departmentCount} departments and ${brandCount} house brands on one invoice`,
  "Weekly delivery rhythm you can plan around",
  "Maker pricing, straight from Ahmedabad",
  "A festival calendar and a stock list to go with it",
];

/* ---------------------------------- About --------------------------------- */

export const aboutFounder = [
  'The founder of Shree Ganesh, Shri Vrajlal Manilal Shah, had a vision he called "Quality Vision." Gifted with foresight and sharp business acumen, he was the first to identify the vast potential of the rapidly growing ready masala market. In 1969, he introduced a new product range called "Shree Ganesh Masala."',
  'Since the inception of the company, quality has been our guiding force. We have always focused on the golden words "Health Is Wealth," believing that healthy cooking is the foundation for a healthy life. Our masalas come with a Quality Assurance for healthy cooking without compromising on taste and aroma.',
  'Spices, premium masalas, and now instant mixes occupy a very special place in every customer\'s heart because we understand their needs. Years ago, we recognised the demand for products that keep up with changing times and increasingly demanding lifestyles. Life moves at lightning speed, and we are ushering in a new era where every requirement is instant. Thus, we launched our product "Shree Ganesh Instant Mix".',
];

export const vision =
  'The vision set by our founder, Shri Parmanand Shah, is to provide quality products to end users and earn a well-deserved place in millions of hearts, establishing the huge brand value of "Shree Ganesh."';

export const whyChooseUs = [
  "At Shree Ganesh, our sole objective is 100% customer satisfaction. Today, our entire range of products, whether regular masalas, premium masalas, or instant mixes, holds an indispensable position on kitchen shelves. The way to a person's heart is through their stomach, and our masalas are crafted to create delicious dishes that nurture one's emotions.",
  "Every product that reaches the end user passes through rigorous testing channels with state-of-the-art technology and measurements. This results in products that consistently meet the high standards we set. As time passes, we continue to grow stronger in our policies and persuasions, never compromising on quality and quantity.",
];

export const aboutPhotos = [
  {
    slot: "plantRoom" as const,
    title: "Blended in Ahmedabad",
    caption: "Ground, blended and packed at our HACCP-certified facility.",
  },
  {
    slot: "batchTesting" as const,
    title: "Tested batch by batch",
    caption: "Rigorous testing channels before anything leaves the plant.",
  },
  {
    slot: "warehouse" as const,
    title: "Shipped from Acacia Ridge",
    caption: "Stock lands in Brisbane, then goes out across Queensland.",
  },
];
