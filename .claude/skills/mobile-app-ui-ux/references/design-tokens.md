# Design tokens

Tokens are the single source of truth for every visual decision. Components consume tokens; screens consume components. Nothing below the token layer should contain a raw hex value, pixel size or duration.

## Contents
1. Three tiers
2. Colour in OKLCH
3. Building a palette
4. Dark mode
5. Type ramp
6. Spacing, radius, elevation
7. Motion tokens
8. Tailwind v4 template
9. Plain-CSS template

## 1. Three tiers

| Tier | Example | Who uses it |
| --- | --- | --- |
| Primitive | `--neutral-50 … --neutral-950`, `--gold-100 … --gold-700` | Only the semantic tier |
| Semantic (role) | `--color-canvas`, `--color-ink-2`, `--color-accent` | Components and screens |
| Component | `--tabbar-h`, `--dock-offset`, `--focus-ring` | A single component |

Semantic names describe the **job**, not the hue: `ink` rather than `brown`, `accent` rather than `gold`. That is what makes rebranding and dark mode cheap.

## 2. Colour in OKLCH

Author colour in `oklch(L% C H)`:
- **L (lightness)** steps are perceptually even, so a ramp built from L values looks evenly spaced, unlike HSL.
- **C (chroma)** is saturation. Keep neutrals at C 0.004–0.02 with a warm or cool hue to avoid dead grey.
- **H (hue)** stays nearly constant across a ramp; drift it by ±5° for warmth in the darks if wanted.

Use `color-mix(in oklch, var(--x) 12%, transparent)` for tints, soft fills and hairlines instead of inventing new colours.

## 3. Building a palette

1. **Neutral ramp** (12 steps, L ≈ 99 → 14). This carries roughly 90% of the UI.
2. **One accent ramp** (7 steps). Pick the hue from the brand. Check that the step used for text (`accent-ink`) has ≥ 4.5:1 contrast on the canvas.
3. **One secondary** colour, used only for a specific meaning (e.g. rose for "saved/love").
4. **Status** colours: success, warning, danger. Use them only for status.

Semantic roles to define (rename to taste):

| Role | Purpose |
| --- | --- |
| `canvas` | Page background (slightly tinted, never pure white in light mode) |
| `surface` / `raised` / `sunken` | Cards, lifted elements, recessed fills |
| `ink` / `ink-2` / `ink-3` | Primary, secondary, tertiary text (`ink-3` is for non-essential text only) |
| `line` / `line-2` | Hairlines and stronger dividers (alpha of `ink`) |
| `accent` / `accent-ink` / `accent-soft` / `on-accent` | The accent fill, accent-coloured text, tinted backgrounds, text on the accent |
| `inverse` / `on-inverse` | Dark-on-light inversions (primary buttons, selected chips) |
| status roles | `success`, `warning`, `danger` |

## 4. Dark mode

Remap roles under `:root[data-theme="dark"]`:
- Don't simply invert: dark canvases sit around L 12–16%, surfaces step **up** in lightness (rather than casting shadows), and text is L ≈ 95%, not pure white.
- Lower the accent's lightness for fills and raise it for text.
- Shadows become darker and larger; add a faint top inner highlight (`inset 0 1px 0 oklch(100% 0 0 / .04)`).
- Theme resolution: a user setting (`light | dark | system`) → listen to `prefers-color-scheme` when set to system → set `data-theme` on `<html>` and update `<meta name="theme-color">`.

## 5. Type ramp

Name text styles by role and bundle size, line-height, weight and tracking into each. Starting point for a mobile app (rem at a 16px root):

| Style | Size | Line-height | Weight | Notes |
| --- | --- | --- | --- | --- |
| display | clamp(2.35rem, 1.6rem + 3.4vw, 3rem) | 1.25–1.3 | 200–300 | One per screen |
| title-1 | clamp(1.75rem, 1.4rem + 1.6vw, 2.1rem) | 1.35 | 250–300 | |
| title-2 | 1.375rem | 1.45 | 300 | Section headings |
| title-3 | 1.125rem | 1.55 | 450 | |
| headline | 1rem | 1.55 | 500–550 | List titles, emphasised rows |
| body | 0.9375rem | 1.7–1.85 | 380–400 | |
| callout | 0.875rem | 1.7 | 400 | |
| footnote | 0.8125rem | 1.65 | 400 | |
| caption | 0.72rem | 1.55 | 450 | Never smaller than ~11.5px |
| eyebrow | 0.75rem | 1.5 | 550 | Accent colour, above headings |

Light display weights with heavier small text is the "premium" signature: hierarchy comes from scale contrast. Line-heights for Arabic-script text should run about 10–15% taller than for Latin.

## 6. Spacing, radius, elevation

- **Spacing:** a 4px base (`1 = 0.25rem`). Add `--spacing-gutter: clamp(1.25rem, 5.2vw, 1.75rem)` for page edges and `--spacing-section: clamp(2.75rem, 9vw, 3.75rem)` for vertical rhythm between sections.
- **Radius:** `xs 6 · sm 10 · md 14 · lg 20 · xl 28 · 2xl 36 · pill`. Nested radii follow *inner = outer − padding* so concentric corners stay parallel.
- **Elevation:** four layered, hue-tinted shadows (never pure black):
  `--shadow-2: 0 1px 2px oklch(25% .02 60 / .05), 0 8px 24px -12px oklch(25% .03 60 / .18)`.
  Add one coloured shadow for the accent call to action.

## 7. Motion tokens

```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);   /* default for movement */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.089 25.5%, 1.087, 1.073 30.6%, 1.022 36.6%, 0.997 41.2%, 0.988 45.6%, 0.993 55.9%, 1.001 66.2%, 1);
--duration-fast: 140ms;  /* press feedback */
--duration-base: 240ms;  /* colour/state */
--duration-slow: 420ms;  /* layout, sheets */
--duration-slower: 700ms;/* entrances */
```

## 8. Tailwind v4 template

In Tailwind v4, tokens declared in `@theme` become utilities (`bg-canvas`, `text-ink-2`, `shadow-2`, `rounded-xl`, `px-gutter`). Reset the default palette so stray `bg-blue-500` can't creep in:

```css
@import "tailwindcss";

:root { /* primitives */
  --neutral-50: oklch(97.4% 0.008 80);
  --neutral-900: oklch(19% 0.009 52);
  --accent-500: oklch(64% 0.1 72);
  --accent-700: oklch(42% 0.075 62);
}

@theme {
  --color-*: initial;
  --color-canvas: var(--neutral-50);
  --color-ink: var(--neutral-900);
  --color-accent: var(--accent-500);
  --color-accent-ink: var(--accent-700);
  --color-white: oklch(100% 0 0);
  --color-transparent: transparent;
  --color-current: currentColor;

  --font-*: initial;
  --font-sans: "Your UI Font Variable", system-ui, sans-serif;

  --spacing-gutter: clamp(1.25rem, 5.2vw, 1.75rem);
  --radius-xl: 1.75rem;
  --shadow-2: 0 1px 2px oklch(25% .02 60 / .05), 0 8px 24px -12px oklch(25% .03 60 / .18);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}

:root[data-theme="dark"] { --color-canvas: oklch(14.5% 0.007 50); --color-ink: oklch(97% 0.008 80); }

/* Composite text styles as utilities */
@utility t-display { font-size: clamp(2.35rem, 1.6rem + 3.4vw, 3rem); line-height: 1.3; font-weight: 200; }
```

Split the stylesheet into `tokens.css`, `base.css`, `components.css` and `motion.css`, imported in that order.

## 9. Plain-CSS template

Without Tailwind, keep the same three tiers as custom properties, and wrap the files in `@layer tokens, base, components, utilities;` so specificity battles disappear.
