import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All catalog, brand and department imagery ships locally in /public,
    // written there by scripts/import-shopify.mjs. No remote patterns: the
    // site must keep working after the Shopify store is retired.
    formats: ["image/webp"],
  },
  async redirects() {
    // Old routes 308 rather than 404 for anything already linking to them.
    // Trade accounts were dropped in client round 2, so /wholesale now lands
    // on the contact page.
    return [
      { source: "/story", destination: "/about", permanent: true },
      { source: "/wholesale", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
