# H-Beauty — 40 AI makeup portrait review branch

**Branch:** `feature/v33-ai-makeup-40-review`. Nothing in this feature auto-merges or publishes. The production makeup gallery remains unchanged.

## Verified inventory and its limits

- 40 unique look IDs, Persian names and separate art-direction instructions are defined in `src/data/makeup-ai-40.json`.
- 20 AI-rendered WebP candidates exist **only in the downloadable offline review ZIP** from the chat; they have not been added to GitHub as binary assets.
- The other 20 look slots have NO portrait image.
- 0 of 40 portraits has identity / distinct-makeup / public-permission approval.
- Some source portraits are very similar, even if SHA256 differs. Pixel uniqueness is **not** makeup-style uniqueness. Review candidates are NOT certified final artwork.
- Unlike an earlier real-photo proposal, the user's latest brief requests **AI-generated photorealistic makeup inspiration** of the original model, not photographs of performed services.

## Import and preview

1. Extract `Hananeh_Beauty_40_Style_Review_Kit_2026-10-23.zip` on a local development computer.
2. From the root of the H-Beauty repository, run:
   `node scripts/import-makeup-ai-candidates.mjs "/path/to/HBeauty_40_Review_20261023"`
   This checks the expected individual filenames, WebP signatures, and SHA256 **before** copying all twenty. If one is missing or substituted, nothing is copied.
3. `npm run verify:makeup-ai-40` checks the 40 records and all unapproved states. `npm run verify:makeup-ai-candidates` checks the twenty local files.
4. `npm run build:makeup-ai-review` builds the app with `VITE_HB_AI_REVIEW=true` and shows a dedicated, beautifully styled Persian 40-look review gallery. It only displays portraits when all 20 candidate files are actually present. It always marks the remaining 20 as missing. Regular `npm run build` keeps the standard existing gallery.
5. Do not run an upload or deploy to the live Cloudflare worker until final review and approval.

## Production acceptance

`npm run verify:makeup-ai-release` fails until all forty individual `public/makeup/ai-portraits/hb-makeup-NN-<slug>.webp` files exist, none has an identical SHA256, and a **private** `.makeup-ai-approvals.local.json` (or `HB_AI_APPROVALS_PATH`) records for every ID:

```json
{
  "looks": {
    "hb-makeup-01": {
      "assetSha256": "<actual hex SHA256 of the image>",
      "identityApproved": false,
      "makeupDistinctApproved": false,
      "publishApproved": false,
      "modelPublicationConsent": false,
      "provenance": "ai-generated"
    }
  }
}
```

Only authorized, real reviewers may set approval fields to true. Do not commit the consent file or upload it to a public path. Preserve natural face proportions, eyebrows, nose, rounded cheeks, smile dimples, full hairline with no exposed scalp, varied **actual** eye/lip/blush artistry, portrait framing, skin texture, realistic photography and no text printed on the image. Render Persian names as accessible text **beneath** photographs.

An automated hash or screenshot test cannot independently certify visual resemblance, makeup distinctions, legal release, or image quality. A successful release verifier is a necessary technical gate, not a guarantee.
