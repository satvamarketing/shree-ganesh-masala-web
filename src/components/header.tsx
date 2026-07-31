import Link from "next/link";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { NavLinks } from "@/components/nav-links";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-md">
      <div className="shell flex h-[78px] min-w-0 items-center gap-[clamp(14px,2.5vw,34px)]">
        <Logo height={44} priority />
        <NavLinks />

        <div className="ml-auto flex shrink-0 items-center gap-3.5">
          <Link
            href="/wholesale"
            className="hidden text-[clamp(13px,1.15vw,14.5px)] font-bold whitespace-nowrap text-ink transition-colors hover:text-red lg:inline"
          >
            Wholesale
          </Link>
          <Link
            href="/wholesale"
            className="hidden rounded-full bg-red px-[clamp(16px,1.8vw,24px)] py-[13px] text-[clamp(12.5px,1.1vw,14px)] font-bold whitespace-nowrap text-white transition-colors hover:bg-forest sm:inline-block"
          >
            Open an account
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
