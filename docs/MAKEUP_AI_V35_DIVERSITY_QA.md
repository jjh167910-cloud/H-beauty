# V35 — Makeup artistry and identity QA (40-style AI catalog)

**Release status: BLOCKED.** This is a candidate-artwork quality review, not verified salon service photography. No human likeness consent or final creative approvals are asserted.

## Actual asset inventory

- 40 planned Persian-named makeup styles.
- 22 standalone AI-generated candidate portraits in the **private, local v35 ZIP**. The original woman reference is in that private archive only; it is not to be committed to the public repository.
- 18 genuinely missing portraits; **0 accepted for public release**.
- Image-generator failures: a built-in-generation call returned a multiportrait collage, not the requested individual makeup; a reference-based GPT Image 2.5 generation via another provider was blocked by an account-plan restriction, so **no new portrait is counted for v35**.

## Makeup close-up review

The v35 private ZIP has `MAKEUP_DIVERSITY_REVIEW_PAGE_1.jpg` and `MAKEUP_DIVERSITY_REVIEW_PAGE_2.jpg`. Each displays the individual image and approximate detected **eye** and **lip** crops next to the name. The images have different exact SHA256s, but several actual makeup techniques overlap:

1. **09 / 10 / 17** — strikingly similar neutral eye, wing liner, nude lip, and composition; replace at least two unless a reviewer can establish a genuinely different technique.
2. **01 / 05 / 06 / 13 / 19** — overlapping warm nude/rose-satin treatment despite wardrobe/background differences; make the eye technique and lip finish genuinely distinct.
3. **07 / 18** — both red statement lips; examine liner, texture, and eye artistry rather than assuming they are duplicates.
4. **21 / 22** — differentiated cobalt/lilac eye artistry and fuller forehead hair coverage, but their narrower jaw and fuller lips suggest likeness drift against the **unmodified original woman photo**; revise before approval.

These are **editorial review flags**, not automated proof of duplicates or individual identity. The manifest now includes `editorialIssues: string[]` for each look. The preview displays them, and release verification requires an authorized private `editorialIssuesResolved: true` decision for each flagged look, in addition to individual asset checksum, likeness/style approvals, provenance and publication permission.

## Final standards

- Exactly one **3:4** photographic-quality portrait per look, at least 1000×1300 output pixels (or greater) with correct color and no panel artifacts.
- Preserve the exact person's naturally round lower face, full cheeks, dimple, eye spacing, original dark thick brows, nose shape and **natural lips**, while showing subtle realistic skin texture.
- Dense natural dark hair with no exposed scalp or artificial thinning along the frontal part; no accidental extra strands or distorted ears.
- Art direction is about **makeup**: demonstrably different pigment, blending topology, eye liner technique, lip color and finish, blush, and complexion treatment. Changing outfits alone is not a new makeup result.
- Persian name belongs in accessible text **below** the photo; never bake it into pixel artwork. Describe the images as AI-generated inspiration, not work performed by the salon.
- Publication only after the model or rights-holder's permission, visual identity verification, creative uniqueness review, and final salon approval.
