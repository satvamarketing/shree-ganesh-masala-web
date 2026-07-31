import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "monthly" },
    { url: absoluteUrl("/range"), priority: 0.9, changeFrequency: "weekly" },
    { url: absoluteUrl("/departments"), priority: 0.9, changeFrequency: "monthly" },
    { url: absoluteUrl("/wholesale"), priority: 0.9, changeFrequency: "monthly" },
    { url: absoluteUrl("/story"), priority: 0.7, changeFrequency: "yearly" },
    { url: absoluteUrl("/contact"), priority: 0.7, changeFrequency: "yearly" },
  ];

  return [
    ...pages,
    ...products.map((p) => ({
      url: absoluteUrl(`/range/${p.handle}`),
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
  ];
}
