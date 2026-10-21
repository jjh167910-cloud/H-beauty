# H-beauty — Hananeh Beauty salon app

Premium, mobile-first Persian (RTL) salon **app**: an installable PWA with an app shell, bottom tab bar, native-style bottom sheets and light/dark ("noir & gold") themes.

## App structure

| Tab | What it does |
| --- | --- |
| خانه (Home) | Greeting, live open/closed status (Tehran time), next appointment, look of the week, quick actions, popular services, artists, curated looks, visit info |
| خدمات (Services) | Categorised service menu with durations and starting prices; add several services to one booking (floating cart) |
| رزرو (centre button) | 4-step booking sheet: services → artist → day & time (Persian calendar, Fridays closed, slots fit service length) → details |
| لوک‌بوک (Lookbook) | 283-look gallery with search, filters, saved looks, infinite scroll, compare (up to 3) |
| نوبت‌ها (Bookings) | Upcoming/past requests with draft/sent status; send, re-book or delete |
| پروفایل (avatar) | Member card (name/phone prefill), saved looks, compare, style finder, consult, theme, clear local data |

Tabs are hash routes (`#/services`, `#/looks`, …) and the browser/Android back button closes open sheets first.

Salon content (services, prices, artists, address, hours, optional WhatsApp/phone) lives in `src/data/salon.ts`. These are **placeholders to verify with the salon**. Setting `SALON.whatsapp` adds one-tap WhatsApp sending for bookings and consultations.

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
- The "استایل‌یاب" (style finder) is questionnaire-based, not a neural hairstyle-transfer model, and is labelled as such. Upload-your-own-photo AI try-on is **not implemented** in this source archive.
- Booking/consultation UI does not connect to an operational reservation backend. Requests are stored only on the device and shown as "draft" until the user sends them (share sheet / copy / WhatsApp); the app never claims a booking is confirmed.
- Photo images are bundled for this website; rights/provenance should be verified by the operator before commercial publication.
