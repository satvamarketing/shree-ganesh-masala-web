import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * The root not-found, used for URLs that match no route at all. It sits
 * outside the (site) route group, so the chrome is rendered here rather than
 * inherited — a bare 404 with no header or footer strands the visitor.
 */
export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
