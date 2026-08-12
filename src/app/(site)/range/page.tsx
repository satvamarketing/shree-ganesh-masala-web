import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandCard } from "@/components/brand-card";
import { ActiveFilters } from "@/components/catalog/active-filters";
import { FilterChips } from "@/components/catalog/filter-chips";
import { Pagination } from "@/components/catalog/pagination";
import { SearchBox } from "@/components/catalog/search-box";
import { ProductCard } from "@/components/product-card";
import { Button, Eyebrow } from "@/components/ui";
import { brands } from "@/data/brands";
import { products } from "@/data/catalog";
import { departments } from "@/data/departments";
import { brandFilterOptions, IMPORTED, queryProducts } from "@/lib/catalog-query";

export const metadata: Metadata = {
  title: "Our Range",
  description:
    `Every line we stock: six house brands manufactured in Ahmedabad plus imported staples across ${departments.length} departments. Search the full catalog and open a wholesale account for carton pricing.`,
  // Filtered views canonicalise to the base page so they do not compete in the
  // index with one another.
  alternates: { canonical: "/range" },
};

type SearchParams = Promise<{ [k: string]: string | string[] | undefined }>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

const brandOptions = brandFilterOptions(products);
const departmentOptions = [
  { value: "all", label: "All departments" },
  ...departments.map((d) => ({ value: d.slug, label: d.name })),
];

export default async function RangePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = one(sp.q) ?? "";
  const department = one(sp.department) ?? "";
  const brand = one(sp.brand) ?? "";
  const pageParam = Number(one(sp.page) ?? 1);

  const result = queryProducts(products, {
    q,
    department,
    brand,
    page: Number.isFinite(pageParam) ? pageParam : 1,
  });

  function hrefFor(page: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (department) params.set("department", department);
    if (brand) params.set("brand", brand);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/range?${qs}` : "/range";
  }

  const applied = [
    brand
      ? {
          param: "brand",
          label:
            brand === IMPORTED
              ? "Imported brands"
              : (brandOptions.find((o) => o.value === brand)?.label ?? brand),
        }
      : null,
    department
      ? {
          param: "department",
          label:
            departments.find((d) => d.slug === department)?.name ?? department,
        }
      : null,
    q ? { param: "q", label: `“${q}”` } : null,
  ].filter((f): f is { param: string; label: string } => f !== null);

  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="shell py-[clamp(40px,4.5vw,64px)]">
          <Eyebrow className="mb-3.5">Our Range</Eyebrow>
          <h1
            className="mb-4.5 max-w-[720px] font-serif text-[clamp(38px,4.6vw,62px)] leading-[1.06] font-normal text-ink"
            style={{ textWrap: "pretty" }}
          >
            {brands.length} house brands, one pantry
          </h1>
          <p className="max-w-[560px] text-[clamp(15.5px,1vw,17px)] leading-[1.65] text-body">
            Every house line is manufactured by us in Ahmedabad and distributed
            from our Brisbane warehouse, alongside imported staples across{" "}
            {departments.length} departments. Carton and pallet quantities,
            priced on a wholesale account.
          </p>
        </div>
      </section>

      <section className="shell py-[clamp(34px,4vw,52px)]">
        <div className="mb-[clamp(34px,4vw,52px)] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <BrandCard key={b.slug} brand={b} withBlurb />
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <Suspense fallback={<div className="h-[58px]" />}>
            <SearchBox initial={q} total={products.length} />
          </Suspense>

          <Suspense fallback={<div className="h-[46px]" />}>
            <FilterChips
              options={brandOptions}
              active={brand}
              param="brand"
              label="Filter by brand"
            />
          </Suspense>

          <Suspense fallback={<div className="h-[46px]" />}>
            <FilterChips
              options={departmentOptions}
              active={department}
              param="department"
              label="Filter by department"
            />
          </Suspense>

          <Suspense fallback={null}>
            <ActiveFilters applied={applied} />
          </Suspense>
        </div>

        <div className="mt-8 mb-6 text-sm text-muted">
          {result.total.toLocaleString("en-AU")}{" "}
          {result.total === 1 ? "product" : "products"}
          {result.pageCount > 1
            ? ` · page ${result.page} of ${result.pageCount}`
            : ""}
        </div>

        {result.total === 0 ? (
          <div className="rounded-[24px] border border-line bg-sand px-8 py-14 text-center">
            <p className="mb-1.5 font-serif text-2xl text-ink">
              No products match those filters.
            </p>
            <p className="mb-7 text-[15.5px] text-muted">
              Try a different department, or search for a product name.
            </p>
            <Button href="/range" variant="red">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {result.items.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        )}

        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          hrefFor={hrefFor}
        />
      </section>

      <section className="shell pb-[clamp(44px,5vw,70px)]">
        <div className="grid items-center gap-8 rounded-[26px] bg-red p-[clamp(32px,4vw,52px)] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          <div>
            <h2 className="mb-3 font-serif text-[clamp(26px,2.8vw,36px)] leading-[1.15] font-normal text-white">
              Buying for a shop or kitchen?
            </h2>
            <p className="text-base leading-[1.65] text-white/85">
              Wholesale accounts get carton pricing across this range plus{" "}
              {departments.length} departments of imported staples.
            </p>
          </div>
          <div className="justify-self-start">
            <Button href="/#apply" variant="gold">
              Open a wholesale account
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
