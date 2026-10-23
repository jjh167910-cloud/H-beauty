# H-Beauty v31.4 — original-face Makeup Atelier

**Status: review branch / PR #9. No virtual try-on.**

## Model identity and imagery
- The model is the **exact supplied selfie** (`1000006327.jpg`), cropped without facial editing or AI-based identity synthesis.
- The published local asset `public/makeup/model-reference.webp` is hashed and immutable at SHA-256 `769e44737d161e77845a9fdb0c6475a75262f01384b369fd9dee3cc20c0cb786`.
- Every card, detail view, saved look, home feature, booking summary, and service thumbnail references this one asset; thumbnails of eyes and lips are CSS crops of that same image.
- The 48 cards describe suggested *palette and style concepts* rather than 48 actual makeup applications. **The colors are not painted onto the photograph**; do not call these results or represent them as salon work samples.
- Because the original image was taken with a phone and fixed makeup, images cannot accurately show 48 visibly different makeup executions while retaining the original pixels. Additional genuine photographs or explicitly approved edits would be needed for that level of variation.

## User experience
- Gallery tab has hair / makeup switch, search, six makeup category chips, 48 concepts, localized titles, proposed swatches, clickable details, and heart favorites.
- Reference design alignment: blush/porcelain surfaces, garnet appointment CTAs, 3:4 portrait framing, centered card captions, unobtrusive save icon at corner, and service/time/price-status panel in detail.
- Makeup favorites persist independently of numeric hairstyle IDs without losing existing data.
- Booking request includes makeup ID, service and optional hairstyle. Consultation-priced services display *قیمت پس از مشاوره*, not invented prices.
- Offline: no remote photo requests, no file upload/camera/face tracking or paid APIs.

## QA / publishing gate
- Check `node --test tests-node/*.test.mjs` for the locked source image, service-worker offline shell, and asset integrity.
- Check TypeScript, Vite production build and Playwright React tests; inspect actual UI screenshots for gallery cards and detail at 320px, 390px, 768px and dark mode.
- Verify that use of the model's image is authorized for public salon marketing before merging and deploying. Separate photo editing/publication approval from functional QA.
- Existing production v30 remains unaffected until the review branch is merged.
