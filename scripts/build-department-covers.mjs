// Builds replacement department cover images from real product packshots.
//
//   node scripts/build-department-covers.mjs
//
// The imported Shopify collection images are mostly generic stock. Where the
// client asked for a different picture, the replacement is composed from real
// lines in that department instead of sourced stock photography.
//
// Output is 2:1 to match the department card frame, so `cover` crops nothing
// and these cards sit flush with the ones using imported collection images.
// Written to public/departments/*-trio.webp — deliberately a different filename
// from the imported covers, so re-running the Shopify import cannot clobber it.
import sharp from "sharp";

/** Packshots are shot on white, so the canvas is white and nothing mismatches. */
const BG = "#FFFFFF";
const WIDTH = 1200;
const HEIGHT = 600;
const PAD = 36;

const SETS = {
  "instant-food-trio": [
    "catalog/ganesh-dhokla-mix-400gx40.webp",
    "catalog/ganesh-dosa-mix-400gx40.webp",
  ],
  "health-and-hygiene-trio": [
    "catalog/aloe-vera-juice-500mlx30.webp",
    "catalog/ashwagandha-powder-200gx48.webp",
    "catalog/amla-powder-200gx20.webp",
  ],
};

for (const [name, files] of Object.entries(SETS)) {
  const count = files.length;
  const cell = Math.floor((WIDTH - PAD * (count + 1)) / count);

  const layers = [];
  for (let i = 0; i < count; i++) {
    // trim() removes each packshot's flat border so the product fills its cell.
    // Without it the products float small in the middle of their own padding.
    const buffer = await sharp(`public/${files[i]}`)
      .flatten({ background: BG })
      .trim({ threshold: 14 })
      .resize(cell, HEIGHT - PAD * 2, { fit: "inside", background: BG })
      .toBuffer();
    const { height } = await sharp(buffer).metadata();
    layers.push({
      input: buffer,
      left: PAD + i * (cell + PAD),
      top: Math.round((HEIGHT - height) / 2),
    });
  }

  const out = await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: BG },
  })
    .composite(layers)
    .webp({ quality: 88 })
    .toFile(`public/departments/${name}.webp`);

  console.log(
    `  ${name}.webp  ${out.width}x${out.height}  ${Math.round(out.size / 1024)}kB  (${count} products)`,
  );
}
