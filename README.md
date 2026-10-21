# حنانه بیوتی — H-beauty

This repository is the deployment target for the mobile-first Persian salon catalog supplied as `salon-app-latest.zip`. The original uploaded archive was adapted to a portable **React + Vite static SPA**, with all 292 hairstyle images preserved. The original archive is not yet stored in this repository.

## Import the prepared app (one-time)

1. Download both parts of the prepared package from the ChatGPT reply: `H-beauty-portable.part-01` and `H-beauty-portable.part-02`.
2. Upload **both files unchanged** to [the `upload/` folder](https://github.com/jjh167910-cloud/H-beauty/tree/main/upload). The names must match exactly. Each file is under GitHub's browser upload size limit.
3. Open [Actions → Import and deploy Hananeh Beauty](https://github.com/jjh167910-cloud/H-beauty/actions/workflows/import-and-deploy.yml) and choose **Run workflow** on `main`.
4. The action concatenates the two parts, verifies the SHA-256, extracts the safe portable project to repository root, removes the temporary parts, commits the app, installs dependencies and builds `dist/`.
5. For **automatic Cloudflare deployment**, configure GitHub repository Actions secrets `CLOUDFLARE_API_TOKEN` (Workers Scripts Edit permission) (the Cloudflare account ID is already set in the workflow). If missing, the workflow builds an artifact but deliberately skips production deployment.

**Package SHA-256:** `86584e5306484f756e65b540e841fc039504b614e5b687fef3ecd3c429c7b7f3`

**Important:** Existing Cloudflare Worker `hanane-beauty` and existing `Hanane-beauty` repository are deliberately untouched. The new worker name will be `h-beauty` once deployed.

### Feature limitations

- 292 hairstyle images across 283 catalog families are included.
- The PWA caches visited catalog images and the shell for repeat offline visits. Full catalog offline viewing on first visit needs a dedicated prefetch feature.
- Face analysis is a questionnaire-based styling guide; the uploaded app has **no implementation of AI-generated personalized hairstyle transfer**.
- The booking view is a non-sending preview (no reservation backend); the portable version removes misleading booking-confirmation claims.
- Verify images' commercial usage rights and the salon's actual address/contact details before promoting this as a live appointment system.

## Developer deployment

Once imported into this repo:

```bash
npm ci
npm run build
npx --yes wrangler@4 deploy
```

Cloudflare Worker static assets are configured through `wrangler.jsonc` to serve `dist/`.
