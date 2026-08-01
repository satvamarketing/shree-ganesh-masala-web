import type { Metadata } from "next";
import Image from "next/image";
import { StoryChapters } from "@/components/story-chapters";
import { DesignedPanel, Eyebrow, Stat } from "@/components/ui";
import { brands } from "@/data/brands";
import { images } from "@/data/images";
import { site } from "@/data/site";
import { chapters, mission, vision, whyChooseUs } from "@/data/story";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Shree Ganesh began in Ahmedabad in 1969, when Shri Vrajlal Manilal Shah saw the ready-masala market before anyone else did. Six brands later, we still make what we sell.",
  alternates: { canonical: "/story" },
};

export default function StoryPage() {
  const founder = images.founder;
  const quality = images.qualityLine;

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-[#F5EADA]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-40px] bottom-[-90px] font-serif text-[clamp(200px,26vw,380px)] leading-none text-[rgba(232,162,12,0.13)] select-none"
        >
          1969
        </div>

        <div className="shell relative grid items-center gap-[clamp(32px,5vw,72px)] py-[clamp(52px,7vw,96px)] lg:grid-cols-2">
          <div>
            <Eyebrow tone="gold" className="mb-4">
              Our Story
            </Eyebrow>
            <h1
              className="mb-5.5 font-serif text-[clamp(38px,4.8vw,66px)] leading-[1.03] font-normal text-cream"
              style={{ textWrap: "pretty" }}
            >
              One man called it{" "}
              <em className="text-gold not-italic">Quality Vision</em>. We&apos;ve
              been keeping it ever since.
            </h1>
            <p className="mb-7.5 max-w-[520px] text-[clamp(16px,1.4vw,18px)] leading-[1.7] text-[#F5EADA]/82">
              The story of Shree Ganesh starts with a founder who saw the
              ready-masala market before anyone else did, and refused to let
              quality slip as it grew.
            </p>
            <div className="flex flex-wrap gap-[clamp(20px,3vw,44px)] border-t border-[#F5EADA]/18 pt-6">
              <Stat
                tone="dark"
                value={String(site.foundedYear)}
                label="First masala launched"
              />
              <Stat tone="dark" value={String(brands.length)} label="Brands today" />
              <Stat tone="dark" value="3" label="Generations" />
            </div>
          </div>

          <div className="flex min-w-0 justify-center">
            <div className="relative w-full max-w-[380px]">
              <div className="relative h-[clamp(320px,40vw,460px)] overflow-hidden rounded-t-[200px] rounded-b-[20px] border border-[rgba(232,162,12,0.35)] bg-[#2F2117]">
                {founder.src ? (
                  <Image
                    src={founder.src}
                    alt={founder.alt}
                    fill
                    sizes="380px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <DesignedPanel label="Founder portrait" />
                )}
              </div>
              <div className="mt-4 text-center">
                <div className="text-base font-bold text-cream">
                  Shri Vrajlal Manilal Shah
                </div>
                <div className="mt-0.5 text-[13px] text-[#F5EADA]/60">Founder</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <StoryChapters chapters={chapters} />
      </section>

      <section className="shell pt-[clamp(20px,3vw,40px)] pb-[clamp(56px,7vw,92px)]">
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="rounded-[24px] bg-forest p-[clamp(32px,4vw,52px)] text-[#F2F7EF]">
            <div className="mb-4 text-xs font-extrabold tracking-[2.5px] text-gold uppercase">
              Our Vision
            </div>
            <p
              className="mb-4.5 font-serif text-[clamp(22px,2.4vw,30px)] leading-[1.35]"
              style={{ textWrap: "pretty" }}
            >
              {vision.headline}
            </p>
            <p className="text-[15.5px] leading-[1.7] text-[#F2F7EF]/80">
              {vision.body}
            </p>
          </div>

          <div className="rounded-[24px] bg-ink p-[clamp(32px,4vw,52px)] text-[#F5EADA]">
            <div className="mb-4 text-xs font-extrabold tracking-[2.5px] text-gold uppercase">
              Our Mission
            </div>
            <p
              className="mb-4.5 font-serif text-[clamp(22px,2.4vw,30px)] leading-[1.35]"
              style={{ textWrap: "pretty" }}
            >
              {mission.headline}
            </p>
            <p className="text-[15.5px] leading-[1.7] text-[#F5EADA]/80">
              {mission.body}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-sand">
        <div className="shell py-[clamp(56px,7vw,92px)]">
          <div className="mb-11 max-w-[640px]">
            <Eyebrow className="mb-3.5">Why Choose Us</Eyebrow>
            <h2
              className="font-serif text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-normal text-ink"
              style={{ textWrap: "pretty" }}
            >
              One objective: 100% customer satisfaction
            </h2>
          </div>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {whyChooseUs.map((item, i) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-line bg-white p-8"
              >
                <div className="mb-3.5 font-serif text-[40px] leading-none text-red">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mb-2 text-lg font-bold text-ink">{item.title}</div>
                <p className="text-[15px] leading-[1.7] text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-[clamp(56px,7vw,92px)]">
        <div className="grid items-center gap-[clamp(32px,5vw,64px)] lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-sand-deep">
            {quality.src ? (
              <Image
                src={quality.src}
                alt={quality.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            ) : (
              <DesignedPanel label="The Ahmedabad packing line" />
            )}
          </div>

          <div>
            <Eyebrow className="mb-3.5">Made &amp; delivered</Eyebrow>
            <h2 className="mb-5 font-serif text-[clamp(28px,3.2vw,42px)] leading-[1.1] font-normal text-ink">
              Ahmedabad makes it. Brisbane ships it.
            </h2>
            {/* The design's "HACCP-certified facility" phrase is deliberately
                dropped here — see spec §8.1. */}
            <p className="mb-6.5 text-[16.5px] leading-[1.75] text-body">
              Every masala, snack and sweet is manufactured, blended and packed
              at our facility in Ahmedabad: the same city, the same recipes,
              since {site.foundedYear}. Stock lands at our Acacia Ridge
              warehouse in Brisbane, and we deliver from there.
            </p>

            <div className="mb-4.5 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
              <div className="rounded-[14px] bg-mint px-4.5 py-4">
                <div className="mb-1 text-xs font-extrabold tracking-[1.5px] text-forest uppercase">
                  Manufacturing
                </div>
                <div className="text-[15.5px] font-semibold text-ink">
                  {site.manufacturing}
                </div>
              </div>
              <div className="rounded-[14px] bg-mint px-4.5 py-4">
                <div className="mb-1 text-xs font-extrabold tracking-[1.5px] text-forest uppercase">
                  Distribution
                </div>
                <div className="text-[15.5px] font-semibold text-ink">
                  {site.distribution}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[14px] border border-line bg-white px-5 py-4 text-[15.5px] font-bold text-ink">
                {site.address.street}, {site.address.suburb} {site.address.state}{" "}
                {site.address.postcode}
              </div>
              <div className="rounded-[14px] border border-line bg-white px-5 py-4 text-[15.5px] text-ink">
                <strong>{site.hours}</strong> · pickup by arrangement
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
