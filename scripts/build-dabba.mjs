/**
 * Builds the masala dabba asset and calibrates its hotspots, from the source
 * photograph in assets-src/.
 *
 *   npm run build:dabba
 *
 * Writes public/dabba/dabba.<hash>.webp (background removed, cropped to the tin) and
 * src/data/dabba.ts (measured hotspot geometry).
 *
 * Run this whenever the tin photograph is replaced. Do not hand-edit the
 * generated numbers: they depend on how the tin sits in the frame.
 *
 * How it works, and why:
 *
 * 1. BACKGROUND REMOVAL is a gradient-limited flood fill from the four corners,
 *    not a colour key and not a circular mask. The generated photo has a soft
 *    drop shadow, which is a smooth gradient, so the fill walks down it and
 *    stops at the tin's hard silhouette. A circular mask cannot do this: the
 *    tin fills only ~85% of the source frame, so masking to the frame's
 *    inscribed circle leaves a ring of the photo's own off-white background,
 *    which is a few RGB units lighter than the page and reads as a pale box.
 *
 * 2. WELL CENTRES come from a distance transform, not a centroid. The image
 *    prompt asks for a few loose grains around each well because it looks real,
 *    but those spills drag a centroid outward by a few percent. The largest
 *    disc that fits inside a well ignores thin spills entirely.
 *
 * 3. HOTSPOT POSITIONS are the measured centres, with a symmetric seven-fold ring
 *    fitted to them as a CROSS-CHECK rather than as the answer. A generated tin is
 *    not perfectly evenly spaced, so the measurements beat the idealised ring;
 *    but if the two disagree by more than 2% of frame width the script aborts,
 *    because that is what a tilted or cropped photograph looks like. The ring is
 *    also the fallback position for a well that will not separate cleanly.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "assets-src/dabba-source.webp";
// The filename carries a hash of the contents. Next's image optimizer caches by
// request URL and a file in public/ keeps its URL when its contents change, so a
// replaced asset otherwise keeps serving its old rendering — old alpha channel
// included — from the optimizer cache, the browser cache and any CDN in front.
// Hashing the name means new pixels always mean a new URL.
const ASSET_DIR = "public/dabba";
const ASSET_STEM = "dabba";
const DATA = "src/data/dabba.ts";
const SIZE = 1200; // output edge, plenty for a 460px box at 2x
const WELLS = 7;

/** Spices clockwise from the 12 o'clock well. Must match `wells` in src/data/story.ts. */
const ORDER = [
  { slug: "turmeric", expect: "vivid golden-yellow" },
  { slug: "red-chilli", expect: "deep brick red" },
  { slug: "dhana-jeeru", expect: "pale khaki-tan" },
  { slug: "cumin", expect: "mid-brown seeds" },
  { slug: "mustard", expect: "near-black seeds" },
  { slug: "hing", expect: "pale sandy ochre" },
  { slug: "garam-masala", expect: "dark chocolate brown" },
];

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

function saturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : ((max - min) / max) * 255;
}

/**
 * Flood fill from the corners, stepping only where luminance changes little.
 * Returns a Uint8Array flag per pixel: 1 where the pixel is background.
 */
function fillBackground(L, W, H) {
  const STEP = 5; // max luminance change per step: walks gradients, not edges
  const FLOOR = 150; // never walk into the tin's darker interior
  const bg = new Uint8Array(W * H);
  const stack = [0, W - 1, (H - 1) * W, W * H - 1];
  for (const s of stack) bg[s] = 1;
  while (stack.length) {
    const i = stack.pop();
    const x = i % W;
    const y = (i - x) / W;
    const l = L[i];
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const j = ny * W + nx;
      if (bg[j] || L[j] < FLOOR || Math.abs(L[j] - l) > STEP) continue;
      bg[j] = 1;
      stack.push(j);
    }
  }
  return bg;
}

/** The connected non-background region containing the frame centre. */
function subjectFrom(bg, W, H) {
  const seed = ((H / 2) | 0) * W + ((W / 2) | 0);
  if (bg[seed]) throw new Error("frame centre was classified as background");
  const mask = new Uint8Array(W * H);
  const stack = [seed];
  mask[seed] = 1;
  while (stack.length) {
    const i = stack.pop();
    const x = i % W;
    const y = (i - x) / W;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const j = ny * W + nx;
      if (mask[j] || bg[j]) continue;
      mask[j] = 1;
      stack.push(j);
    }
  }
  return mask;
}

/** Two-pass chamfer distance to the nearest zero pixel, in pixels. */
function distanceTransform(mask, W, H) {
  const INF = 1e9;
  const d = new Float32Array(W * H);
  for (let i = 0; i < d.length; i++) d[i] = mask[i] ? INF : 0;
  const D1 = 1;
  const D2 = Math.SQRT2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (d[i] === 0) continue;
      let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + D1);
      if (y > 0) v = Math.min(v, d[i - W] + D1);
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
      if (x < W - 1) v = Math.min(v, d[i + 1] + D1);
      if (y < H - 1) v = Math.min(v, d[i + W] + D1);
      if (x < W - 1 && y < H - 1) v = Math.min(v, d[i + W + 1] + D2);
      if (x > 0 && y < H - 1) v = Math.min(v, d[i + W - 1] + D2);
      d[i] = v;
    }
  }
  return d;
}

/** Label connected components of a flag array, returning per-label pixel lists. */
function components(flag, W, H, minArea) {
  const label = new Int32Array(W * H).fill(-1);
  const out = [];
  for (let s = 0; s < flag.length; s++) {
    if (!flag[s] || label[s] !== -1) continue;
    const id = out.length;
    const pixels = [];
    const stack = [s];
    label[s] = id;
    while (stack.length) {
      const i = stack.pop();
      pixels.push(i);
      const x = i % W;
      const y = (i - x) / W;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (!flag[j] || label[j] !== -1) continue;
        label[j] = id;
        stack.push(j);
      }
    }
    if (pixels.length >= minArea) out.push(pixels);
    else out.push([]);
  }
  return out.filter((p) => p.length > 0);
}

/**
 * Fit centre, ring radius and rotation of an evenly spaced ring of `WELLS`
 * points, by coordinate descent with a shrinking step. Deterministic.
 */
function fitRing(points) {
  const step = (2 * Math.PI) / WELLS;
  const mean = (f) => points.reduce((s, p) => s + f(p), 0) / points.length;
  const cx = mean((p) => p.x);
  const cy = mean((p) => p.y);
  const R = mean((p) => Math.hypot(p.x - cx, p.y - cy));
  // angle measured clockwise from 12 o'clock, y axis pointing down
  const angleOf = (p, ox, oy) => Math.atan2(p.x - ox, -(p.y - oy));

  // Every well sits at t0 + i*step, so 7*angle is congruent to 7*t0 for all of
  // them regardless of which i it is. That gives t0 without needing to know the
  // assignment, and without assuming no well is missing from the measurements.
  let sinSum = 0;
  let cosSum = 0;
  for (const p of points) {
    const a = WELLS * angleOf(p, cx, cy);
    sinSum += Math.sin(a);
    cosSum += Math.cos(a);
  }
  const t0 = Math.atan2(sinSum, cosSum) / WELLS;

  const model = (i, p) => ({
    x: p.cx + p.R * Math.sin(p.t0 + i * step),
    y: p.cy - p.R * Math.cos(p.t0 + i * step),
  });
  // Each measured well is scored against its NEAREST slot, so a well that could
  // not be separated simply leaves its slot unconstrained by measurement.
  const cost = (p) =>
    points.reduce((s, pt) => {
      let best = Infinity;
      for (let i = 0; i < WELLS; i++) {
        const m = model(i, p);
        best = Math.min(best, (m.x - pt.x) ** 2 + (m.y - pt.y) ** 2);
      }
      return s + best;
    }, 0);

  let params = { cx, cy, R, t0 };
  let best = cost(params);
  const scales = { cx: 1, cy: 1, R: 1, t0: 0.01 };
  for (let mag = 8; mag > 1e-4; mag /= 1.6) {
    let improved = true;
    while (improved) {
      improved = false;
      for (const key of ["cx", "cy", "R", "t0"]) {
        for (const dir of [1, -1]) {
          const trial = { ...params };
          trial[key] += dir * mag * scales[key];
          const c = cost(trial);
          if (c < best - 1e-9) {
            best = c;
            params = trial;
            improved = true;
          }
        }
      }
    }
  }
  const rms = Math.sqrt(best / points.length);
  // report which slot each measured well landed in, so a mislabelled photo shows
  const assigned = points.map((pt) => {
    let slot = -1;
    let bestD = Infinity;
    for (let i = 0; i < WELLS; i++) {
      const m = model(i, params);
      const d = Math.hypot(m.x - pt.x, m.y - pt.y);
      if (d < bestD) {
        bestD = d;
        slot = i;
      }
    }
    return { ...pt, slot, drift: bestD };
  });
  return { ...params, rms, assigned, model: (i) => model(i, params) };
}

async function main() {
  if (!existsSync(SOURCE)) {
    console.error(`missing ${SOURCE} — the tin photograph is the input to this script.`);
    process.exit(1);
  }

  // 1. segment the tin in the source frame
  const src = sharp(SOURCE).removeAlpha();
  const { data: rgb, info } = await src
    .clone()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const L = new Float32Array(W * H);
  for (let i = 0, p = 0; i < W * H; i++, p += info.channels) {
    L[i] = luma(rgb[p], rgb[p + 1], rgb[p + 2]);
  }
  const tin = subjectFrom(fillBackground(L, W, H), W, H);

  // 2. erode by 2px so the background's anti-aliased fringe does not survive
  //    as a light halo, then use the distance field to find the crop.
  const dist = distanceTransform(tin, W, H);
  const solid = new Uint8Array(W * H);
  for (let i = 0; i < solid.length; i++) solid[i] = dist[i] >= 2 ? 255 : 0;

  let minx = W;
  let maxx = 0;
  let miny = H;
  let maxy = 0;
  for (let i = 0; i < solid.length; i++) {
    if (!solid[i]) continue;
    const x = i % W;
    const y = (i - x) / W;
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
  }
  const tcx = (minx + maxx) / 2;
  const tcy = (miny + maxy) / 2;
  const half = Math.ceil((Math.max(maxx - minx, maxy - miny) / 2) * 1.015);
  const left = Math.round(tcx - half);
  const top = Math.round(tcy - half);
  const side = half * 2;
  if (left < 0 || top < 0 || left + side > W || top + side > H) {
    throw new Error(
      `the tin sits too close to the source edge to crop squarely (${left},${top},${side} in ${W}x${H})`,
    );
  }

  const crop = { left, top, width: side, height: side };
  const resize = { width: SIZE, height: SIZE, fit: "fill" };
  // Resampling the mask to the output size is what feathers its edge.
  // extractChannel is required: sharp promotes a one-channel raw input to three
  // channels through resize, and reading that back as one channel shears the
  // mask into diagonal stripes.
  const alpha = await sharp(Buffer.from(solid), { raw: { width: W, height: H, channels: 1 } })
    .extract(crop)
    .resize(resize)
    .extractChannel(0)
    .raw()
    .toBuffer();
  if (alpha.length !== SIZE * SIZE) {
    throw new Error(`alpha mask is ${alpha.length} bytes, expected ${SIZE * SIZE}`);
  }

  // joinChannel, not a `dest-in` composite: a one-channel mask carries no alpha
  // of its own, so compositing it treats it as fully opaque and silently keeps
  // the whole frame. Joining it as the fourth channel makes it the alpha.
  const cutout = await sharp(rgb, { raw: { width: W, height: H, channels: info.channels } })
    .extract(crop)
    .resize(resize)
    .joinChannel(alpha, { raw: { width: SIZE, height: SIZE, channels: 1 } })
    .png()
    .toBuffer();

  const check = await sharp(cutout).raw().toBuffer();
  let opaque = 0;
  for (let i = 3; i < check.length; i += 4) if (check[i] > 128) opaque++;
  const opaquePct = (opaque / (SIZE * SIZE)) * 100;
  if (opaquePct > 90) {
    throw new Error(`${opaquePct.toFixed(1)}% of the asset is opaque — the background was not removed`);
  }

  mkdirSync(ASSET_DIR, { recursive: true });
  const webp = await sharp(cutout).webp({ quality: 88 }).toBuffer();
  const hash = createHash("sha256").update(webp).digest("hex").slice(0, 8);
  const ASSET = path.join(ASSET_DIR, `${ASSET_STEM}.${hash}.webp`);
  // clear out any earlier build of the tin so old hashes do not pile up
  for (const name of readdirSync(ASSET_DIR)) {
    if (/^dabba(\.[0-9a-f]{8})?\.webp$/.test(name) && path.join(ASSET_DIR, name) !== ASSET) {
      unlinkSync(path.join(ASSET_DIR, name));
      console.log(`removed        ${path.join(ASSET_DIR, name)} (superseded)`);
    }
  }
  const written = await sharp(webp).toFile(ASSET);

  // 3. measure the wells in the FINAL frame, so the numbers need no conversion
  const { data: fin } = await sharp(cutout).raw().toBuffer({ resolveWithObject: true });
  // Only the tin's interior: the wells reach about 40% of the frame, while the
  // outer wall and the shadow under the rim are dark too and would otherwise
  // form one large ring-shaped region that swamps the wells.
  const INTERIOR = 0.45 * SIZE;
  const spice = new Uint8Array(SIZE * SIZE);
  for (let i = 0, p = 0; i < SIZE * SIZE; i++, p += 4) {
    if (fin[p + 3] < 128) continue;
    const x = i % SIZE;
    const y = (i - x) / SIZE;
    if (Math.hypot(x - SIZE / 2, y - SIZE / 2) > INTERIOR) continue;
    const r = fin[p];
    const g = fin[p + 1];
    const b = fin[p + 2];
    // spice is either coloured or dark; steel is desaturated and bright
    spice[i] = saturation(r, g, b) >= 26 || luma(r, g, b) < 140 ? 1 : 0;
  }

  // Open the mask before labelling. A well can touch the shadow under the rim
  // through a bridge only a few pixels wide, which merges the two into one
  // region; eroding by OPEN severs every such bridge while leaving the wells,
  // which are an order of magnitude wider, essentially intact.
  const OPEN = 8;
  const spiceDist = distanceTransform(spice, SIZE, SIZE);
  const cores = new Uint8Array(SIZE * SIZE);
  for (let i = 0; i < cores.length; i++) cores[i] = spiceDist[i] >= OPEN ? 1 : 0;

  const wellArea = Math.PI * (0.10 * SIZE) ** 2;
  const candidates = components(cores, SIZE, SIZE, wellArea * 0.2).map((pixels) => {
    const flag = new Uint8Array(SIZE * SIZE);
    for (const i of pixels) flag[i] = 1;
    const d = distanceTransform(flag, SIZE, SIZE);
    let bi = -1;
    let bv = -1;
    for (const i of pixels) {
      if (d[i] > bv) {
        bv = d[i];
        bi = i;
      }
    }
    // A disc has area close to pi*r^2 for its inscribed radius; an arc or a
    // pair of merged wells is far larger than its inscribed disc.
    return { pixels, x: bi % SIZE, y: ((bi - (bi % SIZE)) / SIZE) | 0, radius: bv + OPEN,
      sprawl: pixels.length / (Math.PI * bv * bv) };
  });
  candidates.sort((a, b) => b.pixels.length - a.pixels.length);
  console.log(`spice regions in the tin interior (${candidates.length}):`);
  for (const c of candidates) {
    console.log(
      `  area ${String(c.pixels.length).padStart(7)}  inscribed r ${c.radius.toFixed(1).padStart(6)}px` +
        `  sprawl ${c.sprawl.toFixed(2)}  at ${((c.x / SIZE) * 100).toFixed(1)}%,${((c.y / SIZE) * 100).toFixed(1)}%`,
    );
  }
  // Disc-shaped regions of roughly the right size are wells. Five is enough to
  // pin a seven-fold ring, so a well that will not separate cleanly is not fatal.
  const kept = candidates.filter((c) => c.sprawl < 1.6 && c.radius > 0.06 * SIZE);
  console.log(`well-shaped regions kept: ${kept.length} of ${WELLS}`);
  if (kept.length < 5) {
    throw new Error(`only ${kept.length} wells separated cleanly — need at least 5 to fit the ring`);
  }

  const measured = kept.map((c) => {
    let r = 0;
    let g = 0;
    let b = 0;
    for (const i of c.pixels) {
      r += fin[i * 4];
      g += fin[i * 4 + 1];
      b += fin[i * 4 + 2];
    }
    const n = c.pixels.length;
    return {
      x: c.x,
      y: c.y,
      radius: c.radius,
      colour: [r / n, g / n, b / n].map(Math.round),
    };
  });

  const fit = fitRing(measured);
  const meanRadius = measured.reduce((s, p) => s + p.radius, 0) / measured.length;
  // Cap the hotspot radius short of half the gap between neighbouring wells, so
  // adjacent hotspots cannot overlap and every click is unambiguous.
  const neighbourGap = 2 * fit.R * Math.sin(Math.PI / WELLS);
  const radiusPct = (Math.min(meanRadius, neighbourGap * 0.46) / SIZE) * 100;

  // 4. identify which measured well is 12 o'clock turmeric, and report colours so
  //    a mismatched photo is obvious rather than silently mislabelled
  console.log(`source        ${SOURCE} ${W}x${H}`);
  console.log(`crop          ${side}x${side} at (${left},${top}) -> ${SIZE}x${SIZE}`);
  console.log(`asset         ${ASSET} ${Math.round(written.size / 1024)}kB`);
  console.log(
    `ring fit      centre ${((fit.cx / SIZE) * 100).toFixed(2)}%,${((fit.cy / SIZE) * 100).toFixed(2)}%  ` +
      `radius ${((fit.R / SIZE) * 100).toFixed(2)}%  rotation ${((fit.t0 * 180) / Math.PI).toFixed(2)}deg`,
  );
  console.log(
    `fit error     ${fit.rms.toFixed(1)}px = ${((fit.rms / SIZE) * 100).toFixed(2)}% of frame width`,
  );
  if (fit.rms / SIZE > 0.02) {
    throw new Error("ring fit error above 2% — the photograph is probably not a clean flat-lay");
  }
  console.log(`hotspot radius ${radiusPct.toFixed(2)}% (measured well ${((meanRadius / SIZE) * 100).toFixed(2)}%)`);
  console.log("wells, clockwise from 12 o'clock:");
  const bySlot = new Map(fit.assigned.map((a) => [a.slot, a]));
  if (bySlot.size !== fit.assigned.length) {
    throw new Error("two measured wells fell in the same ring slot — the fit is wrong");
  }
  for (let i = 0; i < WELLS; i++) {
    const a = bySlot.get(i);
    console.log(
      `  ${i} ${ORDER[i].slug.padEnd(13)} ${
        a
          ? `rgb(${String(a.colour).padEnd(15)}) drift ${a.drift.toFixed(1)}px`
          : "not separated, position from the ring".padEnd(38)
      }  expected ${ORDER[i].expect}`,
    );
  }

  const spots = ORDER.map((_, i) => {
    const a = bySlot.get(i);
    const m = fit.model(i);
    // Prefer the measured centre: the generated tin is not perfectly evenly
    // spaced, and the distance-transform centre is immune to spilled grains, so
    // it beats the symmetric model well by well. The ring is the fallback for a
    // well that could not be separated.
    return {
      slug: ORDER[i].slug,
      x: a ? a.x : m.x,
      y: a ? a.y : m.y,
      radius: a ? a.radius : meanRadius,
      source: a ? "measured" : "ring",
    };
  });

  // No hotspot may reach its neighbour's centre, or clicks near the boundary
  // would land on the wrong spice.
  const final = spots.map((s, i) => {
    let nearest = Infinity;
    spots.forEach((o, j) => {
      if (i !== j) nearest = Math.min(nearest, Math.hypot(s.x - o.x, s.y - o.y));
    });
    return {
      ...s,
      left: +((s.x / SIZE) * 100).toFixed(2),
      top: +((s.y / SIZE) * 100).toFixed(2),
      r: +((Math.min(s.radius, nearest * 0.46) / SIZE) * 100).toFixed(2),
    };
  });
  console.log("hotspots written:");
  for (const s of final) {
    console.log(
      `  ${s.slug.padEnd(13)} ${String(s.left).padStart(5)}%,${String(s.top).padStart(5)}%  r ${s.r}%  (${s.source})`,
    );
  }

  const body = `/**
 * Hotspot geometry for the masala dabba photograph.
 *
 * GENERATED by scripts/build-dabba.mjs — do not hand-edit. The numbers are
 * measured from the photograph, so they are only valid for the asset that
 * produced them. If the tin image changes, run \`npm run build:dabba\` again.
 *
 * Each centre is the middle of the largest disc that fits inside that well, as a
 * percentage of the image box. A seven-fold ring fitted to the same wells agrees
 * to within ${((fit.rms / SIZE) * 100).toFixed(2)}% of frame width, which is the check that the photograph is a
 * clean flat-lay. Order is clockwise from the 12 o'clock well and matches
 * \`wells\` in src/data/story.ts.
 */
/**
 * The filename carries a hash of the image contents, so replacing the photograph
 * changes the URL. Without that, Next's image optimizer keeps serving its cached
 * rendering of the old file, alpha channel included, and the change appears not
 * to have happened.
 */
export const DABBA_IMAGE = "/dabba/${path.basename(ASSET)}";

export type WellHotspot = {
  /** centre, as a percentage of the image box */
  left: number;
  top: number;
  /** radius, as a percentage of the image box width */
  radius: number;
};

export const wellHotspots: WellHotspot[] = [
${final
  .map((s) => `  { left: ${s.left}, top: ${s.top}, radius: ${s.r} }, // ${s.slug}`)
  .join("\n")}
];
`;
  writeFileSync(DATA, body);
  console.log(`wrote         ${DATA}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
