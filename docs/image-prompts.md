# Image generation prompts

For Chapter Two, "The Dabba". Two sets: one hero photo of the spice tin, and
seven matching spice close-ups.

The tin stays **interactive** — tapping a well changes the panel beside it — so
the hero image has geometry requirements. Read "Why the geometry matters" before
generating.

---

## Set A — the dabba (1 image)

### Why the geometry matters

Seven invisible circular hotspots sit on top of this photo, one per well. They
line up automatically if the tin is shot flat-on and centred. You do **not** need
to hit exact percentages: generate the best-looking image that follows the rules
below, send it over, and I measure the actual well centres from your file and
calibrate the hotspots to it.

The three rules that genuinely matter:

1. **Strictly top-down.** A true overhead flat-lay, lens square to the tin. No
   tilt, no perspective, no foreshortening. If the tin looks like an oval rather
   than a circle, the hotspots cannot line up.
2. **Seven wells, one even ring.** Seven equal round wells spaced evenly around a
   single ring, with the empty centre of the tin visible between them. Not six,
   not eight, and not a cluster.
3. **Centred and square.** Square image, tin centred, filling roughly 90% of the
   frame, nothing cropped.

### Spice order

Clockwise from the 12 o'clock well, so the photo matches the site's copy:

| Position | Spice | Looks like |
| --- | --- | --- |
| 12 o'clock | Turmeric (haldi) | vivid golden-yellow powder |
| next clockwise | Red chilli (lal mirch) | deep brick-red powder |
| next | Coriander-cumin (dhana jeeru) | pale khaki-tan powder |
| next | Cumin seed (jeeru) | whole mid-brown seeds, visibly seeds not powder |
| next | Mustard seed (rai) | tiny round near-black seeds |
| next | Asafoetida (hing) | pale sandy ochre powder |
| next | Garam masala | dark chocolate-brown powder |

### Prompt

```
A traditional Indian masala dabba photographed from directly overhead, perfectly
flat lay, lens square to the tin with no tilt and no perspective distortion.

A round brushed stainless steel spice box, lid removed, containing exactly seven
equal round steel wells arranged evenly in a single ring, with the empty base of
the tin visible in the centre between them. Each well is filled level and
generously with a different spice.

Clockwise from the top well: vivid golden turmeric powder; deep brick-red chilli
powder; pale khaki coriander-cumin powder; whole mid-brown cumin seeds; tiny
round near-black mustard seeds; pale sandy ochre asafoetida powder; dark
chocolate-brown garam masala powder.

The tin is centred in a square frame and fills about 90 percent of it, fully in
frame and not cropped. Soft even diffused daylight from above, gentle natural
shadow under the rim, no harsh specular glare on the steel. The spice surfaces
are slightly uneven and natural, with a few loose grains, not perfectly flat.

Background: plain warm off-white, flat and uncluttered.

Editorial food photography, sharp focus across the whole tin, high detail in the
powder texture, realistic colour.
```

### Negative prompt

```
tilted, angled, three-quarter view, perspective, oval, elliptical, cropped,
off-centre, six wells, eight wells, nine wells, wells touching, spices spilled
across the background, lid on, hands, spoons resting in the wells, text, labels,
watermark, logo, harsh reflections, blown highlights, dark moody lighting,
busy patterned background, wooden table grain, cloth, props
```

### Output

- Square, at least **2000 × 2000 px**
- **PNG with a transparent background** if your tool can do it. That is ideal:
  the section ground is a warm sand (`#F6EFE8`) and transparency lets the tin sit
  on it cleanly at any size.
- If transparency is not possible, a flat warm off-white close to `#F6EFE8` is
  the next best thing. Avoid pure white, which will show as a visible square.

### Useful spares

If it is cheap to generate extras, these help:

- The same tin **with the lid resting beside it**, same overhead framing. Nice
  for the About page.
- The same tin **empty**, same framing. A safety net if the filled version's
  colours fight the site palette.

---

## Set B — seven spice close-ups

One per well, shown beside the panel when that spice is selected. They must read
as a **matched set**, so generate all seven from the same template with only the
spice swapped. Same camera height, same light, same background, same crop.

### Template prompt

Replace `{{SPICE}}` and `{{DESCRIPTION}}` from the table below.

```
Overhead close-up of {{SPICE}} in a small round stainless steel spice well,
photographed from directly above, flat lay, lens square to the subject.

{{DESCRIPTION}}

The well is filled level and generously and sits centred in a square frame,
filling about 80 percent of it. A few loose grains scatter naturally on the
surface just outside the rim. Soft even diffused daylight from above, gentle
shadow under the rim, no harsh glare on the steel.

Background: plain warm off-white, flat and uncluttered.

Editorial food photography, macro detail in the texture, sharp focus, realistic
colour, shallow but even depth of field.
```

### The seven variants

| # | `{{SPICE}}` | `{{DESCRIPTION}}` |
| --- | --- | --- |
| 1 | turmeric powder | Vivid golden-yellow fine powder with a soft matte surface and a slight mound in the centre. |
| 2 | red chilli powder | Deep brick-red coarse powder, warm and slightly uneven, with visible fine flecks. |
| 3 | coriander-cumin blend (dhana jeeru) | Pale khaki-tan medium-ground powder, softly speckled, slightly coarser than flour. |
| 4 | whole cumin seeds | Whole mid-brown ridged seeds, clearly individual seeds rather than powder, catching a little light along their ridges. |
| 5 | whole black mustard seeds | Tiny perfectly round near-black seeds with a faint sheen, densely packed. |
| 6 | asafoetida powder (hing) | Pale sandy ochre fine powder, very slightly granular, matte. |
| 7 | garam masala powder | Dark chocolate-brown fine powder, warm-toned, with a few faint lighter flecks of ground spice. |

### Negative prompt (all seven)

```
tilted, angled, perspective, oval, cropped, off-centre, multiple wells, several
bowls, spice piled on bare wood or cloth, hands, spoons, text, labels, watermark,
logo, harsh reflections, blown highlights, dark moody lighting, busy background,
props, garnish, whole spices mixed into powders unless specified
```

### Output

- Square, at least **1200 × 1200 px** each
- Transparent PNG preferred again, otherwise flat warm off-white
- Name them so the spice is obvious: `spice-turmeric.png`,
  `spice-red-chilli.png`, `spice-dhana-jeeru.png`, `spice-cumin.png`,
  `spice-mustard.png`, `spice-hing.png`, `spice-garam-masala.png`

---

## Status: delivered and wired in

All eight images came back usable on the first pass, with the clockwise spice
order matching the site copy exactly.

The delivered tin photograph is kept at `assets-src/dabba-source.webp`. It is the
input to **`npm run build:dabba`**, which writes both the asset
(`public/dabba/dabba.<hash>.webp`) and the hotspot geometry (`src/data/dabba.ts`). Run
that after replacing the photograph; never hand-edit the generated numbers. The
seven spice close-ups need no processing and sit in `public/dabba/spice-*.webp`.

### What the script does, and the three things that went wrong first

**Background removal is a flood fill, not a circular mask.** The tin fills only
about 85% of the source frame, so masking to the frame's inscribed circle leaves
a ring of the photo's own off-white ground. At `#EFE9E2` against the section's
`#F6EFE8` that is a difference of about 7 RGB units across a large area, which
reads as a pale box behind the tin: the exact complaint the mask was meant to
fix. The fill instead starts at the four corners and steps only where luminance
changes by less than 5, so it walks down the soft drop shadow (a smooth gradient)
and stops dead at the tin's silhouette. The tin's shadow goes with the
background, so the tin is grounded with a CSS `drop-shadow` instead.

**Well centres come from a distance transform, not a centroid.** The prompt asks
for a few loose grains around each well because it looks real, and those spills
drag a centroid outward by a few percent. The centre of the largest disc that
fits inside a well ignores thin spills completely.

**Two sharp edges do not make a fit.** The wells sit almost tangent to the tin
wall, so an edge-detection fit for the tin's rim mixes well rims with the wall
and lands 6% out. Segmenting the background and taking its complement has no such
ambiguity.

The script prints each well's mean colour beside the colour the copy claims, so a
photograph whose spices are in a different order fails visibly rather than
silently mislabelling seven products. It also fits a symmetric seven-fold ring as
a **cross-check** and aborts if the measured wells disagree with it by more than
2% of frame width, which is what would happen if the tin were shot at an angle.
For the delivered photo the two agree to 1.28%, and the measured centres are used
because a generated tin is not perfectly evenly spaced.

### Verified

All seven wells select the right spice by click, by arrow key and by touch at a
390px viewport, where the tap targets come out 81px. The ground at the four
corners of the image box matches the surrounding section exactly (delta 0) at
1280, 1600 and 2000px wide.

One trap worth knowing: Next's image optimizer caches by request URL, and a file
in `public/` keeps its URL when its contents change. Replacing an asset in place
therefore leaves the **old** rendering being served, alpha channel included, and
`next build` does not clear it. `scripts/verify-pages.mjs` now removes
`.next/cache/images` before it checks anything.
