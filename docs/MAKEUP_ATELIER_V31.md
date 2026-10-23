# H-Beauty v31 — Makeup Atelier

## Release scope

Adds a second catalog under Gallery → **میکاپ**, without changing the five-button mobile navigation and **without any virtual try-on, face detection, camera access, AI makeup application, or portrait upload**.

### Content
- 48 clearly labeled **editorial concept looks** across six categories: Natural, Soft Glam, Evening, Bridal, Eye, Lip.
- Self-contained, offline SVG facial illustrations illustrate color and finish. They are **not photos of the salon's actual work**, and do not promise a result on the customer's face.
- Text search, category filters, separate persisted makeup favorites, a detailed palette and request-appointment action.
- The existing hair gallery, save/compare functionality and photos are preserved.

### Booking
- The existing 4-step booking sheet is reused.
- `makeupId` is an optional string reference, distinct from numeric hairstyle `lookId`.
- Old bookings without `makeupId` remain valid on hydration; invalid IDs are ignored.
- Draft and submitted requests show makeup name; shared request text includes its code.
- Makeup-only and hair+makeup services can be selected together.
- Five new makeup services display price as **after consultation**. Existing salon placeholder pricing remains subject to verification.
- Nail services now have their own category.

### Production/photography content gate
Before presenting this as a real salon portfolio, commission/approve model photographs for the selected makeup styles. Obtain consent to publish portraits, choose uniform 3:4 framing, and avoid altering customer faces beyond approved retouching. Do not replace the conceptual-art disclaimer until photos genuinely depict approved work and are correctly labeled.

### QA
Run GitHub review CI (typecheck, Vite build, Playwright UI suite) and inspect actual Android viewport screenshots (320, 390, 768px) in light and dark. In particular verify persisted hairstyles and makeups, booking share text, and offline startup.

**No try-on capability is included in v31.**
