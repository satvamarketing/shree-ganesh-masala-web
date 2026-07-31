import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Chrome comes from the (site) layout. */
export default function NotFound() {
  return <NotFoundContent />;
}
