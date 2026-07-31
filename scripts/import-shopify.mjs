// Imports the live Shopify catalog into committed local data + images.
//
// Run manually:  npm run import:catalog
//
// Deliberately not a build step: a trade catalog changes slowly, and a
// build-time fetch of ~1000 images would make deploys slow and flaky. The
// committed output means the site keeps working after the Shopify store is
// retired. See spec §4.1.
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { parsePack } from "../src/lib/parse-pack.ts";

const STORE = "https://shreeganesh.com.au";
const OUT_CATALOG_IMG = "public/catalog";
const OUT_DEPT_IMG = "public/departments";

/** How many image downloads run at once. */
const IMAGE_CONCURRENCY = 12;

/** Spellings to look for in title/product_type, including store variants. */
const HOUSE_BRAND_MATCHES = [
  "Shree Ganesh",
  "Ganesh",
  "Amdavadi",
  "Herbs & Spices",
  "Herbs and Spices",
  "Henaa",
  "Henna",
  "Vipul Dudhiya",
  "Dhiraj",
];

/** The six house brands, canonical spelling. A product is a house-brand line
 *  if and only if its resolved brand is one of these — see brandOf. */
const HOUSE_BRANDS = [
  "Shree Ganesh",
  "Amdavadi",
  "Herbs & Spices",
  "Dhiraj",
  "Vipul Dudhiya",
  "Henaa",
];

/**
 * The store serves a branded "Image Available On Request" graphic for products
 * with no photograph — 131 of them, in three re-encodings of the same artwork.
 * It is not a product photo, so it is rejected and those products fall through
 * to the site's own typographic fallback tile, which is cleaner and lighter.
 *
 * These are md5s of the *output* WebP, which is deterministic for a given
 * source and encode settings. Anything appearing suspiciously often that is not
 * listed here is reported at the end of the run, so a fourth variant cannot
 * slip in unnoticed. Genuine photos reused across pack sizes (e.g. papad in
 * four weights) repeat far less often and must not be added here.
 */
const PLACEHOLDER_IMAGE_HASHES = new Set([
  "aa8c313b2127b588ef8e23c323165cfb",
  "709040e0f58202d9eb8654918ea6dead",
  "5b9ea69ef7e4769f5399a1e17e1dd2a3",
]);

/** Reuse above this count is almost certainly a placeholder, not a photo. */
const SUSPICIOUS_REUSE = 20;

/** Collections that are empty or merchandising-only, not real departments. */
const SKIP_COLLECTIONS = new Set([
  "New Arrivals",
  "Staff Picks",
  "Weekly Specials",
]);

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getJSON(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } catch (err) {
      if (attempt === 3) throw new Error(`${err.message} for ${url}`);
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
}

/** Shopify caps products.json at 250 per page; walk until a short page. */
async function fetchAllProducts() {
  const all = new Map();
  for (let page = 1; page <= 20; page++) {
    const { products } = await getJSON(
      `${STORE}/products.json?limit=250&page=${page}`,
    );
    if (products.length === 0) break;
    for (const p of products) all.set(p.id, p);
    process.stdout.write(
      `  page ${page}: ${products.length} (total ${all.size})\n`,
    );
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
    let seen = 0;
    for (let page = 1; page <= 20; page++) {
      const { products } = await getJSON(
        `${STORE}/collections/${c.handle}/products.json?limit=250&page=${page}`,
      );
      if (products.length === 0) break;
      for (const p of products) {
        if (!membership.has(p.id)) membership.set(p.id, new Set());
        membership.get(p.id).add(slug);
      }
      seen += products.length;
      if (products.length < 250) break;
    }
    process.stdout.write(`  ${c.title}: ${seen}\n`);
  }
  return membership;
}

/**
 * Downloads and re-encodes to WebP. Returns the public path, or null.
 * Skips the fetch when the file already exists, so re-running the import to
 * pick up a data-shape change costs seconds rather than re-pulling ~1000
 * images. Delete the directory to force a true refresh.
 */
const hashCounts = new Map();

async function saveImage(url, dir, name, width, { rejectPlaceholders = false } = {}) {
  if (!url) return null;
  const out = path.join(dir, `${name}.webp`);
  const publicPath = `/${path.basename(dir)}/${name}.webp`;

  if (!existsSync(out)) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(out);
    } catch {
      return null;
    }
  }

  if (!rejectPlaceholders) return publicPath;

  const hash = createHash("md5").update(await readFile(out)).digest("hex");
  hashCounts.set(hash, (hashCounts.get(hash) ?? 0) + 1);
  if (PLACEHOLDER_IMAGE_HASHES.has(hash)) {
    await unlink(out).catch(() => {});
    return null;
  }
  return publicPath;
}

/** Runs `worker` over `items` with a bounded number in flight. */
async function mapPool(items, limit, worker) {
  const out = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      out[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return out;
}

function brandOf(product) {
  const blob = `${product.title} ${product.product_type}`.toLowerCase();
  const hit = HOUSE_BRAND_MATCHES.find((b) => blob.includes(b.toLowerCase()));
  if (hit) {
    // Collapse the spelling variants onto their canonical brand name.
    if (hit === "Ganesh" || hit === "Shree Ganesh") return "Shree Ganesh";
    if (hit === "Herbs and Spices") return "Herbs & Spices";
    if (hit === "Henna") return "Henaa";
    return hit;
  }
  // `vendor` is deliberately NOT used as a fallback. On this store it holds
  // the seller ("Shree Ganesh") or the manufacturer ("Harihar Foods"), not a
  // consumer brand — falling back to it labelled 285 third-party items like
  // "3G Dust Free Broom" as Shree Ganesh house-brand lines.
  const type = product.product_type?.trim();
  return type && type.length > 0 ? type : "Imported";
}

function plainText(html) {
  return (html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
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

  console.log(`Downloading images for ${raw.length} products…`);
  const imagePaths = await mapPool(raw, IMAGE_CONCURRENCY, async (p, i) => {
    if (i > 0 && i % 100 === 0) process.stdout.write(`  ${i}/${raw.length}\n`);
    return saveImage(p.images?.[0]?.src, OUT_CATALOG_IMG, p.handle, 600, {
      rejectPlaceholders: true,
    });
  });

  const products = raw.map((p, i) => {
    const { name, size, unitsPerCarton } = parsePack(p.title);
    const brand = brandOf(p);
    return {
      handle: p.handle,
      title: name,
      rawTitle: p.title.trim(),
      brand,
      // Derived from the resolved brand, so brand and isHouseBrand can never
      // disagree — otherwise a product shows under both its brand chip and
      // the "Imported brands" chip.
      isHouseBrand: HOUSE_BRANDS.includes(brand),
      departments: [...(membership.get(p.id) ?? [])].sort(),
      size,
      unitsPerCarton,
      image: imagePaths[i],
      description: plainText(p.body_html).slice(0, 600),
    };
  });
  products.sort((a, b) => a.title.localeCompare(b.title));
  const withImage = products.filter((p) => p.image).length;

  console.log("Downloading department images…");
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

  await writeFile(
    "src/data/catalog.json",
    JSON.stringify(products, null, 0) + "\n",
  );
  await writeFile(
    "src/data/departments.ts",
    `// GENERATED by scripts/import-shopify.mjs — do not edit by hand.\n` +
      `export type Department = { name: string; slug: string; image: string; count: number };\n\n` +
      `export const departments: Department[] = ${JSON.stringify(departments, null, 2)};\n`,
  );

  const rejected = products.length - withImage;
  console.log(
    `\nDone. ${products.length} products (${withImage} with images, ` +
      `${rejected} without), ${departments.length} departments.`,
  );

  const suspicious = [...hashCounts.entries()]
    .filter(([h, n]) => n >= SUSPICIOUS_REUSE && !PLACEHOLDER_IMAGE_HASHES.has(h))
    .sort((a, b) => b[1] - a[1]);
  if (suspicious.length > 0) {
    console.warn(
      `\n⚠ ${suspicious.length} image(s) reused ${SUSPICIOUS_REUSE}+ times and not ` +
        `on the placeholder denylist — check whether the store added a new ` +
        `"Image Available On Request" variant:`,
    );
    for (const [h, n] of suspicious) console.warn(`   ${n} x ${h}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
