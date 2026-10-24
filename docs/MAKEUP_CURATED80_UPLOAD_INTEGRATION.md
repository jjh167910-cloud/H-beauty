# Curated 80 makeup portraits — user's uploaded image collection

**Status:** React implementation committed to **draft PR #11**. The attached WebP binaries are **not yet in GitHub** and no Cloudflare publication has occurred.

## Authoritative source images

- Initial forty photo assets come from `Pictures.zip`, numbered 02–42 excluding 07, with corrected Persian and English names in `src/data/makeup-curated-40.ts`.
- New forty photo assets come from `HBeauty_Makeup_43-82.zip`, containing 40 full-size PNG files named **`43 - Office Polished.png` through `82 - J-Beauty Coral.png`**. Filenames in this uploaded ZIP are the source of truth. An earlier unrelated generated *prompt idea bank* numbered 43–82 is explicitly superseded.
- `src/data/makeup-curated-43-82.ts` defines their Persian/English names, descriptions, original numbers, categories, service IDs, and distinct `mk80-43`…`mk80-82` favorite/booking identifiers.
- The original forty `mk40-XX` IDs remain unchanged.

## Data and UI

The app uses **one gallery** with the six existing categories, its original search, saved styles, details, and booking-draft workflow. When `VITE_MAKEUP_CURATED_80=true`, the gallery adds both sets, ordered by original style numbers. The mobile view has an accessible segmented collection switch for **all 80**, **original 40**, and **new 40**. Image labels stay beneath photographs, never overlaid.

The new image paths are `/makeup/curated-80/mk80-XX.webp` with light thumbnails at `/makeup/curated-80/sm/mk80-XX.webp`. Full images use **960×1200**, thumbnails **480×600**. The old photo directory `public/makeup/curated-40/` remains intact.

## Importing the missing binary assets

Download **`HBeauty_80_Makeup_Complete_Import.zip`** attached in this ChatGPT conversation. It contains **all 160 WebPs** (80 full portraits and 80 thumbnails), their two manifests, exact SHA256 provenance, standalone offline gallery preview, CSV/JSON mapping, and `scripts/import-80-assets.py`.

Use the review branch checkout (`feature/v33-ai-makeup-40-review`), not the live main branch. In GitHub Codespaces, extract the package and run:

```bash
python /path/to/HBeauty_Makeup80_Release_Kit/scripts/import-80-assets.py /workspaces/H-beauty --build
```

This checks file integrity before copying 162 assets (160 WebPs + two manifests), then invokes `npm run verify:makeup-curated-80` and the optional full React `npm run build:makeup-curated-80`. After reviewing, commit and push the binary files to the feature branch:

```bash
git add public/makeup/curated-40 public/makeup/curated-80
git commit -m "assets(makeup): import 80 user-supplied makeup portraits"
git push
```

The review branch already has the required metadata, asset reader, filter controls, offline precache integration, and Node verification scripts. Production flags are **off by default**. The existing Cloudflare deployment workflow is preserved and has opt-in image verification when the 80 flag is enabled.

## Publish gates

- **Technical gate:** `npm run verify:makeup-curated-80`, `npm run typecheck`, `npm run build:makeup-curated-80`, CI, real mobile browser QA after assets are imported.
- **Editorial and permissions gate:** visually inspect all 80 looks against each other and the model reference, resolve near-identical makeup candidates, confirm image origin and model likeness consent, and collect private publication approvals. `npm run verify:makeup-curated-80-release` requires this private approval record.
- **Only then:** explicitly enable Cloudflare build variable `VITE_MAKEUP_CURATED_80=true` (and matching GitHub Actions repository variable `HBEAUTY_CURATED_80=true`) for the designated deploy system, merge approved PR, and verify at the [live Worker](https://h-beauty.mostifa2273.workers.dev/#/).

The images are AI-generated inspiration, not proof of salon makeup services performed for real clients.

## Verification already performed in this chat

- The 40 uploaded PNGs are present and decoded at **1126×1397 RGB**.
- All 160 optimized WebPs decode successfully. Their SHA256 checksums match the two manifests and all 80 master hashes are distinct.
- An offline standalone preview passes JavaScript syntax and headless JS DOM-function tests for 80 cards, new/old filtering, English search, bridal category, opening/closing a detail modal, and saving favorites.
- Automated Chrome navigation to file and local HTTP URLs was **blocked by environment policy**, so end-to-end browser/mobile interactive QA and a full React deployment build are **not certified** here.
