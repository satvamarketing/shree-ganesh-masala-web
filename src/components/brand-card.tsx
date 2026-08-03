import Image from "next/image";
import type { Brand } from "@/data/brands";

/** Logo well, or a typographic wordmark when no logo file exists. */
function LogoWell({
  brand,
  height,
  padded,
}: {
  brand: Brand;
  height: number;
  padded: boolean;
}) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        height,
        background: brand.bg,
        padding: padded && brand.slug !== "dhiraj" ? 24 : 0,
      }}
    >
      {brand.logo ? (
        /* `fill` rather than width/height + w-auto: an auto-width lazy image
           computes to zero width before it loads, so it never intersects the
           viewport, so it never loads — it stays 0x0 forever. `fill` takes its
           box from this parent instead. */
        <Image
          src={brand.logo}
          alt={brand.name}
          fill
          sizes="(max-width: 640px) 50vw, 240px"
          className="object-contain"
          style={{ padding: padded && brand.slug !== "dhiraj" ? 24 : 0 }}
        />
      ) : (
        <span
          className={`px-4 text-center font-serif text-[22px] leading-tight ${
            brand.slug === "dhiraj" ? "text-cream" : "text-teal"
          }`}
        >
          {brand.name}
        </span>
      )}
    </div>
  );
}

export function BrandCard({
  brand,
  withBlurb = false,
}: {
  brand: Brand;
  withBlurb?: boolean;
}) {
  if (!withBlurb) {
    return (
      <div className="overflow-hidden rounded-[18px] border border-line transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-card-lg">
        <LogoWell brand={brand} height={118} padded />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-white">
      <LogoWell brand={brand} height={140} padded />
      <div className="flex-1 px-6 py-[22px]">
        <div className="mb-1.5 text-lg font-bold text-teal">{brand.name}</div>
        <p className="text-[14.5px] leading-[1.65] text-muted">{brand.blurb}</p>
      </div>
    </div>
  );
}
