import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Tag, Truck } from "lucide-react";
import { BrandTile } from "@/components/brand-tile";
import { DepartmentCard } from "@/components/department-card";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { BannerSlider } from "@/components/sections/banner-slider";
import { CertBadges } from "@/components/sections/cert-badges";
import { ContactBlock } from "@/components/sections/contact-block";
import { WhatWeDo } from "@/components/sections/what-we-do";
import { Button, Display } from "@/components/ui";
import { brands } from "@/data/brands";
import { products } from "@/data/catalog";
import { departments } from "@/data/departments";
import { images } from "@/data/images";
import { site } from "@/data/site";
import { benefits, showcase, welcome, whyChooseUs } from "@/data/story";
import { pickShowcase } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "Shree Ganesh Masala Since 1969",
  description: site.description,
  alternates: { canonical: "/" },
};

const BENEFIT_ICONS = [Truck, BadgeCheck, Tag] as const;

/** The eight biggest aisles, for the "shop by department" grid. */
const TOP_DEPARTMENTS = [...departments]
  .sort((a, b) => b.count - a.count)
  .slice(0, 8);

const SHOWCASE_ROWS = showcase.map((row) => ({
  ...row,
  items: pickShowcase(products, row.department, row.prefer),
}));

/**
 * The home page, restructured in client round 2 after Sagoon Group: banner
 * slider, who we are, what we do, then the products, which are the main focus.
 * v7's five-chapter narrative, the trade-account band and everything built
 * around trade accounts are gone.
 */
export default function HomePage() {
  const photo = images.spiceSpoons;

  return (
    <>
      <h1 className="sr-only-label">
        {site.name}: masalas, spices and instant mixes since{" "}
        {site.foundedYear}
      </h1>

      <BannerSlider />

      {/* ------------------------------ Benefits ----------------------------- */}
      <section className="border-b border-line bg-white">
        <ul className="shell grid gap-x-8 gap-y-5 py-[clamp(24px,3vw,34px)] sm:grid-cols-3">
          {benefits.map((b, i) => {
            const Icon = BENEFIT_ICONS[i];
            return (
              <li key={b.title} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sand text-red">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[15.5px] font-bold text-ink">
                    {b.title}
                  </span>
                  <span className="block text-[14px] text-muted">{b.body}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ----------------------------- Who we are ---------------------------- */}
      <section className="bg-white">
        <div className="shell grid items-center gap-[clamp(30px,4vw,64px)] py-[clamp(48px,5vw,80px)] md:grid-cols-[1fr_1.15fr]">
          <Reveal className="relative aspect-[4/5] max-h-[520px] w-full overflow-hidden rounded-[24px] bg-sand-deep">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 520px"
              className="object-cover"
            />
          </Reveal>
          <div>
            <Reveal>
              <Display className="mb-[clamp(20px,2.4vw,28px)] max-w-[18ch] text-ink">
                Welcome to Shree Ganesh
              </Display>
            </Reveal>
            {welcome.map((para, i) => (
              <Reveal key={i} delay={140 + i * 70}>
                <p className="mb-5 max-w-[58ch] text-[clamp(15.5px,1vw,17px)] leading-[1.75] text-body">
                  {para}
                </p>
              </Reveal>
            ))}
            <Reveal delay={280} className="mt-3">
              <Button href="/about" variant="outlineDark">
                About us
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      <WhatWeDo />

      {/* ------------------------------ Products ----------------------------- */}
      <section className="bg-white">
        <div className="shell py-[clamp(48px,5vw,80px)]">
          <Reveal>
            <Display className="mb-[clamp(36px,4vw,56px)] text-ink">
              Our Products
            </Display>
          </Reveal>

          <div className="grid gap-[clamp(44px,5vw,68px)]">
            {SHOWCASE_ROWS.filter((row) => row.items.length > 0).map((row) => (
              <Reveal key={row.department}>
                <div className="mb-[clamp(18px,2vw,24px)] flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
                  <div>
                    <h3 className="font-serif text-[clamp(24px,2.4vw,32px)] leading-[1.15] font-normal text-ink">
                      {row.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] text-muted">{row.blurb}</p>
                  </div>
                  <Link
                    href={`/range?department=${row.department}`}
                    className="text-[14.5px] font-bold whitespace-nowrap text-red hover:text-red-dark"
                  >
                    View all {row.title.toLowerCase()} →
                  </Link>
                </div>
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr))]">
                  {row.items.map((product) => (
                    <ProductCard key={product.handle} product={product} />
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- Departments --------------------------- */}
      <section className="bg-sand">
        <div className="shell py-[clamp(48px,5vw,76px)]">
          <div className="mb-[clamp(28px,3.2vw,40px)] flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <Display className="text-ink">All Departments</Display>
            </Reveal>
            <Reveal delay={70}>
              <Button href="/departments" variant="outlineDark">
                All {departments.length} departments
              </Button>
            </Reveal>
          </div>
          <Reveal
            delay={140}
            className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))]"
          >
            {TOP_DEPARTMENTS.map((department) => (
              <DepartmentCard key={department.slug} department={department} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- Brands ------------------------------ */}
      <section className="bg-white">
        <div className="shell py-[clamp(48px,5vw,76px)]">
          <Reveal>
            <Display className="mb-[clamp(28px,3.2vw,40px)] text-ink">
              Our Brands
            </Display>
          </Reveal>
          <Reveal
            delay={140}
            className="grid gap-[clamp(14px,2vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr))]"
          >
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/range?brand=${encodeURIComponent(b.name)}`}
                aria-label={`Browse ${b.name}`}
                className="block rounded-2xl transition-transform hover:-translate-y-1"
              >
                <BrandTile brand={b} />
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- Why choose us -------------------------- */}
      <section className="bg-sand">
        <div className="shell py-[clamp(48px,5vw,76px)]">
          <Reveal>
            <Display className="mb-[clamp(24px,3vw,36px)] text-ink">
              Why Choose Us
            </Display>
          </Reveal>
          <Reveal
            delay={140}
            className="grid gap-[clamp(20px,2.5vw,30px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]"
          >
            {whyChooseUs.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="text-[16.5px] leading-[1.8] text-ink-deep"
              >
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <CertBadges />
      <ContactBlock />
    </>
  );
}
