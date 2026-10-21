# Accessibility and the final review

## Contents
1. Accessibility baseline
2. Visual QA procedure
3. Review checklist
4. Reporting to the user

## 1. Accessibility baseline (WCAG 2.2 AA)

- **Contrast:** body text ≥ 4.5:1, large text (≥ 24px, or 19px bold) and UI glyphs ≥ 3:1. Check accent-coloured text and text on photos (add a gradient scrim).
- **Targets:** ≥ 44×44px; adjacent targets separated by at least 8px.
- **Focus:** visible focus ring on every interactive element (`:focus-visible` with a 2px ring offset from the canvas). Never `outline: none` without a replacement.
- **Semantics:** real `<button>` and `<a>` elements; `aria-label` on icon-only controls; `aria-pressed` for toggles, `aria-current="page"` for active tabs, `aria-current="step"` for steppers; `role="radiogroup"`/`radio` with `aria-checked` for segmented controls; `aria-live="polite"` for result counts and counters; dialogs with titles.
- **Motion and transparency:** honour `prefers-reduced-motion` and `prefers-reduced-transparency`.
- **Text scaling:** layouts survive 200% text size; no fixed-height text containers.
- **Language:** `lang` on `<html>`; mark foreign-language runs with their own `lang`.
- **Images:** meaningful `alt`; decorative images use `alt=""` and `aria-hidden`.

## 2. Visual QA procedure

1. `npm run build` and serve the production build (e.g. `npx vite preview --port 4173`).
2. Write a flow file for `scripts/screenshot.mjs` (see the header comment in the script) that visits each screen, opens each sheet and completes the key flow.
3. Run it at three sizes: small (Playwright "iPhone SE", 320×568 — the narrowest stress test), medium ("iPhone 13", 390×664 usable), and large ("Pixel 7", 412×839).
4. The script reports console errors, page errors, horizontal overflow (`scrollWidth > innerWidth`) and writes a contact sheet. Treat any of the first three as a bug.
5. Open the contact sheets and look closely. A screen is not done until nothing on it looks accidental.
6. Repeat in dark mode and, for RTL products, check the direction-specific items in `rtl.md`.

## 3. Review checklist

**System**
- [ ] No raw colours, sizes or durations outside the token files
- [ ] One accent colour; status colours only used for status
- [ ] At most three type sizes per screen; all text uses named text styles
- [ ] One icon family and weight convention; no ambiguous glyphs

**Layout**
- [ ] No horizontal overflow at 320px
- [ ] Consistent page gutter; vertical rhythm from the section token
- [ ] Primary action in the thumb zone and visible without scrolling where it matters
- [ ] Content clears the tab bar, docks and safe areas

**States**
- [ ] Empty, loading, error, offline and success states designed
- [ ] Long names and translations don't break the layout (truncate or wrap deliberately)
- [ ] Disabled states are legible

**Interaction**
- [ ] Back closes sheets; tabs are deep-linkable; scroll position is restored
- [ ] Press feedback on every tappable element
- [ ] Destructive actions offer Undo
- [ ] Inputs use the correct keyboard type and validate helpfully

**Honesty**
- [ ] No claims the system can't back (confirmed bookings, AI, ratings)
- [ ] Placeholder data is flagged

**Performance**
- [ ] Images sized for their display (thumbnails in grids)
- [ ] Fonts subset and variable; heavy display fonts used sparingly
- [ ] Icons tree-shaken; bundle size change noted

## 4. Reporting to the user

Lead with what they can now see and do, attach the screenshots, then list the trade-offs and anything that needs their input (placeholder content, accounts, credentials). Keep implementation detail short unless they ask.
