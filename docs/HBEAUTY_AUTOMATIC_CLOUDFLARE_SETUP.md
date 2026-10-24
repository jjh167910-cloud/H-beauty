# Fix automatic deployment for H-Beauty Worker

Existing production address: **https://h-beauty.mostifa2273.workers.dev/**.
Existing Cloudflare account ID in Wrangler workflow: `a22c80a102037bf59a1a25426cb93d66`.
GitHub repository: **jjh167910-cloud/H-beauty**, production branch **main**.
Wrangler Worker `name`: **h-beauty**.

## Verified incident (23 Oct 2026)

Workflow run [40030013001](https://github.com/jjh167910-cloud/H-beauty/actions/runs/40030013001) reported overall **success**. GitHub's step results prove that Build, mobile UI tests, and artifact upload succeeded, but "Deploy to Cloudflare Workers" was **skipped** and the "Explain missing Cloudflare token" step ran. Therefore GitHub Actions did **not** publish this run. The missing GitHub Actions secret `CLOUDFLARE_API_TOKEN` is the immediate reason.

> A Cloudflare connection inside ChatGPT is separate from the Cloudflare API token required for GitHub Actions. Never paste a Cloudflare token into chat, source files, issue comments, or pull requests.

## Recommended: Cloudflare Workers Builds (GitHub integration, no GitHub API token)

This installs the Cloudflare **GitHub integration** directly on the existing Worker so pushes to the configured branch automatically trigger Cloudflare-hosted builds.

1. Sign into [Cloudflare Dashboard — Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages).
2. Open the **existing** `h-beauty` Worker (do not create a second Worker).
3. Choose **Settings → Builds → Connect**.
4. Choose GitHub. In the GitHub authorization screen, install/authorize the Cloudflare GitHub App for the account owning `jjh167910-cloud/H-beauty`; if you restrict repositories, select **H-beauty** explicitly.
5. Set repository **jjh167910-cloud/H-beauty**, production branch **main**, and **root directory /** (repository root).
6. Build command (tests before publication): `npm ci --no-audit --no-fund && npm run verify:assets && npm run test:offline && npm run typecheck`.
7. Deploy command: `npx wrangler deploy`. The repository's `wrangler.jsonc` already runs `npm run build` as a pre-deploy build and serves the `./dist` directory. Worker name must exactly equal `h-beauty`.
8. Save/Connect. In [GitHub repository Settings → Secrets and variables → Actions → Variables](https://github.com/jjh167910-cloud/H-beauty/settings/variables/actions), create a repository **variable**, not secret, **`HBEAUTY_DEPLOY_MODE` = `cloudflare-builds`**. This prevents the GitHub Actions workflow from also publishing the same Worker. Note: this revised workflow becomes active only when merged into main.
9. Keep `HBEAUTY_CURATED_40` unset/false until **all 80 WebP binaries plus the SHA manifest** are committed and production release requirements have been satisfied. When ready for 40-look production, set **Cloudflare Workers Builds build variable** `VITE_MAKEUP_CURATED_40=true` in the dashboard and matching GitHub Actions variable **`HBEAUTY_CURATED_40=true`**; the Node asset verifier then rejects missing photos before building.
10. Merge only reviewed, tested code and image assets to **main**. Confirm the new build in Cloudflare Builds history and independently inspect the website at `https://h-beauty.mostifa2273.workers.dev/#/looks` with Makeup selected. Check browser caching/service-worker updates if an old version persists.

With native Workers Builds enabled, do not additionally enable GitHub Actions Wrangler deployment; choose one publisher.

## Alternative: GitHub Actions Wrangler deployment

If you prefer to retain the existing GitHub Actions deployment:

1. In [Cloudflare Account API Tokens](https://dash.cloudflare.com/?to=/:account/api-tokens) select **Create Token**. Choose **Custom → Edit Cloudflare Workers**, restrict it to the `mostifa2273@gmail.com` account only, and create it.
2. In [H-beauty GitHub Actions secrets](https://github.com/jjh167910-cloud/H-beauty/settings/secrets/actions), add:
   - Repository secret **`CLOUDFLARE_API_TOKEN`** containing the Cloudflare API token value.
   - Optional repository secret **`CLOUDFLARE_ACCOUNT_ID`** containing `a22c80a102037bf59a1a25426cb93d66` (the workflow already has this account ID as its default).
3. In [GitHub Actions variables](https://github.com/jjh167910-cloud/H-beauty/settings/variables/actions) set **`HBEAUTY_DEPLOY_MODE` = `github-actions`**. Leave `HBEAUTY_CURATED_40=false` until all files are committed.
4. Review/merge the new deployment workflow into **main**. A subsequent push to **main** will test, build, and deploy the existing `h-beauty` Worker, failing clearly if the token is unavailable. An authorized user can also run **Actions → Deploy حنانه بیوتی → Run workflow** (choose main).
5. Verify the GitHub Actions step **Deploy to Cloudflare Workers** actually says **success**, not **skipped**. A successful build without a successful deploy is not a website update.
6. Do **not** connect Cloudflare Workers Builds to the same Worker simultaneously unless the GitHub deployment mode is changed to cloudflare-builds.

## What this workflow correction changes

`.github/workflows/deploy.yml` on the review branch now:
- Handles `HBEAUTY_DEPLOY_MODE` = `github-actions` (default) or `cloudflare-builds`.
- **Fails** instead of reporting misleading green deployment status when GitHub Actions is the selected publisher and `CLOUDFLARE_API_TOKEN` is absent.
- Honors the opt-in `HBEAUTY_CURATED_40` setting (forwarded into Vite as `VITE_MAKEUP_CURATED_40`) and verifies all 40 image assets before building.
- Never publishes automatically from the draft feature branch; the deploy trigger is still pushes to **main**.

**Still blocked:** The 40-photo catalog's 80 WebP image binaries have not been committed into GitHub yet. They exist in the downloadable `HBeauty_40_Cloudflare_Deploy_Kit.zip` from the chat. Do not enable the curated flag, deploy the draft app, or merge PR #11 until its image payload is present and the production build and approvals are verified.

Documentation:
- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
