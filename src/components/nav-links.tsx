"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { enquireHref, nav } from "@/data/site";

/**
 * The desktop nav: uppercase, letter-spaced, gold underline on the active item.
 * A client island only so the active link can be derived from the pathname; the
 * header itself stays a Server Component.
 */
export function NavLinks() {
  const pathname = usePathname();

  const base =
    "whitespace-nowrap border-b-2 pb-0.5 transition-colors border-transparent";

  return (
    <nav className="ml-auto hidden min-w-0 flex-wrap items-center gap-[clamp(14px,2vw,28px)] text-[13px] font-bold tracking-[1.3px] uppercase lg:flex">
      {nav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`${base} ${
              active ? "border-gold! text-gold" : "text-cream hover:text-gold"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <Link
        href={enquireHref}
        className="rounded-full bg-white px-5 py-2.5 tracking-[1px] text-red transition-colors hover:bg-gold hover:text-ink"
      >
        Enquire now
      </Link>
    </nav>
  );
}
