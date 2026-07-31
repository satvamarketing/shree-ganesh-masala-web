import Image from "next/image";
import { brands } from "@/data/brands";
import { products } from "@/data/catalog";
import { departments } from "@/data/departments";
import { images } from "@/data/images";
import { site } from "@/data/site";
import { Button, DesignedPanel, Stat } from "@/components/ui";

/**
 * The first house-brand line that has both a packshot and a carton quantity,
 * for the floating reorder card. Picked from real data so the card never shows
 * a placeholder or an invented pack size.
 */
function featuredReorder() {
  return products.find(
    (p) => p.isHouseBrand && p.image && p.unitsPerCarton && p.departments.length > 0,
  );
}

export function Hero() {
  const hero = images.hero;
  const reorder = featuredReorder();

  return (
    <section className="border-b border-line bg-cream">
      <div className="shell grid items-center gap-[clamp(32px,5vw,72px)] pt-[clamp(48px,6vw,84px)] pb-[clamp(56px,6vw,92px)] lg:[grid-template-columns:minmax(0,1.05fr)_minmax(280px,1fr)]">
        <div className="min-w-0">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-mint px-4 py-2.5 text-[12.5px] font-bold tracking-[1.5px] text-forest uppercase">
            🌾 Made in Ahmedabad · Supplied from Brisbane
          </div>

          <h1
            className="mb-5.5 font-serif text-[clamp(42px,5.6vw,78px)] leading-[1.04] font-normal text-ink"
            style={{ textWrap: "pretty" }}
          >
            {site.tagline}
          </h1>

          <p className="mb-8.5 max-w-[500px] text-[clamp(16px,1.4vw,18.5px)] leading-[1.65] text-body">
            {brands.length} house brands made in Ahmedabad, plus{" "}
            {departments.length} departments of Indian pantry staples — supplied
            by the carton to grocers, restaurants and caterers across
            Queensland.
          </p>

          <div className="mb-8.5 flex flex-wrap gap-3">
            <Button href="/wholesale" variant="red">
              Open a wholesale account
            </Button>
            <Button href="/range" variant="outline">
              See the range
            </Button>
          </div>

          <div className="flex flex-wrap gap-[clamp(20px,3vw,40px)] border-t border-line pt-6.5">
            <Stat value={String(departments.length)} label="Departments" />
            <Stat value={String(brands.length)} label="House brands" />
            {/* The design's third stat was "HACCP / Certified facility";
                replaced with a verifiable figure. See spec §8.1. */}
            <Stat value={String(site.foundedYear)} label="Established" />
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="h-[clamp(340px,42vw,520px)] overflow-hidden rounded-[24px] bg-sand-deep">
            {hero.src ? (
              <Image
                src={hero.src}
                alt={hero.alt}
                width={1200}
                height={900}
                priority
                className="h-full w-full object-cover"
              />
            ) : (
              <DesignedPanel label="Finished dish, styled on a table" />
            )}
          </div>

          {reorder ? (
            <div className="absolute -bottom-5.5 -left-4.5 hidden max-w-[260px] items-center gap-3.5 rounded-[18px] bg-white p-3.5 shadow-float sm:flex">
              <Image
                src={reorder.image as string}
                alt=""
                width={54}
                height={54}
                className="h-[54px] w-[54px] shrink-0 object-contain"
              />
              <div className="min-w-0">
                <div className="text-sm font-bold text-ink">{reorder.title}</div>
                <div className="text-[12.5px] text-muted">
                  Carton of {reorder.unitsPerCarton} · top reorder
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
