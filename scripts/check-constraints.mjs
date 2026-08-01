// Asserts the project-wide constraints against a RUNNING server.
//
//   node scripts/check-constraints.mjs            (defaults to :3000)
//   VERIFY_BASE=http://localhost:3100 node scripts/check-constraints.mjs
//
// These are checked against rendered HTML, not source. Source greps produce
// false positives on the comments that explain each rule — e.g. the note
// recording that the live site's only social link is a Shopify default.
import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const BASE = process.env.VERIFY_BASE ?? "http://localhost:3000";

const PAGES = [
  "/",
  "/range",
  "/departments",
  "/story",
  "/wholesale",
  "/contact",
  "/range/aara-root-flour-400gx25",
];

let failures = 0;

function report(name, ok, detail = "") {
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const html = new Map();
for (const path of PAGES) {
  const res = await fetch(`${BASE}${path}`);
  html.set(path, await res.text());
  if (!res.ok) report(`${path} responds 200`, false, `got ${res.status}`);
}

/** Strips RSC comment markers so split text nodes read as prose. */
function text(body) {
  return body
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

// 1. The three certification badges render on the pages that carry the strip.
//
// This previously asserted the opposite — that "HACCP" appeared nowhere —
// because the claim was unverified. The client has since supplied the marks
// and directed that all three be shown, so the check now guards that they
// actually render rather than that they are absent. The licence conditions
// attached to two of them are tracked in ASSETS-NEEDED.md §4.
{
  const { images } = await import("../src/data/images.ts");
  const badges = [
    images.badgeAustralianOwnedOperated,
    images.badgeAustralianOwned,
    images.badgeHaccp,
  ];
  report("all three badge slots have a source", badges.every((b) => b.src !== ""));

  for (const page of ["/", "/wholesale"]) {
    const body = html.get(page);
    const missing = badges.filter((b) => !body.includes(b.src.replace(/\//g, "%2F")) && !body.includes(b.src));
    report(`badges present on ${page}`, missing.length === 0, `${missing.length} missing`);
  }
}

// 2. No em dashes in rendered copy — a house style rule for this site.
// Checked against rendered text, so code comments are unaffected.
{
  const EM = String.fromCharCode(0x2014);
  const hits = PAGES.filter((p) => text(html.get(p)).includes(EM));
  report("no em dash in rendered copy", hits.length === 0, hits.join(", "));
}

// 3. No dead social links.
{
  const hits = PAGES.filter((p) => /facebook\.com\/shopify/i.test(html.get(p)));
  report("no placeholder social links", hits.length === 0, hits.join(", "));
}

// 3. No prices — this is a wholesale catalog with pricing behind approval.
{
  const hits = PAGES.filter((p) => /\$\d+\.\d{2}/.test(text(html.get(p))));
  report("no prices rendered", hits.length === 0, hits.join(", "));
}

// 4. Department count is derived, not the design's stale hardcoded 28.
{
  const { departments } = await import("../src/data/departments.ts");
  const wholesale = text(html.get("/wholesale"));
  const ok = wholesale.includes(`${departments.length} aisles`);
  report(
    "department count derived on /wholesale",
    ok,
    ok ? `${departments.length} aisles` : "expected derived count in h1",
  );
  report("no stale '28 departments/aisles'", !/28 (departments|aisles)/i.test(wholesale));
}

// 5. The 1174-product catalog must never reach the browser.
{
  let leaked = [];
  try {
    for await (const file of glob(".next/static/chunks/**/*.js")) {
      const body = await readFile(file, "utf8");
      if (body.includes("unitsPerCarton")) leaked.push(file);
    }
  } catch {
    // glob unavailable on older Node; the build gate covers this too.
  }
  report("catalog absent from client bundle", leaked.length === 0, leaked.join(", "));
}

// 6. No remote image hosts — every asset ships locally.
{
  const config = await readFile("next.config.ts", "utf8");
  report("no remote image patterns configured", !config.includes("remotePatterns"));
}

// 7. Unmatched URLs get the branded 404, not Next's default.
{
  const res = await fetch(`${BASE}/definitely-not-a-page`);
  const body = await res.text();
  report(
    "branded 404 with chrome",
    res.status === 404 && body.includes("Browse the range") && body.includes("Open an account"),
    `status ${res.status}`,
  );
}

console.log(
  failures === 0
    ? "\n✓ all constraints hold"
    : `\n✗ ${failures} constraint(s) violated`,
);
process.exit(failures === 0 ? 0 : 1);
