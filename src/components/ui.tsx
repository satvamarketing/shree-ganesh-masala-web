import Link from "next/link";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Shared primitives, from Shree Ganesh Trade v7.
 * See design/shree-ganesh-trade-v7.reference.html.
 * ------------------------------------------------------------------ */

const BUTTON_VARIANTS = {
  red: "bg-red text-white hover:bg-red-dark",
  gold: "bg-gold text-ink hover:bg-gold-soft",
  ink: "bg-ink text-white hover:bg-red",
  outlineLight:
    "border-b-2 border-gold text-white hover:text-gold rounded-none px-1.5",
  outlineDark:
    "border-[1.5px] border-line-deep bg-white text-ink hover:border-ink",
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
  const pill = variant === "outlineLight" ? "" : "rounded-full px-7 py-3.5";
  return (
    <Link
      href={href}
      className={`inline-block text-[14.5px] font-extrabold tracking-[0.4px] transition-colors ${pill} ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/** The small uppercase label above every heading. */
export function Eyebrow({
  children,
  tone = "red",
  className = "",
}: {
  children: ReactNode;
  tone?: "red" | "gold" | "faint" | "redDeep";
  className?: string;
}) {
  const colour = {
    red: "text-red",
    gold: "text-gold",
    faint: "text-faint",
    redDeep: "text-red-deeper",
  }[tone];
  return (
    <div
      className={`text-[11.5px] font-extrabold tracking-[2.5px] uppercase ${colour} ${className}`}
    >
      {children}
    </div>
  );
}

/** The pill badge used at the top of the dark heroes. */
export function HeroBadge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-red/35 px-4.5 py-2.5 text-[11.5px] font-extrabold tracking-[2.2px] text-red uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-red" aria-hidden="true" />
      {children}
    </div>
  );
}

/** Serif heading, the workhorse of v7. */
export function Display({
  children,
  as: Tag = "h2",
  size = "chapter",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "hero" | "chapter" | "section" | "card";
  className?: string;
}) {
  const scale = {
    hero: "text-[clamp(34px,4.4vw,60px)] leading-[1.05]",
    chapter: "text-[clamp(27px,3vw,42px)] leading-[1.1]",
    section: "text-[clamp(24px,2.4vw,34px)] leading-[1.15]",
    card: "text-[clamp(20px,1.7vw,25px)] leading-[1.2]",
  }[size];
  return (
    <Tag
      className={`font-serif font-normal ${scale} ${className}`}
      style={{ textWrap: "pretty" }}
    >
      {children}
    </Tag>
  );
}

/** The italic gold pull-line under the hero headings. */
export function PullLine({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-serif text-[clamp(20px,2.1vw,30px)] leading-[1.34] text-red italic ${className}`}
    >
      {children}
    </p>
  );
}

/** Hero statistic: big serif figure over an uppercase caption. */
export function Stat({
  value,
  label,
  onDark = false,
}: {
  value: string;
  label: string;
  onDark?: boolean;
}) {
  return (
    <div>
      <div
        className={`font-serif text-[clamp(26px,2.4vw,36px)] leading-none ${
          onDark ? "text-gold" : "text-red"
        }`}
      >
        {value}
      </div>
      <div
        className={`mt-2 text-[12px] tracking-[1.4px] uppercase ${
          onDark ? "text-white/65" : "text-muted"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

/** The oversized chapter numeral behind each section. */
export function ChapterNumeral({
  numeral,
  side = "right",
  tone = "light",
}: {
  numeral: string;
  side?: "left" | "right";
  tone?: "light" | "dark" | "sand";
}) {
  const colour = {
    light: "text-shell",
    sand: "text-sand-deeper",
    dark: "text-white/[0.10]",
  }[tone];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -top-8 font-serif text-[clamp(180px,26vw,360px)] leading-[0.8] select-none ${colour} ${
        side === "right" ? "right-0 lg:-right-10" : "left-0 lg:-left-8"
      }`}
    >
      {numeral}
    </div>
  );
}

/**
 * Stands in for an image slot the client has not supplied yet. Deliberately
 * not stock photography, which would misrepresent the business.
 */
export function DesignedPanel({
  label,
  tone = "sand",
  className = "",
}: {
  label: string;
  tone?: "sand" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
        dark ? "bg-red-dark" : "bg-sand-deep"
      } ${className}`}
    >
      <div
        className={`absolute inset-0 ${
          dark
            ? "bg-gradient-to-br from-red via-red-dark to-red-deeper"
            : "bg-gradient-to-br from-sand via-sand-deep to-sand-deeper"
        }`}
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${
            dark ? "#FFFFFF" : "#231F1D"
          } 1px, transparent 0)`,
          backgroundSize: "14px 14px",
        }}
      />
      <span
        className={`relative max-w-[24ch] px-6 text-center font-serif text-lg leading-snug ${
          dark ? "text-white/55" : "text-faint"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/** Fallback for a product or brand with no image file. */
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

/** Heading row with an optional right-aligned action, for catalogue pages. */
export function SectionHeading({
  eyebrow,
  title,
  action,
  align = "start",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
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
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <Display size="section" className="text-ink">
          {title}
        </Display>
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
