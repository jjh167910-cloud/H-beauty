# Visual craft

The difference between "fine" and "premium" is a hundred small decisions made on purpose. This file covers how to choose a direction and execute it precisely.

## Contents
1. Choosing a design direction
2. Direction recipes
3. Layout and grid
4. Optical details
5. Colour application
6. Imagery and art direction
7. Iconography details
8. Self-critique rubric

## 1. Choosing a design direction

Before styling, write a one-paragraph **direction statement**: the brand's adjectives, the audience, one reference world (a fashion magazine, a Swiss bank, a children's book, a terminal), and the signature element. Every later decision is checked against it.

If the user hasn't given a direction, infer it from the product and audience, choose the best-fitting recipe below, adapt it, and state your choice in one line. Don't ask the user to pick from a menu unless they want to be involved.

## 2. Direction recipes

Starting points to adapt, not templates to copy.

| Direction | Type | Colour | Shape and space | Signature ideas | Fits |
| --- | --- | --- | --- | --- | --- |
| **Quiet luxury / editorial** | Thin display (200–300), a serif or calligraphic accent, small-caps Latin | Warm porcelain neutrals, one metallic accent (champagne, bronze) | Generous whitespace, hairlines, arches or tall portrait crops | Foil call to action, numbered sections, dotted price leaders, a rotating seal | Beauty, fashion, hospitality, jewellery |
| **Swiss / precise** | Grotesk sans, strong size contrast, tabular numbers | Near-monochrome plus one saturated signal colour | Strict 4/8pt grid, square-ish radii (6–10), visible structure | Big numerals, rules, data as decoration | Finance, productivity, B2B, transport |
| **Soft / friendly** | Rounded sans, medium weights | Pastel tints, a vivid primary | Large radii (20–28), soft shadows, blobby shapes | Illustrations, playful empty states, bouncy springs | Wellness, kids, social, habit apps |
| **Bold / expressive** | Heavy condensed display, oversized headings | High contrast, 2–3 brand colours | Edge-to-edge imagery, overlapping layers | Kinetic type, marquee, colour blocking | Music, sport, events, streetwear |
| **Calm / natural** | Humanist sans plus a soft serif | Earth tones, desaturated greens and sands | Organic radii, paper texture | Photography of materials, slow fades | Meditation, food, travel, sustainability |
| **Dark / technical** | Mono accents, geometric sans | Near-black surfaces, neon or electric accent | Thin borders, grids, glows | Live data, glass panels | Developer tools, crypto, gaming, AI |

## 3. Layout and grid

- **Mobile column:** page gutter of 20–28px (fluid). Content and image edges align to the gutter; full-bleed items deliberately break it.
- **Baseline rhythm:** all vertical spacing is a multiple of 4; section gaps are a fixed token (about 48–60px); related items sit closer than unrelated ones (law of proximity).
- **Two-column grids** on phones for catalogues (gap about 16px); rails for curated sets (item width about 35–45% of the viewport so the next item peeks, signalling scroll).
- **Asymmetry with intent:** an off-grid seal, an overlapping badge or an oversized numeral adds tension; one per screen.
- **Widths:** cap the app canvas (about 34rem) on tablets and desktop, centred on a branded backdrop, rather than stretching mobile layouts.

## 4. Optical details

- Align text by its **cap height or x-height**, not its bounding box. Icons next to text are nudged so their visual centre matches the text's.
- **Concentric radii:** inner radius = outer radius − padding.
- **Optical sizing:** icons with a lot of empty space (circles) look smaller than squares; adjust by 1–2px.
- Use `text-wrap: balance` and manual line breaks in display headings to avoid orphans and lopsided shapes.
- **Hairlines:** use 1px at an alpha of the ink colour, not light grey, so they adapt to dark mode and tinted surfaces.
- **Shadows:** two layers (a tight contact shadow plus a large soft ambient one), tinted with the hue of the background.
- Numerals in prices and data: align the decimals (tabular figures) in Latin scripts only.

## 5. Colour application

- About **60/30/10** neutral surfaces / secondary surfaces and ink / accent.
- The accent marks: the primary call to action, selection, the active tab, small highlights. It is not used for decoration everywhere.
- Text on images needs a scrim (a gradient from transparent to about 80% dark at the text area).
- Check states in both themes: pressed, selected, disabled, focus.

## 6. Imagery and art direction

- Consistent crop (e.g. all portraits 3:4, the subject's eyes at the upper third), consistent colour grade and consistent background.
- A single mask shape for all imagery of a type (arch, circle, squircle) builds identity.
- Avoid stock-photo clichés; prefer real product, people and place photography. If there are no images, use typography and colour rather than generic illustrations.
- Blurred, enlarged copies of an image make premium ambient backgrounds behind it in immersive views.
- Overlay actions (save, share) sit where they won't cover the subject's face.

## 7. Iconography details

- One family, one stroke weight at rest. Size 20–24px in UI, 16–18px inline with text.
- Filled weight for active states (tab bar, pressed toggles), duotone for decorative feature tiles.
- Category icons should be literal and distinct from each other at a glance (scissors, palette, lotus, hair dryer, crown, brush).
- Test each icon with "would a stranger guess this?" and replace any that resemble a different common glyph.

## 8. Self-critique rubric

Score each 1–5 before calling the work done. Anything below 4 gets another pass.

| Criterion | 5 looks like |
| --- | --- |
| **Hierarchy** | In one second you know what the screen is and what to do next |
| **Consistency** | Every repeated element is identical; spacing follows the scale |
| **Restraint** | Nothing could be removed without loss; one accent, one signature |
| **Craft** | Alignment, radii, shadows and type details hold up at 3× zoom |
| **Identity** | Without the logo, you would still recognise the brand |
| **Usability** | Targets, contrast, feedback, Back and Undo all work on a small phone |
| **Honesty** | Every claim the UI makes is true |
| **Delight** | At least one moment (motion, a reveal, a success state) feels crafted |
