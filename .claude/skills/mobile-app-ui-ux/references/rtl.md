# Right-to-left (Persian, Arabic, Hebrew, Urdu)

Design RTL-first rather than mirroring a finished LTR design. Most bugs come from physical CSS properties and unisolated Latin runs.

## Contents
1. Document setup
2. Layout
3. Icons and direction
4. Bidirectional text
5. Typography reminders
6. Dates, calendars, numbers, phones
7. Testing

## 1. Document setup

```html
<html lang="fa" dir="rtl">
```
- Set `dir` on `<html>`; give toasts, sheets and portals `dir="rtl"` if the library renders outside the root (e.g. `<Toaster dir="rtl" />`).
- Copy is written in the language itself. Don't litter the UI with English eyebrow labels; Latin is for brand accents only.

## 2. Layout

- Only logical properties: `margin-inline-start`, `padding-inline`, `inset-inline-end`, `border-inline-start`, `text-align: start`. Tailwind: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`.
- Flex and grid follow the direction automatically. Never hard-code `left`/`right` for alignment.
- Transforms do **not** mirror: `translateX(-50%)` for centring under `start-1/2` must become `translate-x-1/2` in RTL. Check every translate.
- Horizontal scroll containers start at the right; `scrollLeft` is negative (or 0 → −max) in RTL in modern browsers. Use `Math.abs(scrollLeft)` when computing the index.
- Slide animations: "forward" moves leftwards. Choose keyframes by meaning, then mirror for RTL.

## 3. Icons and direction

- Mirror icons that imply direction or progress: back/forward arrows, chevrons, "send", undo/redo arrows in some contexts, progress bars.
- Don't mirror icons of real-world objects, media playback (play ▶ stays), clocks, checkmarks, brand logos, or the search magnifier.
- Name icons semantically (`forward`, `back`, `chevron`) and map them per direction in the icon module.

## 4. Bidirectional text

- Wrap Latin and number runs that sit inside RTL text: `<span dir="ltr">HB-027</span>`, `<bdi>`, or `unicode-bidi: isolate`. Otherwise punctuation and digits jump to the wrong side (e.g. "N°" rendering as "°N").
- Phone, email, code and URL inputs get `dir="ltr"`.
- SVG text (`<text>`, `<textPath>`) inherits RTL and may vanish or reverse. Set `direction="ltr"` on the SVG for Latin text.
- Mixed bullet lists: put the separator (·) inside the isolated run or between isolated runs.

## 5. Typography reminders

See `typography.md` section 5. In short:
- no letter-spacing on cursive scripts
- taller line-height
- ZWNJ gaps are correct
- verify Persian-specific letters (پ چ ژ گ ک ی) and digit forms in specimens
- Nastaliq only for short display text

## 6. Dates, calendars, numbers, phones

- Persian (Solar Hijri) calendar via `Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday, day, month, timeZone })`. Arabic Hijri via `ar-SA-u-ca-islamic`.
- Do date arithmetic in UTC from ISO date strings, and get "now" in the business's timezone with `formatToParts`; never trust the device timezone for opening hours.
- Week structure differs: in Iran the weekend is Friday, and the week starts on Saturday.
- Numbers: `Intl.NumberFormat("fa-IR")` for display. Accept Persian, Arabic and Latin digits on input and normalise before validating, e.g. for Iranian mobiles `^(?:\+98|0098|0)?(9\d{9})$` after digit conversion.
- Prices: write units in words ("هزار" / "میلیون" تومان) for large figures; avoid tabular figures on Persian decimals.

## 7. Testing

- Screenshot every screen in RTL at small and large phone sizes.
- Check: alignment of icons next to text, chevron directions, swipe directions, carousel start position, number and code rendering, and toasts.
- Search the codebase for physical properties: `left:`, `right:`, `ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `translateX(`.
