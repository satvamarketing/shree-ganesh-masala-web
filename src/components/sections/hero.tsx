import Link from "next/link";
import { Glow } from "@/components/sections/glow";
import { Reveal } from "@/components/reveal";
import { Button, Display, HeroBadge, PullLine, Stat } from "@/components/ui";
import { brands } from "@/data/brands";
import { departments } from "@/data/departments";
import { site } from "@/data/site";

/**
 * The opening statement.
 *
 * v7 stacked everything in one left column, which worked on its dark ground but
 * on white left the right half of a laptop fold empty. The client reported the
 * site reading as "designed for mobile" on a larger screen, so from lg the
 * headline and the supporting copy sit side by side and the fold fills.
 *
 * From lg the section is also sized so that it stops short of the fold by
 * --sg-peek, leaving the top of the Trending section showing. The height is a
 * floor, not a fixed height: where the hero's own content is taller than the
 * target -- a short laptop, or any phone -- it simply keeps its natural height
 * and the peek shrinks to nothing. Content is never clipped to manufacture one.
 *
 * The content is centred within that height rather than left at the top, so the
 * extra room on a tall display is shared above and below instead of dumped
 * underneath the stats row.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white text-ink">
      <Glow />

      <div className="shell relative flex flex-col justify-center pt-[clamp(40px,4.5vw,64px)] pb-[clamp(44px,5vw,70px)] lg:min-h-[calc(100svh-var(--sg-fold-chrome)-var(--sg-peek))]">
        <div className="grid items-end gap-x-[clamp(32px,4vw,64px)] gap-y-[clamp(28px,3vw,36px)] lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal className="mb-[clamp(22px,2.6vw,32px)]">
              <HeroBadge>A masala house since {site.foundedYear}</HeroBadge>
            </Reveal>

            <Reveal delay={70}>
              <Display as="h1" size="hero" className="max-w-[15ch]">
                {site.tagline}
              </Display>
            </Reveal>

            <Reveal delay={140} className="mt-[clamp(18px,2.2vw,26px)]">
              <PullLine className="max-w-[24ch]">{site.pullLine}</PullLine>
            </Reveal>
          </div>

          <div className="lg:pb-2">
            <Reveal delay={210}>
              <p className="max-w-[52ch] text-[clamp(15.5px,1vw,17px)] leading-[1.72] text-body">
                Shree Ganesh has been blending masala in Ahmedabad since{" "}
                {site.foundedYear}: {brands.length} house brands, made by us,
                shipped to our Brisbane warehouse and delivered to grocers,
                restaurants and caterers across Queensland. Trade only. No
                middlemen in between.
              </p>
            </Reveal>

            <Reveal
              delay={280}
              className="mt-[clamp(24px,2.6vw,32px)] flex flex-wrap items-center gap-3.5"
            >
              <Button href="/#apply" variant="red">
                Open a trade account
              </Button>
              <Link
                href="/#ch-1"
                className="border-b-2 border-red px-1.5 py-3.5 text-[14.5px] font-bold text-ink transition-colors hover:text-red"
              >
                Start at the beginning ↓
              </Link>
            </Reveal>
          </div>
        </div>

        <Reveal
          delay={350}
          className="mt-[clamp(34px,4vw,52px)] grid gap-[clamp(20px,3vw,44px)] border-t border-line pt-[clamp(24px,3vw,34px)] [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]"
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
