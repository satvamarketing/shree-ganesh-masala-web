import Link from "next/link";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Shared primitives. Variants map to the exact button treatments in
 * Shree Ganesh Retail v5 — see design/shree-ganesh-retail-v5.reference.html.
 * ------------------------------------------------------------------ */

const BUTTON_VARIANTS = {
  red: "bg-red text-white hover:bg-red-dark",
  gold: "bg-gold text-ink hover:bg-white",
  outline: "bg-white text-ink border-[1.5px] border-line-deep hover:border-ink",
  ink: "bg-ink text-white hover:bg-forest",
  forest: "bg-forest text-white hover:bg-ink",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

export function Button({
  href,
  variant = "red",
  children,
  className = "",
}: {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-full px-7 py-4 text-[15.5px] font-bold transition-colors ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/** The design's repeated small uppercase label above a heading. */
export function Eyebrow({
  children,
  tone = "red",
  className = "",
}: {
  children: ReactNode;
  tone?: "red" | "gold";
  className?: string;
}) {
  return (
    <div
      className={`text-[12.5px] font-extrabold uppercase tracking-[2.5px] ${
        tone === "gold" ? "text-gold" : "text-red"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Eyebrow + serif title, with an optional right-aligned action link. */
export function SectionHeading({
  eyebrow,
  title,
  tone = "light",
  action,
  align = "start",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  tone?: "light" | "dark";
  action?: { href: string; label: string };
  align?: "start" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`mb-10 flex flex-col gap-6 sm:flex-row ${
        centered ? "items-center text-center" : "sm:items-end sm:justify-between"
      } ${className}`}
    >
      <div className={centered ? "mx-auto" : ""}>
        {eyebrow ? (
          <Eyebrow tone={tone === "dark" ? "gold" : "red"} className="mb-3">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2
          className={`font-serif text-[clamp(32px,3.6vw,50px)] leading-[1.1] font-normal ${
            tone === "dark" ? "text-cream" : "text-ink"
          }`}
          style={{ textWrap: "pretty" }}
        >
          {title}
        </h2>
      </div>
      {action ? (
        <Link
          href={action.href}
          className="shrink-0 border-b-2 border-red pb-[3px] text-[14.5px] font-bold whitespace-nowrap text-red hover:text-red-dark"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

/** The hero / story statistic pair. */
export function Stat({
  value,
  label,
  tone = "light",
}: {
  value: string;
  label: string;
  tone?: "light" | "dark";
}) {
  return (
    <div>
      <div
        className={`font-serif text-3xl ${tone === "dark" ? "text-gold" : "text-forest"}`}
      >
        {value}
      </div>
      <div
        className={`mt-0.5 text-[13px] ${
          tone === "dark" ? "text-cream/65" : "text-muted"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

/**
 * Renders in place of an unfilled image slot: a brand-palette gradient with
 * the slot's subject as quiet centred text. Deliberately not stock
 * photography, which would misrepresent the business. Must never read as a
 * broken image.
 */
export function DesignedPanel({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-sand-deep ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sand via-sand-deep to-[#E6D3B4]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #22160F 1px, transparent 0)",
          backgroundSize: "14px 14px",
        }}
      />
      <span className="relative max-w-[22ch] px-6 text-center font-serif text-lg leading-snug text-faint">
        {label}
      </span>
    </div>
  );
}

/**
 * Fallback for a product or brand with no image file: its name set in the
 * brand serif on a warm field. Used by ProductCard and BrandCard.
 */
export function WordmarkFallback({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-sand px-5 ${className}`}
    >
      <span className="text-center font-serif text-lg leading-tight text-faint">
        {name}
      </span>
    </div>
  );
}
