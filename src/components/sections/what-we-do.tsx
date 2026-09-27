import { BadgeCheck, Factory, Timer } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Display } from "@/components/ui";
import { whatWeDo } from "@/data/story";

const ICONS = [Factory, Timer, BadgeCheck] as const;

/**
 * "What We Do", after Sagoon Group's About page: three short pillars, each one
 * fact from the original About Us page. Shared by the home and About pages.
 */
export function WhatWeDo() {
  return (
    <section className="bg-sand">
      <div className="shell py-[clamp(48px,5vw,76px)]">
        <Reveal>
          <Display className="mb-[clamp(30px,3.4vw,44px)] text-ink">
            What We Do
          </Display>
        </Reveal>
        <Reveal
          delay={140}
          className="grid gap-[clamp(16px,2vw,24px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]"
        >
          {whatWeDo.map((pillar, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={pillar.title}
                className="rounded-[20px] border border-line bg-white p-[clamp(26px,3vw,36px)]"
              >
                <Icon size={28} className="mb-4 text-red" aria-hidden="true" />
                <h3 className="mb-3 font-serif text-[24px] font-normal text-ink">
                  {pillar.title}
                </h3>
                <p className="text-[15.5px] leading-[1.7] text-body">
                  {pillar.body}
                </p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
