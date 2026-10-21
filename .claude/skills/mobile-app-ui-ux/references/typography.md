# Typography

## Contents
1. Choosing fonts by rendering, not by name
2. A three-family system
3. Loading fonts well
4. Setting type
5. Arabic-script languages (Persian, Arabic, Urdu)
6. Numerals
7. Font candidates

## 1. Choosing fonts by rendering, not by name

Never pick a font from memory. Render the **real brand name and real UI strings** in every candidate at display and body sizes, then look:

```bash
python3 scripts/font_specimen.py --text "Brand Name" --ui "Book an appointment · 980 · Settings" \
  --font "Inter=node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2" \
  --font "Manrope=node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2" \
  --out /tmp/specimen
```

This writes `specimen.html` and `specimen.png` (light and bold weights, plus a UI line). Reject a candidate if it has:
- missing or substituted glyphs (letters fall back to another font)
- wrong digit forms for the locale
- poor light weights, which a premium display style needs
- a mood that contradicts the brand adjectives

Install candidates from npm (`@fontsource-variable/<name>`, or `@fontsource/<name>` for static fonts) so files are local and versioned. Run `npm view <pkg> version` first to confirm the package exists.

## 2. A three-family system

| Role | Purpose | Typical choice |
| --- | --- | --- |
| UI / body | Everything functional | A variable sans-serif with a wide weight range (100–900) |
| Display / brand accent | Wordmark, one accent phrase per screen | A serif, calligraphic or high-contrast display face |
| Latin accent (for non-Latin products) | Logotype, small caps labels, numerals | A Didone or fashion serif (e.g. Bodoni Moda) |

Two families is often enough; three is the ceiling. Every extra family costs bytes and coherence.

## 3. Loading fonts well

- Prefer **variable** fonts: one file covers every weight, and the optical-size axis (`opsz`) improves small text.
- Import only the subsets you need (the `unicode-range` split per script).
- Fontsource uses `font-display: swap`. Size the fallback stack so layout shift stays small (`system-ui` for sans-serif fonts).
- A heavy display font (calligraphy is often 200 KB or more) should only be used on screens that need it; browsers download it lazily when a glyph first renders.
- Set `font-synthesis: none` so the browser never fakes bold or italic.

## 4. Setting type

- Body line-height 1.6–1.85; display 1.2–1.35.
- Measure (line length) of 45–75 characters. On phones this is naturally constrained, so mind it on tablets.
- `text-wrap: balance` for headings and `text-wrap: pretty` for paragraphs.
- Track Latin all-caps labels **open** (0.12–0.3em) and keep them small. Large display text may take −0.01 to −0.02em, but only for Latin scripts.
- Use one weight step for emphasis (e.g. 400 → 500), not bold everywhere.
- Underline-style form fields and light headings look premium; heavy borders look like a default template.

## 5. Arabic-script languages (Persian, Arabic, Urdu)

These are **cursive, joined** scripts, and Latin habits break them.
- **No letter-spacing, ever.** Tracking breaks letter joins and Chrome may disable shaping. Set `letter-spacing: 0` on every text style that Persian text can reach.
- **Taller line-height** (about 1.75–1.9 for body). Diacritics and deep descenders need room.
- **ZWNJ (U+200C)** is essential in Persian (`می‌شود`, `ریچوال‌های`). It produces a visible gap where letters do not join. That gap is **correct**; don't "fix" it. Confirm the font's `unicode-range` includes `U+200C` (Fontsource Arabic subsets do).
- **Nastaliq** calligraphy (e.g. Noto Nastaliq Urdu) is the authentic Persian display style. It is luxurious for wordmarks and short accent phrases but:
  - needs line-height of about 2.0–2.2 because its descenders are very deep
  - clips if combined with `background-clip: text` on a tight box; give it padding
  - must never be used for UI text, long paragraphs or numbers
  - when a Latin line sits under a Nastaliq wordmark, leave about 0.5em of gap or the descenders collide
- **Ruqaa and Kufi** fonts are Arabic styles. Many lack Persian letters (پ چ ژ گ) or Persian `ی`/`ک` forms; check the specimen.
- Bold Persian text is louder than bold Latin, so use one weight lighter than you would in English.

## 6. Numerals

- Format numbers with `Intl.NumberFormat(locale)`: `fa-IR` gives Persian digits (۰۱۲۳), `ar-EG` gives Arabic-Indic digits (٠١٢٣). Many Arabic fonts render ٤٥٦ instead of the Persian ۴۵۶; reject those for Persian products.
- Do not apply `tabular-nums` / `tnum` to Persian prices. It widens the Persian decimal separator (`٫`) so `۲٫۱` reads as `۲ , ۱`. Use tabular figures only for times, counters and tables.
- Wrap mixed-direction numbers (phone numbers, codes, times in Latin digits) in `dir="ltr"` or `<bdi>`.

## 7. Font candidates

UI sans-serif (Latin): Inter, Manrope, Plus Jakarta Sans, Geist, General Sans (commercial), SF Pro (Apple platforms only).

Display serif (Latin): Fraunces, Playfair Display, Bodoni Moda, Cormorant Garamond, Instrument Serif.

Persian UI sans-serif: **Estedad** (modern, excellent light weights), **Vazirmatn** (the safe workhorse), Shabnam, Sahel, Samim; commercial: IRANSansX, Yekan Bakh, Peyda, Kalameh.

Persian display: **Noto Nastaliq Urdu** (calligraphy), Lalezar (bold display), and Estedad or Vazirmatn at weights 100–200 for elegant thin headlines.

Arabic UI: IBM Plex Sans Arabic, Noto Sans Arabic, Readex Pro, Alexandria. Arabic display: Amiri, Markazi Text, El Messiri, Reem Kufi (verify Persian support before using any of these for Persian).

Hebrew: Rubik, Assistant, Heebo; display: Frank Ruhl Libre.
