import Image from "next/image";
import Link from "next/link";
import { images } from "@/data/images";

export function Logo({
  height = 44,
  onCream = true,
  priority = false,
}: {
  height?: number;
  /** False on the dark footer, where the wordmark needs a light chip behind it. */
  onCream?: boolean;
  priority?: boolean;
}) {
  const slot = images.logo;
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="Shree Ganesh — home">
      <Image
        src={slot.src}
        alt={slot.alt}
        width={Math.round(height * (440 / 186))}
        height={height}
        priority={priority}
        className={
          onCream
            ? "block w-auto"
            : "block w-auto rounded-[10px] bg-white px-3 py-1.5"
        }
        style={{ height }}
      />
    </Link>
  );
}
