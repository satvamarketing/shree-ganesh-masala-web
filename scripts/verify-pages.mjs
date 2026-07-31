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
      if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160));
    });

    let status = 0;
    try {
      const res = await page.goto(`${BASE}${path}`, {
        waitUntil: "networkidle",
        timeout: 45000,
      });
      status = res?.status() ?? 0;
    } catch (err) {
      console.log(`✗ ${path} @${width}  navigation failed: ${err.message.split("\n")[0]}`);
      failures++;
      await page.close();
      continue;
    }

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
      const imgs = [...document.images];
      return {
        scrollWidth: de.scrollWidth,
        innerWidth: window.innerWidth,
        emptySrc: imgs.filter((i) => !i.getAttribute("src")).length,
        broken: imgs
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src)
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
      problems.push(`broken img: ${report.broken.join(", ")}`);
    if (report.offenders.length > 0)
      problems.push(`overflow: ${report.offenders.join(" | ")}`);
    if (consoleErrors.length > 0)
      problems.push(`console: ${consoleErrors.slice(0, 2).join(" | ")}`);

    if (problems.length > 0) {
      failures++;
      console.log(`✗ ${path} @${width}`);
      for (const p of problems) console.log(`    ${p}`);
    } else {
      console.log(`✓ ${path} @${width}  (${report.imgCount} imgs)`);
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
