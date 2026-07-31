"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";

/**
 * Mobile navigation drawer. This is an addition to the source design, which
 * has no mobile nav at all — its header is a fixed 78px bar with a
 * horizontally scrolling nav that does not survive a 375px viewport.
 * See spec §8.5.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-line-deep text-ink transition-colors hover:border-ink"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-x-0 top-[78px] bottom-0 z-50 overflow-y-auto bg-cream px-6 pt-8 pb-12"
        >
          <div className="flex flex-col gap-1">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`border-b border-line py-4 text-[22px] font-bold ${
                    active ? "text-red" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/wholesale"
              onClick={() => setOpen(false)}
              className="rounded-full bg-red px-7 py-4 text-center text-base font-bold text-white"
            >
              Open an account
            </Link>
            <Link
              href="/wholesale"
              onClick={() => setOpen(false)}
              className="rounded-full border-[1.5px] border-line-deep bg-white px-7 py-4 text-center text-base font-bold text-ink"
            >
              Wholesale
            </Link>
          </div>

          <div className="mt-10 text-[15px] leading-relaxed text-muted">
            <a href={site.phoneHref} className="block font-semibold text-ink">
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 block font-semibold text-ink"
            >
              {site.email}
            </a>
            <p className="mt-3">{site.hours}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
