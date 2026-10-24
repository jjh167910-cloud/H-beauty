# H-Beauty continuation — data-derived gallery and GPT Image 2.5 status

This branch is an internal review feature only. Production remains unchanged.

## Verified on this continuation
- Original photo reference is still available in the connected ElevenLabs flow.
- Silver Chrome #23 was generated with explicit GPT Image 2.5 Sunburst parameters: 3:4 portrait, 2K, high quality. The resulting master reports **1536 × 2048** with generation ID `cj9Wuf40GbeHx1JBB0QN` and is visible in the connected workspace.
- **No downloaded master bytes** or user-approved image has yet been placed in the repository. Quality and likeness have not been certified.
- The attempt to configure another GPT Image 2.5 look on the pre-existing reference-connected node was blocked by the image provider's safety controls, so it was not generated. Do not count it as finished.
- The v38 private offline review package has **22 locally available individual WebP candidates**, 18 look slots without locally available files, and 0 published or publication-approved portraits. Some of the 18 slots have provider-hosted generations that still require file export and inspection.

## Actual code changes
- The React Persian gallery no longer hardcodes `۲۲` / `۱۸` counters. It derives planned, candidate, missing-local-file, provider-only and approved counts from `makeup-ai-40.json`.
- Missing local image vs finished external generation without imported bytes have different visible statuses. **External image presence never implies publication approval**.
- Added a Node regression test enforcing those dynamic totals and unapproved states.
- Previous v40-ready change also made candidate count validation grow from 22 to 40 while still requiring **all 40 local images** for `--release`.

## Remaining release gates
1. Export actual full-size images from provider workspaces, not thumbnails.
2. Verify 3:4 resolution, image integrity, SHA256, and image uniqueness; ensure no tile grids.
3. Examine every candidate alongside the original photo for rounded face, natural cheeks, eyebrows, nose, lips and full hairline; reject identity drift.
4. Check makeup craftsmanship and genuine differences in eye and lip techniques; resolve all editorial duplicate warnings.
5. Obtain private rights-holder consent and publication sign-off as separate gates.
6. Run full React build, CI and actual mobile QA, then consider a deliberate release after approval.

This documentation is not evidence that an outstanding image has been exported, that tests have passed CI, or that the 40-image final catalog is complete.
