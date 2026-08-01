import Link from "next/link";
import { FacebookIcon, InstagramIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { brands } from "@/data/brands";
import { site } from "@/data/site";

const TRADE = [
  { label: "Our range", href: "/range" },
  { label: "Departments", href: "/departments" },
  { label: "Wholesale", href: "/wholesale" },
];

const COMPANY = [
  { label: "Our story", href: "/story" },
  { label: "Contact", href: "/contact" },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-[11.5px] font-extrabold tracking-[2px] text-gold uppercase">
      {children}
    </div>
  );
}

export function Footer() {
  // Only render a social icon when a real handle exists. The live site links
  // to facebook.com/shopify, an unreplaced default — see spec §8.4.
  const socials = [
    { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  ].filter((s) => s.href !== "");

  return (
    <footer className="bg-ink text-footer-text">
      <div className="shell pt-[clamp(48px,6vw,72px)] pb-9">
        <div className="grid gap-10 border-b border-cream/15 pb-10 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          <div>
            <div className="mb-4.5">
              <Logo height={44} />
            </div>
            <p className="max-w-[280px] text-sm leading-relaxed">
              Indian pantry staples made in Ahmedabad, delivered across
              Queensland. Makers of{" "}
              {brands.map((b) => b.name).join(", ").replace(/, ([^,]*)$/, " and $1")}.
            </p>
          </div>

          <div>
            <ColumnHeading>Trade</ColumnHeading>
            <div className="grid gap-2.5 text-[14.5px]">
              {TRADE.map((l) => (
                <Link key={l.href} href={l.href} className="text-footer-text hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <ColumnHeading>Company</ColumnHeading>
            <div className="grid gap-2.5 text-[14.5px]">
              {COMPANY.map((l) => (
                <Link key={l.href} href={l.href} className="text-footer-text hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <ColumnHeading>Contact</ColumnHeading>
            <div className="grid gap-2.5 text-[14.5px] leading-relaxed">
              <span>
                {site.address.street},
                <br />
                {site.address.suburb} {site.address.state} {site.address.postcode}
              </span>
              <a href={site.phoneHref} className="text-footer-text hover:text-white">
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="text-footer-text hover:text-white"
              >
                {site.email}
              </a>
              <span>{site.hours}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 pt-6 text-[13px]">
          <span>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
            {site.abn ? ` ABN ${site.abn}.` : ""}
          </span>
          {socials.length > 0 ? (
            <div className="flex gap-4">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-footer-text hover:text-white"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
