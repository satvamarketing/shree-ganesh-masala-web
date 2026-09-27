import type { Metadata } from "next";
import Image from "next/image";
import { BrandTile } from "@/components/brand-tile";
import { Reveal } from "@/components/reveal";
import { CertBadges } from "@/components/sections/cert-badges";
import { ContactBlock } from "@/components/sections/contact-block";
import { WhatWeDo } from "@/components/sections/what-we-do";
import { Display, Eyebrow } from "@/components/ui";
import { brands } from "@/data/brands";
import { images } from "@/data/images";
import { aboutFounder, vision, whyChooseUs } from "@/data/story";

export const metadata: Metadata = {
  title: "About Us",
  description:
    'Founded by Shri Vrajlal Manilal Shah, who introduced "Shree Ganesh Masala" in 1969. Quality has been our guiding force ever since.',
  alternates: { canonical: "/about" },
};

/**
 * About, restructured in client round 2 after Sagoon Group's About page: page
 * title, the welcome and founder story beside a photograph, what we do, then
 * vision, why choose us and the brands. Copy is the original site's, tightened.
 */
export default function AboutPage() {
  // The founder portrait when the client supplies it; the spice photograph
  // until then, never an empty panel.
  const photo = images.founder.src ? images.founder : images.spiceSpoons;

  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="shell py-[clamp(40px,4.5vw,64px)]">
          <Eyebrow className="mb-3.5">About us</Eyebrow>
          <h1 className="font-serif text-[clamp(38px,4.6vw,62px)] leading-[1.06] font-normal text-ink">
            Welcome to Shree Ganesh
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="shell grid items-start gap-[clamp(30px,4vw,64px)] py-[clamp(48px,5vw,80px)] md:grid-cols-[1fr_1.2fr]">
          <Reveal className="relative aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-[24px] bg-sand-deep md:sticky md:top-24">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 520px"
              className="object-cover"
            />
          </Reveal>

          <div>
            <Reveal delay={140}>
              <p className="text-[clamp(16px,1.1vw,17.5px)] leading-[1.8] text-ink-deep">
                {aboutFounder[0]}
              </p>
            </Reveal>

            <Reveal delay={210}>
              <blockquote className="my-[clamp(26px,3vw,36px)] border-l-[3px] border-gold pl-[clamp(20px,2.6vw,30px)]">
                <p className="font-serif text-[clamp(26px,3vw,38px)] leading-[1.25] text-ink">
                  Health Is Wealth.
                </p>
                <cite className="mt-3 block text-[13px] font-bold tracking-[1.6px] text-faint uppercase not-italic">
                  Our golden words
                </cite>
              </blockquote>
            </Reveal>

            {aboutFounder.slice(1).map((para, i) => (
              <Reveal key={i} delay={280 + i * 70} className={i > 0 ? "mt-6" : ""}>
                <p className="text-[clamp(16px,1.1vw,17.5px)] leading-[1.8] text-ink-deep">
                  {para}
                </p>
              </Reveal>
            ))}

            <Reveal
              delay={420}
              className="mt-[clamp(28px,3.2vw,40px)] rounded-[22px] border border-line bg-sand p-[clamp(24px,3vw,36px)]"
            >
              <Eyebrow className="mb-3.5">Our Vision</Eyebrow>
              <p className="text-[clamp(15.5px,1vw,17px)] leading-[1.78] text-body">
                {vision}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <WhatWeDo />

      <section className="bg-white">
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

      <section className="bg-sand">
        <div className="shell py-[clamp(44px,5vw,68px)]">
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
              <BrandTile key={b.slug} brand={b} />
            ))}
          </Reveal>
        </div>
      </section>

      <CertBadges />
      <ContactBlock />
    </>
  );
}
