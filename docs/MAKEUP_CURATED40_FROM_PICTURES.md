# H-Beauty — Implemented forty-photo makeup gallery

**Input:** the 40 independent close-up makeup portraits in the user's `Pictures.zip`, in original ZIP member order. No new AI portraits are needed for this collection.

## Committed app integration
- `src/data/makeup-curated-40.ts`: 40 fixed Persian look names, categories, makeup descriptions, thumbnail/full paths, and real salon service IDs.
- `src/data/makeup.ts`: opt-in `VITE_MAKEUP_CURATED_40=true` switches from the existing 48 concepts to the 40 curated photos, without changing the default live release.
- `src/components/salon/makeup-artwork.tsx`: photographs with stable 4:5 crops, lazy previews and full-resolution detail images.
- `src/components/salon/screens/{makeup,home}.tsx` and `src/components/salon/sheets/makeup.tsx`: use those images throughout the existing discovery, favorites, detail and booking pathways.
- `src/styles/makeup-curated-40.css`: responsive rose-and-burgundy Persian salon layout; photo is unobstructed and its name is displayed **beneath** it.
- `scripts/finalize-service-worker.mjs`: offline build validates and pre-caches all 40 full images and 40 thumbnails.
- `npm run verify:makeup-curated-40` / `npm run build:makeup-curated-40` are added to package scripts and designed to fail if assets are missing or mismatched.

## Binary assets and private preview
The chat-provided **HBeauty_Curated40_Implementation.zip** is the canonical package containing:
`public/makeup/curated-40/mk40-01.webp` through `mk40-40.webp` (960×1200), plus `sm/` thumbnails (480×600) and SHA256 manifest. Connected GitHub text-file tools cannot upload binary WebP assets from the local container, so those **80 actual image files are not yet in the remote branch**.

To complete the implementation, copy the package's `public/makeup/curated-40` directory into the repository and commit the binary files. Or extract the entire patch and run:

```bash
python scripts/apply-curated-40-patch.py /path/to/H-beauty
cd /path/to/H-beauty
npm ci
npm run verify:makeup-curated-40
npm run build:makeup-curated-40
```

The patch is designed to be idempotent with this draft branch. Do **not** turn the opt-in flag on in Cloudflare until the files are in its build input. The existing live site is unchanged.

## QA evidence and restrictions
- Locally verified: all 40 source images, 40 full WebPs, and 40 thumbnails decode at their expected dimensions; SHA256 integrity; the Node asset gate passes.
- The standalone lightweight offline gallery rendered 40 cards with no horizontal scroll at 320, 390, 768 and 1280 px in Chromium. At 390 px, modal/detail closeups, saving, searching, and local booking drafts were tested; a found overlay intercept bug was fixed.
- **Not verified:** production React Vite build, CI, and Cloudflare acceptance, because the connected GitHub branch does not contain binary assets. Do not call the draft PR ready to merge into production.
- These AI portraits are inspiration artwork, **not actual makeup services performed by the salon**. Real-person likeness, distinctness of makeup and publication permissions are separate editorial acceptance criteria.
