import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { OrganizationJsonLd } from "@/components/json-ld";
import { AnnouncementBar } from "@/components/announcement-bar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      {/* The announcement bar sits above the header on every page, as on the
          original site. It is static, so it scrolls away and the sticky header
          takes over. */}
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
