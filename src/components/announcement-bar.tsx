import Link from "next/link";
import { site } from "@/data/site";

export function AnnouncementBar() {
  return (
    <div className="bg-forest px-6 py-2.5 text-[13.5px] font-medium text-[#E9F3E4]">
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-1">
        <span>
          Wholesale only: carton pricing for grocers, restaurants &amp; caterers
        </span>
        <span className="hidden opacity-40 sm:inline">•</span>
        <span className="hidden sm:inline">
          Free {site.deliveryArea} delivery over ${site.freeDeliveryThreshold}
        </span>
        <span className="hidden opacity-40 sm:inline">•</span>
        <Link
          href="/#apply"
          className="hidden font-bold text-gold hover:text-white sm:inline"
        >
          Wholesale enquiries →
        </Link>
      </div>
    </div>
  );
}
