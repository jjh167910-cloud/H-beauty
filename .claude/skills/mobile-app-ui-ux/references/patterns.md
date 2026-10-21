# UX patterns

## Contents
1. Navigation model
2. First launch and onboarding
3. Home screen
4. Catalogues, feeds and search
5. Booking, checkout and other multi-step flows
6. Profile and settings
7. Feedback, errors and undo
8. Honest UI when there is no backend

## 1. Navigation model

- **Bottom tabs** for 3–5 peer destinations, plus an optional centre action for the core job. Anything else lives in sheets or behind the profile/avatar.
- **Sheets** for detail and tasks that return to the same place; **push navigation** only for genuinely hierarchical drill-downs.
- **Deep links:** every tab and important sheet has a route or hash. The browser/Android Back button closes the top-most sheet first, then walks tab history.
- **Restore position:** returning to a tab restores its scroll offset. Remember how many items were loaded in infinite lists, or the restored offset gets clamped.
- **Tabs and transitions:** tab switches slide in the direction of the tab order (mirrored in RTL); sheets rise from the bottom.

## 2. First launch and onboarding

- One welcome screen, not a carousel. It carries the brand, a single image, three short promises, an optional personalisation input (a name), and one call to action.
- The call to action must be visible without scrolling on a 320×568 screen. Hide secondary content with `@media (max-height: …)` rather than shrinking text.
- Never block the app behind sign-up when the product works without an account.
- Remember that onboarding has been seen; returning users skip it.

## 3. Home screen

Order of content, top to bottom:
1. **Context:** greeting (time of day and name), a live status (open/closed, order status).
2. **What's next:** the user's upcoming item (appointment, order), if one exists.
3. **Hero:** one editorial image or story with a single action.
4. **Quick actions:** a **bento grid** (one tall image tile, two square tiles, one wide tile) beats a row of identical icons.
5. **Curated rails:** horizontally scrolling, snap-aligned rows (services, people, collections), each with a "see all" link.
6. **Trust and practicalities:** location, hours, contact.
7. A quiet footer with the wordmark.

## 4. Catalogues, feeds and search

- Grid of 2 columns on phones, 3 on large phones and tablets. Each card shows the image, a two-line title and a secondary line; per-item actions (save, compare) sit over the image, out of the subject's face.
- A sticky filter chip row with a search field above it. Show the count of results ("24 of 283") and a "show all" reset when the list is narrowed.
- Infinite scroll with an IntersectionObserver sentinel and a generous `rootMargin`. Animate only the first page of items in, with a short stagger.
- **Immersive mode:** a full-screen, vertically snapping feed (one item per screen) with double-tap to save, a side action rail and a progress indicator. Render only the items near the current one.
- Compare: a tray (dock) collects up to 3 items, then opens a side-by-side view.
- Empty results suggest the next action (clear filters, browse all).

## 5. Booking, checkout and other multi-step flows

- A cart model: users add one or more items anywhere in the app, a dock shows a running summary (count, duration or total), and "Continue" opens the flow with the items preselected.
- Steps for a booking: **what → who → when → details → confirm**. Skip steps already decided (a chosen staff member jumps to time selection).
- **Date picker:** a horizontal strip of days (weekday, date, month) with closed days disabled and labelled. **Time slots:** grouped by morning/afternoon/evening, only times when the whole service fits before closing, and nothing in the past.
- Show the sticky footer summary on every step; the primary button names the next step's verb.
- Prefill from what the app already knows (profile name and phone).
- Confirmation states what was saved and what the user must still do. Rebooking ("book again") restores the full original selection.

## 6. Profile and settings

- A member or identity card at the top (name, key counts as tappable stats).
- Saved items rail, then grouped list rows for tools, then appearance (light/dark/auto as a segmented control), then privacy explanation and data reset.
- Settings take effect immediately; no Save button.

## 7. Feedback, errors and undo

- Optimistic UI for local actions (save, compare) with instant visual change and a light haptic (`navigator.vibrate(8)` where supported).
- Prefer **Undo in a toast** over confirmation dialogs; keep confirmations for irreversible, high-cost actions.
- Errors say what happened, why if known, and the fix, in the user's language.
- Share flows: try `navigator.share`, fall back to clipboard copy, and confirm with a toast that says which one happened.

## 8. Honest UI when there is no backend

Prototypes and early products often lack real booking, payment or AI services. The interface must reflect that truthfully:
- Store requests locally and label them as drafts ("Draft · not sent").
- Offer a real channel to send them (share sheet, WhatsApp/SMS link, copy text).
- A rules-based recommender is a "style finder" or "quiz", not "AI analysis".
- Placeholder content (prices, staff, addresses) is centralised in one data file with a comment saying it must be confirmed. Tell the user about it when you deliver.
