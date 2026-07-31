import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/catalog";
import { WordmarkFallback } from "@/components/ui";

/** "100g · carton of 10", or whichever half exists, or "" for neither. */
export function packLine(product: Product): string {
  const parts: string[] = [];
  if (product.size) parts.push(product.size);
  if (product.unitsPerCarton) parts.push(`carton of ${product.unitsPerCarton}`);
  return parts.join(" · ");
}

export function ProductCard({
  product,
  showBrandTag = true,
}: {
  product: Product;
  showBrandTag?: boolean;
}) {
  const pack = packLine(product);

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-white transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-[5px] hover:shadow-card-lg">
      <Link
        href={`/range/${product.handle}`}
        className="relative block h-[200px] shrink-0"
        tabIndex={-1}
        aria-hidden="true"
      >
        {product.image ? (
          /* `fill` rather than width/height + w-auto: an auto-width lazy image
             computes to zero width before it loads, so it never intersects the
             viewport, so it never loads — it stays 0x0 forever. */
          <div className="relative h-full w-full bg-sand">
            <Image
              src={product.image}
              alt=""
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 260px"
              className="object-contain p-[22px]"
            />
          </div>
        ) : (
          <WordmarkFallback name={product.brand} />
        )}
        {showBrandTag ? (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-ink px-[11px] py-[5px] text-[10.5px] font-bold tracking-[1px] text-[#FFF1DE] uppercase">
            {product.brand}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-[5px] px-5 py-[18px]">
        <Link
          href={`/range/${product.handle}`}
          className="text-[15.5px] leading-[1.35] font-bold text-ink hover:text-red"
        >
          {product.title}
        </Link>
        {pack ? <div className="text-[13px] text-muted">{pack}</div> : null}
        <Link
          href="/wholesale"
          className="mt-auto pt-3 text-[13.5px] font-bold text-red hover:text-red-dark"
        >
          Log in for carton pricing →
        </Link>
      </div>
    </div>
  );
}
