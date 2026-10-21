# UX principles, heuristics and microcopy

Use this when deciding *what* a screen should contain and how it should behave, and when critiquing an existing design.

## Contents
1. Laws that predict behaviour
2. Nielsen's heuristics as a checklist
3. Reducing cognitive load
4. Microcopy
5. Conversion without dark patterns
6. Personalisation and retention

## 1. Laws that predict behaviour

| Law | Implication on a phone |
| --- | --- |
| **Fitts** — time to hit a target grows with distance and shrinks with size | Big, close targets for frequent actions; primary action in the thumb zone (bottom third); destructive actions small and away from primary ones |
| **Hick** — decision time grows with the number of choices | 3–5 tabs; 4–7 filter chips visible; progressive disclosure for the rest |
| **Miller / chunking** — working memory holds about 4±1 chunks | Group fields; split flows into steps; format numbers (۰۹۱۲ ۳۴۵ ۶۷۸۹) |
| **Jakob** — users expect your app to work like the others they use | Standard patterns (bottom tabs, pull-to-refresh, swipe-to-dismiss sheets, a heart for save) before novelty |
| **Doherty threshold** — feedback within ~400ms keeps users in flow | Optimistic UI, skeletons, instant press states |
| **Aesthetic–usability effect** — polished interfaces are perceived as easier | Visual polish is functional, not decoration |
| **Peak–end rule** — experiences are judged by their peak and their end | Invest in the moment of delight (a reveal, a confirmation) and in a satisfying success screen |
| **Von Restorff (isolation)** — the different item is remembered | Exactly one visually distinct call to action per screen |
| **Goal-gradient** — effort increases near the goal | Show progress in multi-step flows; prefill to start users "part-way" |
| **Zeigarnik** — unfinished tasks stay in mind | Keep drafts and "continue where you left off" entries |

## 2. Nielsen's heuristics as a checklist

1. **Visibility of system status:** loading, saving, sent/draft states are always visible.
2. **Match with the real world:** user vocabulary, local formats (calendar, currency, digits).
3. **User control and freedom:** back, undo, cancel, dismiss everywhere.
4. **Consistency and standards:** one component per job; platform conventions.
5. **Error prevention:** disable impossible choices (closed days, past times); confirm only irreversible actions.
6. **Recognition rather than recall:** show recent items, saved items and the current selection in summaries.
7. **Flexibility and efficiency:** shortcuts (rebook, repeat order), deep links, prefill.
8. **Aesthetic and minimalist design:** every element earns its place.
9. **Help users recover from errors:** plain-language errors with the fix.
10. **Help and documentation:** inline hints at the point of need, not manuals.

## 3. Reducing cognitive load

- One primary question per screen in flows.
- Defaults that are right for most people (the first available slot, the most popular option).
- Show summaries of earlier choices so users don't have to remember them.
- Remove options before adding explanation.
- Use icons **with** labels in navigation; icon-only buttons are fine for universal actions (close, share, heart).

## 4. Microcopy

- **Buttons say what happens:** "Book this style", "Send to salon", not "Submit" or "OK".
- **Titles state the user's goal;** helper text answers the next question they would ask.
- **Errors:** what happened + how to fix it + an example: "Enter a mobile number like 0912 345 6789."
- **Empty states:** why it's empty + the next action: "No saved looks yet. Tap the heart on any look to keep it here."
- **Confirmations** describe the real outcome: "Request saved on this device. Send it to the salon to confirm."
- **Tone** follows the brand adjectives. Luxury voices are calm and concise and use no exclamation marks.
- **Write in the user's language natively.** Don't translate English idioms literally, and keep English labels out of non-English interfaces unless they are brand marks.
- Use numerals and units the locale expects, and the time of day in greetings.

## 5. Conversion without dark patterns

Do:
- Reduce steps; prefill; remember choices; show price and duration before commitment.
- Social proof only if it is real and verifiable.
- A clear value proposition on first launch.

Never:
- Fake scarcity or countdowns, pre-ticked consent, confirmshaming ("No, I don't want to look good"), hidden costs, roach-motel cancellation, or disguised ads.
- Make "cancel" or "delete my data" harder to find than "sign up".

## 6. Personalisation and retention

- Ask for one piece of personal context early (a name, a preference) and use it visibly (a greeting, recommendations).
- "Next up" cards on home for anything scheduled.
- Saved and collections features give users a reason to return.
- Notifications: opt-in at a meaningful moment (after a booking), never on first launch.
