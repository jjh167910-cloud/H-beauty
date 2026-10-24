# H-Beauty makeup names — original source prompts

The user supplied 40 textual makeup prompts, numbered **02 through 42 with 07 omitted**. Original `Pictures.zip` contained 40 portrait images, but its internal ZIP order **does not match the style numbers**. The previous catalog applied inferred names such as “Satin Brown”, which caused incorrect image captions.

This revision ties every original English prompt name to an accurate Persian salon title and faithful makeup description. It preserves the original **40 image IDs and WebP bytes** and sorts only the *display order* by original prompt number. The original ZIP→image mapping is encoded in the private review kit manifest and crosswalk CSV/JSON.

## Definitive numbering and photo mapping

| Look number | Exact English style | Persian salon title | Immutable source image |
|---|---|---|---|
| 02 | Classic Bride | عروس کلاسیک | `mk40-02.webp` |
| 03 | Persian Bride | عروس ایرانی | `mk40-03.webp` |
| 04 | Aqd Ceremony | میکاپ عقد | `mk40-04.webp` |
| 05 | Romantic Pink | صورتی رمانتیک | `mk40-05.webp` |
| 06 | Full Glam | فول گلم | `mk40-01.webp` |
| 08 | Classic Smokey | اسموکی کلاسیک | `mk40-08.webp` |
| 09 | Brown Smokey | اسموکی قهوه‌ای | `mk40-07.webp` |
| 10 | Cat Eye | چشم گربه‌ای | `mk40-10.webp` |
| 11 | No-Makeup Makeup | آرایش نامحسوس | `mk40-06.webp` |
| 12 | Latte Makeup | آرایش لاته | `mk40-09.webp` |
| 13 | Clean Girl | کلین گرل | `mk40-15.webp` |
| 14 | Sun-Kissed | آفتاب‌بوسه | `mk40-14.webp` |
| 15 | Cold Girl | صورتی زمستانی | `mk40-13.webp` |
| 16 | Strawberry | آرایش توت‌فرنگی | `mk40-11.webp` |
| 17 | Arabic Glam | گلم عربی | `mk40-12.webp` |
| 18 | Bronzed Goddess | برنزه طلایی | `mk40-16.webp` |
| 19 | Golden Hour | ساعت طلایی | `mk40-17.webp` |
| 20 | Bold Glam | گلم جسورانه | `mk40-18.webp` |
| 21 | Cut Crease | کات کریس | `mk40-19.webp` |
| 22 | Plum Smokey | اسموکی آلویی | `mk40-20.webp` |
| 23 | Emerald Night | شب زمردی | `mk40-24.webp` |
| 24 | Navy Smokey | اسموکی سرمه‌ای | `mk40-21.webp` |
| 25 | Siren Eyes | چشم سایرن | `mk40-23.webp` |
| 26 | Fox Eye | چشم روباهی | `mk40-25.webp` |
| 27 | Graphic Liner | خط چشم گرافیکی | `mk40-22.webp` |
| 28 | Colour Liner | خط چشم آبی رنگی | `mk40-26.webp` |
| 29 | Boho Bride | عروس بوهو | `mk40-30.webp` |
| 30 | Henna Night | شب حنا | `mk40-28.webp` |
| 31 | Sunset Eyes | چشم غروب | `mk40-29.webp` |
| 32 | Pastel Lilac | یاسی پاستلی | `mk40-27.webp` |
| 33 | Monochrome Berry | بری تک‌رنگ | `mk40-35.webp` |
| 34 | Glitter Party | گلیتر مهمانی | `mk40-32.webp` |
| 35 | Rhinestone Accents | نگین‌های چشم | `mk40-34.webp` |
| 36 | Electric Blue | آبی الکتریکی | `mk40-33.webp` |
| 37 | 50s Pin-Up | پین‌آپ دهه ۵۰ | `mk40-31.webp` |
| 38 | 60s Mod | ماد دهه ۶۰ | `mk40-39.webp` |
| 39 | 90s Brown Lip | لب قهوه‌ای دهه ۹۰ | `mk40-40.webp` |
| 40 | 1920s Vamp | ومپ دهه ۱۹۲۰ | `mk40-38.webp` |
| 41 | K-Beauty | کی‌بیوتی کره‌ای | `mk40-37.webp` |
| 42 | Douyin | میکاپ دوویین | `mk40-36.webp` |

**Examples of non-positional mapping:** prompt **06 Full Glam** corresponds to `mk40-01.webp`; prompt **23 Emerald Night** is `mk40-24.webp`; prompt **24 Navy Smokey** is `mk40-21.webp`; prompt **42 Douyin** is `mk40-36.webp`.

All makeup technique summaries, finishes, categories, palette colors, photo display titles, and searchable English names have been updated to match the user-supplied prompts. The `code` values now show original prompt numbers (e.g., `HB-06`) while `id` remains unchanged for saved looks and booking references.

## Technical and editorial boundaries

- Images have **not** been retouched or regenerated in this revision. Labeling is based on the provided prompt specification and manual visual comparison; images may not perfectly achieve every described technique. This does not constitute professional makeup-quality or identity certification.
- AI-generated images are **inspiration**, not photographs of completed real salon work.
- Draft PR #11 contains the frontend metadata/UI. Its separate image binary assets must still be imported from the updated download package before a curated gallery production build can succeed.
- Original look numbers **01 and 07 do not exist in the supplied prompt list**. We did not invent them.
- This change is not a production deployment and does not approve publication.
