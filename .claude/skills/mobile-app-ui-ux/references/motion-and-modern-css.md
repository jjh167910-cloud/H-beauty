# Motion and modern CSS

Every feature here is progressive enhancement. When a browser lacks a feature, the result must still be a complete, usable interface; just a calmer one.

## Contents
1. Motion principles
2. View Transitions
3. Scroll-driven animations
4. Entry animations with @starting-style
5. Materials: glass and foil
6. Layout tools
7. Accessibility fallbacks
8. Known pitfalls (learned the hard way)

## 1. Motion principles

- Motion explains **spatial change**. Sheets come from below, tabs slide in their order, a tapped image grows into its detail view.
- Durations: press 120–160ms, state 200–260ms, layout and sheets 350–450ms, entrances up to 700ms. Exits run faster than entrances.
- Ease-out for things arriving, ease-in-out for things moving, and a spring (`linear()` easing) for playful affordances such as a tab lens or success pop.
- Stagger lists by 15–25ms per item, capped at one page.
- One ambient motion per screen at most (slow Ken Burns on a hero, a foil sheen on the primary call to action).

## 2. View Transitions (same-document)

Wrap state changes that alter the page in a transition:

```ts
import { flushSync } from "react-dom";
export function withTransition(update: () => void, direction: "forward" | "back" | "morph" | "none" = "none") {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) { update(); return null; }
  document.documentElement.dataset.nav = direction;
  const t = document.startViewTransition(() => flushSync(update));
  t.finished.finally(() => delete document.documentElement.dataset.nav);
  return t;
}
```

- **Directional tab slides:** animate `::view-transition-old(root)` and `::view-transition-new(root)` with keyframes chosen by `html[data-nav]`. Mirror the direction for RTL.
- **Fixed chrome:** give the top bar and tab bar their own `view-transition-name` with `animation: none`, so they stay still while content slides.
- **Shared-element morph:** set `view-transition-name` on the tapped image, and inside the update callback move the name to the destination element. Clear it on `transition.finished`. Exactly one element may hold a name at a time.
- Scroll restoration must happen synchronously inside the update (e.g. in `useLayoutEffect`), so the "new" snapshot is correct.

## 3. Scroll-driven animations

```css
@supports (animation-timeline: view()) {
  .reveal-on-scroll { animation: reveal linear both; animation-timeline: view(); animation-range: entry 0% entry 55%; }
  .hero > img { animation: parallax linear both; animation-timeline: view(); animation-range: exit -20% exit 100%; }
}
```

- Use them for reveals, parallax and depth effects in snapping feeds. They are not for anything the user must notice to understand content.
- Without support, elements are simply static and visible, which is why the rule lives inside `@supports`.

## 4. Entry animations with @starting-style

```css
.dock { transition: opacity .42s var(--ease-out), translate .42s var(--ease-out); }
@starting-style { .dock { opacity: 0; translate: 0 1rem; } }
```

Animates elements on insertion with no JavaScript and no keyframes.

## 5. Materials: glass and foil

**Liquid Glass** (translucent bars and controls over content):

```css
.glass {
  background: linear-gradient(180deg, oklch(100% 0 0 / .42), oklch(100% 0 0 / .17)), color-mix(in oklch, var(--color-surface) 38%, transparent);
  backdrop-filter: blur(22px) saturate(1.8);
  box-shadow: inset 0 1px .5px oklch(100% 0 0 / .85), inset 0 0 0 1px oklch(100% 0 0 / .3), var(--shadow-3);
}
```

Use glass only on floating chrome (tab bar, docks, controls over photos), never on reading surfaces.

**Foil** (metallic accent): a multi-stop gradient on `background-size: 220% 100%` animated across `background-position` over about 7s. Reserve it for the main call to action and celebratory marks.

**Grain:** a 4% opacity SVG `feTurbulence` noise layer (`position: fixed; pointer-events: none`) removes the flat-digital feel.

## 6. Layout tools

- Logical properties everywhere (`margin-inline`, `inset-inline-end`, `padding-block`); this makes RTL free.
- Container queries and units (`container-type: inline-size`, `cqw`) for components that position overlays relative to their own size.
- `dvh` for full-height mobile layouts; `env(safe-area-inset-*)` for notches and home indicators; `viewport-fit=cover` in the viewport meta tag.
- `text-wrap: balance | pretty`, `field-sizing: content`, `interpolate-size: allow-keywords` (animating to `height: auto`), `scrollbar-gutter: stable`.
- Scroll snap for rails and carousels: `scroll-snap-type: x mandatory`, `scroll-snap-stop: always` for one-at-a-time feeds, `overscroll-behavior: contain` inside sheets.

## 7. Accessibility fallbacks

```css
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
@media (prefers-reduced-transparency: reduce) { .glass { backdrop-filter: none; background: var(--color-surface); } }
```

## 8. Known pitfalls (learned the hard way)

| Symptom | Cause | Fix |
| --- | --- | --- |
| Page wider than the phone; the whole UI zooms out | A horizontal rail inside a CSS grid item; grid items default to `min-width: auto` | `grid-template-columns: minmax(0, 1fr)` (Tailwind `grid-cols-1`) on the parent; `overflow-x: clip` on the app frame |
| Shared-element morph invisible | The destination overlay has its own `view-transition-name`, so its group paints over the morph group | Don't name the overlay; un-name the bars during a morph (`html[data-nav="morph"] .tabbar { view-transition-name: none }`) |
| Bars flash over a full-screen overlay during a transition | Named groups always paint above `root` | As above |
| Overlay image blank for half a second | Waiting for the full-resolution image | Render the cached thumbnail first and fade the full image in over it |
| Text in an SVG `textPath` doesn't render | The page is `dir="rtl"`, so the SVG text runs off its path | `direction="ltr"` on the `<svg>` and `unicode-bidi: isolate` |
| Rotating seal text overlaps itself | The text is longer than the circle's circumference | Shorten the text or reduce font size and letter-spacing |
| Calligraphic glyph clipped (e.g. ح looks like 7) | `background-clip: text` with a tight line-height cuts the descender | Line-height about 2.2 plus padding |
| Full-page screenshot shows blank sections | Scroll-driven reveals never enter the viewport in a full-page capture | Scroll the real viewport and capture frames |
| Infinite drawer animations hurt performance | Many offscreen animated elements | Render only the items near the active one |
