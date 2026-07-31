import Image from "next/image";
import type { ReactNode } from "react";
import type { ImageSlot } from "@/data/images";
import { DesignedPanel, Eyebrow } from "@/components/ui";

/**
 * The design's two-column text/image feature block, generalised from the
 * forest panel (reference lines 114-127) and the cream one (lines 192-205).
 */
export function FeaturePanel({
  eyebrow,
  title,
  body,
  image,
  actions,
  reverse = false,
  tone = "forest",
  imageClassName = "",
}: {
  eyebrow: string;
  title: string;
  body: ReactNode;
  image: ImageSlot;
  actions?: ReactNode;
  reverse?: boolean;
  tone?: "forest" | "cream";
  /**
   * Extra classes for the image, for object-position. Wide marketing banners
   * need steering: centre-cropping a 2.9:1 banner into a tall box slices
   * through its lettering.
   */
  imageClassName?: string;
}) {
  const forest = tone === "forest";

  const media = (
    <div
      className={
        forest
          ? "relative min-h-[320px]"
          : "relative aspect-[3/2] overflow-hidden rounded-[24px] bg-sand-deep"
      }
    >
      {image.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 620px"
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <DesignedPanel label={image.alt} />
      )}
    </div>
  );

  const copy = (
    <div
      className={
        forest
          ? "flex flex-col justify-center p-[clamp(36px,4.5vw,64px)] text-[#F2F7EF]"
          : ""
      }
    >
      <Eyebrow tone={forest ? "gold" : "red"} className="mb-4">
        {eyebrow}
      </Eyebrow>
      <h2
        className={`mb-4.5 font-serif text-[clamp(30px,3.4vw,46px)] leading-[1.1] font-normal ${
          forest ? "" : "text-ink"
        }`}
        style={{ textWrap: "pretty" }}
      >
        {title}
      </h2>
      <div
        className={`mb-7 text-[16.5px] leading-[1.7] ${
          forest ? "text-[#F2F7EF]/85" : "text-body"
        }`}
      >
        {body}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );

  if (forest) {
    return (
      <section className="shell py-[clamp(48px,6vw,84px)]">
        <div className="grid overflow-hidden rounded-[28px] bg-forest [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {reverse ? (
            <>
              {media}
              {copy}
            </>
          ) : (
            <>
              {copy}
              {media}
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="shell py-[clamp(64px,8vw,104px)]">
      <div className="grid items-center gap-[clamp(32px,5vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {reverse ? (
          <>
            {media}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {media}
          </>
        )}
      </div>
    </section>
  );
}
