// Asserts every image path referenced in data actually exists on disk.
// Run: npm run check:assets
//
// This guards the failure mode of a silently broken image frame after an
// import re-run. See spec §12.4.
import { access } from "node:fs/promises";
import path from "node:path";

const problems = [];

async function check(src, where) {
  // An empty src is an intentionally unfilled slot; the UI renders a designed
  // panel for those. Only a non-empty path that does not resolve is a problem.
  if (!src) return;
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

// Read the JSON directly rather than through src/data/catalog.ts: that module
// uses a bare JSON import, which the bundler resolves but plain Node ESM does
// not without an import attribute.
const { default: products } = await import("../src/data/catalog.json", {
  with: { type: "json" },
});
const { departments } = await import("../src/data/departments.ts");
const { brands } = await import("../src/data/brands.ts");
const { images } = await import("../src/data/images.ts");

for (const d of departments) await check(d.image, `department "${d.slug}"`);
for (const b of brands) await check(b.logo, `brand "${b.slug}"`);
for (const [key, slot] of Object.entries(images))
  await check(slot.src, `image "${key}"`);
for (const p of products) await check(p.image, `product "${p.handle}"`);

if (problems.length > 0) {
  console.error(`✗ ${problems.length} missing asset(s):`);
  for (const p of problems.slice(0, 40)) console.error(`   ${p}`);
  if (problems.length > 40)
    console.error(`   …and ${problems.length - 40} more`);
  process.exit(1);
}

const needsReal = Object.entries(images)
  .filter(([, s]) => s.needsReal)
  .map(([k]) => k);
const noLogo = brands.filter((b) => !b.logo).map((b) => b.slug);

console.log(
  `✓ all assets resolve — ${products.length} products, ` +
    `${departments.length} departments, ${brands.length} brands.`,
);
console.log(`  ${needsReal.length} image slot(s) awaiting a real asset: ${needsReal.join(", ")}`);
if (noLogo.length > 0)
  console.log(`  ${noLogo.length} brand(s) with no logo file: ${noLogo.join(", ")}`);
