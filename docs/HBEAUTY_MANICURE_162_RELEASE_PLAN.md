# H-Beauty – remaining 162 manicure photographs (4 quality-gated batches)

STATUS: **0 of these 162 generated/approved/deployed**. Existing certified photo count: 58 manicure + 78 pedicure. This is a production specification, not finished image assets. Do not count a prompt or preview collage as a published photograph.

Source of truth: exact 220 manicure catalog style IDs; exclusions: all previously released 58 manicure IDs from immutable SHA-256 release manifests. All 162 IDs are unique and not in previous photo releases.

| Batch | Target | Photos | State |
|---|---|---:|---|
| B61 | `assets/hbeauty-manicure-batch61.sha256` | 50 | Awaiting original image generation, visual QA and approval |
| B62 | `assets/hbeauty-manicure-batch62.sha256` | 50 | Awaiting original image generation, visual QA and approval |
| B63 | `assets/hbeauty-manicure-batch63.sha256` | 50 | Awaiting original image generation, visual QA and approval |
| B64 | `assets/hbeauty-manicure-batch64.sha256` | 12 | Awaiting original image generation, visual QA and approval |

**Quality bar:** Individual photorealistic image with five anatomically correct fingers, exact design/finish, a single woman's hand on pure ivory silk, genuine native square resolution >=1600 px; no duplicate/stone/extra fingers, no contact-sheet crop. Visual/semantic review is not certified by SHA-256 or a technical build. Each approved batch must pass app's TypeScript/build/Playwright, offline-precache and *all-public-URLs-hash-matched* CI release checks.

**Files:** `docs/HBEAUTY_MANICURE_162_QUEUE.json` contains machine-readable metadata and QA statuses; batch briefs `docs/HBEAUTY_MANICURE_B61_PROMPTS.md` through `docs/HBEAUTY_MANICURE_B64_PROMPTS.md`. The submitted scripts do not spend paid image credits or alter published images.
