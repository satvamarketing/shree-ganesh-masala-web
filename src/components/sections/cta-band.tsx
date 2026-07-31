import Image from "next/image";
import { departments } from "@/data/departments";
import { images } from "@/data/images";
import { site } from "@/data/site";
import { Button, DesignedPanel, Eyebrow } from "@/components/ui";

/** The dark trade CTA (reference lines 207-217). */
export function CtaBand() {
  const warehouse = images.warehouse;

  return (
    <section className="bg-ink text-[#F5EADA]">
      <div className="shell grid items-center gap-[clamp(28px,4vw,56px)] py-[clamp(56px,7vw,88px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div>
          <Eyebrow tone="gold" className="mb-3.5">
            For Trade
          </Eyebrow>
          <h2 className="mb-4 font-serif text-[clamp(30px,3.4vw,46px)] leading-[1.08] font-normal text-cream">
            One account. {departments.length} aisles. One delivery run.
          </h2>
          <p className="mb-6.5 max-w-[460px] text-[16.5px] leading-[1.7] text-[#F5EADA]/80">
            Approved within one business day, no minimum first order, free{" "}
            {site.deliveryArea} delivery over ${site.freeDeliveryThreshold}.
          </p>
          <Button href="/wholesale" variant="gold">
            Open a wholesale account
          </Button>
        </div>

        <div className="h-[280px] overflow-hidden rounded-[22px] bg-[#2F2117]">
          {warehouse.src ? (
            <Image
              src={warehouse.src}
              alt={warehouse.alt}
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
          ) : (
            <DesignedPanel label="Cartons on the Acacia Ridge dock" />
          )}
        </div>
      </div>
    </section>
  );
}
