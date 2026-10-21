# Components

Build each component once, expose variants through data attributes and states through ARIA, and compose every screen from them. The CSS uses semantic tokens only.

## Contents
1. API conventions
2. Buttons and icon buttons
3. Chips, badges, status
4. Cards and lists
5. Forms
6. Bottom sheets
7. Tab bar, top bar, docks
8. Media and loading
9. Empty states and feedback
10. Icon system

## 1. API conventions

```html
<button class="btn" data-variant="primary|accent|secondary|tonal|ghost|glass" data-size="sm|md|lg" data-block>
<button class="icon-btn" data-variant="outline|tonal|solid|glass" aria-pressed="true" aria-label="Save">
<button class="chip" aria-pressed="true">
<div class="card" data-variant="surface|outline|sunken|inverse">
<span class="status" data-tone="success|warning|danger">
<input aria-invalid="true">
```

Why: the markup states what something *is*, and a styled pressed state can't exist without the matching accessibility state. React and Vue wrappers (`<Button variant="accent" icon="book" orb />`) only translate props into these attributes.

## 2. Buttons and icon buttons

- Height 48px (md), 38px (sm), 56px (lg). Pill radius reads friendlier and more premium than small radii.
- Exactly **one primary action per view**. The accent (or foil or gradient) variant is reserved for the single most valuable action on a screen.
- Press feedback: `transform: scale(.97)` over about 140ms with `--ease-out`. Disabled: opacity .4 with no shadow, and keep the label legible.
- Signature call to action: label plus a trailing circular "orb" holding the forward arrow. Use it sparingly, as a brand gesture.
- Icon buttons are 44px minimum (36px only inside dense rows, with the hit area padded). They always need an `aria-label`. Use `aria-pressed` for toggles (save, favourite); the icon swaps to its filled weight when pressed.
- Avoid ambiguous glyphs. A "columns" icon reads as a pause button. Test icons out of context: would a stranger guess the action?

## 3. Chips, badges, status

- **Chips** filter or select. Height 38px, pill, 1px inset outline at rest, inverse fill when `aria-pressed="true"`. Put them in a horizontally scrolling row with hidden scrollbars. Make the row sticky under the top bar when it filters a long list, with a gradient fade at its bottom edge.
- **Badges** are labels (Popular, 1 h, Specialist): small, a tinted background, no border.
- **Status** is a dot plus a label, with tone driven by `data-tone`. The live or open state may pulse gently, but never for errors.

## 4. Cards and lists

- Prefer a **grouped list** (one rounded container, rows separated by hairlines) over a stack of individual cards. It is calmer and denser.
- Row anatomy: leading icon in a tinted circle → title and supporting line → trailing chevron, value or switch. Minimum height 56px.
- Cards: radius xl, padding 20px, `shadow-2` plus an inset hairline. Use an **inverse card** (dark with accent glow) once or twice per screen for promotion.
- Editorial menus such as prices: title … dotted leader … value. The leader line is `flex:1; border-bottom: 1px dotted`.

## 5. Forms

- Labels above fields, always visible (placeholders are not labels).
- Underline fields (1px bottom border, accent on focus) look refined; boxed fields suit dense data entry. Pick one style per product.
- Correct `inputMode`, `autoComplete`, `enterKeyHint` and `type`. Phone fields: `inputMode="tel" dir="ltr"`.
- Validate on submit or blur, not per keystroke. Show the error under the field with `aria-invalid`, and tell the user exactly how to fix it, with an example.
- Normalise input the user can't control: localised digits, spaces, country prefixes.
- `textarea { field-sizing: content }` grows with its content; no resize handle on mobile.
- Font size ≥ 16px on inputs, or iOS zooms the page on focus.

## 6. Bottom sheets

- Use a drawer library with drag-to-dismiss (e.g. `vaul` in React). Corner radius about 36px, a grab handle, a title row with a close button, a scrollable body, and a sticky footer for the primary action and a running summary.
- Full-height (≈94dvh) for flows; content-height (max 92dvh) for details.
- Back button closes the sheet: push a history entry on open; `popstate` closes it.
- Multi-step flows in a sheet get a stepper (numbered dots joined by a line, done steps tinted with the accent) and a back button in the header.
- Keep the sheet mounted while it animates closed, then remount fresh on the next open so internal step state resets.

## 7. Tab bar, top bar, docks

- **Tab bar:** 3–5 destinations, icon plus short label, active tab = filled icon plus ink colour. A floating "glass" capsule inset from the screen edges looks current. A sliding **lens** (a highlight that springs between tabs) marks the active item. Hide the labels and shrink the bar while the user scrolls down; restore it on scroll up.
- A raised **centre action** is for the product's main job (book, create, scan) and is not itself a tab.
- **Top bar:** sticky; transparent at the top of the page, blurred surface with a hairline once scrolled. It holds the brand mark or screen title on one side and the profile/avatar on the other.
- **Docks:** floating bars above the tab bar for contextual state (a cart summary, comparison tray). Animate their entry with `@starting-style`, and show at most one at a time per screen.
- Content needs bottom padding equal to tab bar + dock + safe area, or the last item hides behind them.

## 8. Media and loading

- Wrap images in a container whose background is a **shimmer** placeholder; stop the animation when the image loads (`data-loaded`).
- Serve thumbnails at about 2× display size for grids; load full-resolution images only in immersive views, cross-fading over the thumbnail.
- Mask shapes (arch, squircle) create identity. Apply them consistently to every image of the same kind.
- `loading="lazy"` below the fold; `fetchpriority="high"` on the hero image.

## 9. Empty states and feedback

- Empty state: an icon in the brand shape, a one-line title, one sentence on what to do, and the action button. Never just "No data".
- Toasts: short, bottom or top centre, inverse colours, pill, about 4s. Offer **Undo** for destructive actions instead of a confirm dialog when the action is reversible.
- Success screens state exactly what happened and what happens next. They never claim more than the system did.

## 10. Icon system

- One family, used everywhere: Phosphor (6 weights, good for premium work), Lucide (stroke only), Material Symbols (variable axes), or SF Symbols on Apple-only work.
- One module maps **semantic names to glyphs** (`book`, `compare`, `finder`, plus one icon per category); screens never import glyphs directly.
- Weight conventions: light/regular by default, fill for active or pressed, duotone for feature tiles. Set the defaults with the library's context provider.
- Directional icons (back, forward, chevron) depend on writing direction. In RTL, "forward" points left; name them by meaning, not by arrow direction.
- Multi-weight icon libraries cost bundle size; verify tree-shaking (unused glyph names should not appear in the bundle).
