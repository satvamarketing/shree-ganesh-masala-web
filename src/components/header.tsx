import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { NavLinks } from "@/components/nav-links";

/**
 * Header: brand red, sticky, 66px. Teal was removed on client feedback.
 * (reference lines 28-40).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-red">
      <div className="shell flex h-[66px] min-w-0 items-center gap-[clamp(18px,3vw,40px)]">
        <Logo height={40} priority />
        <NavLinks />

        <div className="ml-auto flex shrink-0 items-center gap-3.5 lg:hidden">
          <Link
            href="/#apply"
            className="hidden rounded-full bg-white px-5 py-2.5 text-[12px] font-extrabold tracking-[1px] whitespace-nowrap text-red uppercase transition-colors hover:bg-gold hover:text-ink sm:inline-block"
          >
            Open an account
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
