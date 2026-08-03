import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Display, Eyebrow } from "@/components/ui";
import { images } from "@/data/images";

/**
 * The certification strip, in v7's language.
 *
 * Two of these are licensed certification trade marks and may only be published
 * while the corresponding licence is current:
 *   - Australian Owned (ausowned.com.au) issues a per-licensee AO ID number.
 *   - HACCP International's mark requires written consent and a licence.
 * See ASSETS-NEEDED.md §4. Removing a badge is one line: drop its entry below.
 */
const BADGES = [
  { slot: images.badgeAustralianOwnedOperated, caption: "Owned & operated" },
  { slot: images.badgeAustralianOwned, caption: "Australian Owned certified" },
  { slot: images.badgeHaccp, caption: "HACCP certified" },
] as const;

export function CertBadges() {
  const visible = BADGES.filter((b) => b.slot.src !== "");

  return (
    <section className="border-y border-line bg-white">
      <div className="shell grid items-center gap-[clamp(24px,4vw,48px)] py-[clamp(44px,5.5vw,68px)] lg:grid-cols-2">
        <Reveal>
          <Eyebrow className="mb-4">Certified</Eyebrow>
          <Display size="card" className="mb-3 text-teal">
            Australian owned. Food-safety certified.
          </Display>
          <p className="max-w-[440px] text-[15.5px] leading-[1.65] text-muted">
            An Australian-owned family business importing and distributing our
            own manufacturing out of Ahmedabad. The paperwork your buyers ask
            for, ready on request.
          </p>
        </Reveal>

        <Reveal delay={70}>
          <ul className="flex flex-wrap items-start justify-start gap-[clamp(14px,2.5vw,28px)]">
            {visible.map(({ slot, caption }) => (
              <li key={caption} className="w-32 text-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-[18px] bg-sand">
                  <Image
                    src={slot.src}
                    alt={slot.alt}
                    fill
                    sizes="128px"
                    className="object-contain p-2.5"
                  />
                </div>
                <div className="mt-2.5 text-[11px] leading-[1.4] font-bold tracking-[0.6px] text-faint uppercase">
                  {caption}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
