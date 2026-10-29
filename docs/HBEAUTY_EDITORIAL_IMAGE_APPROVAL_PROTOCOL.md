# H-Beauty — Mandatory Editorial Approval Before Future Manicure Releases

**Status:** No new images approved by this change. Existing verified photo coverage remains 58 manicure and 78 pedicure images.

A SHA-256 manifest proves file identity, not correct anatomy or nail style. A new image batch must have separately reviewed original files and an auditable editorial approval record.

## Release procedure

1. Generate a separate native square image for each catalog ID. Visually inspect the original at full resolution (not a contact sheet): one young adult woman's hand, exactly five anatomically normal fingers, real skin/cuticles, no stone or extra props, and pure ivory silk beneath the hand.
2. Match nail design to the exact style ID: shape, length, color palette, metallic/matte/french/ombre finish, and motif. Compare against all previously released designs for duplicates. Reject any mismatch.
3. For every accepted photo, record its exact original WebP SHA-256 in docs/HBEAUTY_MANICURE_162_QUEUE.json and change qa_status to APPROVED and approved_by_qa to true. Leave unapproved entries NOT_GENERATED, false and null; reflect progress accurately in the batch status.
4. Create the corresponding 1–50-photo assets/hbeauty-manicure-batch61.sha256 (or next unused release lock), one source image per exact ID.
5. Create assets/hbeauty-manicure-batch61.qa.json. It requires schema:1; batch matching lock name; decision:APPROVED_FOR_PUBLICATION; a real reviewer identifier; ISO-reviewed timestamp; and exactly one review record per image.
6. Each reviewed image must list id, filename, exact sha256, finish, shape, length, base and accent copied from its actual catalog specification. Each image must document reviewed_full_resolution:true and anatomy_five_fingers, nail_detail_and_cuticles, pure_ivory_silk_no_stone, exact_catalog_style, no_duplicate_or_collage and original_native_resolution as PASS, plus meaningful review_notes.
7. Build rejects any absent, partial, mismatched or rejected editorial review before compilation. CI additionally verifies hashes, file structure, offline precache, native dimensions, mobile RTL/booking regressions, deployed service worker and every public image URL.

## Evidence limitations

An approval record is an auditable assertion, not automatic photographic proof. Full-resolution inspection is still mandatory. Generated dashboards, contact sheets, mockups, filenames and misleading deployment-count graphics cannot be accepted as manicure photographs.

**No image approval documents are added as part of this PR because no new original source photos have passed visual review.**