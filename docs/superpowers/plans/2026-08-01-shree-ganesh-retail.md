# Shree Ganesh Retail Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a wholesale trade/marketing website for Shree Ganesh — an Indian pantry-goods distributor in Brisbane — with a fully browsable 1174-product catalog, from the approved `Shree Ganesh Retail v5` design.

**Architecture:** Next.js 16 App Router. Six routes, all Server Components except four interactive islands (filter chips, search box, story scroll-spy, forms). The product catalog is imported once from the live Shopify store's public JSON into a committed local JSON file plus local WebP images, so the built site has no runtime dependency on Shopify. `/range` filters server-side from `searchParams`, so the 1174-product catalog never reaches the browser. Three form endpoints email via Resend. No database, no auth, no cart, no prices.

**Tech Stack:** Next.js 16.2.10 · React 19.2.4 · TypeScript 5 (strict) · Tailwind CSS v4 (`@tailwindcss/postcss`) · lucide-react · next/font/google · Resend · sharp (import script only) · vitest

**Spec:** `docs/superpowers/specs/2026-08-01-shree-ganesh-retail-design.md`
**Design reference:** `design/shree-ganesh-retail-v5.reference.html` — read this before any view task. Line numbers cited throughout this plan refer to it.

## Global Constraints

Every task's requirements implicitly include this section.

- **Colours** (exact, from the design). Cream `#FFF8EE` · ink `#22160F` · red `#C40A13` · red-dark `#8F070E` · forest `#1F4A34` · forest-light `#2A5A40` · forest-line `#3D6E52` · gold `#E8A20C` · sand `#FBF1E0` · sand-deep `#F1E4CE` · line `#EBDCC4` · line-deep `#E0CFB4` · body `#5C4A38` · muted `#7A6752` · faint `#A08A72` · mint `#EDF3E9` · mint-ink `#4A6553` · footer-text `#B9A68F`.
- **Type.** Headings: DM Serif Display 400 only. Body: Plus Jakarta Sans 400/500/600/700/800. Both via `next/font/google`, never a `<link>`.
- **Radii.** Pills/buttons `999px`. Cards `20px`. Panels `24px`–`28px`. Small tiles `14px`–`18px`.
- **Max content width** `1280px`. Horizontal page padding `clamp(20px, 4vw, 40px)`.
- **No prices anywhere.** Every buying CTA links to `/wholesale`. Every live Shopify variant price is `0.00`; there is no pricing data in the project.
- **No HACCP claim.** Do not write the string "HACCP" into any rendered copy. See spec §8.1.
- **Never hardcode counts.** Department and brand counts render from `departments.length` / `brands.length`. See spec §8.8.
- **No social links** until real handles exist. `site.social` fields are empty strings; the footer renders an icon only when its field is non-empty.
- **Body must never scroll horizontally** at any width from 320px up.
- **Every image is local** under `public/`. `next.config.ts` declares no `remotePatterns`.
- **Commit after every task**, using the message given in that task's final step.

---

### Task 1: Project scaffold, design tokens, and site data

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`, `.env.example`
- Create: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/(site)/layout.tsx`, `src/app/(site)/page.tsx`
- Create: `src/data/site.ts`, `src/lib/seo.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing.
- Produces: `site` object from `src/data/site.ts` with the exact shape given in Step 4. `SITE_URL: string` from `src/lib/seo.ts`. Tailwind theme tokens named in Global Constraints, usable as `bg-cream`, `text-ink`, `border-line`, `font-serif`, etc.

- [ ] **Step 1: Initialise the package and install dependencies**

```bash
cd /Users/vrund/Developer/shree-ganesh
npm init -y
npm i next@16.2.10 react@19.2.4 react-dom@19.2.4 lucide-react resend
npm i -D typescript @types/node@^20 @types/react@^19 @types/react-dom@^19 \
  tailwindcss@^4 @tailwindcss/postcss@^4 eslint@^9 eslint-config-next@16.2.10 \
  @eslint/eslintrc sharp vitest
```

Then replace the generated `package.json` `name`/`scripts` block so it reads:

```json
{
  "name": "shree-ganesh",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "import:catalog": "node scripts/import-shopify.mjs",
    "check:assets": "node scripts/check-assets.mjs"
  }
}
```

Keep the `dependencies` and `devDependencies` blocks npm generated.

- [ ] **Step 2: Write the config files**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`postcss.config.mjs`:

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All catalog, brand and department imagery ships locally in /public,
    // written there by scripts/import-shopify.mjs. No remote patterns: the
    // site must keep working after the Shopify store is retired.
    formats: ["image/webp"],
  },
};

export default nextConfig;
```

`eslint.config.mjs`:

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/**", "node_modules/**", "public/**"] },
];
```

`next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

`.env.example`:

```
# Resend API key for the wholesale / contact / newsletter forms.
# Unset in development: handlers log the payload and return success.
RESEND_API_KEY=
# Where form submissions are delivered.
FORM_TO_EMAIL=info@shreeganesh.com.au
NEXT_PUBLIC_SITE_URL=https://shreeganesh.com.au
```

Append to `.gitignore`:

```
/.vercel
*.tsbuildinfo
```

**Do not add `public/catalog/` or `public/departments/` to `.gitignore`.** The imported
images are committed on purpose — that is what removes the site's runtime dependency on
Shopify (spec §4.1).

- [ ] **Step 3: Write the design tokens**

`src/app/globals.css`:

```css
@import "tailwindcss";

/* ------------------------------------------------------------------ *
 * Shree Ganesh — design tokens, lifted from Shree Ganesh Retail v5.
 * Warm pantry palette: brand red + gold on cream, forest green panels.
 * Type: DM Serif Display (headings) · Plus Jakarta Sans (body).
 * ------------------------------------------------------------------ */
@theme {
  /* surfaces */
  --color-cream: #fff8ee;
  --color-sand: #fbf1e0;
  --color-sand-deep: #f1e4ce;
  --color-mint: #edf3e9;

  /* brand red */
  --color-red: #c40a13;
  --color-red-dark: #8f070e;

  /* forest green */
  --color-forest: #1f4a34;
  --color-forest-light: #2a5a40;
  --color-forest-line: #3d6e52;
  --color-mint-ink: #4a6553;

  /* gold */
  --color-gold: #e8a20c;

  /* text ramp */
  --color-ink: #22160f;
  --color-body: #5c4a38;
  --color-muted: #7a6752;
  --color-faint: #a08a72;
  --color-footer-text: #b9a68f;

  /* lines */
  --color-line: #ebdcc4;
  --color-line-deep: #e0cfb4;

  --font-sans: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-dm-serif), Georgia, "Times New Roman", serif;

  --shadow-card: 0 2px 14px rgba(34, 22, 15, 0.08);
  --shadow-card-lg: 0 18px 34px rgba(34, 22, 15, 0.12);
  --shadow-float: 0 16px 34px rgba(34, 22, 15, 0.14);
}

@layer base {
  html {
    scroll-behavior: smooth;
    /* Sticky header clearance for in-page anchors (header is 78px). */
    scroll-padding-top: 7rem;
  }

  body {
    margin: 0;
    background: var(--color-cream);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    /* Guards the Global Constraint that the body never scrolls sideways. */
    overflow-x: hidden;
  }

  ::selection {
    background: var(--color-gold);
    color: var(--color-ink);
  }
}

@layer utilities {
  /* The design's edge-to-edge marquee (reference lines 82-91). */
  @keyframes sg-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: sg-marquee 34s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .animate-marquee { animation: none; }
  }

  /* Shared page shell: max-width 1280 + the design's fluid gutter. */
  .shell {
    max-width: 1280px;
    margin-inline: auto;
    padding-inline: clamp(20px, 4vw, 40px);
  }
}
```

- [ ] **Step 4: Write the site data**

`src/data/site.ts`:

```ts
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
```

`src/lib/seo.ts`:

```ts
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://shreeganesh.com.au"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
```

- [ ] **Step 5: Write the root layout and a placeholder home page**

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { SITE_URL } from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — Wholesale Indian Pantry Staples, Brisbane`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  category: "food",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_AU",
    url: SITE_URL,
    title: `${site.name} — Wholesale Indian Pantry Staples`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={`${jakarta.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
```

`src/app/(site)/layout.tsx` — chrome gets filled in during Task 4:

```tsx
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
```

`src/app/(site)/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <section className="shell py-20">
      <h1 className="font-serif text-5xl text-ink">Shree Ganesh</h1>
      <p className="mt-4 text-body">Scaffold running. Tokens loaded.</p>
    </section>
  );
}
```

- [ ] **Step 6: Verify the scaffold builds and the tokens resolve**

```bash
npx tsc --noEmit && npx next build
```

Expected: both succeed with no errors. In the build output, confirm route `/` is listed.

Then confirm the tokens actually compiled — this catches a malformed `@theme` block, which Tailwind fails silently on:

```bash
grep -c 'fff8ee' .next/static/css/*.css
```

Expected: at least `1`. If `0`, the `@theme` block did not compile; fix `globals.css` before continuing.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 app with Shree Ganesh design tokens"
```

---

### Task 2: Pack-format parser

The catalog's size and carton-quantity data is encoded in product titles. This parser is the only place that knowledge lives. It is pure, so it is tested directly.

**Files:**
- Create: `src/lib/parse-pack.ts`
- Test: `src/lib/parse-pack.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  ```ts
  type Pack = { name: string; size: string | null; unitsPerCarton: number | null };
  function parsePack(rawTitle: string): Pack;
  ```
  Task 3's import script calls `parsePack` for every product. `name` is the title with the pack suffix stripped, for display. Never returns `name: ""` — if stripping would empty it, the raw title is kept.

- [ ] **Step 1: Write the failing test**

`src/lib/parse-pack.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parsePack } from "./parse-pack";

describe("parsePack", () => {
  it("splits size and carton quantity, and strips the suffix from the name", () => {
    expect(parsePack("Ganesh Aara Flour 400gx25")).toEqual({
      name: "Ganesh Aara Flour",
      size: "400g",
      unitsPerCarton: 25,
    });
  });

  it("handles ml, kg and spaced/uppercase separators", () => {
    expect(parsePack("Castor Oil 50mlx12")).toEqual({
      name: "Castor Oil",
      size: "50ml",
      unitsPerCarton: 12,
    });
    expect(parsePack("Dhiraj Surti Jeera Butter Cookies 400gx12")).toEqual({
      name: "Dhiraj Surti Jeera Butter Cookies",
      size: "400g",
      unitsPerCarton: 12,
    });
    expect(parsePack("Premium Basmati 5 KG X 4")).toEqual({
      name: "Premium Basmati",
      size: "5kg",
      unitsPerCarton: 4,
    });
  });

  it("keeps a bare size when there is no carton quantity", () => {
    expect(parsePack("Suterfeni 200g")).toEqual({
      name: "Suterfeni",
      size: "200g",
      unitsPerCarton: null,
    });
  });

  it("returns nulls when the title carries no pack information", () => {
    expect(parsePack("Diwali Wagli Diya")).toEqual({
      name: "Diwali Wagli Diya",
      size: null,
      unitsPerCarton: null,
    });
  });

  it("does not mistake a trailing piece count for a carton quantity", () => {
    // "2pcs" is the product's own contents, not a carton multiple.
    expect(parsePack("Diya Metal 2pcs")).toEqual({
      name: "Diya Metal",
      size: "2pcs",
      unitsPerCarton: null,
    });
  });

  it("never empties the name", () => {
    expect(parsePack("500gx20").name).toBe("500gx20");
  });

  it("trims stray punctuation left behind by stripping", () => {
    expect(parsePack("Tamarind, 500gx20").name).toBe("Tamarind");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/lib/parse-pack.test.ts
```

Expected: FAIL — `Failed to resolve import "./parse-pack"`.

- [ ] **Step 3: Write the implementation**

`src/lib/parse-pack.ts`:

```ts
export type Pack = {
  /** Title with the pack suffix removed, for display. Never empty. */
  name: string;
  /** Normalised unit size, e.g. "400g". Null when the title carries none. */
  size: string | null;
  /** Units in a carton, e.g. 25. Null when the title carries none. */
  unitsPerCarton: number | null;
};

const UNIT = "(?:kg|g|gm|ml|l|lt|ltr|pcs|pc)";

/** "400gx25", "5 KG X 4" — a unit size followed by a carton multiple. */
const SIZE_AND_CARTON = new RegExp(`\\s*(\\d+(?:\\.\\d+)?)\\s*(${UNIT})\\s*[x*]\\s*(\\d+)\\s*$`, "i");

/** "200g", "2pcs" — a trailing unit size with no carton multiple. */
const SIZE_ONLY = new RegExp(`\\s*(\\d+(?:\\.\\d+)?)\\s*(${UNIT})\\s*$`, "i");

/** Normalises unit spelling so "5 KG" and "5kg" collapse to one value. */
function normaliseUnit(unit: string): string {
  const u = unit.toLowerCase();
  if (u === "gm") return "g";
  if (u === "lt" || u === "ltr") return "l";
  if (u === "pc") return "pcs";
  return u;
}

/** Drops trailing separators left behind after the suffix is stripped. */
function cleanName(name: string, fallback: string): string {
  const cleaned = name.replace(/[\s,\-–—/]+$/, "").trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

export function parsePack(rawTitle: string): Pack {
  const title = rawTitle.trim();

  const both = title.match(SIZE_AND_CARTON);
  if (both) {
    return {
      name: cleanName(title.slice(0, both.index), title),
      size: `${both[1]}${normaliseUnit(both[2])}`,
      unitsPerCarton: Number(both[3]),
    };
  }

  const sizeOnly = title.match(SIZE_ONLY);
  if (sizeOnly) {
    return {
      name: cleanName(title.slice(0, sizeOnly.index), title),
      size: `${sizeOnly[1]}${normaliseUnit(sizeOnly[2])}`,
      unitsPerCarton: null,
    };
  }

  return { name: title, size: null, unitsPerCarton: null };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/lib/parse-pack.test.ts
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/parse-pack.ts src/lib/parse-pack.test.ts
git commit -m "feat: parse pack size and carton quantity from product titles"
```

---

### Task 3: Shopify catalog import script

Run once, manually. Output is committed. See spec §4.1.

**Files:**
- Create: `scripts/import-shopify.mjs`
- Create (generated, committed): `src/data/catalog.json`, `src/data/departments.ts`, `public/catalog/*.webp`, `public/departments/*.webp`
- Create: `src/data/catalog.ts` (typed accessor over the JSON)

**Interfaces:**
- Consumes: `parsePack` from Task 2.
- Produces:
  ```ts
  type Product = {
    handle: string; title: string; rawTitle: string; brand: string;
    isHouseBrand: boolean; departments: string[];
    size: string | null; unitsPerCarton: number | null;
    image: string | null; description: string;
  };
  type Department = { name: string; slug: string; image: string; count: number };
  // src/data/catalog.ts
  const products: Product[];
  // src/data/departments.ts
  const departments: Department[];
  ```
  Tasks 5–8, 11 and 12 read `products` and `departments`. `image` is a root-relative path like `/catalog/ganesh-tea-masala.webp`, or `null`.

- [ ] **Step 1: Write the import script**

`scripts/import-shopify.mjs`:

```js
// Imports the live Shopify catalog into committed local data + images.
//
// Run manually:  npm run import:catalog
//
// Deliberately not a build step: a trade catalog changes slowly, and a
// build-time fetch of ~1000 images would make deploys slow and flaky. The
// committed output means the site keeps working after the Shopify store is
// retired. See spec §4.1.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { parsePack } from "../src/lib/parse-pack.ts";

const STORE = "https://shreeganesh.com.au";
const OUT_CATALOG_IMG = "public/catalog";
const OUT_DEPT_IMG = "public/departments";

/** The six house brands, matched against title and product_type. */
const HOUSE_BRANDS = [
  "Shree Ganesh", "Ganesh", "Amdavadi", "Herbs & Spices",
  "Herbs and Spices", "Henaa", "Henna", "Vipul Dudhiya", "Dhiraj",
];

/** Collections that are empty or merchandising-only, not real departments. */
const SKIP_COLLECTIONS = new Set(["New Arrivals", "Staff Picks", "Weekly Specials"]);

function slugify(s) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

/** Shopify caps products.json at 250 per page; walk until a short page. */
async function fetchAllProducts() {
  const all = new Map();
  for (let page = 1; page <= 20; page++) {
    const { products } = await getJSON(`${STORE}/products.json?limit=250&page=${page}`);
    if (products.length === 0) break;
    for (const p of products) all.set(p.id, p);
    process.stdout.write(`  page ${page}: ${products.length} (total ${all.size})\n`);
    if (products.length < 250) break;
  }
  return [...all.values()];
}

async function fetchCollections() {
  const { collections } = await getJSON(`${STORE}/collections.json?limit=250`);
  return collections.filter(
    (c) => !SKIP_COLLECTIONS.has(c.title) && (c.products_count ?? 0) > 0,
  );
}

/** Which collections a product belongs to, via each collection's product list. */
async function fetchCollectionMembership(collections) {
  const membership = new Map(); // productId -> Set<slug>
  for (const c of collections) {
    const slug = slugify(c.title);
    for (let page = 1; page <= 20; page++) {
      const { products } = await getJSON(
        `${STORE}/collections/${c.handle}/products.json?limit=250&page=${page}`,
      );
      if (products.length === 0) break;
      for (const p of products) {
        if (!membership.has(p.id)) membership.set(p.id, new Set());
        membership.get(p.id).add(slug);
      }
      if (products.length < 250) break;
    }
    process.stdout.write(`  ${c.title}: mapped\n`);
  }
  return membership;
}

/** Downloads and re-encodes to WebP. Returns the public path, or null. */
async function saveImage(url, dir, name, width) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(dir, `${name}.webp`));
    return `/${path.basename(dir)}/${name}.webp`;
  } catch {
    return null;
  }
}

function brandOf(product) {
  const blob = `${product.title} ${product.product_type}`.toLowerCase();
  const hit = HOUSE_BRANDS.find((b) => blob.includes(b.toLowerCase()));
  if (hit) {
    // Collapse the spelling variants onto their canonical brand name.
    if (hit === "Ganesh" || hit === "Shree Ganesh") return "Shree Ganesh";
    if (hit === "Herbs and Spices") return "Herbs & Spices";
    if (hit === "Henna") return "Henaa";
    return hit;
  }
  return product.product_type?.trim() || product.vendor || "Imported";
}

function plainText(html) {
  return (html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ").trim();
}

async function main() {
  await mkdir(OUT_CATALOG_IMG, { recursive: true });
  await mkdir(OUT_DEPT_IMG, { recursive: true });

  console.log("Fetching collections…");
  const collections = await fetchCollections();
  console.log("Mapping collection membership…");
  const membership = await fetchCollectionMembership(collections);

  console.log("Fetching products…");
  const raw = await fetchAllProducts();

  console.log(`Processing ${raw.length} products…`);
  const products = [];
  let withImage = 0;
  for (const p of raw) {
    const { name, size, unitsPerCarton } = parsePack(p.title);
    const image = await saveImage(p.images?.[0]?.src, OUT_CATALOG_IMG, p.handle, 600);
    if (image) withImage++;
    products.push({
      handle: p.handle,
      title: name,
      rawTitle: p.title.trim(),
      brand: brandOf(p),
      isHouseBrand: HOUSE_BRANDS.some((b) =>
        `${p.title} ${p.product_type}`.toLowerCase().includes(b.toLowerCase()),
      ),
      departments: [...(membership.get(p.id) ?? [])].sort(),
      size,
      unitsPerCarton,
      image,
      description: plainText(p.body_html).slice(0, 600),
    });
  }
  products.sort((a, b) => a.title.localeCompare(b.title));

  const departments = [];
  for (const c of collections) {
    const slug = slugify(c.title);
    departments.push({
      name: c.title,
      slug,
      image:
        (await saveImage(c.image?.src, OUT_DEPT_IMG, slug, 1200)) ??
        "/departments/_fallback.webp",
      count: products.filter((p) => p.departments.includes(slug)).length,
    });
  }
  departments.sort((a, b) => a.name.localeCompare(b.name));

  await writeFile("src/data/catalog.json", JSON.stringify(products, null, 0) + "\n");
  await writeFile(
    "src/data/departments.ts",
    `// GENERATED by scripts/import-shopify.mjs — do not edit by hand.\n` +
      `export type Department = { name: string; slug: string; image: string; count: number };\n\n` +
      `export const departments: Department[] = ${JSON.stringify(departments, null, 2)};\n`,
  );

  console.log(
    `\nDone. ${products.length} products (${withImage} with images), ` +
      `${departments.length} departments.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Run the import**

Node 22+ runs `.ts` imports natively; if the `parsePack` import fails, run via `npx tsx scripts/import-shopify.mjs` instead.

```bash
npm run import:catalog
```

Expected: finishes with a line like `Done. 1174 products (1054 with images), 31 departments.` Product count must be ≥ 1100 and department count must be ≥ 28. If either is far below, the store's endpoints changed — stop and investigate rather than committing a truncated catalog.

- [ ] **Step 3: Add a fallback department image and the typed accessor**

Create `public/departments/_fallback.webp` — a 1200×800 flat `#F1E4CE` field:

```bash
node -e "require('sharp')({create:{width:1200,height:800,channels:3,background:'#F1E4CE'}}).webp({quality:82}).toFile('public/departments/_fallback.webp')"
```

`src/data/catalog.ts`:

```ts
import raw from "./catalog.json";

export type Product = {
  handle: string;
  title: string;
  rawTitle: string;
  brand: string;
  isHouseBrand: boolean;
  departments: string[];
  size: string | null;
  unitsPerCarton: number | null;
  image: string | null;
  description: string;
};

export const products = raw as Product[];

export function productByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}
```

- [ ] **Step 4: Verify the output is sane**

```bash
node -e "
const p=require('./src/data/catalog.json');
const {departments}=await import('./src/data/departments.ts').catch(()=>({departments:[]}));
console.log('products',p.length);
console.log('with image',p.filter(x=>x.image).length);
console.log('with carton',p.filter(x=>x.unitsPerCarton).length);
console.log('house brands',[...new Set(p.filter(x=>x.isHouseBrand).map(x=>x.brand))].sort());
console.log('no departments',p.filter(x=>x.departments.length===0).length);
" 2>/dev/null || node -e "
const p=require('./src/data/catalog.json');
console.log('products',p.length);
console.log('with image',p.filter(x=>x.image).length);
console.log('with carton',p.filter(x=>x.unitsPerCarton).length);
console.log('house brands',[...new Set(p.filter(x=>x.isHouseBrand).map(x=>x.brand))].sort());
console.log('no departments',p.filter(x=>x.departments.length===0).length);
"
```

Expected: `products` ≥ 1100; `with image` ≥ 1000; `with carton` ≥ 650; `house brands` contains `Shree Ganesh`, `Amdavadi`, `Dhiraj`, `Henaa`, `Herbs & Spices`, `Vipul Dudhiya`. Also confirm `ls public/catalog | wc -l` matches `with image`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: import live Shopify catalog to local data and images"
```

---

### Task 4: Catalog query layer

`/range` filters 1174 products server-side. That logic is pure and testable, so it lives apart from the page.

**Files:**
- Create: `src/lib/catalog-query.ts`
- Test: `src/lib/catalog-query.test.ts`

**Interfaces:**
- Consumes: `Product` type from `src/data/catalog.ts` (Task 3).
- Produces:
  ```ts
  const PAGE_SIZE = 48;
  type Query = { q?: string; department?: string; brand?: string; page?: number };
  type Result = { items: Product[]; total: number; page: number; pageCount: number };
  function queryProducts(all: Product[], query: Query): Result;
  function brandFilterOptions(all: Product[]): { value: string; label: string }[];
  ```
  Task 6 (`/range`) is the only consumer. `brand` accepts a house brand name or the literal `"imported"` (spec §5).

- [ ] **Step 1: Write the failing test**

`src/lib/catalog-query.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Product } from "@/data/catalog";
import { brandFilterOptions, PAGE_SIZE, queryProducts } from "./catalog-query";

function p(over: Partial<Product> & { handle: string }): Product {
  return {
    title: over.handle, rawTitle: over.handle, brand: "Shree Ganesh",
    isHouseBrand: true, departments: [], size: null, unitsPerCarton: null,
    image: null, description: "", ...over,
  };
}

const all: Product[] = [
  p({ handle: "tea-masala", title: "Ganesh Tea Masala", brand: "Shree Ganesh", departments: ["herbs-and-spices"] }),
  p({ handle: "khakhra", title: "Chilli Khakhra", brand: "Amdavadi", departments: ["snacks"] }),
  p({ handle: "maggi", title: "Maggi Noodles", brand: "Maggi", isHouseBrand: false, departments: ["noodles"] }),
  p({ handle: "lays", title: "Lays Classic", brand: "Lays", isHouseBrand: false, departments: ["snacks"] }),
];

describe("queryProducts", () => {
  it("returns everything, paginated, with no filters", () => {
    const r = queryProducts(all, {});
    expect(r.total).toBe(4);
    expect(r.items).toHaveLength(4);
    expect(r.page).toBe(1);
    expect(r.pageCount).toBe(1);
  });

  it("filters by department", () => {
    const r = queryProducts(all, { department: "snacks" });
    expect(r.items.map((x) => x.handle)).toEqual(["khakhra", "lays"]);
  });

  it("filters by a house brand", () => {
    const r = queryProducts(all, { brand: "Amdavadi" });
    expect(r.items.map((x) => x.handle)).toEqual(["khakhra"]);
  });

  it("groups every third-party line under 'imported'", () => {
    const r = queryProducts(all, { brand: "imported" });
    expect(r.items.map((x) => x.handle)).toEqual(["maggi", "lays"]);
  });

  it("searches title, raw title and brand, case-insensitively", () => {
    expect(queryProducts(all, { q: "masala" }).items.map((x) => x.handle)).toEqual(["tea-masala"]);
    expect(queryProducts(all, { q: "LAYS" }).items.map((x) => x.handle)).toEqual(["lays"]);
  });

  it("combines filters", () => {
    const r = queryProducts(all, { department: "snacks", brand: "imported" });
    expect(r.items.map((x) => x.handle)).toEqual(["lays"]);
  });

  it("returns an empty result rather than throwing when nothing matches", () => {
    const r = queryProducts(all, { q: "nothing-matches-this" });
    expect(r.items).toEqual([]);
    expect(r.total).toBe(0);
    expect(r.pageCount).toBe(1);
  });

  it("paginates and clamps out-of-range pages", () => {
    const many = Array.from({ length: PAGE_SIZE + 5 }, (_, i) => p({ handle: `x${i}` }));
    expect(queryProducts(many, {}).items).toHaveLength(PAGE_SIZE);
    expect(queryProducts(many, { page: 2 }).items).toHaveLength(5);
    expect(queryProducts(many, { page: 99 }).page).toBe(2);
    expect(queryProducts(many, { page: 0 }).page).toBe(1);
    expect(queryProducts(many, { page: -3 }).page).toBe(1);
  });

  it("ignores an unknown brand or department rather than returning nothing", () => {
    // A stale bookmarked URL should still show the catalog, not a dead end.
    expect(queryProducts(all, { brand: "Nonexistent" }).total).toBe(4);
    expect(queryProducts(all, { department: "nope" }).total).toBe(4);
  });
});

describe("brandFilterOptions", () => {
  it("lists house brands present in the data, then a single imported option", () => {
    const opts = brandFilterOptions(all);
    expect(opts[0]).toEqual({ value: "all", label: "All products" });
    expect(opts.map((o) => o.value)).toContain("Shree Ganesh");
    expect(opts.map((o) => o.value)).toContain("Amdavadi");
    expect(opts.map((o) => o.value)).not.toContain("Maggi");
    expect(opts.at(-1)).toEqual({ value: "imported", label: "Imported brands" });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/lib/catalog-query.test.ts
```

Expected: FAIL — cannot resolve `./catalog-query`.

- [ ] **Step 3: Write the implementation**

`src/lib/catalog-query.ts`:

```ts
import type { Product } from "@/data/catalog";

export const PAGE_SIZE = 48;

/** Sentinel brand value covering every non-house-brand line. See spec §5. */
export const IMPORTED = "imported";

export type Query = { q?: string; department?: string; brand?: string; page?: number };
export type Result = { items: Product[]; total: number; page: number; pageCount: number };

export function queryProducts(all: Product[], query: Query): Result {
  const q = query.q?.trim().toLowerCase() ?? "";
  const department = query.department?.trim() ?? "";
  const brand = query.brand?.trim() ?? "";

  // An unknown department or brand is ignored rather than filtering to zero,
  // so a stale bookmark degrades to the full catalog instead of a dead end.
  const departmentIsReal = department !== "" && all.some((p) => p.departments.includes(department));
  const brandIsReal =
    brand === IMPORTED || (brand !== "" && all.some((p) => p.isHouseBrand && p.brand === brand));

  const filtered = all.filter((p) => {
    if (departmentIsReal && !p.departments.includes(department)) return false;
    if (brandIsReal) {
      if (brand === IMPORTED) {
        if (p.isHouseBrand) return false;
      } else if (p.brand !== brand) return false;
    }
    if (q !== "") {
      const haystack = `${p.title} ${p.rawTitle} ${p.brand}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Math.trunc(query.page ?? 1) || 1), pageCount);
  const start = (page - 1) * PAGE_SIZE;

  return { items: filtered.slice(start, start + PAGE_SIZE), total, page, pageCount };
}

export function brandFilterOptions(all: Product[]): { value: string; label: string }[] {
  const houseBrands = [...new Set(all.filter((p) => p.isHouseBrand).map((p) => p.brand))].sort();
  return [
    { value: "all", label: "All products" },
    ...houseBrands.map((b) => ({ value: b, label: b })),
    { value: IMPORTED, label: "Imported brands" },
  ];
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/lib/catalog-query.test.ts
```

Expected: PASS, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/catalog-query.ts src/lib/catalog-query.test.ts
git commit -m "feat: add server-side catalog filtering, search and pagination"
```

---

### Task 5: Brands, images registry, and the asset checker

**Files:**
- Create: `src/data/brands.ts`, `src/data/images.ts`
- Create: `scripts/check-assets.mjs`
- Create: `ASSETS-NEEDED.md`
- Create: brand logos and banners under `public/brands/`, `public/banners/`

**Interfaces:**
- Consumes: `products` from Task 3 (to count each brand's lines).
- Produces:
  ```ts
  type Brand = { name: string; slug: string; logo: string; bg: string; blurb: string };
  const brands: Brand[];
  const images: Record<string, { src: string; alt: string; needsReal?: boolean }>;
  ```
  Tasks 6–11 read `brands` and `images`. Every non-catalog image on the site resolves through `images`, so a real photograph replaces a placeholder by editing one entry.

- [ ] **Step 1: Fetch the brand logos, badge and banners**

The six brand logos, the wordmark and the Australian-Owned badge live in the Claude Design project. Download the two live-site banners, then copy the design uploads across:

```bash
mkdir -p public/brands public/banners public/logo public/badges
cd public/banners
curl -sL -o masala-lineup.jpg "https://shreeganesh.com.au/cdn/shop/files/01.jpg?width=1600"
curl -sL -o pickle-range.jpg "https://shreeganesh.com.au/cdn/shop/files/04.jpg?width=1600"
cd ../..
node -e "
const sharp=require('sharp');
for (const n of ['masala-lineup','pickle-range'])
  sharp('public/banners/'+n+'.jpg').resize({width:1600,withoutEnlargement:true})
    .webp({quality:84}).toFile('public/banners/'+n+'.webp');
"
rm public/banners/*.jpg
```

Then use the `DesignSync` tool with `method: "get_file"` on project `e7aec9cb-2eed-4e15-b2b2-ee32846ee6e2` for each of these paths, writing each decoded base64 payload to the given destination:

| Design project path | Destination |
| --- | --- |
| `uploads/pasted-1785505166571-0.png` | `public/logo/shree-ganesh.png` |
| `uploads/pasted-1785528944691-0.png` | `public/brands/shree-ganesh.png` |
| `uploads/pasted-1785528953606-0.png` | `public/brands/amdavadi.png` |
| `uploads/pasted-1785528957810-0.png` | `public/brands/herbs-and-spices.png` |
| `uploads/pasted-1785528939574-0.png` | `public/brands/dhiraj.png` |
| `uploads/pasted-1785528949200-0.png` | `public/brands/vipul-dudhiya.png` |
| `uploads/pasted-1785528913296-0.png` | `public/brands/henaa.png` |
| `uploads/badge-australian-owned.png` | `public/badges/australian-owned.png` |

- [ ] **Step 2: Write the brands data**

Note the corrected Dhiraj blurb — the design's "flours, dals and rice" is wrong; all five Dhiraj lines in the real catalog are cookies (spec §8.2). Henaa's blurb is unresolved (spec §9) and ships as an honest one-liner, not invented detail.

`src/data/brands.ts`:

```ts
export type Brand = { name: string; slug: string; logo: string; bg: string; blurb: string };

export const brands: Brand[] = [
  {
    name: "Shree Ganesh",
    slug: "shree-ganesh",
    logo: "/brands/shree-ganesh.png",
    bg: "#FFF8EE",
    blurb:
      "The flagship — masalas, pickles, instant mixes and mithai to the original family recipes.",
  },
  {
    name: "Amdavadi",
    slug: "amdavadi",
    logo: "/brands/amdavadi.png",
    bg: "#FFF8EE",
    blurb:
      "Gujarati snacks — khakhra, chevda and farsan the way Ahmedabad's old city makes them.",
  },
  {
    name: "Herbs & Spices",
    slug: "herbs-and-spices",
    logo: "/brands/herbs-and-spices.png",
    bg: "#FFF8EE",
    blurb: "Whole and ground spices, herbs and seasonings for everyday cooking.",
  },
  {
    name: "Dhiraj",
    slug: "dhiraj",
    logo: "/brands/dhiraj.png",
    bg: "#414735",
    blurb:
      "Biscuits and cookies — coconut, chocolate, cashew, and Surti jeera butter and nankhati.",
  },
  {
    name: "Vipul Dudhiya",
    slug: "vipul-dudhiya",
    logo: "/brands/vipul-dudhiya.png",
    bg: "#FFF8EE",
    blurb: "Traditional mithai, made to the same recipes for decades.",
  },
  {
    name: "Henaa",
    slug: "henaa",
    logo: "/brands/henaa.png",
    bg: "#FBF3E4",
    blurb: "Henna and personal-care lines, stocked alongside the pantry range.",
  },
];
```

- [ ] **Step 3: Write the images registry**

Each entry the client still owes a real photograph for carries `needsReal: true`. `src/data/images.ts`:

```ts
export type ImageSlot = { src: string; alt: string; needsReal?: boolean };

/**
 * Every non-catalog image on the site resolves through this map, so a real
 * photograph replaces a designed placeholder by editing one entry. Slots
 * flagged needsReal are listed in ASSETS-NEEDED.md. See spec §6.
 */
export const images: Record<string, ImageSlot> = {
  logo: { src: "/logo/shree-ganesh.png", alt: "Shree Ganesh" },
  badgeAustralianOwned: {
    src: "/badges/australian-owned.png",
    alt: "100% Australian owned and operated",
  },
  masalaFeature: {
    src: "/banners/masala-lineup.webp",
    alt: "Shree Ganesh masala packets with whole spices and ground spice bowls",
  },
  pickleFeature: {
    src: "/banners/pickle-range.webp",
    alt: "The Shree Ganesh pickle range — mixed, green chilli, gorkeri, mango, kerda and thokku mango",
  },
  // Awaiting client photography. Until then these render as designed panels
  // (see components/designed-panel.tsx), never as stock photography.
  hero: { src: "", alt: "Shree Ganesh pantry staples", needsReal: true },
  founder: { src: "", alt: "Shri Vrajlal Manilal Shah, founder", needsReal: true },
  warehouse: { src: "", alt: "The Acacia Ridge warehouse", needsReal: true },
  archival1969: { src: "", alt: "The original Ahmedabad masala shop, 1969", needsReal: true },
  qualityLine: { src: "", alt: "The Ahmedabad packing line", needsReal: true },
};
```

- [ ] **Step 4: Write the asset checker**

This guards the failure mode of a silently broken image frame after an import re-run — spec §12.4.

`scripts/check-assets.mjs`:

```js
// Asserts every image path referenced in data actually exists on disk.
// Run: npm run check:assets
import { access } from "node:fs/promises";
import path from "node:path";
import products from "../src/data/catalog.json" with { type: "json" };

const problems = [];

async function check(src, where) {
  if (!src) return; // Intentionally empty slots are handled by the UI.
  if (!src.startsWith("/")) {
    problems.push(`${where}: "${src}" is not root-relative`);
    return;
  }
  try {
    await access(path.join("public", src));
  } catch {
    problems.push(`${where}: missing public${src}`);
  }
}

const { departments } = await import("../src/data/departments.ts");
const { brands } = await import("../src/data/brands.ts");
const { images } = await import("../src/data/images.ts");

for (const d of departments) await check(d.image, `department "${d.slug}"`);
for (const b of brands) await check(b.logo, `brand "${b.slug}"`);
for (const [key, slot] of Object.entries(images)) await check(slot.src, `image "${key}"`);
for (const p of products) await check(p.image, `product "${p.handle}"`);

if (problems.length > 0) {
  console.error(`✗ ${problems.length} missing asset(s):`);
  for (const p of problems.slice(0, 40)) console.error(`   ${p}`);
  if (problems.length > 40) console.error(`   …and ${problems.length - 40} more`);
  process.exit(1);
}

const needsReal = Object.entries(images).filter(([, s]) => s.needsReal).map(([k]) => k);
console.log(
  `✓ all assets resolve — ${products.length} products, ${departments.length} departments, ` +
    `${brands.length} brands. ${needsReal.length} slot(s) awaiting real photography: ` +
    needsReal.join(", "),
);
```

If the `.ts` dynamic imports fail on the installed Node, run the script with `npx tsx scripts/check-assets.mjs` and update the `check:assets` npm script to match.

- [ ] **Step 5: Write ASSETS-NEEDED.md**

```markdown
# Assets & content still needed from the client

Everything below is unresolved in the approved design and cannot be sourced
from shreeganesh.com.au. Each ships with a deliberate placeholder. Replacing
one means editing a single entry in `src/data/images.ts` — no component
changes.

## Photography

| Slot (`src/data/images.ts`) | Subject | Target ratio |
| --- | --- | --- |
| `hero` | Finished dish styled on a table, warm daylight | 4:3 |
| `founder` | Shri Vrajlal Manilal Shah, archival portrait | 3:4 |
| `warehouse` | Pallets / cartons on the Acacia Ridge dock | 16:9 |
| `archival1969` | The original Ahmedabad shop or early packing | 16:9 |
| `qualityLine` | Ahmedabad packing line or spice pouches | 4:3 |

## Copy

- **Our Story, chapter 04** — the year Shree Ganesh began distributing in
  Australia, the first Queensland stockists, and how the Acacia Ridge
  facility began. Currently an honest placeholder.
- **Henaa** — what the range actually covers, to firm up the brand blurb.
- **ABN** — for the footer (`site.abn`).

## Claims to confirm

- **HACCP certification.** The design asserted it, but it appears nowhere on
  the current site and no certificate was supplied. It is omitted site-wide.
  Send the certificate and it can be switched on — the badge slot and copy
  are already in place, commented, in `src/data/images.ts` and the
  certification section.

## Social

- Real Facebook and Instagram handles. The current site links to
  `facebook.com/shopify`, an unreplaced Shopify default, so social links are
  hidden until `site.social` is filled in.
```

- [ ] **Step 6: Run the asset checker**

```bash
npm run check:assets
```

Expected: `✓ all assets resolve — …` and a non-zero count of slots awaiting photography. If it reports missing brand logos, Step 1's DesignSync downloads did not all land.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add brand data, image registry, asset checker and client asset list"
```

---

### Task 6: Layout chrome — announcement bar, header, mobile nav, footer

**Files:**
- Create: `src/components/ui.tsx`, `src/components/logo.tsx`, `src/components/announcement-bar.tsx`, `src/components/header.tsx`, `src/components/mobile-nav.tsx`, `src/components/footer.tsx`, `src/components/marquee.tsx`
- Modify: `src/app/(site)/layout.tsx`

**Interfaces:**
- Consumes: `site`, `nav`, `formattedAddress` (Task 1); `images` (Task 5); `departments` (Task 3).
- Produces:
  ```tsx
  // ui.tsx
  function Button(props: { href: string; variant?: "red" | "gold" | "outline" | "ink" | "forest"; children: ReactNode; className?: string }): JSX.Element
  function Eyebrow(props: { children: ReactNode; tone?: "red" | "gold"; className?: string }): JSX.Element
  function SectionHeading(props: { eyebrow?: string; title: string; tone?: "light" | "dark"; action?: { href: string; label: string } }): JSX.Element
  function Stat(props: { value: string; label: string; tone?: "light" | "dark" }): JSX.Element
  function DesignedPanel(props: { label: string; className?: string }): JSX.Element
  ```
  Every later view task uses these. `DesignedPanel` is what renders in place of an unfilled `images` slot — a brand-palette gradient with the slot's subject as quiet centred text. It must never look like a broken image.

- [ ] **Step 1: Build the primitives**

Read reference lines 36–49 (header), 26–33 (announcement), 686–729 (footer), 82–91 (marquee) first.

`src/components/ui.tsx` — a Server Component module. Button variants map to the design's exact button treatments: `red` = `bg-red text-white hover:bg-red-dark`; `gold` = `bg-gold text-ink hover:bg-white`; `outline` = `bg-white text-ink border border-line-deep hover:border-ink`; `ink` = `bg-ink text-white hover:bg-forest`; `forest` = `bg-forest text-white hover:bg-ink`. All are `rounded-full`, `font-bold`, `px-7 py-4`, `text-[15.5px]`, with a `transition-colors`.

`Eyebrow` is the repeated label: `text-[12.5px] font-extrabold uppercase tracking-[2.5px]`, red or gold.

`SectionHeading` is the design's repeated header row (reference lines 94–100): eyebrow, `font-serif` title at `clamp(32px,3.6vw,50px)`, and an optional right-aligned action link underlined in red — wrapping to a column below `sm`.

`Stat` is the hero/story stat pair: `font-serif` value at 30px, label at 13px muted.

`DesignedPanel`:

```tsx
export function DesignedPanel({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-deep ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sand via-sand-deep to-[#E6D3B4]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #22160F 1px, transparent 0)",
          backgroundSize: "14px 14px",
        }}
      />
      <span className="relative max-w-[22ch] px-6 text-center font-serif text-lg leading-snug text-faint">
        {label}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Build the chrome**

- `announcement-bar.tsx` — forest `#1F4A34` bar, `#E9F3E4` text, 13.5px/500, centred flex with `gap-7`, dot separators at 40% opacity. Copy: "Wholesale only — carton pricing for grocers, restaurants & caterers" · "Free Brisbane-metro delivery over $500" (from `site.freeDeliveryThreshold`) · a gold bold link "Wholesale enquiries →" to `/wholesale`. Below `sm`, show only the first item so it stays one line.
- `logo.tsx` — `next/image` from `images.logo`, height 44, `priority`, wrapped in a link to `/`.
- `header.tsx` — Server Component. `sticky top-0 z-40`, `bg-cream/95 backdrop-blur-md`, `border-b border-line`, 78px tall inside `.shell`. Logo, then `nav` links (600 weight, red + red underline when active — active state comes from `usePathname` inside a tiny client child, or compare against a `pathname` prop passed from each page; use the client child so the header itself stays a Server Component). Right side: a text "Wholesale" link and a red pill "Open an account", both to `/wholesale`. Nav and the text link hide below `lg`; `MobileNav` shows below `lg`.
- `mobile-nav.tsx` — `"use client"`. Hamburger (`lucide-react` `Menu`/`X`) opening a full-screen cream drawer: the four `nav` links at 22px/700, a divider, then "Wholesale" and "Open an account". Close on link click and on `Escape`; lock body scroll while open; `aria-expanded` and `aria-controls` on the trigger. This is an addition to the design, which has no mobile nav (spec §8.5).
- `marquee.tsx` — the red `#C40A13` strip with `#FFF1DE` uppercase 13.5px/700 tracking-[2px] items separated by gold `✦`, duplicated twice inside a `w-max` flex using `.animate-marquee`. Items: "No artificial colours", "Traditional recipes", "Batch tested", "Family owned", "Made in Ahmedabad", "Since 1969". Note "HACCP certified" from the design is deliberately replaced by "Since 1969" (spec §8.1). Wrap in `aria-hidden="true"` — it is decorative.
- `footer.tsx` — ink `#22160F` background, `#B9A68F` text. Four columns via `repeat(auto-fit,minmax(200px,1fr))`: logo on a white rounded chip + the description sentence; "Trade" (Our range, Departments, Wholesale); "Company" (Our story, Contact, Privacy policy, Terms of service); "Contact" (address, phone, email, hours). Bottom row: `© {new Date().getFullYear()} Shree Ganesh Australia. All rights reserved.` Column headings are gold 11.5px/800 uppercase tracking-[2px]. **Render a social icon only if its `site.social` field is non-empty** — with both empty, the social group renders nothing (spec §8.4).

- [ ] **Step 3: Wire the layout**

`src/app/(site)/layout.tsx`:

```tsx
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npx next build && npx next lint
```

Then `npm run dev` and confirm at 375px, 768px and 1280px: the header stays one line at every width, the drawer opens and closes (click, `Escape`, and link click), no horizontal body scroll, and the footer shows **no** social links.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add layout chrome with mobile nav drawer"
```

---

### Task 7: Home page

**Files:**
- Create: `src/app/(site)/page.tsx` (replace the Task 1 placeholder)
- Create: `src/components/sections/hero.tsx`, `src/components/sections/feature-panel.tsx`, `src/components/sections/cert-badges.tsx`, `src/components/sections/cta-band.tsx`, `src/components/department-card.tsx`, `src/components/brand-card.tsx`, `src/components/product-card.tsx`

**Interfaces:**
- Consumes: everything from Tasks 3, 5, 6.
- Produces:
  ```tsx
  function ProductCard(props: { product: Product; showBrandTag?: boolean }): JSX.Element
  function DepartmentCard(props: { department: Department }): JSX.Element
  function BrandCard(props: { brand: Brand; withBlurb?: boolean }): JSX.Element
  function FeaturePanel(props: { eyebrow: string; title: string; body: string; image: ImageSlot; actions: ReactNode; reverse?: boolean; tone?: "forest" | "cream" }): JSX.Element
  function CertBadges(): JSX.Element
  function CtaBand(): JSX.Element
  ```
  `ProductCard` is reused by `/range` (Task 8) and `/departments` (Task 10). `CertBadges` and `CtaBand` are reused by `/wholesale` (Task 11).

- [ ] **Step 1: Build the reusable cards**

`ProductCard` mirrors reference lines 153–163 and 293–303: white, `border border-line`, `rounded-[20px]`, hover `-translate-y-[5px]` + `shadow-card-lg`. A 200px `bg-sand` image well with the packshot `object-contain` and 22px padding; an ink pill top-left carrying `product.brand`. Body: title 16px/700; a muted 13.5px line composing `size` and `unitsPerCarton` — render `"100g · carton of 10"`, or just the size, or just the carton line, or nothing, depending on which are non-null. Then a red bold 13.5px "Log in for carton pricing →" linking to `/wholesale`, pushed to the bottom with `mt-auto`.

When `product.image` is `null` (120 products), render the fallback in the image well instead of an `Image`: a `bg-sand` field with the brand name in `font-serif text-faint`. Never render an `Image` with an empty `src`.

The whole card links to `/range/${product.handle}`.

`DepartmentCard` mirrors reference lines 103–109: `rounded-[20px]`, white, `border-line`, a 168px cover image, then name 17px/700 and a muted `{count} products` line. Links to `/range?department=${slug}`.

`BrandCard` has two modes — the 118px logo-only tile from reference lines 136–138, and the `withBlurb` card from lines 273–281 with a 140px logo well over name and blurb. Both use `brand.bg` as the well background.

- [ ] **Step 2: Build the sections**

- `hero.tsx` — reference lines 54–80. Two-column grid `minmax(0,1.05fr) minmax(280px,1fr)`, collapsing to one column below `md`. Left: mint pill "🌾 Made in Ahmedabad · Supplied from Brisbane"; `h1` in `font-serif` at `clamp(42px,5.6vw,78px)`, `leading-[1.04]`, text "Stock the taste your customers grew up with."; the lede from `site.description`; red "Open a wholesale account" + outline "See the range" buttons; then a `border-t border-line` stat row. **Stats are derived**: `{departments.length}` Departments · `{brands.length}` House brands · `1969` Est. The design's third stat was "HACCP / Certified facility" — replaced per spec §8.1 and §8.8. Right: a `rounded-[24px]` well at `clamp(340px,42vw,520px)` rendering `images.hero` — since that slot is empty, `DesignedPanel`. Keep the design's floating white card overlapping the well's bottom-left: a real packshot plus its name and "Carton of N · top reorder", sourced from the first house-brand product that has both an image and a `unitsPerCarton`.
- `feature-panel.tsx` — generalises reference lines 114–127 (forest) and 192–205 (cream): two columns, one text and one image, `reverse` swapping the order, `tone` choosing forest-on-`#F2F7EF` or cream-on-ink.
- `cert-badges.tsx` — reference lines 220–241, **with the third and second badge slots reduced to one**. Heading "Australian owned." (the design's "Australian owned. Food-safety certified." loses its second sentence, per spec §8.1), the supporting line rewritten to drop the HACCP claim: "An Australian-owned family business importing and distributing our own manufacturing — the paperwork your buyers ask for, ready on request." Render only the Australian-Owned badge, 128px, in a `rounded-[18px]` `bg-sand` well. Leave a commented block showing where the HACCP badge goes once supplied.
- `cta-band.tsx` — reference lines 207–217. Ink background, gold eyebrow "For Trade", `font-serif` heading "One account. {departments.length} aisles. One delivery run.", the approval/threshold line, a gold "Open a wholesale account" button, and a 280px well rendering `images.warehouse` → `DesignedPanel`.

- [ ] **Step 3: Compose the page**

`src/app/(site)/page.tsx`, in the design's order, omitting the social grid (spec §8.4) and pointing the former Recipes section at `/departments`:

1. `Hero`
2. `Marquee`
3. "Our Range" — `SectionHeading` with action → `/range`, then a grid of six `DepartmentCard`s. Pick the six by highest `count` so the largest departments lead.
4. `FeaturePanel` forest — eyebrow "The Masala Range", heading "Ground in small batches, never bulk-blended", the design's body copy from reference line 119, actions gold "Shop masalas" → `/range?department=herbs-and-spices` and a gold-underlined "Browse departments →" → `/departments`. Image: `images.masalaFeature` — a real photograph.
5. "Our Brands" — centred `SectionHeading` "Six labels, one family" (from `brands.length`), then six `BrandCard`s, logo-only.
6. "Best Sellers" — `SectionHeading` "What everyone's buying" with action → `/range`; four `ProductCard`s. Choose the first four house-brand products that have both an image and a `unitsPerCarton`, so no card renders a fallback here.
7. `FeaturePanel` cream, reversed — "Our Story" / "A family masala house that moved to Queensland", the two paragraphs from reference lines 200–201, ink "Read our story" → `/story`. Image: `images.pickleFeature` — a real photograph, used here rather than the empty `story` slot.
8. `CtaBand`
9. `CertBadges`

Add page `metadata` with a distinct title and description.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npx next build && npx next lint && npm run check:assets
```

Then `npm run dev` and check `/` at 375 / 768 / 1280 / 1600: no horizontal scroll; the hero collapses cleanly; stat row reads "31 Departments · 6 House brands · 1969 Est."; the marquee animates and stops under `prefers-reduced-motion`; no "HACCP" text anywhere. Confirm with:

```bash
grep -ri "haccp" src/ && echo "FAIL: HACCP present" || echo "OK: no HACCP copy"
```

Expected: `OK: no HACCP copy`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: build home page"
```

---

### Task 8: Range page — catalog with filters, search and pagination

**Files:**
- Create: `src/app/(site)/range/page.tsx`
- Create: `src/components/catalog/filter-chips.tsx`, `src/components/catalog/search-box.tsx`, `src/components/catalog/pagination.tsx`, `src/components/catalog/active-filters.tsx`

**Interfaces:**
- Consumes: `queryProducts`, `brandFilterOptions`, `PAGE_SIZE`, `IMPORTED` (Task 4); `products` (Task 3); `departments` (Task 3); `ProductCard`, `BrandCard` (Task 7).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Build the interactive filter islands**

All three are `"use client"` and share one helper that rewrites `searchParams` while preserving the others and resetting `page` to 1 on any filter change.

`src/components/catalog/use-filter-nav.ts`:

```ts
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/** Rewrites one search param, preserving the rest and resetting pagination. */
export function useFilterNav() {
  const router = useRouter();
  const params = useSearchParams();

  return useCallback(
    (key: string, value: string | null, opts: { keepPage?: boolean } = {}) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "" || value === "all") next.delete(key);
      else next.set(key, value);
      if (!opts.keepPage) next.delete("page");
      const qs = next.toString();
      router.push(qs ? `/range?${qs}` : "/range", { scroll: false });
    },
    [params, router],
  );
}
```

- `filter-chips.tsx` — takes `{ options, active, param }`. Renders the design's chip exactly (reference line 755): active is `bg-ink text-cream border-ink`, inactive `bg-white text-ink border-line-deep`, both `rounded-full px-5 py-[11px] text-sm font-bold`, `transition-all duration-[180ms]`. Two rows are rendered on the page — one for `brand`, one for `department`.
- `search-box.tsx` — a controlled input with local state, debounced 300ms before calling `useFilterNav`. `type="search"`, placeholder "Search 1174 products" built from a `total` prop so the number is never hardcoded. Styled to match the design's inputs: `bg-white border-[1.5px] border-line-deep rounded-full px-6 py-4 text-base`. Keep focus across navigations by not remounting — the component owns its own value and only pushes to the router.
- `pagination.tsx` — numbered pages using `Link` so it works without JS. Show first, last, current ±2, with `…` gaps. Current page is `bg-ink text-cream`; others are outlined. Prev/Next arrows disabled at the boundaries.
- `active-filters.tsx` — shows the applied brand/department/search as removable chips with an `X`, plus a "Clear all" link to `/range`. Renders nothing when no filters are applied.

- [ ] **Step 2: Build the page**

`src/app/(site)/range/page.tsx` — a Server Component. In Next 16 `searchParams` is a Promise, so it must be awaited:

```tsx
type SearchParams = Promise<{ [k: string]: string | string[] | undefined }>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function RangePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const result = queryProducts(products, {
    q: one(sp.q),
    department: one(sp.department),
    brand: one(sp.brand),
    page: Number(one(sp.page) ?? 1),
  });
  // …
}
```

Page structure, following reference lines 262–316:

1. Sand hero band — eyebrow "Our Range", `h1` "Six house brands, one pantry" at `clamp(38px,4.6vw,62px)`, the lede from reference line 266.
2. Six `BrandCard`s with `withBlurb`.
3. Controls: `SearchBox`, then brand chips from `brandFilterOptions(products)`, then department chips (`All departments` plus every `departments` entry). `ActiveFilters` below.
4. A muted count line: `` `${result.total} products` `` — singular when 1.
5. The product grid, `repeat(auto-fit,minmax(230px,1fr))` at `gap-5`, of `ProductCard`s.
6. Empty state when `result.total === 0`: a `rounded-[24px]` sand panel, "No products match those filters.", and a red "Clear all filters" button to `/range`.
7. `Pagination`.
8. The mint closing CTA from reference lines 308–316, heading "Buying for a shop or kitchen?", forest button → `/wholesale`.

Because the page reads `searchParams`, it renders dynamically — that is intended, and it is what keeps `catalog.json` out of the client bundle. Wrap the three client islands in `<Suspense>` so `useSearchParams` does not opt the whole route into client rendering.

Add `metadata` and, since the filtered views should not compete in the index, set `robots: { index: true }` on the bare page but add `alternates: { canonical: "/range" }` so filtered URLs canonicalise to the base.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npx next build && npx next lint
```

Then `npm run dev` and walk every case from spec §12.6:

| URL | Expect |
| --- | --- |
| `/range` | 48 cards, count reads the full total, pagination shows ~25 pages |
| `/range?department=snacks` | only snacks, count matches the Departments page figure |
| `/range?brand=Amdavadi` | only Amdavadi lines |
| `/range?brand=imported` | no house-brand lines |
| `/range?q=masala` | titles containing "masala"; the input keeps focus and its text |
| `/range?department=snacks&brand=imported` | intersection of both |
| `/range?q=zzzznothing` | empty state with a working "Clear all filters" |
| `/range?page=999` | clamps to the last page, does not error |
| `/range?page=0` and `?page=-3` | clamp to page 1 |
| `/range?department=bogus` | full catalog, not an empty page |

Also confirm the client bundle stayed small — `catalog.json` must not be in it:

```bash
grep -rl "unitsPerCarton" .next/static/chunks/ | head
```

Expected: no output. Any hit means the catalog leaked into the browser bundle; move the filtering back to the server component.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: build range page with server-side filtering, search and pagination"
```

---

### Task 9: Product detail pages

**Files:**
- Create: `src/app/(site)/range/[handle]/page.tsx`
- Create: `src/components/catalog/product-detail.tsx`

**Interfaces:**
- Consumes: `products`, `productByHandle` (Task 3); `departments`; `ProductCard` (Task 7).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Build the page**

SSG over the whole catalog:

```tsx
export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ handle: string }> },
): Promise<Metadata> {
  const { handle } = await params;
  const product = productByHandle(handle);
  if (!product) return {};
  const pack = [product.size, product.unitsPerCarton ? `carton of ${product.unitsPerCarton}` : null]
    .filter(Boolean).join(" · ");
  return {
    title: product.title,
    description: `${product.title}${pack ? ` — ${pack}` : ""}. ${product.brand}, wholesale from our Brisbane warehouse.`,
    alternates: { canonical: `/range/${product.handle}` },
  };
}
```

The page calls `notFound()` for an unknown handle.

Layout: a two-column grid. Left, a `rounded-[24px]` `bg-sand` well with the packshot `object-contain`, or the brand-name fallback when `image` is `null`. Right: a breadcrumb (`Our Range / {first department}`), an ink brand pill, the title in `font-serif` at `clamp(28px,3.2vw,42px)`, then a definition list of the facts that exist — Brand, Size, Units per carton, Departments (each linking to `/range?department=…`) — skipping any that are null. Then the description if non-empty, then a red "Log in for carton pricing" button to `/wholesale` with the muted note "Wholesale accounts only. Carton pricing is sent with your account approval."

Below, "More from {brand}" — up to four other `ProductCard`s from the same brand that have images.

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit && npx next build
```

In the build output, confirm `/range/[handle]` is listed as SSG with a page count matching the catalog size. Then in dev, check: a product with full pack data, one with `size` only, one with neither, one with `image: null` (fallback tile, no broken frame), and an unknown handle → 404.

Find each case:

```bash
node -e "
const p=require('./src/data/catalog.json');
const f=(fn)=>p.find(fn)?.handle;
console.log('full  ', f(x=>x.size&&x.unitsPerCarton&&x.image));
console.log('size  ', f(x=>x.size&&!x.unitsPerCarton));
console.log('bare  ', f(x=>!x.size&&!x.unitsPerCarton));
console.log('noimg ', f(x=>!x.image));
"
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add product detail pages"
```

---

### Task 10: Departments page

Replaces the design's Recipes page — spec §3.

**Files:**
- Create: `src/app/(site)/departments/page.tsx`
- Create: `src/components/newsletter-form.tsx`, `src/lib/use-form-post.ts`

**Interfaces:**
- Consumes: `departments` (Task 3); `products`; `DepartmentCard`, `ProductCard`, `SectionHeading` (Tasks 6–7).
- Produces: `NewsletterForm` — posts to `/api/subscribe`, built in Task 12. Until that route exists it will 404 on submit; that is expected and is verified in Task 12, not here.

- [ ] **Step 1: Build the page**

Reuse the Recipes page's layout language (reference lines 323–371) with real data:

1. Sand hero band — eyebrow "Departments", `h1` "Everything for the Indian kitchen", lede: "One supplier for the whole shop — {departments.length} departments, from spices and frozen to kitchenware and puja. Browse the aisles, then open a wholesale account for carton pricing."
2. A featured band in the design's featured-recipe shape (a white `rounded-[26px]` split panel): the largest department by `count`, its real collection image on one side, and on the other the eyebrow "Biggest aisle", its name in `font-serif`, a line reading "{count} lines in stock", and a red "Browse {name}" button to `/range?department={slug}`.
3. The full grid of every `DepartmentCard`, `repeat(auto-fit,minmax(260px,1fr))` at `gap-6`.
4. The mint newsletter band from reference lines 362–371 — heading "Trade updates, once a fortnight", the body copy from line 365, and `NewsletterForm`.

- [ ] **Step 2: Build the newsletter form**

`"use client"`. One email input plus a forest "Subscribe" button, matching reference lines 366–369. On submit: `POST /api/subscribe` with `{ email, honeypot }`; disable the button and show "Subscribing…" while in flight; on success replace the form with "Thanks — you're on the list."; on failure show a red inline message and leave the value intact. Include a visually-hidden honeypot input named `company`.

Extract the fetch-and-state pattern into `src/lib/use-form-post.ts` so Tasks 11 and 13 reuse it:

```ts
"use client";

import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

export function useFormPost(endpoint: string) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: Record<string, unknown>) {
    setState("sending");
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("error");
        return false;
      }
      setState("sent");
      return true;
    } catch {
      setError("Could not reach the server. Please check your connection.");
      setState("error");
      return false;
    }
  }

  return { state, error, submit, reset: () => setState("idle") };
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npx next build && npx next lint
```

In dev, confirm `/departments` lists every department with a real image and a count, that each card's count matches what `/range?department=<slug>` reports, and that the page has no horizontal scroll at 375px.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: build departments page replacing the unbacked recipes page"
```

---

### Task 11: Story page

**Files:**
- Create: `src/app/(site)/story/page.tsx`
- Create: `src/data/story.ts`, `src/components/story-chapters.tsx`

**Interfaces:**
- Consumes: `images`, `site`, `brands`; `Stat`, `DesignedPanel`, `SectionHeading` (Task 6).
- Produces: `StoryChapters` — a Client Component owning the scroll-spy rail. Chapter prose is passed in as props from the server so it is not shipped as JS.

- [ ] **Step 1: Write the story data**

`src/data/story.ts` holds the five chapters, vision, mission and the three why-choose-us cards, with copy taken verbatim from reference lines 425–528. It is faithful to the live site's About page, so no copy is invented — except chapter 4, which the design itself leaves open (spec §9). Write chapter 4 as an honest placeholder that reads deliberately rather than as filler:

```ts
{
  id: "ch-4",
  badge: "Brisbane",
  badgeTone: "forest",
  title: "The recipes cross the water",
  body:
    "Shree Ganesh now imports and distributes its own manufacturing from a warehouse in Acacia Ridge, supplying grocers, restaurants and caterers across Queensland. The full history of that move — the year, the first stockists, the early delivery runs — is being written with the family.",
  image: "archival1969",
}
```

Include a `// TODO(client)` comment above it pointing at `ASSETS-NEEDED.md`. The rail label stays "Crossing the water".

- [ ] **Step 2: Build the scroll-spy chapters**

`src/components/story-chapters.tsx`, `"use client"`. Port the design's scroll-spy from reference lines 734–751: on scroll, the active chapter is the last one whose `getBoundingClientRect().top <= 260`. Requirements the original lacks:

- Throttle with `requestAnimationFrame` (the original does this — keep it) and add `{ passive: true }` on the listener (also present — keep).
- Use a `ref` per chapter rather than `document.getElementById`, so it is not coupled to global IDs.
- Run the calculation once on mount, so a deep-linked or restored scroll position highlights correctly.
- Remove the listener on unmount.
- The rail is `position: sticky; top: 110px` in a `minmax(0,240px) minmax(0,1fr)` grid. Below `lg`, hide the rail entirely and render chapters full-width.
- Active rail item: 700 weight, ink text, an 11px red dot. Inactive: 500 weight, faint text, a 7px `#DDCDB4` dot. Both transition over 200ms.

Chapter bodies render from props. The oversized `01`–`05` watermarks (`font-serif`, 120px, `#F2E6D0`) are `aria-hidden`.

- [ ] **Step 3: Build the page**

Following reference lines 376–551:

1. Ink hero with the `1969` watermark at `clamp(200px,26vw,380px)` in `rgba(232,162,12,0.13)`, `aria-hidden`. Eyebrow "Our Story"; `h1` "One man called it *Quality Vision*. We've been keeping it ever since." with "Quality Vision" in gold, `font-style: normal`; the lede from reference line 386; a stat row — `1969` First masala launched, `{brands.length}` Brands today, `3` Generations. Right: the arch-topped portrait well (`border-radius: 200px 200px 20px 20px`) rendering `images.founder` → `DesignedPanel`, captioned "Shri Vrajlal Manilal Shah / Founder".
2. `StoryChapters`, with the red quote panel from reference lines 444–448 interleaved after chapter 2.
3. Vision and mission — the two dark cards from reference lines 488–501.
4. "Why Choose Us" — the sand band with three numbered cards, reference lines 504–528.
5. "Made & delivered" — reference lines 531–548. Heading "Ahmedabad makes it. Brisbane ships it." The body copy must drop the design's "HACCP-certified facility" phrase (spec §8.1): "Every masala, snack and sweet is manufactured, blended and packed at our facility in Ahmedabad — the same city, the same recipes, since 1969. Stock lands at our Acacia Ridge warehouse in Brisbane, and we deliver from there." Then the Manufacturing / Distribution mint tiles and the address and hours cards, all from `site`. Image: `images.qualityLine` → `DesignedPanel`.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npx next build && npx next lint
grep -ri "haccp" src/ && echo "FAIL: HACCP present" || echo "OK: no HACCP copy"
```

In dev at 1280px, scroll `/story` and confirm the rail highlight advances through all five chapters and that deep-linking to `#ch-4` highlights chapter 4 on load. At 375px confirm the rail is hidden and chapters are full-width.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: build story page with scroll-spy chapter rail"
```

---

### Task 12: Form endpoints

**Files:**
- Create: `src/lib/validate.ts`, `src/lib/mailer.ts`, `src/lib/rate-limit.ts`
- Create: `src/app/api/wholesale/route.ts`, `src/app/api/contact/route.ts`, `src/app/api/subscribe/route.ts`
- Test: `src/lib/validate.test.ts`

**Interfaces:**
- Consumes: `site` (Task 1).
- Produces:
  ```ts
  // validate.ts
  type FieldSpec = { key: string; label: string; required?: boolean; email?: boolean; max?: number };
  function validate(body: unknown, spec: FieldSpec[]): { ok: true; values: Record<string, string> } | { ok: false; error: string };
  // mailer.ts
  function sendFormEmail(args: { subject: string; lines: [string, string][] }): Promise<void>;
  // rate-limit.ts
  function rateLimit(key: string): boolean; // true = allowed
  ```
  Tasks 10, 13 and 14's forms POST to these routes. All three routes answer `{ ok: true }` on success or `{ error: string }` with a 4xx/5xx status.

- [ ] **Step 1: Write the failing validation test**

`src/lib/validate.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validate } from "./validate";

const spec = [
  { key: "name", label: "Your name", required: true, max: 100 },
  { key: "email", label: "Email", required: true, email: true },
  { key: "notes", label: "Notes" },
];

describe("validate", () => {
  it("accepts a well-formed body and trims values", () => {
    const r = validate({ name: "  Asha  ", email: "a@b.com" }, spec);
    expect(r).toEqual({ ok: true, values: { name: "Asha", email: "a@b.com", notes: "" } });
  });

  it("rejects a missing required field, naming it", () => {
    const r = validate({ email: "a@b.com" }, spec);
    expect(r).toEqual({ ok: false, error: "Your name is required." });
  });

  it("rejects a whitespace-only required field", () => {
    expect(validate({ name: "   ", email: "a@b.com" }, spec).ok).toBe(false);
  });

  it("rejects a malformed email", () => {
    const r = validate({ name: "Asha", email: "not-an-email" }, spec);
    expect(r).toEqual({ ok: false, error: "Email must be a valid email address." });
  });

  it("rejects an over-long value", () => {
    const r = validate({ name: "x".repeat(101), email: "a@b.com" }, spec);
    expect(r).toEqual({ ok: false, error: "Your name is too long." });
  });

  it("rejects a filled honeypot without explaining why", () => {
    const r = validate({ name: "Asha", email: "a@b.com", company: "bot" }, spec);
    expect(r).toEqual({ ok: false, error: "Submission rejected." });
  });

  it("rejects a non-object body", () => {
    expect(validate(null, spec).ok).toBe(false);
    expect(validate("nope", spec).ok).toBe(false);
  });

  it("ignores unspecified fields rather than passing them through", () => {
    const r = validate({ name: "Asha", email: "a@b.com", admin: "true" }, spec);
    expect(r.ok && "admin" in r.values).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/lib/validate.test.ts
```

Expected: FAIL — cannot resolve `./validate`.

- [ ] **Step 3: Write validation, rate limiting and the mailer**

`src/lib/validate.ts`:

```ts
export type FieldSpec = {
  key: string;
  label: string;
  required?: boolean;
  email?: boolean;
  max?: number;
};

export type ValidateResult =
  | { ok: true; values: Record<string, string> }
  | { ok: false; error: string };

/** Deliberately loose: catches typos without rejecting valid odd addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Hidden field real users never fill. Named innocuously to bait bots. */
const HONEYPOT = "company";

export function validate(body: unknown, spec: FieldSpec[]): ValidateResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "Submission rejected." };
  }
  const raw = body as Record<string, unknown>;

  // Say nothing useful to a bot about why it failed.
  if (typeof raw[HONEYPOT] === "string" && raw[HONEYPOT].trim() !== "") {
    return { ok: false, error: "Submission rejected." };
  }

  const values: Record<string, string> = {};
  for (const field of spec) {
    const value = typeof raw[field.key] === "string" ? (raw[field.key] as string).trim() : "";
    if (field.required && value === "") {
      return { ok: false, error: `${field.label} is required.` };
    }
    if (value !== "" && field.max && value.length > field.max) {
      return { ok: false, error: `${field.label} is too long.` };
    }
    if (value !== "" && field.email && !EMAIL.test(value)) {
      return { ok: false, error: `${field.label} must be a valid email address.` };
    }
    values[field.key] = value;
  }
  return { ok: true, values };
}
```

`src/lib/rate-limit.ts`:

```ts
/**
 * Fixed-window in-memory limiter: 5 submissions per IP per 10 minutes.
 * Per-instance, so it is a courtesy speed bump rather than a hard guarantee
 * on serverless — which is the right level for three low-traffic forms.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX) return false;
  entry.count += 1;
  return true;
}
```

`src/lib/mailer.ts`:

```ts
import { Resend } from "resend";
import { site } from "@/data/site";

const TO = process.env.FORM_TO_EMAIL ?? site.email;

/**
 * With RESEND_API_KEY unset the payload is logged and the call succeeds, so
 * the site runs locally and in preview without secrets. See spec §7.
 */
export async function sendFormEmail({
  subject,
  lines,
}: {
  subject: string;
  lines: [string, string][];
}): Promise<void> {
  const text = lines.map(([label, value]) => `${label}: ${value || "—"}`).join("\n");
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.info(`[form] ${subject}\n${text}`);
    return;
  }

  const html =
    `<h2>${subject}</h2><table cellpadding="6">` +
    lines
      .map(
        ([label, value]) =>
          `<tr><td><strong>${label}</strong></td><td>${value || "—"}</td></tr>`,
      )
      .join("") +
    `</table>`;

  const { error } = await new Resend(key).emails.send({
    from: `${site.name} website <website@shreeganesh.com.au>`,
    to: [TO],
    replyTo: lines.find(([l]) => l === "Email")?.[1] || undefined,
    subject,
    text,
    html,
  });
  if (error) throw new Error(error.message);
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/lib/validate.test.ts
```

Expected: PASS, 8 tests.

- [ ] **Step 5: Write the three routes**

Each follows the same shape. `src/app/api/wholesale/route.ts`:

```ts
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendFormEmail } from "@/lib/mailer";
import { validate, type FieldSpec } from "@/lib/validate";

const SPEC: FieldSpec[] = [
  { key: "business", label: "Business name", required: true, max: 200 },
  { key: "abn", label: "ABN", required: true, max: 20 },
  { key: "contact", label: "Contact name", required: true, max: 120 },
  { key: "email", label: "Email", required: true, email: true, max: 200 },
  { key: "phone", label: "Phone", required: true, max: 40 },
  { key: "suburb", label: "Delivery suburb & postcode", required: true, max: 120 },
  { key: "notes", label: "What are you looking to stock?", max: 2000 },
];

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`wholesale:${ip}`)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429 },
    );
  }

  const result = validate(await request.json().catch(() => null), SPEC);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  try {
    await sendFormEmail({
      subject: `Wholesale application — ${result.values.business}`,
      lines: SPEC.map((f) => [f.label, result.values[f.key]]),
    });
  } catch (err) {
    console.error("[wholesale] send failed", err);
    return NextResponse.json(
      { error: "We could not send your application. Please call us instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
```

`src/app/api/contact/route.ts` — identical shape, `SPEC` of `name` (required, 120), `email` (required, email, 200), `subject` (required, 200), `message` (required, 4000); subject line `` `Website enquiry — ${values.subject}` ``.

`src/app/api/subscribe/route.ts` — identical shape, `SPEC` of just `email` (required, email, 200); subject `Newsletter subscription`.

- [ ] **Step 6: Verify the routes end to end**

```bash
npx tsc --noEmit && npx next build
npm run dev &
sleep 6
echo "--- valid wholesale (expect 200 {\"ok\":true}) ---"
curl -s -w '\n%{http_code}\n' -X POST localhost:3000/api/wholesale \
  -H 'Content-Type: application/json' \
  -d '{"business":"Test Grocers","abn":"12345678901","contact":"Asha","email":"a@b.com","phone":"0400000000","suburb":"Sunnybank 4109","notes":"Masalas"}'
echo "--- missing field (expect 400 + named field) ---"
curl -s -w '\n%{http_code}\n' -X POST localhost:3000/api/wholesale \
  -H 'Content-Type: application/json' -d '{"business":"No ABN"}'
echo "--- bad email (expect 400) ---"
curl -s -w '\n%{http_code}\n' -X POST localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"A","email":"nope","subject":"S","message":"M"}'
echo "--- honeypot (expect 400 Submission rejected) ---"
curl -s -w '\n%{http_code}\n' -X POST localhost:3000/api/subscribe \
  -H 'Content-Type: application/json' -d '{"email":"a@b.com","company":"bot"}'
echo "--- rate limit: 7 rapid posts, last should be 429 ---"
for i in $(seq 1 7); do
  curl -s -o /dev/null -w "$i:%{http_code} " -X POST localhost:3000/api/subscribe \
    -H 'Content-Type: application/json' -d '{"email":"a@b.com"}'
done; echo
kill %1
```

Expected: 200; 400 naming "ABN is required."; 400; 400 "Submission rejected."; and the 6th/7th subscribe returning 429. With `RESEND_API_KEY` unset, each success prints a `[form]` block in the dev server log — confirm that appears.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add wholesale, contact and newsletter form endpoints"
```

---

### Task 13: Wholesale page

**Files:**
- Create: `src/app/(site)/wholesale/page.tsx`
- Create: `src/data/wholesale.ts`, `src/components/forms/wholesale-form.tsx`, `src/components/forms/field.tsx`

**Interfaces:**
- Consumes: `useFormPost` (Task 10); `POST /api/wholesale` (Task 12); `CertBadges` (Task 7); `departments` (Task 3).
- Produces: `Field` — the shared labelled input used by both this form and Task 14's contact form.
  ```tsx
  function Field(props: { name: string; label: string; type?: string; rows?: number; required?: boolean; tone: "forest" | "cream" }): JSX.Element
  ```

- [ ] **Step 1: Write the wholesale data**

`src/data/wholesale.ts` — the four benefit cards and three FAQ entries, copy verbatim from reference lines 569–579, with one correction: the "One supplier for the whole shop" card's detail renders `{departments.length}` rather than the hardcoded 28.

- [ ] **Step 2: Build the form**

`src/components/forms/field.tsx` — a `<label>` wrapping an `<input>` or `<textarea>`. The `forest` tone matches reference lines 596–602: `bg-forest-light border-[1.5px] border-forest-line rounded-xl text-[#F2F7EF] px-[18px] py-[15px] text-[15.5px]`. The `cream` tone matches lines 672–675: `bg-cream border-line-deep text-ink`. Labels are visually hidden but present for screen readers, since the design uses placeholders as labels; add `aria-required` on required fields.

`src/components/forms/wholesale-form.tsx` — `"use client"`, using `useFormPost("/api/wholesale")`. The seven fields from Task 12's `SPEC`, in the design's order, plus the hidden `company` honeypot. Submit button gold, "Submit application", disabled and reading "Sending…" while in flight. On success, swap in the design's success panel from reference lines 584–589 — a `✓`, "Application received", the one-business-day line, and a "Submit another" button calling `reset()`. On error, show `error` inline above the button in `#FBD9DB`, and keep every entered value.

Mark up the form as a real `<form>` with `onSubmit` and `noValidate`, so Enter submits and the browser does not double-report validation.

- [ ] **Step 3: Build the page**

Following reference lines 556–636:

1. Sand hero band — eyebrow "For Trade", `h1` "{departments.length} aisles, one delivery run", the lede from reference line 560 with the count derived.
2. Two columns: left, "Why shops order from us" with the four benefit cards, then "Common questions" with the three FAQ items; right, the forest `rounded-[26px]` panel containing `WholesaleForm`.
3. `CertBadges`.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npx next build && npx next lint
```

In dev on `/wholesale`: submit with fields empty (inline error naming the first missing field, values kept), submit valid (success panel appears, `[form]` block in the server log), click "Submit another" (form returns empty). Confirm at 375px that the form panel and inputs do not overflow.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: build wholesale page with working application form"
```

---

### Task 14: Contact page

**Files:**
- Create: `src/app/(site)/contact/page.tsx`
- Create: `src/components/forms/contact-form.tsx`, `src/components/static-map.tsx`

**Interfaces:**
- Consumes: `Field`, `useFormPost`; `POST /api/contact`; `site`, `formattedAddress`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Build the static map**

The design wants a map screenshot; none is available and embedding Google Maps would add a third-party script and a key. `src/components/static-map.tsx` renders an OpenStreetMap `<iframe>` embed — no key, no tracking script — with `loading="lazy"`, `title="Map of the Shree Ganesh warehouse in Acacia Ridge"`, and a "Get directions" link below it opening the address in the user's default map app:

```tsx
const query = encodeURIComponent(`${formattedAddress()}, Australia`);
// bbox is a tight window around Success St, Acacia Ridge.
const src = `https://www.openstreetmap.org/export/embed.html?bbox=153.019%2C-27.596%2C153.045%2C-27.578&layer=mapnik`;
```

Wrap it in a `rounded-[18px] overflow-hidden` 240px well, and give the iframe `className="h-full w-full border-0"`.

- [ ] **Step 2: Build the form and page**

`contact-form.tsx` mirrors `WholesaleForm` with the four contact fields and the `cream` tone, a red submit button "Send message", and the success panel from reference lines 661–666 ("Message sent" / "Send another").

`src/app/(site)/contact/page.tsx`, following reference lines 641–683:

1. Sand hero band — eyebrow "Contact", `h1` "Talk to us", the lede from reference line 645.
2. Two columns: left, four white info cards (Warehouse / Phone / Email / Hours) all from `site`, phone and email as real `tel:` and `mailto:` links, then `StaticMap`; right, the white `rounded-[26px]` panel with `ContactForm`.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit && npx next build && npx next lint
```

In dev on `/contact`: the map renders, "Get directions" opens the right address, the `tel:` and `mailto:` links carry the values from `site`, and the form's success and validation-failure paths both behave as on `/wholesale`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: build contact page with map and enquiry form"
```

---

### Task 15: SEO — sitemap, robots, structured data

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/json-ld.tsx`, `src/app/(site)/not-found.tsx`
- Modify: `src/app/(site)/layout.tsx` (mount site-wide JSON-LD), `src/app/(site)/range/[handle]/page.tsx` (per-product JSON-LD)

**Interfaces:**
- Consumes: `products`, `departments`, `site`, `SITE_URL`, `absoluteUrl`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write sitemap and robots**

`src/app/sitemap.ts` — the six static routes at priority 1.0/0.9, plus every `/range/${handle}` at 0.6. `src/app/robots.ts` — allow all, point `sitemap` at `absoluteUrl("/sitemap.xml")`, and `disallow: ["/api/"]`.

- [ ] **Step 2: Write the structured data**

`src/components/json-ld.tsx` exports `OrganizationJsonLd` and `ProductJsonLd`, each rendering a `<script type="application/ld+json">` with `dangerouslySetInnerHTML` of `JSON.stringify(data)`.

`OrganizationJsonLd` emits a combined `Organization` + `LocalBusiness` graph: name, url, logo, `telephone`, `email`, `foundingDate: "1969"`, `address` as a `PostalAddress` from `site.address`, and `openingHoursSpecification` for Mon–Fri 09:30–15:30. Omit `sameAs` entirely while `site.social` is empty.

`ProductJsonLd` emits `@type: "Product"` with name, image (absolute URL, omitted when `image` is null), brand, and description. **No `offers` block** — there are no prices, and a fabricated one would be a false claim to search engines.

Mount `OrganizationJsonLd` in `(site)/layout.tsx`; mount `ProductJsonLd` in the product page.

- [ ] **Step 3: Write the 404 page**

`src/app/(site)/not-found.tsx` — cream, `font-serif` "We couldn't find that page.", a muted line, and two buttons: red "Browse the range" → `/range` and outline "Back home" → `/`.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit && npx next build
npm run dev & sleep 6
curl -s localhost:3000/robots.txt
curl -s localhost:3000/sitemap.xml | head -20
curl -s localhost:3000/sitemap.xml | grep -c "<url>"
curl -s localhost:3000/ | grep -o '"@type":"[A-Za-z]*"' | sort -u
curl -s -o /dev/null -w '404 page: %{http_code}\n' localhost:3000/definitely-not-a-page
kill %1
```

Expected: robots.txt lists the sitemap and disallows `/api/`; the `<url>` count is roughly `products.length + 6`; the home page reports `Organization` and `LocalBusiness`; the unknown path returns 404. Then paste one product page's JSON-LD into validator.schema.org and confirm no errors — in particular, no warning about a missing `offers`, which is expected and correct here.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots, structured data and 404 page"
```

---

### Task 16: Full verification pass

No new features. This task exists to run spec §12 end to end and fix whatever it surfaces.

**Files:**
- Modify: whatever the checks below break.
- Create: `README.md`

**Interfaces:**
- Consumes: everything.
- Produces: a verified, deployable site.

- [ ] **Step 1: Run every automated gate**

```bash
npx tsc --noEmit
npm test
npx next lint
npm run check:assets
npx next build
```

All five must pass with no errors and no new warnings. Record the actual output; do not claim success without it.

- [ ] **Step 2: Assert the project-wide constraints hold**

```bash
echo "--- no HACCP copy (expect no matches) ---"
grep -rin "haccp" src/ && echo "FAIL" || echo "OK"
echo "--- no hardcoded '28 departments' / '28 aisles' (expect no matches) ---"
grep -rinE "28 (departments|aisles)" src/ && echo "FAIL" || echo "OK"
echo "--- no remote image hosts configured (expect no matches) ---"
grep -n "remotePatterns" next.config.ts && echo "FAIL" || echo "OK"
echo "--- catalog not in the client bundle (expect no matches) ---"
grep -rl "unitsPerCarton" .next/static/chunks/ && echo "FAIL" || echo "OK"
echo "--- no dead social links (expect no matches) ---"
grep -rn "facebook.com/shopify" src/ && echo "FAIL" || echo "OK"
```

Every line must print `OK`.

- [ ] **Step 3: Responsive and interaction pass**

`npm run dev`, then at each of 375 / 768 / 1280 / 1600 walk `/`, `/range`, `/range/[a real handle]`, `/departments`, `/story`, `/wholesale`, `/contact` and confirm:

- No horizontal body scroll at any width, including 320px.
- The mobile drawer opens, closes on link click and on `Escape`, and locks background scroll.
- The story rail highlights correctly and is hidden below `lg`.
- Every image either renders or shows an intentional `DesignedPanel` / brand fallback — no broken frames, no empty `src`.
- Keyboard-only: every interactive element is reachable and has a visible focus ring.

- [ ] **Step 4: Re-walk the catalog matrix**

Repeat the full table from Task 8 Step 3, plus the four product-detail cases from Task 9 Step 2. These are the highest-risk surfaces and are worth re-checking after later tasks touched shared components.

- [ ] **Step 5: Submit each form once more**

One success and one validation failure for each of `/wholesale`, `/contact`, and the `/departments` newsletter. Confirm the `[form]` log block for each success and that failures preserve entered values.

- [ ] **Step 6: Write the README**

`README.md` covering: what the site is and that it is deliberately not e-commerce; the stack; `npm run dev`; the environment variables from `.env.example` and that forms log instead of sending when `RESEND_API_KEY` is unset; how to refresh the catalog (`npm run import:catalog`, then `npm run check:assets`, then commit the output); a pointer to `ASSETS-NEEDED.md` for outstanding client content; and a note that the HACCP claim is intentionally omitted, with a pointer to spec §8.1.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs: add README and complete full verification pass"
```

---

## Plan self-review

**Spec coverage.** §2 stack → Task 1. §3 routes → Tasks 7–14 (`/departments` replacing `/recipes` → Task 10). §4.1 import pipeline → Task 3. §4.2 product shape and best-effort pack parsing → Tasks 2–3. §4.3 data files → Tasks 1, 3, 5, 11, 13. §5 range page, brand-filter grouping, 48/page, empty state, image fallback → Tasks 4, 8; detail pages → Task 9. §6 imagery, `images.ts` registry, `ASSETS-NEEDED.md` → Task 5, with `DesignedPanel` in Task 6. §7 three endpoints, validation, honeypot, rate limit, no-key fallback, newsletter moved to `/departments` → Tasks 10, 12. §8 deviations: .1 HACCP → Tasks 6, 7, 11 plus a grep gate in 7, 11 and 16; .2 Dhiraj → Task 5; .3 recipes→departments → Task 10; .4 social → Tasks 1, 6 plus a grep gate in 16; .5 mobile nav → Task 6; .6 next/font → Task 1; .7 address → Task 1; .8 derived counts → Tasks 7, 10, 13 plus a grep gate in 16. §9 open content → Task 5's `ASSETS-NEEDED.md` and Task 11's chapter 4. §10 component structure → Tasks 6–14. §11 SEO → Task 15. §12 verification → Task 16, with each gate also run in the task that introduces it. §13 out of scope → nothing in any task implements cart, prices, auth or a CMS.

**Placeholder scan.** No "TBD", "TODO" or "handle edge cases" instructions. The one `TODO(client)` comment in Task 11 is a deliberate marker in shipped source pointing at `ASSETS-NEEDED.md`, not an unfinished plan step. Error handling is specified concretely everywhere it appears — named status codes, named messages, and the value-preservation requirement on form failure.

**Type consistency.** `parsePack` returns `{ name, size, unitsPerCarton }` in Task 2 and is consumed under those names in Task 3. `Product` is defined once in Task 3 and imported by Tasks 4, 7, 8, 9, 15. `Department` is defined in the generated `departments.ts` in Task 3 and consumed in 7, 8, 10, 13. `queryProducts` returns `{ items, total, page, pageCount }` in Task 4 and is destructured under exactly those names in Task 8. `IMPORTED` is exported from Task 4 and referenced by both Task 4's tests and Task 8. `useFormPost` returns `{ state, error, submit, reset }` in Task 10 and is used under those names in Tasks 10, 13, 14. `Field`'s `tone` accepts `"forest" | "cream"` in Task 13 and is called with `"cream"` in Task 14. `images` keys written in Task 5 (`hero`, `founder`, `warehouse`, `archival1969`, `qualityLine`, `masalaFeature`, `pickleFeature`, `logo`, `badgeAustralianOwned`) are exactly the keys read in Tasks 6, 7 and 11 — Task 11's `story.ts` chapter 4 references `archival1969`, which exists.
