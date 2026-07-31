# Assets & content still needed from the client

Everything below is unresolved in the approved design and cannot be sourced
from shreeganesh.com.au. Each ships with a deliberate placeholder, so the site
is complete and shippable as-is — these are quality upgrades, not blockers.

Replacing an image means editing a single entry in `src/data/images.ts` (or
`src/data/brands.ts` for a brand logo). No component changes.

After dropping files into `public/`, run `npm run check:assets` to confirm
every path resolves.

---

## 1. Blocked by a tooling limit — you already own these two

These exist at full quality in the Claude Design project, but the design MCP
caps a single file read at 256 KiB and both exceed it, so they arrived
truncated (one cut off mid-wordmark, the other decoding as repeating garbage).
Copy them out of the design project manually and they are done.

| Design project path | Save as | Then set |
| --- | --- | --- |
| `uploads/pasted-1785528957810-0.png` | `public/brands/herbs-and-spices.webp` | `brands.ts` → Herbs & Spices `logo` |
| `uploads/badge-australian-owned.png` | `public/badges/australian-owned.webp` | `images.ts` → `badgeAustralianOwned.src` |

Until then: the Herbs & Spices brand tile renders its name as a typographic
wordmark, and the certification section renders without a badge image. Both
read as intentional.

There is also `uploads/AO_LOGO_KEY_1_b8b07b31f3.webp` in the design project. It
came through intact but is the brand-guidelines *key* artwork — the roundel
overlaid with numbered callout dots and a `#00000` placeholder — so it is not
usable as a site badge. A clean "Australian Owned Certified" roundel would be.

## 2. Photography

None of these exist anywhere on the current site.

| Slot (`src/data/images.ts`) | Subject | Target ratio |
| --- | --- | --- |
| `hero` | Finished dish styled on a table, warm daylight | 4:3 |
| `founder` | Shri Vrajlal Manilal Shah, archival portrait | 3:4 |
| `warehouse` | Pallets / cartons on the Acacia Ridge dock | 16:9 |
| `archival1969` | The original Ahmedabad shop or early packing | 16:9 |
| `qualityLine` | Ahmedabad packing line or spice pouches | 4:3 |

## 3. Copy

- **Our Story, chapter 04** — the year Shree Ganesh began distributing in
  Australia, the first Queensland stockists, and how the Acacia Ridge facility
  began. The design itself flags this as awaiting client input.
- **Henaa** — what the range actually covers, to firm up the brand blurb.
- **ABN** — for the footer (`site.abn` in `src/data/site.ts`).

## 4. Claims to confirm

- **HACCP certification.** The design asserted it — as a hero statistic, a
  marquee item, and a certification badge — but the word appears nowhere on the
  current shreeganesh.com.au and no certificate was supplied. Publishing an
  unverified food-safety certification is a compliance exposure, so it is
  omitted site-wide. Send the certificate and it can be switched on: the badge
  slot and the copy are already in place, commented, in `src/data/images.ts`
  and the certification section.

## 5. Social

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
