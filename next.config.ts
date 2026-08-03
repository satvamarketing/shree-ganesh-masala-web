import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All catalog, brand and department imagery ships locally in /public,
    // written there by scripts/import-shopify.mjs. No remote patterns: the
    // site must keep working after the Shopify store is retired.
    formats: ["image/webp"],
  },
  async redirects() {
    // Trade v7 folds these into the narrative home page and About, so the v5
    // routes 308 rather than 404 for anything already linking to them.
    return [
      { source: "/story", destination: "/about", permanent: true },
      { source: "/wholesale", destination: "/#apply", permanent: true },
    ];
  },
};

export default nextConfig;
