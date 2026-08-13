# Marquee at the top, and a Trending section that peeks

Client change, 13 Aug 2026. Two related homepage moves:

1. The marquee goes to the top of the page.
2. Trending moves up to sit right after the hero, showing "a little from the main
   screen" so the visitor is curious enough to scroll.

Both sections already exist. This is repositioning, not new UI.

## What is there now

    marquee-less top
    Header (sticky, 66px, brand red)
    Hero                        (white)
    Ticker                      (the marquee, red)
    ChapterRail (sticky, 52px)
    ch-1 … ch-5
    Trending                    (white)
    CertBadges
    Apply

`Ticker` is used only on the homepage. `ChapterRail` is `sticky top-[66px]`, so it
works wherever it is placed in the flow. No test asserts page order: the three
test files are all `src/lib` unit tests.

## Measured, at the current build

| Viewport | header | hero | marquee + header + hero | Room below |
| --- | --- | --- | --- | --- |
| 1280 × 800 | 67 | 516 | 631 | 169 |
| 1440 × 900 | 67 | 545 | 660 | 240 |
| 1536 × 864 | 67 | 546 | 661 | 203 |
| 1920 × 1080 | 67 | 546 | 661 | 419 |
| 768 × 1024 | 67 | 583 | 698 | 326 |
| 1366 × 640 | 67 | 537 | 652 | **−12** |
| 390 × 844 | 67 | 772 | 887 | **−43** |

Two things follow. There is already room below the hero on most desktop sizes, so
a peek happens by accident, but it ranges from 169px to 419px, which is the
difference between "a hint" and "most of the section". And on a phone, or a short
laptop, there is no room at all.

So the peek has to be **controlled**, and it has to be **conditional**.

## Decisions

Both confirmed with the client before building.

**The marquee sits at the very top, above the header, in a deeper red.** The
marquee and the header are both brand red, so placed adjacent in the same red
they read as one 114px slab before any content. `--color-red-deeper` (`#8f1c18`)
against the header's `#cf322d` keeps them as two strips and leaves the header as
the brand moment. It is not sticky, so it scrolls away and the header takes over.

To sit above the header the marquee must be a sibling rendered before it, and the
header lives in `(site)/layout.tsx`. So the marquee becomes **site-wide**. That is
a deliberate consequence rather than a side effect: the strip is brand-level
content ("Made in Ahmedabad", "Trade only", "HACCP certified"), it reinforces on
every page, and a header that starts 48px down on the homepage but flush on every
other page would read as a bug.

**Trending moves to directly after the hero, and peeks.** Order becomes hero,
Trending, then the chapter rail and the narrative: hook, then product, then story.
The rail stays with the chapters it navigates, which is why Trending goes above
it rather than below.

## How the peek is made deterministic

The hero gets a viewport-relative floor, from `lg` up only:

    min-height: calc(100svh - var(--sg-fold-chrome) - var(--sg-peek))

with `--sg-fold-chrome: 114px` (marquee 48 + header 66) and `--sg-peek: 200px`,
both declared in `globals.css` next to a comment explaining the arithmetic, so
the numbers are not scattered as magic values.

`200px` is chosen from Trending's own geometry, not picked for feel: its top
padding is 64–70px, the eyebrow and its margin about 26px, and the section
heading about 40–44px. That puts the bottom of "What shops are reordering" at
roughly 130–140px, and the card grid starts at about 166–176px. A 200px peek
therefore shows the label and the heading, and clips the cards a couple of dozen
pixels in. The visitor learns *what* is down there without seeing the products,
which is the whole point.

Because the hero grows on tall screens, its content is vertically centred rather
than left to sit at the top with the extra height dumped underneath. That also
serves an earlier client note about the site feeling built for mobile on a large
display.

`svh` rather than `vh` so a mobile browser's collapsing toolbar cannot change the
arithmetic.

**Where the peek cannot happen it degrades to nothing.** `min-height` is a floor,
so when the natural hero is taller than the target the hero simply keeps its own
height and the peek shrinks. At 1280 × 800 that means about 169px, enough for the
label and heading. At 1366 × 640 and on phones there is no peek, and the sections
follow one another normally. No content is ever clipped to manufacture a peek.

## Trending needs a visible edge

Trending is currently `bg-white` and the hero is `bg-white`. Directly adjacent
and peeking, that reads as the hero simply continuing, and the peek does not
register as another section. Trending becomes `bg-sand`, which is already the
alternating ground used by chapters two and three, so the fold cut lands on a
colour change.

## Risks checked before building

- **Stranded reveal.** `Reveal` sets `opacity: 0` after mount. It reveals
  immediately when an element's top is within 90% of the viewport, so at a 200px
  peek (top at `100svh − 200`) it reveals on load. A much smaller peek would fall
  through to the IntersectionObserver, whose `threshold: 0.08` a thin sliver of a
  tall section may not meet, leaving the peek invisible at rest. This is a second
  reason the peek is 200px and not 60px.
- **Sticky offsets.** The header stays `sticky top-0` and the rail
  `top-[66px]`, so `scroll-padding-top: 7.5rem` still clears both. The marquee is
  static and above them, so it does not enter the calculation.
- **Scroll-spy.** The rail moves down the page but its threshold is measured from
  `getBoundingClientRect().top` per chapter, so it is position-independent.

## Out of scope

Reordering anything below the chapters, and any change to Trending's product
selection or to the marquee's wording.
