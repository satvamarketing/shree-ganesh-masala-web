"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/logo";
import { nav, site } from "@/data/site";

/**
 * Mobile navigation drawer. An addition to the source design, which has no
 * mobile nav at all — its header is a fixed 78px bar with a horizontally
 * scrolling nav that does not survive a 375px viewport. See spec §8.5.
 *
 * The panel is portalled to <body> rather than rendered in place. The header
 * carries `backdrop-blur`, and backdrop-filter makes an element a containing
 * block for position:fixed descendants — so a drawer rendered inside the
 * header positions against the header, not the viewport, and collapses to an
 * ~80px sliver clipped under it.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /**
   * Captured in the click handler, not in the effect. Between the click and
   * the effect the page shifts (focus scrolling and scroll anchoring as the
   * portal mounts), so reading window.scrollY in the effect restores the user
   * to the wrong place — consistently ~440px off.
   */
  const savedScroll = useRef(0);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      // Keep Tab inside the panel while it is the only thing on screen.
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    // Lock the page behind the drawer without losing scroll position.
    const scrollY = savedScroll.current;
    const { style } = document.body;
    const previous = {
      position: style.position,
      top: style.top,
      width: style.width,
      overflow: style.overflow,
    };
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    // Focus the panel itself, not its first control. Focusing the logo link
    // draws the red focus ring around the wordmark, which reads as a defect.
    panelRef.current?.focus();

    return () => {
      style.position = previous.position;
      style.top = previous.top;
      style.width = previous.width;
      style.overflow = previous.overflow;
      // Force a reflow before restoring scroll. While the body was fixed the
      // document had no height, so scrollTo would clamp to whatever the
      // collapsed page allowed and land the user part-way up.
      void document.body.offsetHeight;
      // Restore instantly. globals.css sets `scroll-behavior: smooth`, which
      // would animate the page back over ~600ms and read as jank on close.
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      root.style.scrollBehavior = previousBehavior;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!open) savedScroll.current = window.scrollY;
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-line-deep text-ink transition-colors hover:border-ink"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* No mounted guard needed: `open` starts false on both server and
          client, and can only become true from a click, which is client-side. */}
      {open
        ? createPortal(
            <div
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="fixed inset-0 z-[100] lg:hidden"
            >
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="absolute inset-0 h-full w-full cursor-default bg-ink/55 backdrop-blur-[2px]"
              />

              <div
                ref={panelRef}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex outline-none w-[min(88vw,380px)] flex-col overflow-y-auto bg-cream shadow-[0_0_60px_rgba(34,22,15,0.35)]"
                style={{
                  paddingTop: "max(env(safe-area-inset-top), 0px)",
                  paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
                }}
              >
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <Logo height={38} className="[&_img]:!h-[38px]" />
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close menu"
                    className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-line-deep text-ink"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col px-5 pt-2">
                  {nav.map((item) => {
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={close}
                        className={`border-b border-line py-4 text-xl font-bold ${
                          active ? "text-red" : "text-ink"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="flex flex-col gap-3 px-5 pt-6">
                  <Link
                    href="/wholesale"
                    onClick={close}
                    className="rounded-full bg-red px-7 py-4 text-center text-base font-bold text-white"
                  >
                    Open an account
                  </Link>
                  <Link
                    href="/wholesale"
                    onClick={close}
                    className="rounded-full border-[1.5px] border-line-deep bg-white px-7 py-4 text-center text-base font-bold text-ink"
                  >
                    Wholesale pricing
                  </Link>
                </div>

                <div className="mt-auto border-t border-line px-5 py-6 text-[15px]">
                  <a
                    href={site.phoneHref}
                    className="flex items-center gap-2.5 py-1.5 font-semibold text-ink"
                  >
                    <Phone size={16} className="text-red" aria-hidden="true" />
                    {site.phone}
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-2.5 py-1.5 font-semibold break-all text-ink"
                  >
                    <Mail size={16} className="text-red" aria-hidden="true" />
                    {site.email}
                  </a>
                  <p className="mt-2 text-[14px] text-muted">{site.hours}</p>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
