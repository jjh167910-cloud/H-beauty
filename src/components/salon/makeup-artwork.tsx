import type { MakeupLook } from "@/data/makeup";

export const MODEL_REFERENCE_SRC = "/makeup/model-reference.webp";

/**
 * An unretouched crop of the exact reference photograph supplied for H-Beauty.
 * All 48 concepts share this single, unchanged face. Makeup colors shown in
 * the metadata/palette are suggestions, NOT simulated edits to the portrait.
 * No try-on, inference, synthetic face, or third-party image URL is used.
 */
export function MakeupArtwork({ look }: { look: MakeupLook }) {
  return (
    <div className="makeup-art" data-model-source="exact-reference" data-makeup-category={look.category}>
      <img
        src={MODEL_REFERENCE_SRC}
        alt={`چهره مدل مرجع حنانه بیوتی؛ تصویر ثابت برای ایده ${look.name}`}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
