import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All catalog, brand and department imagery ships locally in /public,
    // written there by scripts/import-shopify.mjs. No remote patterns: the
    // site must keep working after the Shopify store is retired.
    formats: ["image/webp"],
  },
};

export default nextConfig;
