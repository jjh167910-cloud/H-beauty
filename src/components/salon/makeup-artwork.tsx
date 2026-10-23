import type { MakeupLook } from "@/data/makeup";

export const MODEL_REFERENCE_SRC = "/makeup/model-reference.webp";

/**
 * Default concept preview is the unchanged source photograph, not a finished look.
 * Only the explicitly approved 48-image release build uses separate photo files.
 * The release command fails if any look is absent or not approved.
 */
export const MAKEUP_FINAL_IMAGES = import.meta.env.VITE_MAKEUP_FINAL_IMAGES === "true";

export function makeupPortraitSrc(look: MakeupLook) {
  return MAKEUP_FINAL_IMAGES ? `/makeup/results/${look.id}.webp` : MODEL_REFERENCE_SRC;
}

export function MakeupArtwork({ look }: { look: MakeupLook }) {
  return (
    <div className="makeup-art" data-model-source={MAKEUP_FINAL_IMAGES ? "individual-portrait" : "exact-reference"} data-makeup-category={look.category}>
      <img
        src={makeupPortraitSrc(look)}
        alt={MAKEUP_FINAL_IMAGES
          ? `پرتره اختصاصی مدل حنانه بیوتی با میکاپ ${look.name}`
          : `چهره مدل مرجع حنانه بیوتی؛ تصویر ثابت برای ایده ${look.name}`}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
