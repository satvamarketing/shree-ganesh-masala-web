import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductJsonLd } from "@/components/json-ld";
import { ProductCard, packLine } from "@/components/product-card";
import { Button, WordmarkFallback } from "@/components/ui";
import { products, productByHandle } from "@/data/catalog";
import { departments } from "@/data/departments";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = productByHandle(handle);
  if (!product) return {};

  const pack = packLine(product);
  return {
    title: product.title,
    description:
      `${product.title}${pack ? `, ${pack}` : ""}. ${product.brand}, ` +
      `wholesale from our Brisbane warehouse to grocers, restaurants and caterers.`,
    alternates: { canonical: `/range/${product.handle}` },
  };
}

function departmentName(slug: string): string {
  return departments.find((d) => d.slug === slug)?.name ?? slug;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = productByHandle(handle);
  if (!product) notFound();

  const related = products
    .filter(
      (p) => p.brand === product.brand && p.handle !== product.handle && p.image,
    )
    .slice(0, 4);

  const facts = [
    { label: "Brand", value: product.brand },
    product.size ? { label: "Size", value: product.size } : null,
    product.unitsPerCarton
      ? { label: "Units per carton", value: String(product.unitsPerCarton) }
      : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <>
      <ProductJsonLd product={product} />
      <section className="shell py-[clamp(32px,5vw,64px)]">
        <nav aria-label="Breadcrumb" className="mb-8 text-[13.5px] text-muted">
          <Link href="/range" className="font-semibold text-red hover:text-red-dark">
            Our Range
          </Link>
          {product.departments[0] ? (
            <>
              <span className="px-2 text-line-deep">/</span>
              <Link
                href={`/range?department=${product.departments[0]}`}
                className="font-semibold text-red hover:text-red-dark"
              >
                {departmentName(product.departments[0])}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="grid items-start gap-[clamp(28px,5vw,64px)] lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-[24px] border border-line bg-sand">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 92vw, 560px"
                priority
                className="object-contain p-[clamp(24px,4vw,56px)]"
              />
            ) : (
              <WordmarkFallback name={product.brand} />
            )}
          </div>

          <div>
            <span className="inline-block rounded-full bg-ink px-[11px] py-[5px] text-[10.5px] font-bold tracking-[1px] text-[#FFF1DE] uppercase">
              {product.brand}
            </span>

            <h1
              className="mt-4 mb-5 font-serif text-[clamp(28px,3.2vw,42px)] leading-[1.1] font-normal text-ink"
              style={{ textWrap: "pretty" }}
            >
              {product.title}
            </h1>

            <dl className="mb-7 grid gap-3 border-y border-line py-6">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-4 text-[15.5px]">
                  <dt className="w-[150px] shrink-0 font-bold text-muted">
                    {f.label}
                  </dt>
                  <dd className="font-semibold text-ink">{f.value}</dd>
                </div>
              ))}
              {product.departments.length > 0 ? (
                <div className="flex gap-4 text-[15.5px]">
                  <dt className="w-[150px] shrink-0 font-bold text-muted">
                    {product.departments.length === 1 ? "Department" : "Departments"}
                  </dt>
                  <dd className="flex flex-wrap gap-x-2 gap-y-1">
                    {product.departments.map((slug, i) => (
                      <span key={slug}>
                        <Link
                          href={`/range?department=${slug}`}
                          className="font-semibold text-red hover:text-red-dark"
                        >
                          {departmentName(slug)}
                        </Link>
                        {i < product.departments.length - 1 ? (
                          <span className="text-line-deep">,</span>
                        ) : null}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>

            {product.description ? (
              <p className="mb-7 text-[16px] leading-[1.75] text-body">
                {product.description}
              </p>
            ) : null}

            <Button href="/wholesale" variant="red">
              Log in for carton pricing
            </Button>
            <p className="mt-4 text-[13.5px] leading-[1.6] text-muted">
              Wholesale accounts only. Carton pricing is sent with your account
              approval.
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="shell pb-[clamp(64px,8vw,96px)]">
          <h2 className="mb-8 font-serif text-[clamp(24px,2.6vw,34px)] font-normal text-ink">
            More from {product.brand}
          </h2>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
