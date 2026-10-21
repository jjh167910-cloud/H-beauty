# H-beauty — Hananeh Beauty salon catalog

Portable mobile-first Persian React website derived from `salon-app-latest.zip`.

## Run / build

Requires Node.js 22+.

```bash
npm ci
npm run build
npx wrangler deploy
```

The frontend is a static Vite/React SPA and Cloudflare Workers static assets are served from `dist/` using `wrangler.jsonc`. To deploy from GitHub Actions, configure `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the repository secrets.

## Important functional distinctions

- The salon gallery has 292 bundled hairstyle images and can cache previously opened images offline. A first-time offline visitor will not have the whole catalog cached; full offline access to all hairstyles requires explicit prefetch.
- Face-shape suggestions are questionnaire-based, not a neural hairstyle-transfer model. Upload-your-own-photo AI try-on is **not implemented** in this source archive.
- Booking/consultation UI does not connect to an operational reservation backend; the page must not claim a booking has been placed.
- Photo images are bundled for this website; rights/provenance should be verified by the operator before commercial publication.
