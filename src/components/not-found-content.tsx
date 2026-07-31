import { Button } from "@/components/ui";

export function NotFoundContent() {
  return (
    <section className="shell py-[clamp(72px,12vw,140px)] text-center">
      <p className="mb-4 text-[12.5px] font-extrabold tracking-[2.5px] text-red uppercase">
        404
      </p>
      <h1 className="mb-4 font-serif text-[clamp(34px,4.4vw,56px)] leading-[1.1] font-normal text-ink">
        We couldn&apos;t find that page.
      </h1>
      <p className="mx-auto mb-9 max-w-[460px] text-[16.5px] leading-[1.65] text-body">
        The link may be out of date, or the product may no longer be stocked.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/range" variant="red">
          Browse the range
        </Button>
        <Button href="/" variant="outline">
          Back home
        </Button>
      </div>
    </section>
  );
}
