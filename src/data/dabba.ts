/**
 * Calibration for the photographed masala dabba.
 *
 * The tin is a real photograph (public/dabba/dabba.webp) with seven invisible
 * hotspots laid over its wells, so tapping a well still selects that spice.
 *
 * These numbers are measured from the image, not assumed. Five of the seven
 * wells flood-filled cleanly; a symmetric seven-fold ring was then fitted to
 * those five and used for all seven, which is more accurate than per-well
 * centroids because the loose spilled grains in the photo pull a centroid
 * outward. RMS fit error is 1.0% of the frame width.
 *
 * All values are percentages of the image's width and height. If the photo is
 * ever replaced, re-measure rather than hand-editing: the fit is sensitive to
 * how the tin is cropped.
 *
 * Order matches `wells` in src/data/story.ts, clockwise from the twelve
 * o'clock well.
 */
export type WellHotspot = {
  /** Centre, as a percentage of image width. */
  left: number;
  /** Centre, as a percentage of image height. */
  top: number;
  /** Radius, as a percentage of image width. */
  radius: number;
};

export const DABBA_IMAGE = "/dabba/dabba.webp";

export const wellHotspots: WellHotspot[] = [
  // 0: turmeric
  { left: 51.75, top: 19.26, radius: 11.88 },
  // 1: red-chilli
  { left: 73.75, top: 30.12, radius: 11.88 },
  // 2: dhana-jeeru
  { left: 78.98, top: 54.08, radius: 11.88 },
  // 3: cumin
  { left: 63.5, top: 73.12, radius: 11.88 },
  // 4: mustard
  { left: 38.97, top: 72.88, radius: 11.88 },
  // 5: hing
  { left: 23.86, top: 53.56, radius: 11.88 },
  // 6: garam-masala
  { left: 29.55, top: 29.69, radius: 11.88 },
];
