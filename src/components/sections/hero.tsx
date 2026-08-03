import Link from "next/link";
import { Glow } from "@/components/sections/glow";
import { Reveal } from "@/components/reveal";
import { Button, Display, HeroBadge, PullLine, Stat } from "@/components/ui";
import { brands } from "@/data/brands";
import { departments } from "@/data/departments";
import { site } from "@/data/site";

/** v7's opening statement (reference lines 46-69). */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-teal text-cream">
      <Glow />

      <div className="shell relative pt-[clamp(72px,9vw,132px)] pb-[clamp(56px,7vw,96px)]">
        <Reveal className="mb-[clamp(26px,3.5vw,40px)]">
          <HeroBadge>A masala house since {site.foundedYear}</HeroBadge>
        </Reveal>

        <Reveal delay={70}>
          <Display as="h1" size="hero" className="max-w-[15ch]">
            {site.tagline}
          </Display>
        </Reveal>

        <Reveal delay={140} className="mt-[clamp(24px,3vw,34px)]">
          <PullLine className="max-w-[24ch]">{site.pullLine}</PullLine>
        </Reveal>

        <Reveal delay={210} className="mt-[clamp(30px,4vw,44px)]">
          <p className="max-w-[58ch] text-[clamp(16px,1.45vw,19px)] leading-[1.72] text-cream/82">
            Shree Ganesh has been blending masala in Ahmedabad since{" "}
            {site.foundedYear}: {brands.length} house brands, made by us,
            shipped to our Brisbane warehouse and delivered to grocers,
            restaurants and caterers across Queensland. Trade only. No middlemen
            in between.
          </p>
        </Reveal>

        <Reveal
          delay={280}
          className="mt-[clamp(34px,4.5vw,48px)] flex flex-wrap items-center gap-3.5"
        >
          <Button href="/#apply" variant="red">
            Open a trade account
          </Button>
          <Link
            href="/#ch-1"
            className="border-b-2 border-gold px-1.5 py-4.5 text-[15px] font-bold text-cream transition-colors hover:text-gold"
          >
            Start at the beginning ↓
          </Link>
        </Reveal>

        <Reveal
          delay={350}
          className="mt-[clamp(48px,6vw,80px)] grid max-w-[900px] gap-[clamp(20px,3vw,44px)] border-t border-red/24 pt-[clamp(28px,3.5vw,40px)] [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]"
        >
          <Stat value={String(site.foundedYear)} label="Blending since" />
          <Stat value={String(brands.length)} label="House brands" />
          <Stat value={String(departments.length)} label="Departments" />
          <Stat value="1 day" label="Account approval" />
        </Reveal>
      </div>
    </section>
  );
}
