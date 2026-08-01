import type { Metadata } from "next";
import { WholesaleForm } from "@/components/forms/wholesale-form";
import { CertBadges } from "@/components/sections/cert-badges";
import { Eyebrow } from "@/components/ui";
import { departments } from "@/data/departments";
import { site } from "@/data/site";
import { benefits, faqs } from "@/data/wholesale";

export const metadata: Metadata = {
  title: "Wholesale Accounts",
  description: `Open a wholesale account with Shree Ganesh: ${departments.length} departments of Indian pantry staples by the carton, approved within one business day, free ${site.deliveryArea} delivery over $${site.freeDeliveryThreshold}.`,
  alternates: { canonical: "/wholesale" },
};

export default function WholesalePage() {
  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="shell py-[clamp(48px,6vw,80px)]">
          <Eyebrow className="mb-3.5">For Trade</Eyebrow>
          <h1
            className="mb-4.5 max-w-[760px] font-serif text-[clamp(38px,4.6vw,62px)] leading-[1.06] font-normal text-ink"
            style={{ textWrap: "pretty" }}
          >
            {departments.length} aisles, one delivery run
          </h1>
          <p className="max-w-[580px] text-[clamp(16px,1.4vw,18px)] leading-[1.65] text-body">
            Grocers, restaurants and caterers order our full house range by the
            carton, plus imported staples across {departments.length}{" "}
            departments. Approved within one business day.
          </p>
        </div>
      </section>

      <section className="shell py-[clamp(48px,6vw,80px)]">
        <div className="grid items-start gap-[clamp(32px,5vw,60px)] lg:grid-cols-2">
          <div>
            <h2 className="mb-6.5 font-serif text-[clamp(28px,3.2vw,40px)] leading-[1.1] font-normal text-ink">
              Why shops order from us
            </h2>

            <div className="mb-10 grid gap-3.5">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-line bg-white px-6 py-5"
                >
                  <div className="mb-1 text-[16.5px] font-bold text-ink">
                    {b.title}
                  </div>
                  <div className="text-[14.5px] leading-[1.6] text-muted">
                    {b.body}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="mb-4.5 font-serif text-[28px] font-normal text-ink">
              Common questions
            </h3>
            <dl className="grid gap-3">
              {faqs.map((f) => (
                <div key={f.question} className="border-b border-line pb-3.5">
                  <dt className="mb-1.5 text-[15.5px] font-bold text-ink">
                    {f.question}
                  </dt>
                  <dd className="text-[14.5px] leading-[1.6] text-muted">
                    {f.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-[26px] bg-forest p-[clamp(28px,3.5vw,44px)] text-[#F2F7EF]">
            <WholesaleForm />
          </div>
        </div>
      </section>

      <CertBadges />
    </>
  );
}
