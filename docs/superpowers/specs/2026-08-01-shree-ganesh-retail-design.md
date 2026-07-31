# Shree Ganesh Retail — Website Redesign Design Doc

**Date:** 2026-08-01
**Source design:** `Shree Ganesh Retail v5.dc.html` (Claude Design project `e7aec9cb-2eed-4e15-b2b2-ee32846ee6e2`)
**Live site being replaced:** https://shreeganesh.com.au (Shopify)

## 1. What this is

Shree Ganesh is a wholesale distributor of Indian pantry goods: six house brands manufactured
in Ahmedabad, plus imported third-party staples, distributed from a Brisbane warehouse to
grocers, restaurants and caterers across Queensland.

This project rebuilds their web presence as a **standalone trade/marketing site with a full
browsable catalog**. It is not e-commerce: there is no cart, no checkout, and no prices. Every
buying intent routes to a wholesale account application. This mirrors how the business already
works — every variant price on the live Shopify store is `0.00`, i.e. pricing is already
login-gated and held outside the website.

The v5 design is the visual and structural source of truth. Deviations from it are enumerated
in §8 and each has a stated reason.

## 2. Stack

Matching the conventions of the existing `Satva` and `velora-website` projects.

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16.2.x, App Router |
| React | 19.2.x |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss`, tokens in `@theme` |
| Language | TypeScript, strict |
| Icons | `lucide-react` |
| Fonts | `next/font/google` — DM Serif Display, Plus Jakarta Sans |
| Email | Resend, via route handlers |
| Images | `next/image`, all assets local under `public/` |
| Hosting | Vercel |

No database, no auth, no Prisma. Nothing in the product requires them.

## 3. Routes

Every page in the source design is a branch of a single `state.page` switch. Each becomes a
real route.

| Route | Source design section | Rendering |
| --- | --- | --- |
| `/` | `isHome` | Static |
| `/range` | `isRange` | Dynamic (reads `searchParams`) |
| `/range/[handle]` | *new* | SSG, one page per product |
| `/departments` | *replaces* `isRecipes` | Static |
| `/story` | `isStory` | Static |
| `/wholesale` | `isWholesale` | Static |
| `/contact` | `isContact` | Static |

Announcement bar, sticky header and footer live in `src/app/(site)/layout.tsx`.

### Why `/departments` replaces `/recipes`

The Recipes page in the source design has no real content behind it. The live site has no
blog, no recipes, and no food photography; the six recipe cards and the "Undhiyu recipe of the
month" are invented copy with empty image slots and no recipe bodies. Shipping it would mean
inventing a content section for a client, unbacked.

`/departments` is a visual index of the real stocked departments — each with its real
collection image and live product count — deep-linking into `/range?department=<slug>`. It is
100% backed by imported data, it directly serves the "one supplier for the whole shop" pitch
the Wholesale page already makes, and it makes the site's department claim verifiable by
clicking it.

The Recipes design work is not discarded: the card grid, filter chips and featured-item layout
are reused for the department index and product grid.

## 4. Data

### 4.1 Import pipeline

`scripts/import-shopify.mjs`, run manually, not at build time.

It reads the live store's open JSON endpoints:
- `https://shreeganesh.com.au/products.json?limit=250&page=1..5` → 1174 unique products
- `https://shreeganesh.com.au/collections.json?limit=250` → 33 collections, 31 non-empty

It then:
1. Normalises each product to the shape in §4.2.
2. Downloads product images (1054 available) and collection images (31), resizing to WebP with
   `sharp` — products at 600px, collections at 1200px, banners at 1600px — into
   `public/catalog/` and `public/departments/`.
3. Writes `src/data/catalog.json` and `src/data/departments.ts`.

Output is **committed**. The built site has no runtime dependency on Shopify, so it keeps
working after the Shopify store is retired. Estimated image payload ≈ 45 MB.

Re-running the script is how the catalog is refreshed. This is deliberate: a trade catalog of
this kind changes slowly, and a manual refresh is simpler and more predictable than a
build-time fetch that can fail a deploy.

### 4.2 Product shape

```ts
type Product = {
  handle: string            // Shopify handle, used as the /range/[handle] slug
  title: string             // cleaned: pack suffix stripped from the display name
  rawTitle: string          // original, retained for search
  brand: string             // house brand or third-party brand
  isHouseBrand: boolean
  departments: string[]     // department slugs this product belongs to
  size: string | null       // e.g. "400g"      — parsed from title where present
  unitsPerCarton: number | null // e.g. 25      — parsed from title where present
  image: string | null      // local path under /catalog, null for the 120 without one
  description: string       // sanitised body_html, plain text
}
```

**Pack parsing is best-effort, by measurement.** 712 of 1174 titles (60%) match
`<size>x<cartonQty>` (`Ganesh Aara Flour 400gx25`). Others carry a size only
(`Suterfeni 200g`) or neither (`Diwali Wagli Diya`). The parser fills what it can and leaves
`null` otherwise; the UI omits the field rather than guessing. No title is discarded.

Prices are **not** imported. Every live variant price is `0.00`, so there is no pricing data to
carry, and nothing can leak.

### 4.3 Data files

| File | Contents |
| --- | --- |
| `src/data/site.ts` | Business name, address, phone, email, hours, nav, ABN placeholder |
| `src/data/catalog.json` | The 1174 normalised products |
| `src/data/departments.ts` | 31 departments: name, slug, image, product count |
| `src/data/brands.ts` | The six house brands: name, logo, blurb |
| `src/data/story.ts` | Story chapters, vision, mission, why-choose-us |
| `src/data/wholesale.ts` | Benefits, FAQ |
| `src/data/images.ts` | Central registry for every non-catalog image slot (see §6) |

Business facts, taken from the live site and the design, and treated as authoritative:

- Unit 3/32 Success St, Acacia Ridge QLD 4110
- 0490 729 900 · info@shreeganesh.com.au
- Mon–Fri 9:30am–3:30pm, closed weekends
- Founded 1969 in Ahmedabad by Shri Vrajlal Manilal Shah; vision set by Shri Parmanand Shah

## 5. The `/range` catalog page

1174 products cannot ship as a client-side array. Filtering is therefore **server-side and
URL-driven**, which also makes every filtered view shareable and indexable.

`searchParams`: `?q=&department=&brand=&page=`

- A Server Component reads `searchParams`, filters `catalog.json` on the server, and renders
  only the current page of cards. The full catalog never reaches the browser.
- Filter chips and the search box are small Client Components that push to the router.
  Search is debounced; the input keeps focus across navigations.
- **Brand filter values** are the six house brands, plus a single `imported` value covering all
  third-party lines. There are dozens of distinct third-party brands across 578 products
  (Dabur, Maggi, Lays, Cadbury, Zandu and others); enumerating them as chips would drown the
  house range, which is what the business is selling. The brand of every product still displays
  on its card and detail page, and is searchable via `q`.
- 48 products per page, numbered pagination.
- Empty state when filters match nothing, with a one-click reset.
- The 120 products without an image get a branded fallback tile (brand wordmark on a cream
  field), not a broken frame.

The design's chip styling, card shape and hover lift are preserved exactly; only the data
volume and the filter mechanism change.

`/range/[handle]` is a lightweight SSG detail page — packshot, brand, size, units per carton,
department links, description, and a "Log in for carton pricing" CTA to `/wholesale`. 1174
static pages, which is cheap, and it is the main SEO surface for a distributor whose buyers
search by product name.

## 6. Imagery

### Available from real sources
- 1054 product packshots and 31 department images from the live store.
- Two strong wide banners, both inspected: the Shree Ganesh masala-packet lineup (usable for the
  masala feature panel) and the pickle-jar range with the real wordmark. Two further homepage
  images are phone snapshots of packaging and are used only at small sizes, if at all.
- Main logo, six brand logos, and the Australian-Owned badge, from the design project uploads.

### Not obtainable — verified absent from the live site
Founder portrait, warehouse/dock photography, 1969 archival imagery, five social tiles,
HACCP mark, and a location map image.

For these, the site uses **on-brand designed treatments** rather than stock photography that
would misrepresent the business: packshot-composition panels built from real product images,
and typographic/pattern panels using the brand palette. The location map is rendered as a
styled static map, not a screenshot.

Every one of these slots resolves through `src/data/images.ts`, so a real photograph replaces a
placeholder by editing one line, with no component changes. `ASSETS-NEEDED.md` at the repo root
lists each slot, its intended subject, and its target aspect ratio.

## 7. Forms

Three route handlers, each returning JSON consumed by the design's existing inline success
states:

| Route | Source | Fields |
| --- | --- | --- |
| `POST /api/wholesale` | Wholesale page | business name, ABN, contact, email, phone, delivery suburb + postcode, notes |
| `POST /api/contact` | Contact page | name, email, subject, message |
| `POST /api/subscribe` | Newsletter block | email |

All three: required-field and email-shape validation server-side, honeypot field, a rate limit
keyed on IP, and delivery to `info@shreeganesh.com.au` via Resend. Errors surface inline on the
field; they are never swallowed. With `RESEND_API_KEY` unset the handler logs the payload and
returns success, so the site runs locally without secrets.

The newsletter block moves from the Recipes page (which no longer exists) to the bottom of
`/departments`.

## 8. Deviations from the source design

Each of these changes something the design asserts or omits. Every other visual decision in
v5 is carried over as-is.

1. **The HACCP certification claim is removed.** It appears in the design as a hero stat, a
   marquee item and a certification badge, but the word appears nowhere on shreeganesh.com.au
   and no HACCP asset exists in the design project. Publishing an unverified food-safety
   certification on a client's site is a compliance exposure. The hero stat becomes
   **"1969 · Est."**, the marquee item becomes "Batch tested", and the certification block ships
   with the Australian-Owned badge only. The third badge slot and the HACCP copy are retained
   in `images.ts` and `site.ts`, commented, ready to switch on the moment the client sends the
   certificate.

2. **The Dhiraj brand blurb is corrected.** The design describes Dhiraj as "flours, dals and
   rice at prices that work for family shops". In the real catalog Dhiraj is five products and
   all five are cookies — coconut, chocolate, cashew, Surti jeera butter, and nankhati. The
   blurb is rewritten to describe biscuits and cookies.

3. **Recipes → Departments**, per §3.

4. **Social links are hidden, not linked.** The live site's Facebook link points at
   `facebook.com/shopify`, an unreplaced Shopify default, and no real profiles are known. The
   design's `@shreeganesh [link real profile]` placeholders and the home page's five-tile social
   grid are omitted until real handles are supplied. `site.ts` carries empty `social` fields; the
   footer renders the icons only when they are non-empty.

5. **A mobile navigation drawer is added.** The design's header is a fixed 78px bar with a
   horizontally scrolling nav and two CTAs, which does not survive a 375px viewport. A
   hamburger-triggered drawer is added below `md`, using the design's own type and colour
   treatment.

6. **Fonts load via `next/font`** rather than the design's `<link>` to Google Fonts, removing a
   render-blocking request and layout shift.

7. **Address.** A packaging photograph on the live site shows an older address (Unit 1/13
   Selhurst St, Coopers Plains QLD 4108). The current Acacia Ridge address is used, matching
   both the live footer and the design.

8. **Department and product counts are derived, never hardcoded.** The design hardcodes "28"
   in six places — the announcement bar, the home hero stat and body copy, the trade CTA
   ("One account. 28 aisles."), the Wholesale hero ("28 aisles, one delivery run") and a
   Wholesale benefit. The live store has 31 non-empty departments, so the figure is already
   wrong. All six render from `departments.length`, so the number cannot drift from the catalog
   again. The same applies to the "6 house brands" stat, which reads from `brands.length`.

## 9. Known open content

These are unresolved in the source design and cannot be resolved from any available source.
Each ships with honest placeholder copy that reads as deliberate, and is listed in
`ASSETS-NEEDED.md`.

- Story chapter 04 — the year Shree Ganesh began distributing in Australia, the first
  Queensland stockists, and the history of the Acacia Ridge facility. The design itself flags
  this as awaiting client input.
- The Henaa Inc range blurb.
- Real social handles.
- HACCP certificate, if it exists.
- Founder portrait and warehouse photography.
- Company ABN, for the footer.

## 10. Component structure

Flat and kebab-case under `src/components/`, following Satva.

```
layout:      announcement-bar, header, mobile-nav*, footer, logo
primitives:  ui.tsx (Button, Pill, SectionHeading, Eyebrow, Stat), icons.tsx
catalog:     product-card, product-grid, filter-chips*, search-box*, pagination,
             department-card, brand-card
sections:    hero, marquee, feature-panel, story-chapters*, cert-badges, cta-band
forms:       wholesale-form*, contact-form*, newsletter-form*
seo:         json-ld
```

`*` = Client Component. Everything else is a Server Component.

The boundary rule: a component is a Client Component only if it owns interaction state.
`story-chapters` is client-side because of the scroll-spy rail; the chapter content itself is
passed in as props from the server, so the prose is not shipped as JS.

## 11. SEO

- Per-route `metadata`, with an OG image built from the brand palette.
- `sitemap.ts` covering the six static routes plus all 1174 product pages.
- `robots.ts`.
- JSON-LD: `Organization` and `LocalBusiness` (address, hours, phone) site-wide; `Product` on
  each detail page, with no `offers` block since there are no prices.

## 12. Verification

Work is not complete until all of these pass, with output shown:

1. `npx tsc --noEmit` clean.
2. `next build` clean, with no new warnings.
3. `next lint` clean.
4. An asset check script asserting every image path referenced in `images.ts`,
   `departments.ts`, `brands.ts` and `catalog.json` exists on disk — the failure mode this
   guards against is a silently broken frame after an import re-run.
5. Responsive pass at 375 / 768 / 1280 / 1600, confirming no horizontal body scroll and that
   the mobile drawer works.
6. `/range` verified with: no filters, each department filter, a brand filter, a search term,
   a combination, a zero-result query, and pagination boundaries.
7. Each of the three forms submitted once — success path and a validation-failure path.
8. A product without an image confirmed to render the fallback tile.

## 13. Out of scope

Cart, checkout, prices, customer accounts, gated pricing, order history, admin UI, CMS,
Shopify migration or redirects, recipe content, and multi-language.
