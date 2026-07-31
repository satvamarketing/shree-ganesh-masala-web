import type { Product } from "@/data/catalog";
import { site } from "@/data/site";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const address = {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.suburb,
    addressRegion: site.address.state,
    postalCode: site.address.postcode,
    addressCountry: site.address.country,
  };

  const sameAs = [site.social.facebook, site.social.instagram].filter(
    (u) => u !== "",
  );

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: site.legalName,
            alternateName: site.name,
            url: SITE_URL,
            logo: absoluteUrl("/logo/shree-ganesh.webp"),
            email: site.email,
            telephone: site.phone,
            foundingDate: String(site.foundedYear),
            description: site.description,
            address,
            // Omitted entirely while no real profiles are known — the live
            // site's only social link is an unreplaced Shopify default.
            ...(sameAs.length > 0 ? { sameAs } : {}),
          },
          {
            "@type": "LocalBusiness",
            "@id": `${SITE_URL}/#warehouse`,
            name: site.legalName,
            url: SITE_URL,
            image: absoluteUrl("/logo/shree-ganesh.webp"),
            email: site.email,
            telephone: site.phone,
            address,
            parentOrganization: { "@id": `${SITE_URL}/#organization` },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:30",
                closes: "15:30",
              },
            ],
          },
        ],
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        ...(product.image ? { image: absoluteUrl(product.image) } : {}),
        brand: { "@type": "Brand", name: product.brand },
        ...(product.description ? { description: product.description } : {}),
        ...(product.size ? { size: product.size } : {}),
        url: absoluteUrl(`/range/${product.handle}`),
        // No `offers` block: this is a wholesale catalog with no public
        // pricing, and a fabricated offer would be a false claim to search
        // engines. See spec §11.
      }}
    />
  );
}
