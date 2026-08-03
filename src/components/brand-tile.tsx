import Image from "next/image";
import type { Brand } from "@/data/brands";

/** v7's brand logo tile (reference lines 261-266, 363-368). */
export function BrandTile({
  brand,
  bordered = true,
}: {
  brand: Brand;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex h-[108px] items-center justify-center rounded-2xl bg-sand p-4.5 ${
        bordered ? "border border-line" : ""
      }`}
    >
      {brand.logo ? (
        <div className="relative h-full w-full">
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            sizes="(max-width: 640px) 45vw, 200px"
            className="object-contain"
          />
        </div>
      ) : (
        <span className="px-2 text-center font-serif text-[19px] leading-tight text-faint">
          {brand.name}
        </span>
      )}
    </div>
  );
}
