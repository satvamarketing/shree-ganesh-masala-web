import Link from "next/link";

/** first, last, and current ±2, with … for the gaps. */
function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  const wanted = new Set<number>([1, pageCount]);
  for (let p = page - 2; p <= page + 2; p++) {
    if (p >= 1 && p <= pageCount) wanted.add(p);
  }
  const sorted = [...wanted].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  let previous = 0;
  for (const p of sorted) {
    if (previous !== 0 && p - previous > 1) out.push("gap");
    out.push(p);
    previous = p;
  }
  return out;
}

/**
 * Server-rendered links, so pagination works without JavaScript.
 * `hrefFor` keeps the other active filters in the URL.
 */
export function Pagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  const base =
    "flex h-11 min-w-11 items-center justify-center rounded-full px-3.5 text-sm font-bold transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={`${base} border-[1.5px] border-line-deep bg-white text-teal hover:border-teal`}>
          ← Prev
        </Link>
      ) : (
        <span aria-disabled="true" className={`${base} border-[1.5px] border-line bg-white text-faint`}>
          ← Prev
        </span>
      )}

      {pageWindow(page, pageCount).map((entry, i) =>
        entry === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-faint" aria-hidden="true">
            …
          </span>
        ) : entry === page ? (
          <span key={entry} aria-current="page" className={`${base} bg-teal text-cream`}>
            {entry}
          </span>
        ) : (
          <Link key={entry} href={hrefFor(entry)} className={`${base} border-[1.5px] border-line-deep bg-white text-teal hover:border-teal`}>
            {entry}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} rel="next" className={`${base} border-[1.5px] border-line-deep bg-white text-teal hover:border-teal`}>
          Next →
        </Link>
      ) : (
        <span aria-disabled="true" className={`${base} border-[1.5px] border-line bg-white text-faint`}>
          Next →
        </span>
      )}
    </nav>
  );
}
