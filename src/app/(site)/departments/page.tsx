import type { Metadata } from "next";
import Image from "next/image";
import { DepartmentCard } from "@/components/department-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Button, Eyebrow } from "@/components/ui";
import { departments } from "@/data/departments";
import { products } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Departments",
  description: `Browse all ${departments.length} departments we stock, from spices and frozen to kitchenware and puja, and open a wholesale account for carton pricing.`,
  alternates: { canonical: "/departments" },
};

/**
 * This page replaces the source design's Recipes page. That page had no real
 * content behind it — no blog, no recipes and no food photography exist — so
 * shipping it would have meant inventing a content section for the client.
 * This uses the same layout language driven entirely by imported data.
 * See spec §3.
 */
const biggest = [...departments].sort((a, b) => b.count - a.count)[0];

export default function DepartmentsPage() {
  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="shell py-[clamp(40px,4.5vw,64px)]">
          <Eyebrow className="mb-3.5">Departments</Eyebrow>
          <h1
            className="mb-4.5 max-w-[720px] font-serif text-[clamp(38px,4.6vw,62px)] leading-[1.06] font-normal text-ink"
            style={{ textWrap: "pretty" }}
          >
            Everything for the Indian kitchen
          </h1>
          <p className="max-w-[600px] text-[clamp(15.5px,1vw,17px)] leading-[1.65] text-body">
            One supplier for the whole shop: {departments.length} departments and{" "}
            {products.length.toLocaleString("en-AU")} lines, from spices and
            frozen to kitchenware and puja. Browse the aisles, then open a
            wholesale account for carton pricing.
          </p>
        </div>
      </section>

      {biggest ? (
        <section className="shell py-[clamp(34px,4vw,52px)]">
          <div className="grid overflow-hidden rounded-[26px] border border-line bg-white [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div className="relative min-h-[320px] bg-sand-deep">
              <Image
                src={biggest.image}
                alt={biggest.name}
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                priority
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-[clamp(30px,4vw,52px)]">
              <Eyebrow className="mb-3.5">Biggest aisle</Eyebrow>
              <h2
                className="mb-4 font-serif text-[clamp(28px,3.2vw,42px)] leading-[1.1] font-normal text-ink"
                style={{ textWrap: "pretty" }}
              >
                {biggest.name}
              </h2>
              <p className="mb-6 text-base leading-[1.7] text-body">
                {biggest.count} lines in stock, from everyday staples to the
                blends your kitchen goes through by the carton.
              </p>
              <Button
                href={`/range?department=${biggest.slug}`}
                variant="red"
                className="self-start"
              >
                Browse {biggest.name}
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="shell pb-[clamp(40px,4.5vw,64px)]">
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {departments.map((department) => (
            <DepartmentCard key={department.slug} department={department} />
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-[780px] px-[clamp(20px,4vw,40px)] py-[clamp(44px,5vw,68px)] text-center">
          <h2 className="mb-3.5 font-serif text-[clamp(30px,3.4vw,44px)] leading-[1.1] font-normal text-ink">
            Trade updates, once a fortnight
          </h2>
          <p className="mb-7.5 text-[16px] leading-[1.65] text-body">
            Festival ordering guides, new lines and price-list changes, straight
            to your inbox. No spam, unsubscribe any time.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
