import Image from "next/image";
import { images } from "@/data/images";
import { Eyebrow } from "@/components/ui";

/**
 * The certification strip (reference lines 220-241), reduced to the one claim
 * that is actually supported.
 *
 * The design asserted HACCP certification as a badge and in the supporting
 * copy, but the word appears nowhere on shreeganesh.com.au and no certificate
 * was supplied — publishing an unverified food-safety certification is a
 * compliance exposure. See spec §8.1 and ASSETS-NEEDED.md.
 *
 * To enable it once the client sends the certificate: add a `badgeHaccp` slot
 * to src/data/images.ts, render it beside the Australian-Owned badge below,
 * and restore ", Food-safety certified." to the heading.
 */
export function CertBadges() {
  const badge = images.badgeAustralianOwned;

  return (
    <section className="border-y border-line bg-white">
      <div className="shell grid items-center gap-[clamp(24px,4vw,48px)] py-[clamp(36px,4.5vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <div>
          <Eyebrow className="mb-3">Certified</Eyebrow>
          <h2
            className="mb-2.5 font-serif text-[clamp(24px,2.6vw,34px)] leading-[1.15] font-normal text-ink"
            style={{ textWrap: "pretty" }}
          >
            Australian owned.
          </h2>
          <p className="max-w-[420px] text-[15.5px] leading-[1.65] text-muted">
            An Australian-owned family business importing and distributing our
            own manufacturing out of Ahmedabad — the paperwork your buyers ask
            for, ready on request.
          </p>
        </div>

        <div className="flex items-start justify-start gap-[clamp(14px,2vw,26px)]">
          {badge.src ? (
            <div className="w-32 text-center">
              <div className="h-32 w-32 overflow-hidden rounded-[18px] bg-sand">
                <Image
                  src={badge.src}
                  alt={badge.alt}
                  width={256}
                  height={256}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-2.5 text-[11px] leading-[1.4] font-bold tracking-[0.6px] text-faint uppercase">
                Owned &amp; operated
              </div>
            </div>
          ) : (
            /* No usable badge asset yet — a typographic seal stands in rather
               than an empty frame. See ASSETS-NEEDED.md §1. */
            <div className="w-full max-w-[360px] rounded-[18px] border border-line bg-sand px-6 py-5">
              <div className="font-serif text-xl leading-tight text-forest">
                100% Australian owned
                <br />
                and operated
              </div>
              <div className="mt-2 text-[12px] leading-[1.5] text-muted">
                Manufactured at our own facility in Ahmedabad · distributed from
                Acacia Ridge, Brisbane
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
