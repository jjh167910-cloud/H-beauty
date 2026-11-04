# H-Beauty AI Try-On v27.5 — isolated GitHub staging

**Status: NOT DEPLOYED until a verified binary release asset is supplied and the staging workflow succeeds.** This branch is independent of the production `main` salon application.

## Purpose
Deploy the standalone CPU478 / bundled-six-class offline makeup studio to a **separate** Cloudflare Worker named `hbeauty-tryon-v275-staging`. It MUST NOT modify `h-beauty`, its production routing, configuration, or Cloudflare Worker.

## Source provenance
Staging kit: `HBeauty_v27_5_Isolated_Staging_Kit.zip` (made from the v27.5 locally tested archive).
**Pinned SHA-256:** `6d523542f26ea446231703da34330e3f43f8b3d877182856623309d465a25f8b`
Expected archive contents: `HBeauty_v27_5_Staging_Kit/public/`, `wrangler.jsonc`, `verify_staging.py`.
Asset inventory: 331 full offline SHA-256 entries; 85 CPU asset entries; 91,847,889 bytes of hashed app assets.
The ZIP is not in this Git repository; a GitHub connector cannot transfer the binary archive directly from a ChatGPT sandbox link.

## To make GitHub staging deployable
1. In the GitHub repository **Releases**, create a release tagged `hbeauty-tryon-v27.5-staging-source`. Attach the **exact** `HBeauty_v27_5_Isolated_Staging_Kit.zip` from the ChatGPT artifact. No re-zipping or file replacement.
2. Use Actions > **H-Beauty Try-On v27.5 isolated staging** > Run workflow, branch `staging/ai-tryon-v275-github`. If the workflow is not listed because it is not on the default branch, push a new change to this branch or enable the workflow via a reviewed PR without merging a production deployment change.
3. The workflow downloads the release asset, compares its SHA-256 with the literal pinned checksum above, verifies the complete offline manifest and Worker name, and only then invokes Wrangler with the **staging-specific** configuration.
4. Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` GitHub Actions secrets to a token/account authorized to deploy a NEW Worker. GitHub cannot prove secret values through this connector. It may also reuse the existing deploy workflow's account ID fallback, but publication remains gated on a valid token.
5. Verify the resulting real HTTPS URL, remote model SHA-256, offline installer, six-class mask output on physical Android, airplane mode and restart.

## Evidence and restrictions
- The existing research branch's genuine 19-class CPU proof is [GitHub Actions run 41743061971](https://github.com/jjh167910-cloud/H-beauty/actions/runs/41743061971): real BiSeNet execution, 19-class output, saved artifact. It does **not** prove WebGL or Android readiness.
- v27.5's bundled **six-class** model is distinct from the external 19-class model.
- Trained reference-guided makeup-transfer weights are **not** included. Neural quality and production certification remain NO-GO.
- Do not merge this staging deployment workflow into `main` without a deliberate production-security review. It is designed to run only on `staging/ai-tryon-v275-github`.

## Rollback
The staging worker uses a separate name. Delete or roll back `hbeauty-tryon-v275-staging` without touching `h-beauty`.
