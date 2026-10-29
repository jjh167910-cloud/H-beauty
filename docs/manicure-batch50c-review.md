# H-Beauty manicure Batch50C — source review, 29 October 2026

The previous verified release contains 48 manicure and 78 pedicure photographs. The current source set contains eight native 1600×1600 WebPs. Every file decoded, had a distinct SHA-256 checksum, and was visually reviewed against its target catalog family.

**Approved (five):** Espresso Cat-Eye, Sage Cat-Eye, Ivory Chrome, Pearl Ombré, Lavender Ombré. These depict five fingernails, a light ivory-silk surface, and an identifiable matching finish/shape. They are AI-generated editorial inspiration, **not** evidence of actual H-Beauty salon work.

**Held (three, not shipped):**
- `nail-atlas-geometry-blush`: coffin/tapered shape, while the catalog's Geometry family specifies square.
- `nail-atlas-gradient-ruby`: short, mainly glossy red presentation, while the catalog's Gradient family specifies long coffin ombré.
- `nail-atlas-gradient-cobalt`: almond/tapered appearance with uncertain squared coffin tip; cannot certify the required long coffin shape.

The release uses exact five-ID SHA-256 locking, native WebP decoding, duplicate checks against prior manicure and pedicure locks, build fail-closed logic, and service-worker offline precaching. It must not be merged until the GitHub review and mobile booking tests pass, followed by matching live Cloudflare service-worker bytes. All previous approved assets remain untouched.
