import type { Metadata } from "next";
import Image from "next/image";
import { BrandTile } from "@/components/brand-tile";
import { Reveal } from "@/components/reveal";
import { Apply } from "@/components/sections/apply";
import { CertBadges } from "@/components/sections/cert-badges";
import { Glow } from "@/components/sections/glow";
import {
  DesignedPanel,
  Display,
  Eyebrow,
  HeroBadge,
  PullLine,
} from "@/components/ui";
import { brands } from "@/data/brands";
import { images } from "@/data/images";
import { site } from "@/data/site";
import {
  aboutFounder,
  aboutPhotos,
  vision,
  whyChooseUs,
} from "@/data/story";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Shree Ganesh began in Ahmedabad in 1969, when Shri Vrajlal Manilal Shah set a standard he called Quality Vision. Six brands later, it still decides what goes in the packet.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const founder = images.founder;

  return (
    <>
      <section className="relative overflow-hidden bg-white text-ink">
        <Glow opacity={0.38} />
        <div className="shell relative grid items-center gap-[clamp(30px,3.6vw,56px)] py-[clamp(48px,5vw,80px)] lg:grid-cols-2">
          <div>
            <Reveal className="mb-7.5">
              <HeroBadge>About us</HeroBadge>
            </Reveal>
            <Reveal delay={70}>
              <Display
                as="h1"
                size="hero"
                className="mb-6.5 max-w-[16ch] text-[clamp(38px,5.4vw,76px)]! leading-[1.04]!"
              >
                Welcome to Shree Ganesh
              </Display>
            </Reveal>
            <Reveal delay={140}>
              <PullLine className="max-w-[26ch] text-[clamp(20px,2.4vw,30px)]! leading-[1.4]!">
                One standard, set in {site.foundedYear}, still deciding what goes
                in the packet.
              </PullLine>
            </Reveal>
          </div>

          <Reveal delay={210} className="flex min-w-0 justify-center">
            <div className="h-[clamp(340px,42vw,480px)] w-full max-w-[400px] overflow-hidden rounded-[24px] border border-line bg-sand">
              {founder.src ? (
                <Image
                  src={founder.src}
                  alt={founder.alt}
                  width={800}
                  height={1000}
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <DesignedPanel label={founder.alt} />
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-[820px] px-[clamp(20px,4vw,40px)] py-[clamp(48px,5vw,76px)]">
          <Reveal>
            <Eyebrow className="mb-7">The founder</Eyebrow>
          </Reveal>

          <Reveal delay={70}>
            <p className="mb-7.5 text-[clamp(16px,1.1vw,17.5px)] leading-[1.8] text-ink-deep">
              {aboutFounder[0]}
            </p>
          </Reveal>

          <Reveal delay={140}>
            <blockquote className="my-[clamp(28px,3.2vw,40px)] border-l-[3px] border-gold pl-[clamp(22px,3vw,34px)]">
              <p className="font-serif text-[clamp(26px,3.4vw,42px)] leading-[1.25] text-ink">
                Health Is Wealth.
              </p>
              <cite className="mt-3.5 block text-[13px] font-bold tracking-[1.6px] text-faint uppercase not-italic">
                The golden words we still cook by
              </cite>
            </blockquote>
          </Reveal>

          {aboutFounder.slice(1).map((para, i) => (
            <Reveal key={i} delay={210 + i * 70}>
              <p
                className={`text-[clamp(16px,1.1vw,17.5px)] leading-[1.8] text-ink-deep ${
                  i === aboutFounder.length - 2 ? "" : "mb-7.5"
                }`}
              >
                {para}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand text-ink">
        <div className="shell max-w-[860px] py-[clamp(44px,5vw,70px)]">
          {/* "Our Mission" removed on client feedback; Vision stands alone. */}
          {[{ label: "Our Vision", body: vision }].map((block, i) => (
            <Reveal
              key={block.label}
              delay={i * 70}
              className="rounded-[22px] border border-line bg-white p-[clamp(28px,3.4vw,44px)]"
            >
              <Eyebrow className="mb-4.5">
                {block.label}
              </Eyebrow>
              <p className="text-[clamp(15.5px,1vw,17px)] leading-[1.78] text-body">
                {block.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-sand">
        <div className="shell py-[clamp(48px,5vw,76px)]">
          <Reveal>
            <Eyebrow className="mb-4">Why choose us</Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <Display
              size="section"
              className="mb-[clamp(30px,3.4vw,44px)] max-w-[22ch] text-[clamp(30px,4.2vw,56px)]! text-ink"
            >
              100% customer satisfaction is the whole objective.
            </Display>
          </Reveal>

          <Reveal
            delay={140}
            className="mb-[clamp(36px,4vw,52px)] grid gap-[clamp(20px,2.5vw,30px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]"
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

          <Reveal
            delay={210}
            className="grid gap-[clamp(16px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]"
          >
            {aboutPhotos.map((photo) => {
              const slot = images[photo.slot];
              return (
                <div key={photo.title} className="min-w-0">
                  <div className="h-[clamp(220px,26vw,300px)] overflow-hidden rounded-[20px] bg-sand-deep">
                    {slot.src ? (
                      <Image
                        src={slot.src}
                        alt={slot.alt}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <DesignedPanel label={slot.alt} />
                    )}
                  </div>
                  <div className="mt-3.5 text-[15.5px] font-bold text-ink">
                    {photo.title}
                  </div>
                  <div className="mt-1 text-[14px] leading-[1.6] text-muted">
                    {photo.caption}
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="bg-white text-ink">
        <div className="shell py-[clamp(44px,5vw,68px)]">
          <Reveal>
            <Eyebrow className="mb-4">
              The family of brands
            </Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <Display
              size="section"
              className="mb-[clamp(32px,4vw,46px)] max-w-[24ch]"
            >
              {brands.length} brands, one house, one standard.
            </Display>
          </Reveal>
          <Reveal
            delay={140}
            className="grid gap-[clamp(14px,2vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr))]"
          >
            {brands.map((b) => (
              <BrandTile key={b.slug} brand={b} bordered={false} />
            ))}
          </Reveal>
        </div>
      </section>

      <CertBadges />
      <Apply />
    </>
  );
}
