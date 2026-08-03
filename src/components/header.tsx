import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { NavLinks } from "@/components/nav-links";

/**
 * v7's header: deep teal, sticky, 74px, with a red hairline under it
 * (reference lines 28-40).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-red/28 bg-teal">
      <div className="shell flex h-[74px] min-w-0 items-center gap-[clamp(18px,3vw,40px)]">
        <Logo height={40} priority />
        <NavLinks />

        <div className="ml-auto flex shrink-0 items-center gap-3.5 lg:hidden">
          <Link
            href="/#apply"
            className="hidden rounded-full bg-red px-5 py-3 text-[12px] font-extrabold tracking-[1px] whitespace-nowrap text-white uppercase transition-colors hover:bg-red-dark sm:inline-block"
          >
            Open an account
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
