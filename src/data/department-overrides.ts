/**
 * Replacement cover images for specific departments.
 *
 * The imported Shopify collection images are mostly generic stock. Where the
 * client has asked for a different picture, the replacement is a real packshot
 * from the catalogue rather than sourced stock photography.
 *
 * Each replacement is a 2:1 composite of real packshots from that department,
 * built by scripts/build-department-covers.mjs. Matching the card's aspect ratio
 * means `cover` crops nothing, so these cards sit flush with the other 28
 * rather than reading as a different kind of image.
 */
export type DepartmentImageOverride = {
  image: string;
  fit: "cover" | "contain";
  /** Why this override exists, for whoever reads it next. */
  reason: string;
};

export const departmentImageOverrides: Record<string, DepartmentImageOverride> =
  {
    "instant-food": {
      image: "/departments/instant-food-trio.webp",
      fit: "cover",
      reason:
        "Client feedback: the stock tomato-soup photo was wrong for Indian instant food and they asked for idli, dosa or dhokla. This is the Shree Ganesh Dhokla Mix and Dosa Mix packs, both of which show the dish.",
    },
    "health-and-hygiene": {
      image: "/departments/health-and-hygiene-trio.webp",
      fit: "cover",
      reason:
        "Client feedback: replace the generic stock bathroom photo. These are three real lines from the department.",
    },
  };
