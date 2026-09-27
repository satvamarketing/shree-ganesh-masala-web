import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button, Display, Eyebrow } from "@/components/ui";
import { enquireHref, formattedAddress, site } from "@/data/site";

/**
 * The closing contact band, after Sagoon Group: phone, email, location and
 * trading hours side by side, then the one call to action. It replaces v7's
 * trade-account apply band, which client round 2 removed with the service.
 */
export function ContactBlock() {
  const items = [
    {
      Icon: Phone,
      label: "Phone",
      value: site.phone,
      href: site.phoneHref,
    },
    {
      Icon: Mail,
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    { Icon: MapPin, label: "Warehouse", value: formattedAddress() },
    {
      Icon: Clock,
      label: "Trading hours",
      value: `${site.hours}. ${site.hoursNote}.`,
    },
  ];

  return (
    <section className="bg-red text-white">
      <div className="shell py-[clamp(48px,5vw,76px)]">
        <div className="mb-[clamp(30px,3.4vw,44px)] flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <Eyebrow tone="gold" className="mb-4">
              Get in touch
            </Eyebrow>
            <Display className="max-w-[20ch]">
              Talk to us about our products.
            </Display>
          </Reveal>
          <Reveal delay={70}>
            <Button href={enquireHref} variant="gold">
              Enquire now
            </Button>
          </Reveal>
        </div>

        <Reveal
          delay={140}
          className="grid gap-[clamp(14px,1.8vw,20px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))]"
        >
          {items.map(({ Icon, label, value, href }) => (
            <div
              key={label}
              className="min-w-0 rounded-[18px] border border-white/20 bg-white/7 p-[clamp(18px,1.9vw,24px)]"
            >
              <Icon size={20} className="mb-3 text-gold" aria-hidden="true" />
              <div className="mb-1.5 text-[11.5px] font-extrabold tracking-[1.8px] text-gold uppercase">
                {label}
              </div>
              {href ? (
                <a
                  href={href}
                  className="text-[15px] leading-[1.5] font-semibold [overflow-wrap:anywhere] text-white hover:text-gold"
                >
                  {value}
                </a>
              ) : (
                <p className="text-[15px] leading-[1.5] font-semibold">
                  {value}
                </p>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
