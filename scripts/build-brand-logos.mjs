/**
 * Cuts the opaque background out of the brand logos that arrived with one.
 *
 *   npm run build:logos
 *
 * Reads the client's originals from assets-src/brands/ and writes cutouts to
 * public/brands/<slug>.<hash>.webp. Print output includes the exact `logo:`
 * lines for src/data/brands.ts.
 *
 * Only the logos listed in TARGETS are processed. The others already arrived
 * with transparency, and re-processing them would risk eating into the mark for
 * no gain.
 *
 * Why a flood fill from the edges rather than "make white transparent":
 *
 *   These marks contain white that MUST survive. Amdavadi's wordmark and monument
 *   are white knocked out of a red shield, and keying on colour alone would
 *   delete them. Only white that is CONNECTED to the edge of the canvas is
 *   background. As a bonus this does the right thing with counters: the enclosed
 *   middle of Vipul's "O" is reachable from outside, so it becomes transparent
 *   and the tile shows through, exactly as it should.
 *
 * Why every region is kept, not just the largest:
 *
 *   These logos have elements floating clear of the main shape. Amdavadi has a
 *   superscript TM; Vipul has an arched tagline above the oval and two lines of
 *   copy plus a swoosh below it; Henaa's motif sits clear of its wordmark. Taking
 *   the largest connected region, as the dabba script does, would silently delete
 *   all of them.
 *
 * The 1px erosion before feathering matters: the originals are anti-aliased
 * against white, so the outermost edge pixel of every shape is part white. Left
 * in, that reads as a pale halo once the mark sits on the cream tile.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "assets-src/brands";
const OUT_DIR = "public/brands";

/**
 * Per logo, because the backgrounds are not the same colour.
 *
 * `chromaMax` is how far from neutral grey a pixel may be and still count as
 * background. Henaa's ground is a warm cream rather than white, so it needs a
 * wider tolerance than the two that sit on pure white.
 *
 * NOT LISTED, deliberately:
 *
 *   dhiraj — its dark olive panel is load-bearing. The wordmark is knocked out
 *   of it in white, so removing the panel would leave white type on a cream tile,
 *   i.e. an invisible logo. Getting Dhiraj onto a light ground needs a different
 *   artwork from the brand owner, not a cutout.
 *
 *   shree-ganesh, herbs-and-spices — already transparent.
 */
const TARGETS = [
  { slug: "amdavadi", whiteMin: 242, chromaMax: 16 },
  { slug: "vipul-dudhiya", whiteMin: 242, chromaMax: 16 },
  // 254,248,230 against a 255,248,238 tile: a delta of 8 in blue, which is the
  // same order as the difference that made the dabba read as a pale box.
  { slug: "henaa", whiteMin: 238, chromaMax: 30 },
];

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

/** Two-pass chamfer distance to the nearest zero pixel. */
function distanceTransform(mask, W, H) {
  const d = new Float32Array(W * H);
  for (let i = 0; i < d.length; i++) d[i] = mask[i] ? 1e9 : 0;
  const D2 = Math.SQRT2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (d[i] === 0) continue;
      let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + 1);
      if (y > 0) v = Math.min(v, d[i - W] + 1);
      if (x > 0 && y > 0) v = Math.min(v, d[i - W - 1] + D2);
      if (x < W - 1 && y > 0) v = Math.min(v, d[i - W + 1] + D2);
      d[i] = v;
    }
  }
  for (let y = H - 1; y >= 0; y--) {
    for (let x = W - 1; x >= 0; x--) {
      const i = y * W + x;
      if (d[i] === 0) continue;
      let v = d[i];
      if (x < W - 1) v = Math.min(v, d[i + 1] + 1);
      if (y < H - 1) v = Math.min(v, d[i + W] + 1);
      if (x < W - 1 && y < H - 1) v = Math.min(v, d[i + W + 1] + D2);
      if (x > 0 && y < H - 1) v = Math.min(v, d[i + W - 1] + D2);
      d[i] = v;
    }
  }
  return d;
}

async function cut({ slug, whiteMin, chromaMax }) {
  const source = path.join(SOURCE_DIR, `${slug}.webp`);
  if (!existsSync(source)) throw new Error(`missing ${source}`);

  const { data, info } = await sharp(source)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const ch = info.channels;

  const isWhite = new Uint8Array(W * H);
  for (let i = 0, p = 0; i < W * H; i++, p += ch) {
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    isWhite[i] = luma(r, g, b) >= whiteMin && chroma <= chromaMax ? 1 : 0;
  }

  // Flood fill white inward from every edge pixel, so background reached from
  // any side is removed even when the mark touches one edge.
  const bg = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    const i = y * W + x;
    if (!bg[i] && isWhite[i]) {
      bg[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < W; x++) {
    push(x, 0);
    push(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % W;
    const y = (i - x) / W;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }

  // Erode the kept region by 1px to drop the anti-aliased white fringe, then let
  // the resize-free blur feather what is left.
  const keep = new Uint8Array(W * H);
  for (let i = 0; i < keep.length; i++) keep[i] = bg[i] ? 0 : 1;
  const dist = distanceTransform(keep, W, H);
  const hard = Buffer.alloc(W * H);
  for (let i = 0; i < hard.length; i++) hard[i] = dist[i] >= 1.2 ? 255 : 0;

  const alpha = await sharp(hard, { raw: { width: W, height: H, channels: 1 } })
    .blur(0.7)
    .extractChannel(0)
    .raw()
    .toBuffer();

  const cutout = await sharp(data, { raw: { width: W, height: H, channels: ch } })
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } })
    .png()
    .toBuffer();

  const webp = await sharp(cutout).webp({ quality: 92 }).toBuffer();
  const hash = createHash("sha256").update(webp).digest("hex").slice(0, 8);
  const out = path.join(OUT_DIR, `${slug}.${hash}.webp`);
  for (const name of readdirSync(OUT_DIR)) {
    if (new RegExp(`^${slug}(\\.[0-9a-f]{8})?\\.webp$`).test(name) && path.join(OUT_DIR, name) !== out) {
      unlinkSync(path.join(OUT_DIR, name));
    }
  }
  const written = await sharp(webp).toFile(out);

  // Report, and refuse anything that looks like the mark itself was eaten.
  let removed = 0;
  let kept = 0;
  for (let i = 0; i < alpha.length; i++) {
    if (alpha[i] < 40) removed++;
    else kept++;
  }
  const removedPct = (removed / (W * H)) * 100;
  const check = await sharp(cutout).raw().toBuffer();

  // The real safety check: ink that is not on a shape's boundary must stay fully
  // opaque. Counting ALL ink would fail honestly-good cutouts, because the 1px
  // erosion necessarily takes the outermost pixel of every stroke, and for the
  // hairline type in Vipul's tagline that is a large share of its total ink.
  // Measuring only interior ink separates "the mark was eaten" from "the edges
  // were tightened by a pixel". Testing the middle of the canvas instead would
  // be wrong for a tall lockup like Henaa's, whose centre is the gap between the
  // motif and the wordmark.
  let ink = 0;
  let inkSurvived = 0;
  for (let i = 0; i < W * H; i++) {
    if (isWhite[i] || dist[i] < 2.5) continue;
    ink++;
    if (check[i * 4 + 3] > 200) inkSurvived++;
  }
  const inkPct = (inkSurvived / ink) * 100;
  console.log(
    `${slug.padEnd(14)} ${W}x${H}  removed ${removedPct.toFixed(1)}% of the canvas  ` +
      `kept ${((kept / (W * H)) * 100).toFixed(1)}%  interior ink intact ${inkPct.toFixed(2)}%  ` +
      `${Math.round(written.size / 1024)}kB`,
  );
  if (removedPct < 5) throw new Error(`${slug}: almost nothing was removed — is the background white?`);
  if (removedPct > 80) throw new Error(`${slug}: removed ${removedPct.toFixed(1)}% — the mark was eaten`);
  if (inkPct < 99.5)
    throw new Error(`${slug}: only ${inkPct.toFixed(1)}% of the mark's interior ink survived`);
  return { slug, out };
}

mkdirSync(OUT_DIR, { recursive: true });
const results = [];
for (const target of TARGETS) results.push(await cut(target));
console.log("\nset these in src/data/brands.ts:");
for (const r of results) console.log(`  ${r.slug}: logo: "/${path.relative("public", r.out)}",`);
