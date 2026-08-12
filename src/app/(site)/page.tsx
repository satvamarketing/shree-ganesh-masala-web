import type { Metadata } from "next";
import { BrandTile } from "@/components/brand-tile";
import { ChapterRail } from "@/components/chapter-rail";
import { Reveal } from "@/components/reveal";
import { Ticker } from "@/components/ticker";
import { Apply } from "@/components/sections/apply";
import { CertBadges } from "@/components/sections/cert-badges";
import { FestivalCountdown } from "@/components/sections/festival-countdown";
import { Hero } from "@/components/sections/hero";
import { SpiceTin } from "@/components/sections/spice-tin";
import { TradeSchool } from "@/components/sections/trade-school";
import { Trending } from "@/components/sections/trending";
import { Button, ChapterNumeral, Display, Eyebrow } from "@/components/ui";
import { brands } from "@/data/brands";
import { departments } from "@/data/departments";
import { site } from "@/data/site";
import {
  houseCards,
  rhythmDays,
  sampleTin,
  withOneAccount,
  withoutUs,
} from "@/data/story";

export const metadata: Metadata = {
  title: "A Masala House Since 1969",
  description: site.description,
  alternates: { canonical: "/" },
};

const CHAPTER = "relative overflow-hidden";
const CHAPTER_INNER = "shell relative py-[clamp(48px,5vw,76px)]";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <ChapterRail />

      {/* ---------------------------- 01 The house --------------------------- */}
      <section id="ch-1" className={`${CHAPTER} bg-white`}>
        <ChapterNumeral numeral="01" side="right" tone="light" />
        <div className={CHAPTER_INNER}>
          <Reveal>
            <Eyebrow className="mb-4">Chapter One · The House</Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <Display className="mb-[clamp(22px,2.6vw,30px)] max-w-[20ch] text-ink">
              Wholesale is a race to the cheapest carton. We&apos;re not in that
              race.
            </Display>
          </Reveal>
          <Reveal delay={140}>
            <p className="mb-[clamp(32px,3.6vw,48px)] max-w-[62ch] text-[clamp(15.5px,1vw,17px)] leading-[1.75] text-body">
              In 1969 our founder, Shri Vrajlal Manilal Shah, called his
              standard{" "}
              <em className="font-serif text-ink italic">Quality Vision</em>. He
              was the first in the market to see where ready masala was going,
              and he refused to let volume dictate the blend. Fifty-seven years
              on, that is still the only reason to choose us over a cheaper
              pallet: what&apos;s actually in the packet.
            </p>
          </Reveal>
          <Reveal
            delay={210}
            className="grid gap-[clamp(16px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]"
          >
            {houseCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[20px] border border-line bg-sand p-[clamp(26px,3vw,36px)]"
              >
                <div className="mb-3 font-serif text-[26px] text-red">
                  {card.title}
                </div>
                <p className="text-[15.5px] leading-[1.7] text-body">
                  {card.body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- 02 The dabba --------------------------- */}
      <section
        id="ch-2"
        className={`${CHAPTER} bg-sand text-ink`}
       
      >
        <ChapterNumeral numeral="02" side="left" tone="dark" />
        <div className={CHAPTER_INNER}>
          <Reveal>
            <Eyebrow tone="gold" className="mb-4">
              Chapter Two · The Dabba
            </Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <Display className="mb-[clamp(20px,2.4vw,28px)] max-w-[22ch]">
              Every Indian kitchen already has a spice tin.
            </Display>
          </Reveal>
          <Reveal delay={140}>
            <p className="mb-[clamp(36px,4vw,52px)] max-w-[60ch] text-[clamp(15.5px,1vw,17px)] leading-[1.75] text-cream/80">
              Seven wells, one lid, always within reach of the stove. Your
              customers don&apos;t need convincing that it matters, because they
              grew up with it. Our job is to be what&apos;s inside it. Tap a
              well.
            </p>
          </Reveal>
          <Reveal delay={210}>
            <SpiceTin />
          </Reveal>
        </div>
      </section>

      {/* --------------------------- 03 Trade school -------------------------- */}
      <section id="ch-3" className={`${CHAPTER} bg-sand`}>
        <ChapterNumeral numeral="03" side="right" tone="sand" />
        <div className={CHAPTER_INNER}>
          <Reveal>
            <Eyebrow tone="redDeep" className="mb-4">
              Chapter Three · Trade School
            </Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <Display className="mb-[clamp(20px,2.4vw,28px)] max-w-[22ch] text-ink">
              What we know about spice, you can sell with.
            </Display>
          </Reveal>
          <Reveal delay={140}>
            <p className="mb-[clamp(30px,3.4vw,44px)] max-w-[60ch] text-[clamp(15.5px,1vw,17px)] leading-[1.75] text-body">
              Fifty-seven years of grinding teaches you things a distributor
              never learns. We hand them over, because a grocer who can answer
              these questions at the counter sells more than one who can&apos;t.
            </p>
          </Reveal>
          <Reveal delay={210}>
            <TradeSchool />
          </Reveal>
          <Reveal
            delay={280}
            className="mt-[clamp(28px,3.2vw,38px)] flex flex-wrap items-center gap-4"
          >
            <Button href="/#apply" variant="ink">
              Get the trade pack
            </Button>
            <span className="text-[14.5px] text-muted">
              Blend sheets, shelf-life guides and counter cards, free with every
              account.
            </span>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- 04 The rhythm --------------------------- */}
      <section
        id="ch-4"
        className={`${CHAPTER} bg-red text-white`}
       
      >
        <ChapterNumeral numeral="04" side="left" tone="dark" />
        <div className={CHAPTER_INNER}>
          <Reveal>
            <Eyebrow tone="gold" className="mb-4">
              Chapter Four · The Rhythm
            </Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <Display className="mb-[clamp(20px,2.4vw,28px)] max-w-[20ch]">
              Order Monday. Shelved Wednesday. Every week.
            </Display>
          </Reveal>
          <Reveal delay={140}>
            <p className="mb-[clamp(44px,5.5vw,62px)] max-w-[58ch] text-[clamp(15.5px,1vw,17px)] leading-[1.75] text-cream/80">
              Restocking shouldn&apos;t be a phone call you dread. It should be a
              rhythm you stop thinking about: the same three days, the same
              driver, the same shelf full on Wednesday morning.
            </p>
          </Reveal>

          <Reveal
            delay={210}
            className="mb-[clamp(40px,4.5vw,60px)] grid gap-[clamp(14px,1.8vw,20px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr))]"
          >
            {rhythmDays.map((d) => (
              <div
                key={d.day}
                className="rounded-[18px] border border-red/25 bg-cream/7 p-[clamp(22px,2.6vw,30px)]"
              >
                <div className="mb-3 text-[11.5px] font-extrabold tracking-[1.8px] text-gold uppercase">
                  {d.day}
                </div>
                <div className="mb-2 font-serif text-[23px]">{d.title}</div>
                <p className="text-[14.5px] leading-[1.65] text-cream/72">
                  {d.body}
                </p>
              </div>
            ))}
            <div className="rounded-[18px] bg-red p-[clamp(22px,2.6vw,30px)] text-white">
              <div className="mb-3 text-[11.5px] font-extrabold tracking-[1.8px] uppercase">
                {sampleTin.day}
              </div>
              <div className="mb-2 font-serif text-[23px]">
                {sampleTin.title}
              </div>
              <p className="text-[14.5px] leading-[1.65]">{sampleTin.body}</p>
            </div>
          </Reveal>

          <Reveal className="border-t border-red/25 pt-[clamp(28px,3.2vw,40px)]">
            <div className="mb-[clamp(24px,3vw,34px)] flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow tone="gold" className="mb-3 tracking-[2.2px]">
                  The other rhythm
                </Eyebrow>
                <h3 className="max-w-[24ch] font-serif text-[clamp(24px,2.8vw,36px)] font-normal">
                  The festival calendar decides your best months.
                </h3>
              </div>
              <p className="max-w-[40ch] text-[15px] leading-[1.7] text-cream/72">
                Stock lands from Ahmedabad in about six weeks. These are the
                dates that should already be in your order book.
              </p>
            </div>
            <FestivalCountdown />
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- 05 The aisle --------------------------- */}
      <section id="ch-5" className={`${CHAPTER} bg-white`}>
        <ChapterNumeral numeral="05" side="right" tone="light" />
        <div className={CHAPTER_INNER}>
          <Reveal>
            <Eyebrow className="mb-4">Chapter Five · The Aisle</Eyebrow>
          </Reveal>
          <Reveal delay={70}>
            <Display className="mb-[clamp(20px,2.4vw,28px)] max-w-[20ch] text-ink">
              Run an Indian aisle like a specialist.
            </Display>
          </Reveal>
          <Reveal delay={140}>
            <p className="mb-[clamp(32px,3.6vw,46px)] max-w-[58ch] text-[clamp(15.5px,1vw,17px)] leading-[1.75] text-body">
              Most independent grocers can&apos;t compete with a chain on an
              Indian aisle, because it takes five importers, five minimums and
              five invoices to fill one. One account here replaces all of that.
            </p>
          </Reveal>

          <Reveal
            delay={210}
            className="mb-[clamp(34px,4vw,50px)] grid gap-[clamp(16px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]"
          >
            <div className="rounded-[20px] border border-line-deep bg-sand-deep p-[clamp(26px,3vw,36px)]">
              <Eyebrow tone="faint" className="mb-5 tracking-[2.2px]">
                Without us
              </Eyebrow>
              <div className="grid gap-3.5 text-[15.5px] leading-[1.6] text-muted">
                {withoutUs.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[20px] bg-red p-[clamp(26px,3vw,36px)] text-white">
              <Eyebrow tone="gold" className="mb-5 tracking-[2.2px]">
                With one account
              </Eyebrow>
              <div className="grid gap-3.5 text-[15.5px] leading-[1.6]">
                {withOneAccount(departments.length, brands.length).map(
                  (line) => (
                    <span key={line}>{line}</span>
                  ),
                )}
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={280}
            className="grid gap-[clamp(14px,2vw,22px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr))]"
          >
            {brands.map((b) => (
              <BrandTile key={b.slug} brand={b} />
            ))}
          </Reveal>

          <Reveal delay={350} className="mt-[clamp(28px,3.2vw,38px)]">
            <Button href="/range" variant="outlineDark">
              Browse the full range
            </Button>
          </Reveal>
        </div>
      </section>

      <Trending />
      <CertBadges />
      <Apply />
    </>
  );
}
