# Deploy the 40-look makeup gallery to the existing H-Beauty Worker

**Exact live URL:** https://h-beauty.mostifa2273.workers.dev/#/

The connected Cloudflare user identity was verified as `mostifa2273@gmail.com` on 24 October 2026. A subsequent request to inspect Worker settings/deployments required account approval and was declined; no live Worker changes were made.

The existing repository has:
- `wrangler.jsonc` with `"name":"h-beauty"`, `"assets":{"directory":"./dist","not_found_handling":"single-page-application"}`, and a build command invoking `npm run build`.
- `.github/workflows/deploy.yml` which deploys pushes to **main**, not the draft PR branch. Its default build does not set `VITE_MAKEUP_CURATED_40=true`.
- React catalog integration on `feature/v33-ai-makeup-40-review`; its 80 WebP images are in the **downloadable binary kit**, not in GitHub yet.

## Safest reproducible deployment

1. Open a development checkout (GitHub Codespaces or a local machine) for the draft PR branch, and obtain **HBeauty_40_Cloudflare_Deploy_Kit.zip** from this conversation. Extract it next to the repository.
2. Run the following *from the repository root*:

```bash
bash /path/to/HBeauty_Curated40_Implementation/import_verify_and_deploy.sh
```

The script imports all 40 full-size portraits and 40 thumbnails, verifies SHA256s and WebP structure, installs pinned npm dependencies, runs TypeScript and the existing Node tests, builds React with the correct preview flags, and checks that all photos are in the service-worker offline precache.

3. Review the locally built app and source images. The images are AI-generated inspiration; they are not photos of treatments performed by the salon.
4. To perform an **explicit live deploy**, after confirming publication rights and authenticating Wrangler against the right Cloudflare account, run:

```bash
HBEAUTY_DEPLOY=1 HBEAUTY_APPROVED=1 bash /path/to/HBeauty_Curated40_Implementation/import_verify_and_deploy.sh
```

Only use the second command if the full production-release requirements have been satisfied. The model publication/identity approval checks still belong to the salon; a successful technical build never proves them.

5. Check the URL above (and `#/looks`), detail sheets, photos, PWA offline reuse, and booking links. Save a rollback point of the currently live Worker before replacing it.

**Do not merge or deploy solely because a draft PR exists.** GitHub source alone has no image binaries, and the main-branch GitHub workflow defaults to the old gallery.

## Checks performed in this session

The local patch's two Node tests passed, as did its 40/40 full image and 40/40 thumbnail SHA/WebP integrity check (10.50 MiB) and shell-script syntax check. A full React build against the actual repository checkout, live-worker read, deployed site browser QA and Cloudflare publish were **not** completed in this session.