# Shree Ganesh

Trade website for Shree Ganesh — a wholesale distributor of Indian pantry
goods, manufacturing six house brands in Ahmedabad and distributing from a
warehouse in Acacia Ridge, Brisbane.

**This is deliberately not e-commerce.** There is no cart, no checkout and no
prices. Every buying intent routes to a wholesale account application. That
mirrors how the business already works: every variant price on the live Shopify
store is `0.00`, so pricing is held outside the website and sent with account
approval.

Built from `Shree Ganesh Trade v7`
(`design/shree-ganesh-trade-v7.reference.html`), with the catalog and imagery
grounded in real data pulled from shreeganesh.com.au.

**Palette note.** v7 was designed on a deep teal ground. The client has since
confirmed teal is not a Shree Ganesh colour, so the site is white-ground with
brand red carrying the header, footer and feature blocks, gold as the accent,
and near-black text. `npm run check:constraints` fails if any teal hex reappears
in the compiled CSS.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Resend for form delivery · Vitest · Playwright for page verification.

No database, no auth, no CMS — nothing in the product needs them.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and serve |
| `npm test` | Unit tests (pack parser, catalog query, form validation) |
| `npm run lint` | ESLint |
| `npm run check:assets` | Asserts every image path in data resolves on disk |
| `npm run check:constraints` | Asserts the project-wide rules against a running server |
| `npm run import:catalog` | Re-imports the catalog from Shopify |

### Environment

Copy `.env.example` to `.env.local`. All three variables are optional in
development:

- `RESEND_API_KEY` — **unset by default.** The form handlers log the submission
  to the server console and return success, so the site runs locally and in
  preview without secrets. Set it in production or no mail is sent.
- `FORM_TO_EMAIL` — where submissions go. Defaults to `info@shreeganesh.com.au`.
- `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, the sitemap and JSON-LD.

## Routes

| Route | Rendering | Notes |
| --- | --- | --- |
| `/` | Static | |
| `/range` | Dynamic | Full 1174-product catalog, filtered from `searchParams` |
| `/range/[handle]` | SSG | One page per product, 1174 of them |
| `/departments` | Static | Replaces the design's Recipes page — see below |
| `/story` | Static | Scroll-spy chapter rail |
| `/wholesale` | Static | Account application form |
| `/contact` | Static | Enquiry form + map |

`/range` is dynamic on purpose. Filtering happens on the server so the catalog
never reaches the browser — a check in `check:constraints` fails the build
process if product data ever leaks into a client chunk.

## The catalog

`src/data/catalog.json` (1174 products) and `src/data/departments.ts` (30
departments) are **generated and committed**, along with their images under
`public/catalog/` and `public/departments/`. The built site therefore has no
runtime dependency on Shopify and keeps working after that store is retired.

To refresh:

```bash
npm run import:catalog     # skips images already on disk
npm run check:assets
# commit the changed data files and images
```

Delete `public/catalog/` and `public/departments/` first to force a true
re-pull.

Two things the importer handles that are worth knowing about:

- **`vendor` is not a brand.** On this store it holds the seller
  (`Shree Ganesh`) or the manufacturer (`Harihar Foods`), so using it as a
  brand label marked 285 third-party items — brooms, cookware, photo frames —
  as house-brand lines. Brand comes from the title and product type only, and
  `isHouseBrand` is derived from the resolved brand so the two cannot disagree.
- **The store's "Image Available On Request" graphic is rejected.** 131
  products carried it as their photo. Those fall through to a typographic
  fallback tile instead. Any new placeholder variant is reported at the end of
  an import rather than silently accepted.

Pack size and carton quantity are parsed from product titles
(`Ganesh Aara Flour 400gx25`). About 60% of titles carry both; the rest carry a
size only or neither. The parser fills what it can and the UI omits the field
rather than guessing.

## Deviations from the design

Recorded in full in `docs/superpowers/specs/2026-08-01-shree-ganesh-retail-design.md` §8.
The two worth flagging here:

- **The certification strip carries three trust marks**, added at the client's
  direction: a "100% Australian Owned & Operated" badge built for this site,
  plus the official **Australian Owned** and **HACCP International** marks. The
  latter two are *licensed certification trade marks* — Australian Owned issues
  a per-licensee AO ID number that belongs on the artwork, and HACCP
  International's mark requires written consent. Both licences must be current
  and in Shree Ganesh's name before this goes live; see `ASSETS-NEEDED.md` §4.
  Removing a badge is one line in `src/components/sections/cert-badges.tsx`.
- **Recipes became Departments.** The Recipes page had no real content behind
  it: no blog, no recipes and no food photography exist. Rather than invent a
  content section for the client, that slot became a department index backed
  entirely by imported data.

## Outstanding client content

`ASSETS-NEEDED.md` lists everything still needed — five photographs, two brand
assets blocked by a tooling file-size cap, the Story chapter-4 history, the
Henaa blurb, the ABN, and real social handles. Every one ships with a
deliberate placeholder, so the site is complete and shippable as-is.

## Verification

```bash
npx tsc --noEmit && npm test && npm run lint && npm run check:assets && npm run build
npm start &                                   # or: npm run dev
npm run check:constraints
node scripts/verify-pages.mjs / /range /departments /story /wholesale /contact
```

`verify-pages.mjs` drives the system Chrome via Playwright and checks each page
at 375 / 768 / 1280 / 1600 for horizontal overflow, images that never decoded
or render at zero size, failed requests and console errors. Pass `--shots` to
write screenshots to `.verify/`.
