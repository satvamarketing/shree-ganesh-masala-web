import { TradeForm } from "@/components/forms/trade-form";
import { Display, Eyebrow } from "@/components/ui";
import { formattedAddress, site } from "@/data/site";

/** The red apply band (reference lines 376-419). Shared by home and About. */
export function Apply() {
  return (
    <section
      id="apply"
      className="relative overflow-hidden bg-red text-white"
    >
      <div className="shell grid items-start gap-[clamp(30px,3.6vw,56px)] py-[clamp(48px,5vw,76px)] lg:grid-cols-2">
        <div>
          <Eyebrow className="mb-4 text-gold-soft!">Trade accounts</Eyebrow>
          <Display as="h2" size="chapter" className="mb-5.5 max-w-[18ch]">
            Come through the door.
          </Display>
          <p className="mb-7.5 max-w-[46ch] text-[clamp(15.5px,1vw,17px)] leading-[1.72] text-white/88">
            Approved in one business day. No minimum first order. Wholesale
            pricing, the trade pack and the festival calendar unlock the moment
            you&apos;re in.
          </p>
          <div className="grid gap-2.5 text-[15.5px] leading-[1.6]">
            <span>{formattedAddress()}</span>
            <a
              href={site.phoneHref}
              className="w-fit border-b border-white/40 text-white hover:border-white"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="w-fit border-b border-white/40 text-white hover:border-white"
            >
              {site.email}
            </a>
            <span className="text-white/70">{site.hours}</span>
          </div>
        </div>

        <div className="rounded-[24px] bg-sand p-[clamp(26px,3.2vw,40px)] text-ink">
          <TradeForm />
        </div>
      </div>
    </section>
  );
}
