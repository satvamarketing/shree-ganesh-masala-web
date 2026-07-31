"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/data/site";

/**
 * The desktop nav. A tiny client island purely so the active link can be
 * derived from the pathname — the header itself stays a Server Component.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden min-w-0 items-center gap-[clamp(12px,1.8vw,26px)] text-[clamp(13px,1.15vw,15px)] font-semibold lg:flex">
      {nav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-2 pb-0.5 whitespace-nowrap transition-colors ${
              active
                ? "border-red font-bold text-red"
                : "border-transparent text-ink hover:text-red"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
