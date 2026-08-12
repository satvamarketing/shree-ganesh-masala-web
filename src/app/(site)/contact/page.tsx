import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { StaticMap } from "@/components/static-map";
import { Eyebrow } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to Shree Ganesh. ${site.address.street}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}. Phone ${site.phone}, ${site.hours}.`,
  alternates: { canonical: "/contact" },
};

function InfoCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-line bg-white px-6.5 py-6">
      <div className="mb-2 text-[12px] font-extrabold tracking-[2px] text-red uppercase">
        {label}
      </div>
      <div className="text-[17px] leading-[1.5] font-semibold text-ink">
        {children}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="shell py-[clamp(40px,4.5vw,64px)]">
          <Eyebrow className="mb-3.5">Contact</Eyebrow>
          <h1 className="mb-4.5 font-serif text-[clamp(38px,4.6vw,62px)] leading-[1.06] font-normal text-ink">
            Talk to us
          </h1>
          <p className="max-w-[520px] text-[clamp(15.5px,1vw,17px)] leading-[1.65] text-body">
            New accounts, order questions, product enquiries: someone in the
            warehouse will answer.
          </p>
        </div>
      </section>

      <section className="shell py-[clamp(40px,4.5vw,64px)]">
        <div className="grid items-start gap-[clamp(28px,3.4vw,46px)] lg:grid-cols-2">
          <div className="grid gap-3.5">
            <InfoCard label="Warehouse">
              {site.address.street},
              <br />
              {site.address.suburb} {site.address.state} {site.address.postcode}
            </InfoCard>

            <InfoCard label="Phone">
              <a href={site.phoneHref} className="text-ink hover:text-red">
                {site.phone}
              </a>
            </InfoCard>

            <InfoCard label="Email">
              <a href={`mailto:${site.email}`} className="text-ink hover:text-red">
                {site.email}
              </a>
            </InfoCard>

            <InfoCard label="Hours">
              {site.hours}
              <br />
              <span className="text-[15px] font-medium text-muted">
                {site.hoursNote}
              </span>
            </InfoCard>

            <StaticMap />
          </div>

          <div className="rounded-[26px] border border-line bg-white p-[clamp(28px,3.5vw,44px)]">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
