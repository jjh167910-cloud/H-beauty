# Hananeh Beauty — Editorial Atelier redesign review

Date: 2026-10-22
Source: H-beauty, main at `5de4fb71a689f2d11e374f2d1633028416405fcd`
Implementation: `design/atelier-editorial-v21`
Review status: **NO-GO for production merge until typecheck, build, device/render matrix and salon content approval are completed.** Suitable for code/design review.

## Original job and constraints

Improve an existing luxury, mobile-first Persian RTL salon PWA using the Elite App Creative Product Studio v20.3.1 skill package. Preserve the 283-family hairstyle catalog, the existing salon brand assets, working look discovery/booking/consultation functions, hash routing, themes and progressive offline behaviour. An upload-photo neural hairstyle try-on is **not** currently implemented and this design release does not claim otherwise.

## Baseline inventory and design debt (source inspection)

- Home presented a hero, a four-tile bento with overlapping actions, a second style-finder CTA, curated looks and many later sections. Primary action was diluted by repeated discovery/finder prompts.
- Lookbook action icons measured **34px** by CSS (`2.125rem` at root 16px), below the 44px target recommended for touch.
- Booking cards could mark a request **sent** as soon as a WhatsApp page opened, or when text was only copied. This was an incorrect status transition.
- Installed service worker caches requested assets on demand but does not guarantee first-time offline access to all hairstyle images.
- Services, price lists, salon address, artist details and opening hours are identified as **unverified placeholders** in `src/data/salon.ts`.

## Directions considered

1. **Flat utility dashboard:** strongest speed of use; rejected as uncharacteristic for a visual, editorial salon experience.
2. **Immersive full-screen swipe feed on launch:** dramatic visuals; rejected because it would hide the main appointment/consultation tasks and increase initial asset costs.
3. **Editorial atelier journey (selected):** one flagship portrait, three photographic mood-entry points, then truthful appointment, consultation and questionnaire pathways. Uses the established brand system without refactoring deep data flows.

## What changed

- Rebuilt home editorial header, portrait hero and immediate booking CTA.
- Added three fully functional mood cards; clicking one clears conflicting saved/search filters, selects its real catalog filter and navigates to the lookbook.
- Replaced competing bento actions with a clear request/consultation/finder decision section.
- Consolidated the redundant later finder prompt.
- Added theme-aware editorial CSS and high-contrast media treatment.
- Enlarged lookbook save/compare touch targets to 44×44 CSS px and category chips to 44px minimum height.
- Added an offline notice that accurately limits its promise to content cached on the current device.
- Added a focusable keyboard skip control for the main content without corrupting hash routes.
- Corrected booking-state transitions: clipboard copy or opening WhatsApp no longer automatically means sent; the user can explicitly confirm when they actually send a request.

## QA trace matrix

| Requirement | Oracle | Status |
|---|---|---|
| Preserve prior navigation and React screens | Inspect `salon-app.tsx` route branches | PASS (source review) |
| Real mood-card actions | Inspect `home.tsx` callbacks and catalog filters | PASS (source review) |
| Hero booking action retains selected look | Inspect `openBooking({lookId})` | PASS (source review) |
| Touch targets on lookbook | 2.75rem × 2.75rem CSS | PASS (source measurement; not device tested) |
| Booking status cannot advance from clipboard copy | Compare former and current `send()` branches | PASS (source review) |
| WhatsApp launch cannot instantly mark sent | Inspect link click handler | PASS (source review) |
| Offline message does not promise un-cached catalog | Inspect `OfflineNotice` copy | PASS (source review) |
| CSS brace structure | Balanced braces in stylesheet | PASS (static scan) |
| Full React/TypeScript typecheck | `npm ci && npm run typecheck` | NOT_RUN |
| Production Vite build | `npm run build` | NOT_RUN |
| Render matrix: 320/390/768/1280, light/dark, RTL, 200% text | Browser and screenshots | NOT_RUN |
| Android PWA and offline re-launch | Physical Android, cold/warm cache | NOT_RUN |
| Real end-to-end booking and recovery tests | Browser interaction | NOT_RUN |
| Image license and salon placeholder approval | Human operator documentation | BLOCKED |
| Photorealistic offline neural hairstyle transfer | Real model/runtime and device evidence | NOT_IMPLEMENTED |

## Risks and release policy

- **P1: Unverified salon details and booking slots.** The app is a request workflow, not a real-time reservation or confirmed appointment service. Salon owner must verify prices, location, staff and hours before external release.
- **P1: Photo try-on gap.** No neural hairstyle transfer is implemented; avoid presenting the style-finder questionnaire as equivalent.
- **P1: Build/browser/device QA pending.** Do not merge based solely on source review.
- **P2: Catalog image rights and cold-offline coverage.** Verify rights and offer an explicit prefetch choice if complete offline use is a requirement.
- **P2: Local state persistence can fail silently when storage is unavailable.** Needs a separate integrity pass and failure-feedback tests before promising durable offline records.

### How to verify before merge

```bash
npm ci --no-audit --no-fund
npm run typecheck
npm run build
npm run dev
```

Then visually check Home, Lookbook, Services, Bookings and Profile in light/dark at 320/390/768/1280 widths with Persian strings and 200% text. Check keyboard navigation, touch target geometry, initial portrait loading, offline reload and the manual booking-send confirmation. Do not accept visual quality claims before inspecting those screenshots.

## Rollback

The change is isolated to branch `design/atelier-editorial-v21`. Roll back by declining/closing the PR; `main` has not been changed.
