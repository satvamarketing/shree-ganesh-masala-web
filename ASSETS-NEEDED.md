# Assets & content still needed from the client

Everything below is unresolved in the approved design and cannot be sourced
from shreeganesh.com.au. Each ships with a deliberate placeholder, so the site
is complete and shippable as-is — these are quality upgrades, not blockers.

Replacing an image means editing a single entry in `src/data/images.ts` (or
`src/data/brands.ts` for a brand logo). No component changes.

After dropping files into `public/`, run `npm run check:assets` to confirm
every path resolves.

---

## 1. Blocked by a tooling limit — you already own this one

This exists at full quality in the Claude Design project, but the design MCP
caps a single file read at 256 KiB and it exceeds that, so it arrived truncated
(cut off mid-wordmark). Copy it out of the design project manually and it is
done.

| Design project path | Save as | Then set |
| --- | --- | --- |
| `uploads/pasted-1785528957810-0.png` | `public/brands/herbs-and-spices.webp` | `brands.ts` → Herbs & Spices `logo` |

Until then the Herbs & Spices brand tile renders its name as a typographic
wordmark, which reads as intentional.

The same cap also truncated `uploads/badge-australian-owned.png` and all four
`Screenshot 2026-08-01 …png` files. The badge was re-sourced instead — see §4.

## 2. Photography

None of these exist anywhere on the current site.

| Slot (`src/data/images.ts`) | Where it appears | Subject | Target ratio |
| --- | --- | --- | --- |
| `founder` | About hero | Shri Vrajlal Manilal Shah, or the original masala house | 3:4 |
| `plantRoom` | About, why choose us | Ahmedabad blending / grinding room | 4:3 |
| `batchTesting` | About, why choose us | Batch testing, lab measurement | 4:3 |
| `warehouse` | About, why choose us | Acacia Ridge racking, or the delivery van | 4:3 |

Two real banners pulled from the live site (`masalaFeature`, `pickleFeature`)
are in `public/banners/` but currently unplaced: Trade v7's home page is
typographic and has no photographic feature panel. They are kept for reuse.

## 3. Festival dates

Chapter Four counts down to four festivals from `src/data/story.ts`. The design
carried the note "Confirm festival dates against your 2026-27 calendar before
publishing" and these are the dates as drawn, unverified against an almanac.
Please confirm, and note the list needs a yearly top-up: a festival whose date
has passed drops off the countdown rather than sitting at zero.

## 4. Copy

- **Henaa** — what the range actually covers, to firm up the brand blurb.
- **ABN** — for the footer (`site.abn` in `src/data/site.ts`).

## 5. Certification badges — licences to confirm

All three trust marks render in the certification strip on the home and About
pages (`src/components/sections/cert-badges.tsx`), sourced as:

| Badge | Source | Status |
| --- | --- | --- |
| 100% Australian Owned & Operated | Built for this site, in the brand palette | Generic marketing badge — no certifier, no licence needed |
| Australian Owned | Official artwork from `ausowned.com.au` | **Licensed certification trade mark** |
| HACCP International | Official artwork from `haccp-international.com` | **Licensed certification trade mark** |

**Two of these are licensed marks, and both certifiers restrict their use.**
Please confirm before this goes live:

- **Australian Owned** — [ausowned.com.au](https://ausowned.com.au/certification/)
  issues each licensee a unique **AO ID number**, and the official artwork
  carries it. The key file in the design project shows `#00000` where that
  number belongs. Send me your AO ID and I will use the numbered artwork; if
  the licence has lapsed, say so and I will pull the badge.
- **HACCP International** — the mark is the property of HACCP Australia Pty Ltd
  and, per their published
  [trade mark rules](https://haccp-international.com/wp-content/uploads/2017/11/Rules-of-use-of-Certification-marks.pdf),
  "may not be used in any form without the consent and licence" of the owner.
  Confirm the certificate is current and in Shree Ganesh's name.

Removing either badge is a one-line change — delete its entry from `BADGES` in
`cert-badges.tsx`.

Trade v7 also states the claim in copy, and that wording is now live: the ticker
reads "HACCP certified" and the About page's plant caption reads "Ground,
blended and packed at our HACCP-certified facility." If the certificate is not
current, both need pulling along with the badge.

## 6. Social

- Real Facebook and Instagram handles. The current site links to
  `facebook.com/shopify`, an unreplaced Shopify default, so social links are
  hidden entirely until `site.social` is filled in.

---

## Catalog refresh

The 1174-product catalog and its images are imported from the live Shopify
store and committed. To refresh:

```bash
rm -rf public/catalog public/departments   # only for a true re-pull
npm run import:catalog
npm run check:assets
```

Image downloads skip files already on disk, so re-running without deleting is
fast and only picks up new products.
