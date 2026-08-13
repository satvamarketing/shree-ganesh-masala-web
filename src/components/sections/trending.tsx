import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Button, Display, Eyebrow } from "@/components/ui";
import { products } from "@/data/catalog";

/**
 * Trending.
 *
 * The client asked for the Shopify build's "Staff Picks" section to be renamed
 * "Trending". Our build never had that section, so this is it: a short row of
 * house-brand lines.
 *
 * Deliberately no availability badges. The client also asked for "Sold Out"
 * tags to come off every product, and this site shows neither stock status nor
 * prices at all, so there is nothing to strip.
 *
 * Selection is one product per title and per department, so the row reads as a
 * spread of the range rather than the same line in four sizes.
 *
 * It sits directly under the hero and is deliberately cut by the fold, so the
 * ground is sand rather than white: against the hero's white the join would be
 * invisible and the peek would read as the hero simply continuing, instead of as
 * another section worth scrolling to.
 */
const TRENDING = (() => {
  const seenTitle = new Set<string>();
  const seenDepartment = new Set<string>();
  const picked: typeof products = [];

  for (const p of products) {
    if (!p.isHouseBrand || !p.image || !p.unitsPerCarton) continue;
    const department = p.departments[0] ?? "";
    if (seenTitle.has(p.title) || seenDepartment.has(department)) continue;
    seenTitle.add(p.title);
    seenDepartment.add(department);
    picked.push(p);
    if (picked.length === 4) break;
  }
  return picked;
})();

export function Trending() {
  if (TRENDING.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-sand">
      <div className="shell py-[clamp(44px,5vw,70px)]">
        <Reveal className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow className="mb-3">Trending</Eyebrow>
            <Display size="section" className="max-w-[24ch] text-ink">
              What shops are reordering
            </Display>
          </div>
          <Button href="/range" variant="outlineDark" className="self-start">
            See the full range
          </Button>
        </Reveal>

        <Reveal
          delay={70}
          className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]"
        >
          {TRENDING.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
