import Image from "next/image";
import Link from "next/link";
import { images } from "@/data/images";

/**
 * The wordmark is a red cartouche with white lettering on a transparent
 * background, so it reads on both the cream header and the dark footer with
 * no plate behind it.
 */
export function Logo({
  height = 44,
  priority = false,
  className = "",
}: {
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  const slot = images.logo;
  return (
    <Link
      href="/"
      className={`flex shrink-0 items-center ${className}`}
      aria-label="Shree Ganesh home"
    >
      <Image
        src={slot.src}
        alt={slot.alt}
        width={Math.round(height * (440 / 186))}
        height={height}
        priority={priority}
        className="block w-auto"
        style={{ height }}
      />
    </Link>
  );
}
