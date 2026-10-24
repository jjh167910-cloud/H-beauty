# v36 — Eye and lip distinctness triage for 40-style AI portrait catalog

**Status:** 22 AI portrait candidates / 18 missing / 0 publication-ready. No public deployment.

This revision compares existing individual portraits using the makeup regions, rather than assuming different clothing is a new beauty result. Its offline reproducible methodology is in the private downloadable `HBeauty_V36_22_Images_Makeup_Comparison_Kit.zip` (scripts `hbeauty_makeup_diversity_audit_v36.py`, `hb_v36_pair_sheet.py`), with crop coordinates and numeric output. The original model image remains private and must not be committed to GitHub.

## Findings

The scripts compare 22 images in all 231 pairs. They use 64-bit perceptual difference hash and HSV/Lab histogram distances on previously detected **eye** and **lip** boxes. Combined proximity is only a **sorting heuristic**: it is not a statistical likelihood of matching identity or makeup duplication, and is sensitive to pose/lighting.

| Priority | Candidates | Approximate combined eye+lip visual proximity | Action |
| --- | --- | --- | --- |
| 1 | 09 / 17 | 0.9352 | Closely inspect and remake at least one treatment if makeup is indistinguishable |
| 2 | 06 / 13 | 0.9157 | Distinguish bronze warmth from metallic copper and change lip finish |
| 3 | 09 / 10 | 0.8909 | Differentiate neutral smoky shadow vs eyeliner-only, not merely hairstyle |
| 4 | 01 / 05 | 0.8797 | Inspect nude-rose overlap and champagne highlights |

The metric also ranked 11/13 relatively near because of portrait composition/lips, **despite visibly different emerald versus copper eye pigments**, illustrating why it cannot certify duplicates.

## Work completed in branch

- Added `v36PriorityPairs` plus reciprocal `reviewCompareWith` IDs to the forty-look registry.
- The opt-in Persian salon QA detail viewer can navigate directly between the most important potential duplicate candidates using accessible comparison chips.
- A Node test verifies reference IDs exist, are reciprocal, and planned catalog size is still forty.
- The current release gate still requires forty physically distinct assets and private per-portrait approvals, and blocks flagged editorial issues without explicit resolution.
- No regenerated image is marked as approved or silently substituted.

## Image generation outcome

The last built-in image request returned another **40-panel collage** rather than one standalone portrait. Two separate, reference-guided Canva generation jobs were submitted for Matte Terracotta and Silver Chrome; their returned image bytes have not yet been independently inspected, so they do **not** increase the current 22-image count. Other providers either reached daily limits or rejected the user's current plan.

## Required final visual standard

Exact facial similarity to original woman (cheeks, dimples, brow structure, nose, and natural lips), dense frontal hairline with no exposed scalp, true professional cosmetology, one full portrait per style, clear eye/lip variation, no textual labels baked into pixels, and correct Persian name beneath every photo.

Re-run local comparison and visually approve each candidate after images change. The presence of a checksum, label or high resolution alone never certifies a final look.
