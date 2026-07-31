import type { Metadata } from "next";
import Link from "next/link";
import { BrandCard } from "@/components/brand-card";
import { DepartmentCard } from "@/components/department-card";
import { Marquee } from "@/components/marquee";
import { ProductCard } from "@/components/product-card";
import { CertBadges } from "@/components/sections/cert-badges";
import { CtaBand } from "@/components/sections/cta-band";
import { FeaturePanel } from "@/components/sections/feature-panel";
import { Hero } from "@/components/sections/hero";
import { Button, SectionHeading } from "@/components/ui";
import { brands } from "@/data/brands";
import { products } from "@/data/catalog";
import { departments } from "@/data/departments";
import { images } from "@/data/images";

export const metadata: Metadata = {
  title: "Wholesale Indian Pantry Staples, Brisbane",
  description:
    "Six house brands made in Ahmedabad plus 30 departments of Indian pantry staples, supplied by the carton to grocers, restaurants and caterers across Queensland.",
  alternates: { canonical: "/" },
};

/** The six biggest departments lead the range grid. */
const topDepartments = [...departments]
  .sort((a, b) => b.count - a.count)
  .slice(0, 6);

/**
 * Four house-brand lines with both a packshot and a carton quantity, one per
 * title and one per department — otherwise the row fills with the same product
 * in several sizes ("Ajwain 200g", "Ajwain 454g") and reads as thin.
 */
const bestSellers = (() => {
  const seenTitle = new Set<string>();
  const seenDepartment = new Set<string>();
  const picked = [];
  for (const p of products) {
    if (!p.isHouseBrand || !p.image || !p.unitsPerCarton) continue;
    const department = p.departments[0] ?? "";
    if (seenTitle.has(p.title) || seenDepartment.has(department)) continue;
    seenTitle.add(p.title);
    seenDepartment.add(department);
    picked.push(p);
    if (picked.length === 4) break;
  }
  return picked;
})();

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />

      <section className="shell pt-[clamp(64px,8vw,104px)] pb-[clamp(30px,4vw,50px)]">
        <SectionHeading
          eyebrow="Our Range"
          title="Everything for the Indian kitchen"
          action={{ href: "/range", label: "See all products" }}
        />
        {/* Explicit columns rather than auto-fit: with exactly six cards,
            auto-fit lands on 5+1 at desktop widths, which reads as a mistake. */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topDepartments.map((department) => (
            <DepartmentCard key={department.slug} department={department} />
          ))}
        </div>
      </section>

      <FeaturePanel
        eyebrow="The Masala Range"
        title="Ground in small batches, never bulk-blended"
        body="Whole spices roasted and milled to order, so the oils are still in the powder when it reaches your kitchen. Tea masala, garam masala, dabeli, pav bhaji, chaat — the blends your family actually cooks with."
        image={images.masalaFeature}
        actions={
          <>
            <Button href="/range?department=herbs-and-spices" variant="gold">
              Shop masalas
            </Button>
            <Link
              href="/departments"
              className="border-b-2 border-gold px-2 py-4 text-[15px] font-bold text-[#F2F7EF] hover:text-gold"
            >
              Browse departments →
            </Link>
          </>
        }
      />

      <section className="shell py-[clamp(24px,3vw,40px)]">
        <SectionHeading
          eyebrow="Our Brands"
          title={`${brands.length} labels, one family`}
          align="center"
        />
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
          {brands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </section>

      <section className="shell py-[clamp(40px,5vw,64px)]">
        <SectionHeading
          eyebrow="Best Sellers"
          title="What everyone's buying"
          action={{ href: "/range", label: "Shop the range" }}
        />
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {bestSellers.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

      <FeaturePanel
        tone="cream"
        reverse
        eyebrow="Our Story"
        title="A family masala house that moved to Queensland"
        image={images.pickleFeature}
        /* The jars sit on the banner's right; the left is logo and lettering. */
        imageClassName="object-right"
        body={
          <>
            <p className="mb-4">
              Shree Ganesh began in Ahmedabad, blending masalas for neighbours
              who knew exactly what good chai tasted like. Every product is
              still manufactured there — ground, blended and packed at our
              facility in Ahmedabad — then shipped to our Brisbane warehouse for
              distribution.
            </p>
            <p>
              We make what we sell, we test every batch, and we don&apos;t cut
              the fill weights. That&apos;s the whole policy.
            </p>
          </>
        }
        actions={
          <Button href="/story" variant="ink">
            Read our story
          </Button>
        }
      />

      <CtaBand />
      <CertBadges />
    </>
  );
}
