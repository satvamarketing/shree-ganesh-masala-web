// Responsive + interaction verification against a running dev/prod server.
//
//   node scripts/verify-pages.mjs [--shots] [path ...]
//
// Checks, per page per width:
//   - the body never scrolls horizontally (the project-wide rule)
//   - no <img> failed to load, and none has an empty src
//   - no element overflows the viewport horizontally (names the culprits)
// With --shots, also writes PNGs to .verify/ for eyeballing.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.VERIFY_BASE ?? "http://localhost:3000";
const WIDTHS = [375, 768, 1280, 1600];
const args = process.argv.slice(2);
const shots = args.includes("--shots");
const paths = args.filter((a) => !a.startsWith("--"));
const PAGES = paths.length > 0 ? paths : ["/"];

const OUT = ".verify";
let failures = 0;

const browser = await chromium.launch({ channel: "chrome" });
if (shots) await mkdir(OUT, { recursive: true });

for (const path of PAGES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const consoleErrors = [];
    page.on("console", (m) => {
      const t = m.text();
      // "Failed to load resource" duplicates what badResponses reports, with
      // no URL, so it is dropped in favour of the diagnosable version.
      if (m.type() === "error" && !t.startsWith("Failed to load resource"))
        consoleErrors.push(t.slice(0, 160));
    });

    // Real failing requests, with URLs. Speculative RSC prefetches to routes
    // that do not exist yet are listed separately: while the site is still
    // being built they are expected, and a genuine broken link shows up as a
    // non-prefetch failure anyway.
    const badResponses = new Set();
    const prefetch404s = new Set();
    page.on("response", (r) => {
      if (r.status() < 400) return;
      const url = r.url().replace(BASE, "");
      if (url.includes("_rsc=")) prefetch404s.add(url.split("?")[0]);
      else badResponses.add(`${r.status()} ${url.slice(0, 90)}`);
    });

    let status = 0;
    try {
      const res = await page.goto(`${BASE}${path}`, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      status = res?.status() ?? 0;
    } catch (err) {
      console.log(`✗ ${path} @${width}  navigation failed: ${err.message.split("\n")[0]}`);
      failures++;
      await page.close();
      continue;
    }

    // Scroll the page so lazy images actually load. Without this, a zero-sized
    // lazy image slips past the decode check — exactly the bug that shipped
    // invisible packshots.
    //
    // The pass repeats: as upper images decode the page reflows and pushes
    // lower content down, so a single top-to-bottom pass skips whatever moved
    // below the point it had already scrolled past.
    for (let pass = 0; pass < 6; pass++) {
      await page.evaluate(async () => {
        const step = Math.round(window.innerHeight * 0.8);
        for (let y = 0; y <= document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 70));
        }
      });
      const settled = await page.evaluate(
        () =>
          document.images.length === 0 ||
          [...document.images].every((i) => i.naturalWidth > 0),
      );
      if (settled) break;
      await page.waitForTimeout(500);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);

    const report = await page.evaluate(() => {
      const de = document.documentElement;
      const offenders = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.right > window.innerWidth + 1.5 || r.left < -1.5) {
          const cs = getComputedStyle(el);
          // Elements inside a deliberate horizontal-scroll container, and the
          // decorative marquee, are allowed to exceed the viewport.
          let inScroller = false;
          for (let p = el.parentElement; p; p = p.parentElement) {
            const pcs = getComputedStyle(p);
            if (pcs.overflowX === "auto" || pcs.overflowX === "scroll" || pcs.overflowX === "hidden") {
              inScroller = true;
              break;
            }
          }
          if (inScroller || cs.position === "fixed") continue;
          offenders.push(
            `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(/\s+/).slice(0, 2).join(".") : ""} right=${Math.round(r.right)}`,
          );
        }
      }
      // Only images the user can actually see. An image inside a
      // display:none subtree (e.g. a card hidden below a breakpoint) has zero
      // area and never loads — that is correct, not a defect.
      const imgs = [...document.images].filter((i) =>
        typeof i.checkVisibility === "function"
          ? i.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true })
          : i.offsetParent !== null,
      );
      return {
        scrollWidth: de.scrollWidth,
        innerWidth: window.innerWidth,
        emptySrc: imgs.filter((i) => !i.getAttribute("src")).length,
        // naturalWidth === 0 after a full scroll means it never decoded,
        // whether it errored or was never triggered. Both are defects.
        broken: imgs
          .filter((i) => i.naturalWidth === 0)
          .map((i) => (i.currentSrc || i.src).split("/").pop().slice(0, 48))
          .slice(0, 5),
        // A laid-out image with zero area is invisible even if it loaded.
        zeroSized: imgs
          .filter((i) => {
            const r = i.getBoundingClientRect();
            return r.width < 2 || r.height < 2;
          })
          .map((i) => (i.currentSrc || i.src).split("/").pop().slice(0, 48))
          .slice(0, 5),
        imgCount: imgs.length,
        offenders: [...new Set(offenders)].slice(0, 6),
      };
    });

    const problems = [];
    if (status !== 200) problems.push(`status ${status}`);
    if (report.scrollWidth > report.innerWidth + 1)
      problems.push(`h-scroll ${report.scrollWidth}>${report.innerWidth}`);
    if (report.emptySrc > 0) problems.push(`${report.emptySrc} img with empty src`);
    if (report.broken.length > 0)
      problems.push(`img never decoded: ${report.broken.join(", ")}`);
    if (report.zeroSized.length > 0)
      problems.push(`img with zero area: ${report.zeroSized.join(", ")}`);
    if (report.offenders.length > 0)
      problems.push(`overflow: ${report.offenders.join(" | ")}`);
    if (badResponses.size > 0)
      problems.push(`failed requests: ${[...badResponses].slice(0, 4).join(" | ")}`);
    if (consoleErrors.length > 0)
      problems.push(`console: ${consoleErrors.slice(0, 2).join(" | ")}`);

    if (problems.length > 0) {
      failures++;
      console.log(`✗ ${path} @${width}`);
      for (const p of problems) console.log(`    ${p}`);
    } else {
      const note =
        prefetch404s.size > 0
          ? `  [${prefetch404s.size} prefetch 404: ${[...prefetch404s].slice(0, 3).join(" ")}]`
          : "";
      console.log(`✓ ${path} @${width}  (${report.imgCount} imgs)${note}`);
    }

    if (shots) {
      const name = (path === "/" ? "home" : path.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "")) + `@${width}`;
      await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: width === 1280 });
    }
    await page.close();
  }
}

await browser.close();
console.log(failures === 0 ? "\n✓ all page checks passed" : `\n✗ ${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
