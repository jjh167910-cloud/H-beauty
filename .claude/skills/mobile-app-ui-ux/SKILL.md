---
name: mobile-app-ui-ux
description: Expert playbook for designing and building premium, mobile-first app UI/UX — design systems (tokens, type ramp, colour, icons, components), information architecture, navigation, flows, motion, accessibility, RTL/Persian/Arabic typography, and screenshot-driven visual QA. Use this skill whenever the user asks to design, redesign, polish, "make premium/luxury/modern", restyle, or audit any app or web-app UI, build a design system or style guide, choose fonts or icons, design screens or flows (onboarding, booking, checkout, feeds, profiles), make something feel native on phones, or fix UI that "looks cheap", even if they never say "UI/UX" or "design system".
---

# Mobile App UI/UX

A working method for producing app interfaces that feel designed, not assembled: a coherent system first, screens built only from that system, and every claim of quality checked against real screenshots on real phone sizes.

The reference files hold the detail. Read the ones the task needs:

| Read when… | File |
| --- | --- |
| Defining colour, type, spacing, radius, elevation, motion tokens | `references/design-tokens.md` |
| Choosing fonts, setting type, any non-Latin script | `references/typography.md` |
| Building buttons, fields, sheets, tab bars, cards, lists, empty states | `references/components.md` |
| Designing navigation, onboarding, booking/checkout, feeds, search, forms | `references/patterns.md` |
| Animations, View Transitions, scroll effects, glass, modern CSS | `references/motion-and-modern-css.md` |
| Right-to-left languages (Persian, Arabic, Hebrew, Urdu) | `references/rtl.md` |
| Accessibility and the final review pass | `references/accessibility-and-review.md` |

## The workflow

Work through these stages in order. Skipping straight to screens is the most common reason a UI looks templated: without a system, every screen invents its own spacing, sizes and colours, and the result reads as noise.

### 1. Understand before drawing

Read the existing code, content and brand before proposing anything. Establish:
- **Who and where:** audience, language/script, region, the devices they use (assume a small Android/iPhone first).
- **The jobs:** the 3–5 things a user comes to do. Navigation is built around these, not around the data model.
- **The brand voice:** pick two or three adjectives (e.g. "quiet, precise, warm"). Every later decision gets tested against them.
- **Constraints:** what is real and what is mocked. If a backend does not exist, the UI must not pretend it does (see "Honest UI" below).

When something is genuinely the user's call (brand name, tone, which flows matter), ask. Otherwise choose sensible defaults and say what you chose.

### 2. Information architecture and flows

- Map the jobs to a **primary navigation of 3–5 destinations**. On mobile that is a bottom tab bar, and the single most important action may become a raised centre button.
- Secondary tasks open as **bottom sheets** over the current context rather than as new pages; they keep the user oriented and dismiss with a swipe or the back button.
- Sketch each key flow as a list of steps with the one decision per step. Long forms become steppers; each step should fit one thumb-reachable screen.
- Make every tab and sheet addressable (a URL hash or route) and make the hardware/browser **Back** close the top-most layer first. Native apps behave this way and users rely on it.

### 3. Build the design system before the screens

Define tokens first, then components, then screens. See `references/design-tokens.md` and `references/components.md`.

- **Colour:** authored in OKLCH, in three tiers: primitives → semantic roles (`canvas`, `surface`, `ink`, `ink-2`, `line`, `accent`, `on-accent`, status colours) → a few component tokens. Components only ever use semantic roles, which is what makes dark mode a remap rather than a rewrite.
- **One accent colour.** Use it for the primary action, selection and small highlights. If everything is accented, nothing is.
- **Type ramp** of named text styles (display, title 1–3, headline, body, callout, footnote, caption, eyebrow), each a composite of size, line-height, weight and tracking.
- **Spacing** on a 4px base with a page gutter token and a section-rhythm token. Radius and elevation scales are each small and named.
- **Icons:** one family, one default weight, a filled or bold weight for the active state. Wrap them behind semantic names (`<Icon name="book" />`) so the set can be swapped in one file.
- **Components** expose variants as data attributes (`data-variant="primary"`) and states as ARIA attributes (`aria-pressed`, `aria-current`, `aria-invalid`). Styling then follows semantics, and accessibility comes for free.
- Ship a **living style guide** (a hidden route that renders the tokens and components) plus a short `DESIGN.md`. This is how the system stays a system after you leave.

### 4. Compose screens from the system

Rules that separate premium from generic:
- **Hierarchy through size and space, not weight.** Large, light headlines; generous whitespace; few type sizes per screen (three is plenty).
- **A signature element.** One recognisable motif (a shape, a material, a typographic gesture) repeated with restraint gives the product identity. Examples: an arch-shaped image mask, a hairline-plus-diamond divider, a foil gradient reserved for the main call to action.
- **Hairlines over boxes.** Separate content with whitespace and 1px lines before reaching for card borders and shadows. Reserve elevation for things that float (sheets, docks, the tab bar).
- **Real content, real lengths.** Design with the longest real names, prices and translations. Placeholder text hides overflow bugs.
- **Thumb zone.** Primary actions sit in the bottom third. Touch targets are at least 44×44px.
- **Every state is designed:** empty, loading (skeleton or shimmer, not spinners), error, offline, success, and partially filled.

### 5. Motion with purpose

Motion explains change: where something came from and where it went. Use the modern platform first (View Transitions for page and shared-element changes, scroll-driven animations, `@starting-style` for entry), keep durations at 150–450ms, and collapse everything under `prefers-reduced-motion`. Details and pitfalls are in `references/motion-and-modern-css.md`.

### 6. Verify with your own eyes

Never declare a UI finished from code alone. Render it and look at it.

1. Build the app and serve the production build.
2. Run `scripts/screenshot.mjs` (start from `scripts/example-flow.json`), which drives Playwright at real device sizes (small, medium and large phones), walks a scripted flow, records console errors, checks for horizontal overflow, and writes a contact sheet.
3. Look at every screenshot critically. Check alignment, clipping, overlaps, contrast, truncation, awkward wraps and whether anything looks unintentional. Fix, rebuild, re-shoot.
4. Check the smallest phone (Playwright "iPhone SE", 320×568) specifically: the primary call to action must be reachable without scrolling on onboarding screens.

Known screenshot artefact: full-page captures render scroll-driven animated sections blank (they never "enter" the viewport). Scroll the real viewport and capture instead.

The full review checklist is in `references/accessibility-and-review.md`.

## Honest UI

Interfaces earn trust by never overstating what happened.
- If an action only saves locally or drafts a message, say so ("Draft · not sent yet"), and offer the real next step (share, copy, send via the official channel).
- Do not label heuristics as AI, show fabricated ratings, reviews or counts, or display availability you do not have.
- Mark placeholder business content (prices, staff, addresses) clearly in code and tell the user it needs confirming.

## Non-Latin scripts and RTL

If the product uses Persian, Arabic, Urdu or Hebrew, read `references/rtl.md` and the script section of `references/typography.md` before choosing fonts. The short version:
- Choose fonts by rendering specimens of the real brand name and UI strings (`scripts/font_specimen.py`); reject fonts with missing letters or the wrong digit forms.
- Never letter-space cursive scripts.
- Use logical CSS properties throughout.
- Isolate Latin and numeric runs with `dir="ltr"` or `unicode-bidi: isolate`.

## Delivering

- Summarise what changed for the user in plain language, with screenshots attached.
- Name the trade-offs: bundle size from new fonts or icons, and browser support for progressive features.
- Leave the style guide route and `DESIGN.md` in the repo so the next change can follow the system.
