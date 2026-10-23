# H-Beauty v37 — Verified offline mobile review preview (not production)

## Actual delivery
- Private downloadable `HBeauty_V37_Offline_Mobile_Review_Kit.zip` contains 22 individual AI-generated WebP candidate portraits, the original model image for comparison, the 40-look editorial review interface, and a **standalone `index-portable.html`**.
- The standalone HTML embeds all 22 WebP portraits and the original source photo as base64 data URLs; it needs no localhost server or external network connection. Keep the file PRIVATE because it contains a person's portrait.
- 18 planned looks are still missing; 0 of 40 looks is approved for production. Generated images are beauty inspiration, NOT actual salon performed-makeup photographs. No new portrait is counted in this release.
- File integrity checks: all 22 are WebP, at least 1000x1300, have the right portrait aspect, and unique SHA256 hashes. This does not prove art uniqueness or reference-face identity.

## Browser verification actually executed
Chromium accessed the HTML using Playwright `page.set_content()`, since local file navigation is blocked in this environment. The source HTML and scripts executed normally in the browser, with the image files embedded.

| Browser width | Catalog cards | Images decoded | Horizontal overflow | JS errors |
|---|---:|---:|---|---:|
| 320px | 40 | 22 / 22 | none | 0 |
| 390px | 40 | 22 / 22 | none | 0 |
| 768px | 40 | 22 / 22 | none | 0 |

390px interaction tests: opened portrait detail, decoded original source face, closed dialog, searched Persian phrase `کبالت` and got exactly one matching look. These passed in the tested standalone file. Screenshots are included in the private ZIP.

**Limitations:** It is a test of the separately packaged standalone HTML, NOT a GitHub Actions run, NOT an installed mobile phone test, and NOT an independently verified Cloudflare deployment. Use normal production CI and testing before considering a release.

## Creative acceptance blockers
- User wants 40 nonduplicated premium photorealistic portraits of *the same original woman*. Existing candidate set contains probable nude/rose eye-and-lip duplicates (especially 09/17 and 06/13) and noticeable face-drift in 21/22. No image was auto-approved.
- Two Canva reference-guided image jobs were submitted in the preceding work. Matte Terracotta completed into Canva media `MAHY2T8DJK4` but its final image bytes and identity likeness have not been independently inspected or exported into this package. It is NOT counted. Silver Chrome completion remains unverified.
- Continue generating/editing only from the original permitted image, one separate 3:4 portrait at a time; correct face geometry, ensure natural forehead hairline with no visible scalp, and make visible makeup techniques genuinely different.
- Do not merge this review branch, publish the archive, or silently publish the model source image without rights-holder approval.
