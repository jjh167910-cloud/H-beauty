# H-Beauty B61 — standalone image prompts v2

**40 image prompts pending / 10 released in original 50-style cohort.** Exact status derives from docs/HBEAUTY_MANICURE_162_QUEUE.json. Do not regenerate already-published designs.

## REQUIRED generator configuration (set in the model API, NOT merely inside the prompt)

Provider ElevenLabs creative image-generation node; model FLUX 3 Image; aspect_ratio **1:1**; resolution **2K**; generations_count **1**. Verify the returned original image is genuinely square and at least 1600×1600 before any approval. Do not crop contact sheets or upscale a small source. Using a different model requires setting equivalent model-specific parameters and validating native dimensions.

**Each fenced prompt is complete and independent.** Copy one entire prompt, never just the style title. A photo is an AI-generated *visual inspiration*, not documentation of work performed by the salon. Every accepted output still needs native-resolution human visual review (five nails, ivory silk with no stone, correct style and uniqueness), SHA-256 lock, CI and public Cloudflare checks.

## Already published in this cohort (do not regenerate)

- nail-rose-chrome — Rose Chrome (approved hash a88aa00d04c688a8a6bd169b60f85007eb7c836456fc0e8de64899761c3c8d66)
- nail-atlas-prism-ruby — Ruby Prism Chrome (approved hash cb969b252738b61a414e2707d79a16b181d0a48fbfde355dd57ca0a3bd692559)
- nail-atlas-prism-merlot — Merlot Prism Chrome (approved hash 3146eafcc442af61ff66ff98c6be63afac60a8fe91fd420cdffc0de0f12d1aef)
- nail-atlas-prism-espresso — Espresso Prism Chrome (approved hash c510c0b68f2d93cef71d16cdc835ce7f33fbd0679fbd3d56069d427cf8b4a014)
- nail-atlas-prism-lavender — Lavender Prism Chrome (approved hash 3fd74304149a2a1bdaafe9973bc0377b836ccae3ced73f0046fa3d2311312579)
- nail-atlas-prism-cobalt — Cobalt Prism Chrome (approved hash 8d35f3dd81f462bc30de4771b7ace45d7db2ef5b8193e444aa4631aac0a9ddaa)
- nail-atlas-gradient-midnight — Midnight Smoky Ombré (approved hash 045f19574eed07ce025052cca624a243b4462b0ae442c85ccb6faf11e91248f7)
- nail-atlas-modern-french-champagne — Champagne Double-Line French (approved hash 46db1bd56ea1bdae2c508fd44c87ba6b1b12d42c5cca60c12d20736c6068b9ef)
- nail-atlas-modern-french-cobalt — Cobalt Double-Line French (approved hash 4b72e683e09868ea88a45ca8da3a168a74fa9b7913aff3bb4f82c49deca1b19d)
- nail-atlas-foil-merlot — Merlot Gold Leaf (approved hash 64a9d73ccd7dc60a7f4e7f840f0d49513010de8ab01620f01f6a3e004d91e884)

## Pending — individual ready-to-generate prompts

### 002 — Botanical Line | گل‌های مینیمال

Catalog ID: nail-botanical · Original photo output: public/nails/photos/nail-botanical.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-botanical — Botanical Line. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #ECDACB (nude color family); detail/accent shade close to #879379. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: نقش گیاهی بسیار ظریف روی پایه کرمی.

REQUIRED NAIL ART — CREAM BOTANICAL LINE: a warm cream base on all nails and slender muted sage line-art leafy stems on exactly two accent nails; the other nails remain clean cream. Clearly visible fine botanical lines. The nail finish category is art. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 003 — Sage Garden | باغ زیتونی

Catalog ID: nail-sage-garden · Original photo output: public/nails/photos/nail-sage-garden.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-sage-garden — Sage Garden. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #97AA9C (color color family); detail/accent shade close to #F5EEE8. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: سبز سیج روشن با جزئیات سفید.

REQUIRED NAIL ART — SAGE GARDEN: pale sage base coats with selective fine milky-white miniature leaf/bud detailing on exactly two accent nails. Clean garden-inspired detailing, not solid monochrome or a dense print. The nail finish category is art. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 004 — Lilac Bloom | شکوفه یاسی

Catalog ID: nail-lilac-bloom · Original photo output: public/nails/photos/nail-lilac-bloom.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-lilac-bloom — Lilac Bloom. Nail SHAPE: ALMOND: smoothly tapering sides that meet a softly rounded almond point, not a sharp stiletto or flat coffin tip. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #B9A5CD (color color family); detail/accent shade close to #F6E5F6. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یاسی پاستلی با جزئیات ریز.

REQUIRED NAIL ART — LILAC BLOOM: pastel lilac base, very small delicate five-petal lilac blossoms and tiny pale leaf details on exactly two accent nails; three matching simple base-colored nails; not oversized flowers or stickers. The nail finish category is art. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 005 — Cobalt Accent | آبی کبالت

Catalog ID: nail-cobalt-lines · Original photo output: public/nails/photos/nail-cobalt-lines.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-cobalt-lines — Cobalt Accent. Nail SHAPE: COFFIN/BALLERINA: tapered sides ending in a clearly FLAT, straight narrow tip, not an almond point or wide square. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #325590 (color color family); detail/accent shade close to #CFDFF9. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: آبی عمیق با خطوط دقیق مینیمال.

REQUIRED NAIL ART — COBALT ACCENT: deep cobalt-blue base with precise thin ice-blue minimalist linear accents on exactly two nails; clean architectural edges and negative space, no dots or French borders. The nail finish category is art. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 006 — Merlot Velvet Matte | مخمل مات زرشکی

Catalog ID: nail-atlas-velvet-merlot · Original photo output: public/nails/photos/nail-atlas-velvet-merlot.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-velvet-merlot — Merlot Velvet Matte. Nail SHAPE: ALMOND: smoothly tapering sides that meet a softly rounded almond point, not a sharp stiletto or flat coffin tip. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #5F3046 (dark color family); detail/accent shade close to #E6A9BA. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: پوشش مات مخملی و لبه‌های کاملاً مرتب با پالت زرشکی.

REQUIRED NAIL ART — All five nails have even, opaque velvety MATTE lacquer: diffuse powdery finish with no mirror highlights, no gloss, no glitter, no metallic sheen, no tips or decorative stripes. Keep the base color visually dominant. The nail finish category is matte. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 007 — Espresso Velvet Matte | مخمل مات اسپرسو

Catalog ID: nail-atlas-velvet-espresso · Original photo output: public/nails/photos/nail-atlas-velvet-espresso.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-velvet-espresso — Espresso Velvet Matte. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #63473C (dark color family); detail/accent shade close to #D5AD93. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: پوشش مات مخملی و لبه‌های کاملاً مرتب با پالت اسپرسو.

REQUIRED NAIL ART — All five nails have even, opaque velvety MATTE lacquer: diffuse powdery finish with no mirror highlights, no gloss, no glitter, no metallic sheen, no tips or decorative stripes. Keep the base color visually dominant. The nail finish category is matte. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 008 — Sage Velvet Matte | مخمل مات سیج

Catalog ID: nail-atlas-velvet-sage · Original photo output: public/nails/photos/nail-atlas-velvet-sage.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-velvet-sage — Sage Velvet Matte. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #879C83 (color color family); detail/accent shade close to #DCE8C8. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: پوشش مات مخملی و لبه‌های کاملاً مرتب با پالت سیج.

REQUIRED NAIL ART — All five nails have even, opaque velvety MATTE lacquer: diffuse powdery finish with no mirror highlights, no gloss, no glitter, no metallic sheen, no tips or decorative stripes. Keep the base color visually dominant. The nail finish category is matte. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 009 — Lavender Velvet Matte | مخمل مات یاسی

Catalog ID: nail-atlas-velvet-lavender · Original photo output: public/nails/photos/nail-atlas-velvet-lavender.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-velvet-lavender — Lavender Velvet Matte. Nail SHAPE: COFFIN/BALLERINA: tapered sides ending in a clearly FLAT, straight narrow tip, not an almond point or wide square. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #A395C7 (color color family); detail/accent shade close to #E9DDFB. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: پوشش مات مخملی و لبه‌های کاملاً مرتب با پالت یاسی.

REQUIRED NAIL ART — All five nails have even, opaque velvety MATTE lacquer: diffuse powdery finish with no mirror highlights, no gloss, no glitter, no metallic sheen, no tips or decorative stripes. Keep the base color visually dominant. The nail finish category is matte. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 010 — Cobalt Velvet Matte | مخمل مات کبالت

Catalog ID: nail-atlas-velvet-cobalt · Original photo output: public/nails/photos/nail-atlas-velvet-cobalt.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-velvet-cobalt — Cobalt Velvet Matte. Nail SHAPE: ALMOND: smoothly tapering sides that meet a softly rounded almond point, not a sharp stiletto or flat coffin tip. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #385DA8 (color color family); detail/accent shade close to #BED7FF. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: پوشش مات مخملی و لبه‌های کاملاً مرتب با پالت کبالت.

REQUIRED NAIL ART — All five nails have even, opaque velvety MATTE lacquer: diffuse powdery finish with no mirror highlights, no gloss, no glitter, no metallic sheen, no tips or decorative stripes. Keep the base color visually dominant. The nail finish category is matte. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 011 — Pearl Velvet Matte | مخمل مات مرواریدی

Catalog ID: nail-atlas-velvet-pearl · Original photo output: public/nails/photos/nail-atlas-velvet-pearl.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-velvet-pearl — Pearl Velvet Matte. Nail SHAPE: COFFIN/BALLERINA: tapered sides ending in a clearly FLAT, straight narrow tip, not an almond point or wide square. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #D1CCD0 (nude color family); detail/accent shade close to #FCF8FA. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: پوشش مات مخملی و لبه‌های کاملاً مرتب با پالت مرواریدی.

REQUIRED NAIL ART — All five nails have even, opaque velvety MATTE lacquer: diffuse powdery finish with no mirror highlights, no gloss, no glitter, no metallic sheen, no tips or decorative stripes. Keep the base color visually dominant. The nail finish category is matte. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 017 — Ivory Smoky Ombré | دودی آمبره عاجی

Catalog ID: nail-atlas-gradient-ivory · Original photo output: public/nails/photos/nail-atlas-gradient-ivory.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-gradient-ivory — Ivory Smoky Ombré. Nail SHAPE: ALMOND: smoothly tapering sides that meet a softly rounded almond point, not a sharp stiletto or flat coffin tip. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #E9D7C6 (nude color family); detail/accent shade close to #FFF8E9. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: محو شدن تدریجی و یکدست رنگ با پالت عاجی.

REQUIRED NAIL ART — Smooth, airbrushed smoky OMBRÉ across EACH nail: controlled tonal fade from the base hue near the root into the pale accent hue toward the tip; no hard lines, spotted marble, French tip, or glitter. The nail finish category is ombre. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 018 — Blush Smoky Ombré | دودی آمبره رز لطیف

Catalog ID: nail-atlas-gradient-blush · Original photo output: public/nails/photos/nail-atlas-gradient-blush.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-gradient-blush — Blush Smoky Ombré. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #D9A1B0 (pink color family); detail/accent shade close to #FFE3E7. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: محو شدن تدریجی و یکدست رنگ با پالت رز لطیف.

REQUIRED NAIL ART — Smooth, airbrushed smoky OMBRÉ across EACH nail: controlled tonal fade from the base hue near the root into the pale accent hue toward the tip; no hard lines, spotted marble, French tip, or glitter. The nail finish category is ombre. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 019 — Champagne Smoky Ombré | دودی آمبره شامپاینی

Catalog ID: nail-atlas-gradient-champagne · Original photo output: public/nails/photos/nail-atlas-gradient-champagne.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-gradient-champagne — Champagne Smoky Ombré. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #C6A682 (nude color family); detail/accent shade close to #F9E3BD. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: محو شدن تدریجی و یکدست رنگ با پالت شامپاینی.

REQUIRED NAIL ART — Smooth, airbrushed smoky OMBRÉ across EACH nail: controlled tonal fade from the base hue near the root into the pale accent hue toward the tip; no hard lines, spotted marble, French tip, or glitter. The nail finish category is ombre. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 020 — Espresso Smoky Ombré | دودی آمبره اسپرسو

Catalog ID: nail-atlas-gradient-espresso · Original photo output: public/nails/photos/nail-atlas-gradient-espresso.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-gradient-espresso — Espresso Smoky Ombré. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #63473C (dark color family); detail/accent shade close to #D5AD93. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: محو شدن تدریجی و یکدست رنگ با پالت اسپرسو.

REQUIRED NAIL ART — Smooth, airbrushed smoky OMBRÉ across EACH nail: controlled tonal fade from the base hue near the root into the pale accent hue toward the tip; no hard lines, spotted marble, French tip, or glitter. The nail finish category is ombre. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 021 — Sage Smoky Ombré | دودی آمبره سیج

Catalog ID: nail-atlas-gradient-sage · Original photo output: public/nails/photos/nail-atlas-gradient-sage.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-gradient-sage — Sage Smoky Ombré. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #879C83 (color color family); detail/accent shade close to #DCE8C8. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: محو شدن تدریجی و یکدست رنگ با پالت سیج.

REQUIRED NAIL ART — Smooth, airbrushed smoky OMBRÉ across EACH nail: controlled tonal fade from the base hue near the root into the pale accent hue toward the tip; no hard lines, spotted marble, French tip, or glitter. The nail finish category is ombre. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 023 — Coral Smoky Ombré | دودی آمبره مرجانی

Catalog ID: nail-atlas-gradient-coral · Original photo output: public/nails/photos/nail-atlas-gradient-coral.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-gradient-coral — Coral Smoky Ombré. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #DA887A (pink color family); detail/accent shade close to #FBD2B9. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: محو شدن تدریجی و یکدست رنگ با پالت مرجانی.

REQUIRED NAIL ART — Smooth, airbrushed smoky OMBRÉ across EACH nail: controlled tonal fade from the base hue near the root into the pale accent hue toward the tip; no hard lines, spotted marble, French tip, or glitter. The nail finish category is ombre. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 024 — Ivory Double-Line French | فرنچ دوخط عاجی

Catalog ID: nail-atlas-modern-french-ivory · Original photo output: public/nails/photos/nail-atlas-modern-french-ivory.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-modern-french-ivory — Ivory Double-Line French. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #E9D7C6 (nude color family); detail/accent shade close to #FFF8E9. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: فرنچ دوبل با خطوط موازی فوق‌باریک با پالت عاجی.

REQUIRED NAIL ART — Precise DOUBLE-LINE FRENCH: sheer natural nail-bed with two distinct hair-thin, parallel curved lines following the free edge, using the base hue and pale accent hue as fine tip details; uniform spacing, clear gap, aligned on each nail. Not a single thick tip. The nail finish category is french. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 025 — Blush Double-Line French | فرنچ دوخط رز لطیف

Catalog ID: nail-atlas-modern-french-blush · Original photo output: public/nails/photos/nail-atlas-modern-french-blush.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-modern-french-blush — Blush Double-Line French. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #D9A1B0 (pink color family); detail/accent shade close to #FFE3E7. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: فرنچ دوبل با خطوط موازی فوق‌باریک با پالت رز لطیف.

REQUIRED NAIL ART — Precise DOUBLE-LINE FRENCH: sheer natural nail-bed with two distinct hair-thin, parallel curved lines following the free edge, using the base hue and pale accent hue as fine tip details; uniform spacing, clear gap, aligned on each nail. Not a single thick tip. The nail finish category is french. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 027 — Ruby Double-Line French | فرنچ دوخط یاقوتی

Catalog ID: nail-atlas-modern-french-ruby · Original photo output: public/nails/photos/nail-atlas-modern-french-ruby.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-modern-french-ruby — Ruby Double-Line French. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #A72E40 (red color family); detail/accent shade close to #F3A7B2. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: فرنچ دوبل با خطوط موازی فوق‌باریک با پالت یاقوتی.

REQUIRED NAIL ART — Precise DOUBLE-LINE FRENCH: sheer natural nail-bed with two distinct hair-thin, parallel curved lines following the free edge, using the base hue and pale accent hue as fine tip details; uniform spacing, clear gap, aligned on each nail. Not a single thick tip. The nail finish category is french. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 029 — Midnight Double-Line French | فرنچ دوخط نیمه‌شب

Catalog ID: nail-atlas-modern-french-midnight · Original photo output: public/nails/photos/nail-atlas-modern-french-midnight.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-modern-french-midnight — Midnight Double-Line French. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #2E344E (dark color family); detail/accent shade close to #B7C1E8. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: فرنچ دوبل با خطوط موازی فوق‌باریک با پالت نیمه‌شب.

REQUIRED NAIL ART — Precise DOUBLE-LINE FRENCH: sheer natural nail-bed with two distinct hair-thin, parallel curved lines following the free edge, using the base hue and pale accent hue as fine tip details; uniform spacing, clear gap, aligned on each nail. Not a single thick tip. The nail finish category is french. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 030 — Coral Double-Line French | فرنچ دوخط مرجانی

Catalog ID: nail-atlas-modern-french-coral · Original photo output: public/nails/photos/nail-atlas-modern-french-coral.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-modern-french-coral — Coral Double-Line French. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #DA887A (pink color family); detail/accent shade close to #FBD2B9. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: فرنچ دوبل با خطوط موازی فوق‌باریک با پالت مرجانی.

REQUIRED NAIL ART — Precise DOUBLE-LINE FRENCH: sheer natural nail-bed with two distinct hair-thin, parallel curved lines following the free edge, using the base hue and pale accent hue as fine tip details; uniform spacing, clear gap, aligned on each nail. Not a single thick tip. The nail finish category is french. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 031 — Pearl Double-Line French | فرنچ دوخط مرواریدی

Catalog ID: nail-atlas-modern-french-pearl · Original photo output: public/nails/photos/nail-atlas-modern-french-pearl.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-modern-french-pearl — Pearl Double-Line French. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #D1CCD0 (nude color family); detail/accent shade close to #FCF8FA. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: فرنچ دوبل با خطوط موازی فوق‌باریک با پالت مرواریدی.

REQUIRED NAIL ART — Precise DOUBLE-LINE FRENCH: sheer natural nail-bed with two distinct hair-thin, parallel curved lines following the free edge, using the base hue and pale accent hue as fine tip details; uniform spacing, clear gap, aligned on each nail. Not a single thick tip. The nail finish category is french. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 032 — Blush Gold Leaf | ورق طلا رز لطیف

Catalog ID: nail-atlas-foil-blush · Original photo output: public/nails/photos/nail-atlas-foil-blush.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-foil-blush — Blush Gold Leaf. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #D9A1B0 (pink color family); detail/accent shade close to #FFE3E7. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: جزئیات ورق فلزی نامتقارن با پالت رز لطیف.

REQUIRED NAIL ART — Irregular SMALL asymmetric pieces of true metallic gold-leaf foil embedded in manicure lacquer on one to three accent nails; fine foil edges, with ample visible base-colored nail and no bulky gold jewelry or stones. The nail finish category is foil. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 033 — Champagne Gold Leaf | ورق طلا شامپاینی

Catalog ID: nail-atlas-foil-champagne · Original photo output: public/nails/photos/nail-atlas-foil-champagne.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-foil-champagne — Champagne Gold Leaf. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #C6A682 (nude color family); detail/accent shade close to #F9E3BD. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: جزئیات ورق فلزی نامتقارن با پالت شامپاینی.

REQUIRED NAIL ART — Irregular SMALL asymmetric pieces of true metallic gold-leaf foil embedded in manicure lacquer on one to three accent nails; fine foil edges, with ample visible base-colored nail and no bulky gold jewelry or stones. The nail finish category is foil. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 034 — Ruby Gold Leaf | ورق طلا یاقوتی

Catalog ID: nail-atlas-foil-ruby · Original photo output: public/nails/photos/nail-atlas-foil-ruby.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-foil-ruby — Ruby Gold Leaf. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #A72E40 (red color family); detail/accent shade close to #F3A7B2. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: جزئیات ورق فلزی نامتقارن با پالت یاقوتی.

REQUIRED NAIL ART — Irregular SMALL asymmetric pieces of true metallic gold-leaf foil embedded in manicure lacquer on one to three accent nails; fine foil edges, with ample visible base-colored nail and no bulky gold jewelry or stones. The nail finish category is foil. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 036 — Espresso Gold Leaf | ورق طلا اسپرسو

Catalog ID: nail-atlas-foil-espresso · Original photo output: public/nails/photos/nail-atlas-foil-espresso.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-foil-espresso — Espresso Gold Leaf. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #63473C (dark color family); detail/accent shade close to #D5AD93. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: جزئیات ورق فلزی نامتقارن با پالت اسپرسو.

REQUIRED NAIL ART — Irregular SMALL asymmetric pieces of true metallic gold-leaf foil embedded in manicure lacquer on one to three accent nails; fine foil edges, with ample visible base-colored nail and no bulky gold jewelry or stones. The nail finish category is foil. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 037 — Sage Gold Leaf | ورق طلا سیج

Catalog ID: nail-atlas-foil-sage · Original photo output: public/nails/photos/nail-atlas-foil-sage.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-foil-sage — Sage Gold Leaf. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #879C83 (color color family); detail/accent shade close to #DCE8C8. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: جزئیات ورق فلزی نامتقارن با پالت سیج.

REQUIRED NAIL ART — Irregular SMALL asymmetric pieces of true metallic gold-leaf foil embedded in manicure lacquer on one to three accent nails; fine foil edges, with ample visible base-colored nail and no bulky gold jewelry or stones. The nail finish category is foil. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 038 — Lavender Gold Leaf | ورق طلا یاسی

Catalog ID: nail-atlas-foil-lavender · Original photo output: public/nails/photos/nail-atlas-foil-lavender.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-foil-lavender — Lavender Gold Leaf. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #A395C7 (color color family); detail/accent shade close to #E9DDFB. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: جزئیات ورق فلزی نامتقارن با پالت یاسی.

REQUIRED NAIL ART — Irregular SMALL asymmetric pieces of true metallic gold-leaf foil embedded in manicure lacquer on one to three accent nails; fine foil edges, with ample visible base-colored nail and no bulky gold jewelry or stones. The nail finish category is foil. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 039 — Midnight Gold Leaf | ورق طلا نیمه‌شب

Catalog ID: nail-atlas-foil-midnight · Original photo output: public/nails/photos/nail-atlas-foil-midnight.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-foil-midnight — Midnight Gold Leaf. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: MEDIUM: approximately 4–6 mm free edge beyond the fingertip; clearly longer than short, not dramatic extensions. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #2E344E (dark color family); detail/accent shade close to #B7C1E8. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: جزئیات ورق فلزی نامتقارن با پالت نیمه‌شب.

REQUIRED NAIL ART — Irregular SMALL asymmetric pieces of true metallic gold-leaf foil embedded in manicure lacquer on one to three accent nails; fine foil edges, with ample visible base-colored nail and no bulky gold jewelry or stones. The nail finish category is foil. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 040 — Coral Gold Leaf | ورق طلا مرجانی

Catalog ID: nail-atlas-foil-coral · Original photo output: public/nails/photos/nail-atlas-foil-coral.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-foil-coral — Coral Gold Leaf. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: LONG: approximately 8–12 mm free edge beyond the fingertip; elegant proportional extensions, not extreme claws. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #DA887A (pink color family); detail/accent shade close to #FBD2B9. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: جزئیات ورق فلزی نامتقارن با پالت مرجانی.

REQUIRED NAIL ART — Irregular SMALL asymmetric pieces of true metallic gold-leaf foil embedded in manicure lacquer on one to three accent nails; fine foil edges, with ample visible base-colored nail and no bulky gold jewelry or stones. The nail finish category is foil. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 041 — Pearl Gold Leaf | ورق طلا مرواریدی

Catalog ID: nail-atlas-foil-pearl · Original photo output: public/nails/photos/nail-atlas-foil-pearl.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-foil-pearl — Pearl Gold Leaf. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #D1CCD0 (nude color family); detail/accent shade close to #FCF8FA. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: جزئیات ورق فلزی نامتقارن با پالت مرواریدی.

REQUIRED NAIL ART — Irregular SMALL asymmetric pieces of true metallic gold-leaf foil embedded in manicure lacquer on one to three accent nails; fine foil edges, with ample visible base-colored nail and no bulky gold jewelry or stones. The nail finish category is foil. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 042 — Ivory Minimal Dot | نقطه مینیمال عاجی

Catalog ID: nail-atlas-minimal-ivory · Original photo output: public/nails/photos/nail-atlas-minimal-ivory.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-minimal-ivory — Ivory Minimal Dot. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #E9D7C6 (nude color family); detail/accent shade close to #FFF8E9. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یک نقطهٔ ظریف و تعادل فضای خالی با پالت عاجی.

REQUIRED NAIL ART — MINIMAL DOT: exactly one tiny intentionally positioned accent dot near the cuticle on one or two nails; most of each nail remains clean glossy base with intentional negative space. No polka-dot arrays or gems. The nail finish category is gloss. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 043 — Blush Minimal Dot | نقطه مینیمال رز لطیف

Catalog ID: nail-atlas-minimal-blush · Original photo output: public/nails/photos/nail-atlas-minimal-blush.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-minimal-blush — Blush Minimal Dot. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #D9A1B0 (pink color family); detail/accent shade close to #FFE3E7. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یک نقطهٔ ظریف و تعادل فضای خالی با پالت رز لطیف.

REQUIRED NAIL ART — MINIMAL DOT: exactly one tiny intentionally positioned accent dot near the cuticle on one or two nails; most of each nail remains clean glossy base with intentional negative space. No polka-dot arrays or gems. The nail finish category is gloss. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 044 — Champagne Minimal Dot | نقطه مینیمال شامپاینی

Catalog ID: nail-atlas-minimal-champagne · Original photo output: public/nails/photos/nail-atlas-minimal-champagne.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-minimal-champagne — Champagne Minimal Dot. Nail SHAPE: COFFIN/BALLERINA: tapered sides ending in a clearly FLAT, straight narrow tip, not an almond point or wide square. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #C6A682 (nude color family); detail/accent shade close to #F9E3BD. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یک نقطهٔ ظریف و تعادل فضای خالی با پالت شامپاینی.

REQUIRED NAIL ART — MINIMAL DOT: exactly one tiny intentionally positioned accent dot near the cuticle on one or two nails; most of each nail remains clean glossy base with intentional negative space. No polka-dot arrays or gems. The nail finish category is gloss. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 045 — Ruby Minimal Dot | نقطه مینیمال یاقوتی

Catalog ID: nail-atlas-minimal-ruby · Original photo output: public/nails/photos/nail-atlas-minimal-ruby.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-minimal-ruby — Ruby Minimal Dot. Nail SHAPE: ALMOND: smoothly tapering sides that meet a softly rounded almond point, not a sharp stiletto or flat coffin tip. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #A72E40 (red color family); detail/accent shade close to #F3A7B2. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یک نقطهٔ ظریف و تعادل فضای خالی با پالت یاقوتی.

REQUIRED NAIL ART — MINIMAL DOT: exactly one tiny intentionally positioned accent dot near the cuticle on one or two nails; most of each nail remains clean glossy base with intentional negative space. No polka-dot arrays or gems. The nail finish category is gloss. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 046 — Merlot Minimal Dot | نقطه مینیمال زرشکی

Catalog ID: nail-atlas-minimal-merlot · Original photo output: public/nails/photos/nail-atlas-minimal-merlot.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-minimal-merlot — Merlot Minimal Dot. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #5F3046 (dark color family); detail/accent shade close to #E6A9BA. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یک نقطهٔ ظریف و تعادل فضای خالی با پالت زرشکی.

REQUIRED NAIL ART — MINIMAL DOT: exactly one tiny intentionally positioned accent dot near the cuticle on one or two nails; most of each nail remains clean glossy base with intentional negative space. No polka-dot arrays or gems. The nail finish category is gloss. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 047 — Espresso Minimal Dot | نقطه مینیمال اسپرسو

Catalog ID: nail-atlas-minimal-espresso · Original photo output: public/nails/photos/nail-atlas-minimal-espresso.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-minimal-espresso — Espresso Minimal Dot. Nail SHAPE: SQUARE: visibly straight parallel sidewalls and a flat free edge with subtly softened corners; never almond or rounded tips. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #63473C (dark color family); detail/accent shade close to #D5AD93. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یک نقطهٔ ظریف و تعادل فضای خالی با پالت اسپرسو.

REQUIRED NAIL ART — MINIMAL DOT: exactly one tiny intentionally positioned accent dot near the cuticle on one or two nails; most of each nail remains clean glossy base with intentional negative space. No polka-dot arrays or gems. The nail finish category is gloss. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 048 — Sage Minimal Dot | نقطه مینیمال سیج

Catalog ID: nail-atlas-minimal-sage · Original photo output: public/nails/photos/nail-atlas-minimal-sage.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-minimal-sage — Sage Minimal Dot. Nail SHAPE: COFFIN/BALLERINA: tapered sides ending in a clearly FLAT, straight narrow tip, not an almond point or wide square. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #879C83 (color color family); detail/accent shade close to #DCE8C8. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یک نقطهٔ ظریف و تعادل فضای خالی با پالت سیج.

REQUIRED NAIL ART — MINIMAL DOT: exactly one tiny intentionally positioned accent dot near the cuticle on one or two nails; most of each nail remains clean glossy base with intentional negative space. No polka-dot arrays or gems. The nail finish category is gloss. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 049 — Lavender Minimal Dot | نقطه مینیمال یاسی

Catalog ID: nail-atlas-minimal-lavender · Original photo output: public/nails/photos/nail-atlas-minimal-lavender.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-minimal-lavender — Lavender Minimal Dot. Nail SHAPE: ALMOND: smoothly tapering sides that meet a softly rounded almond point, not a sharp stiletto or flat coffin tip. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #A395C7 (color color family); detail/accent shade close to #E9DDFB. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یک نقطهٔ ظریف و تعادل فضای خالی با پالت یاسی.

REQUIRED NAIL ART — MINIMAL DOT: exactly one tiny intentionally positioned accent dot near the cuticle on one or two nails; most of each nail remains clean glossy base with intentional negative space. No polka-dot arrays or gems. The nail finish category is gloss. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

### 050 — Cobalt Minimal Dot | نقطه مینیمال کبالت

Catalog ID: nail-atlas-minimal-cobalt · Original photo output: public/nails/photos/nail-atlas-minimal-cobalt.webp · STATUS: NOT GENERATED / NOT APPROVED

~~~text
SINGLE PHOTOGRAPH ONLY — Create exactly ONE standalone, photorealistic luxury manicure editorial photograph, not a multi-panel layout, design grid, contact sheet, comparison, infographic or catalog poster. No labels, text, numbers or graphic borders.

SUBJECT AND ANATOMY — Exactly ONE young adult woman's natural hand, palm facing down, relaxed gentle fan pose; ALL FIVE distinct, anatomically correct fingers including the thumb, and ALL FIVE complete nail plates with visible free edges and cuticles, clearly seen in a single frame. Each nail belongs to its own normal finger, with no merged, duplicated, missing or additional digits. Show enough of each fingertip to judge proportions; do not crop nails or thumb. Real human skin pores, plausible knuckles and cuticles, correct nail-to-finger attachment.

STYLE ID nail-atlas-minimal-cobalt — Cobalt Minimal Dot. Nail SHAPE: OVAL: gently rounded elliptical free edge with naturally curved sidewalls, no point and no square corners. Nail LENGTH: SHORT: approximately 1–2 mm free edge beyond the fingertip; compact, natural, practical nails. Choose a believable consistent shape and length for ALL FIVE nails without changing the spec. Main lacquer shade visually close to #385DA8 (color color family); detail/accent shade close to #BED7FF. Use these as calibrated sRGB COLOR TARGETS, not text to be printed. Preserve the main-versus-accent hierarchy; do not make up additional colors or motifs. Catalog meaning: یک نقطهٔ ظریف و تعادل فضای خالی با پالت کبالت.

REQUIRED NAIL ART — MINIMAL DOT: exactly one tiny intentionally positioned accent dot near the cuticle on one or two nails; most of each nail remains clean glossy base with intentional negative space. No polka-dot arrays or gems. The nail finish category is gloss. The motif must be legible at normal catalog thumbnail size and technically plausible as a real salon manicure, with precise painting, no inconsistent patterns between fingers.

SURFACE AND COMPOSITION — The entire surface directly beneath and surrounding the hand is continuous PREMIUM PURE IVORY SILK SATIN, gently folded; satin touches fingertips and palm. No breaks, windows or gaps exposing any table. Absolutely NO stone, travertine, limestone, marble, concrete, tile, wood or textured countertop at ANY point under the hand. No rings, jewelry, props, products, sleeves, flowers, backgrounds, logos or distracting objects. Square 1:1 photograph. One slightly elevated near-top-down three-quarter camera angle, approximately 65–75 degrees above the silk, elegant diagonal placement, hand fills 70–80% of the frame while all five nails remain visible. Neutral high-end studio daylight, natural contact shadows, smooth ivory backdrop; no overt peach tint, no stock-photo filter.

PHOTOGRAPHIC EXECUTION — 90 mm macro product-photography perspective, natural anatomical proportions, realistic smooth but not plastic skin with pores and genuine cuticle detail, diffuse controlled studio light. Focus across ALL FIVE nail plates, premium sharp detail, subtle fabric sheen. Color-accurate tones and believable manicure reflectance: MATTE looks matte, JELLY looks translucent, FRENCH has crisp parallel tips, MAGNETIC has a single light beam. No AI artifacts, floating nails, bent joints, deformed thumb, extra nail tips, cloned fingers, excessive hand airbrushing, collage crop or fake upscaling.

OUTPUT — ONE independent clean photo with NO text or watermark. Require native square generation at 2K or better (both dimensions at least 1600 source pixels); do not rescale a low-resolution output and pretend it is native. The image generator's API settings must explicitly request aspect_ratio=1:1 and resolution=2K; prompt wording alone cannot set file dimensions.
~~~

