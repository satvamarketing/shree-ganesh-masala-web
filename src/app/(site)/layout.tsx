import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { OrganizationJsonLd } from "@/components/json-ld";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
