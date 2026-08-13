import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { OrganizationJsonLd } from "@/components/json-ld";
import { Ticker } from "@/components/ticker";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      {/* The marquee sits above the header, so it has to be a sibling rendered
          before it, which puts it on every page rather than just the home page.
          That is intended: the strip is brand-level content, and a header that
          started 48px down on the home page but flush everywhere else would read
          as a bug. It is static, so it scrolls away and the header takes over. */}
      <Ticker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
