import type { MakeupLook } from "@/data/makeup";
export const MODEL_REFERENCE_SRC = "/makeup/model-reference.webp";
export const MAKEUP_FINAL_IMAGES = import.meta.env.VITE_MAKEUP_FINAL_IMAGES === "true";
/** User-uploaded forty-photo catalog remains explicitly opt-in until image deployment. */
export const MAKEUP_CURATED_40 = import.meta.env.VITE_MAKEUP_CURATED_40 === "true";
export function makeupPortraitSrc(look: MakeupLook, size: "full"|"thumb" = "full") {
  if(MAKEUP_CURATED_40) return size === "thumb"
    ? (look.thumb ?? look.image ?? MODEL_REFERENCE_SRC)
    : (look.image ?? MODEL_REFERENCE_SRC);
  return MAKEUP_FINAL_IMAGES ? `/makeup/results/${look.id}.webp` : MODEL_REFERENCE_SRC;
}
export function MakeupArtwork({look,full=false}:{look:MakeupLook;full?:boolean}) {
  return <div className="makeup-art"
    data-model-source={MAKEUP_CURATED_40?"curated-portrait":MAKEUP_FINAL_IMAGES?"individual-portrait":"exact-reference"}
    data-makeup-category={look.category}>
    <img src={makeupPortraitSrc(look,full?"full":"thumb")}
      alt={MAKEUP_CURATED_40
        ? `پرتره الهام‌بخش هوش مصنوعی، سبک ${look.name}`
        : MAKEUP_FINAL_IMAGES
          ? `پرتره اختصاصی مدل حنانه بیوتی با میکاپ ${look.name}`
          : `چهره مدل مرجع حنانه بیوتی؛ تصویر ثابت برای ایده ${look.name}`}
      width={MAKEUP_CURATED_40?960:undefined} height={MAKEUP_CURATED_40?1200:undefined}
      loading={full?"eager":"lazy"} decoding="async" draggable={false}
      onError={event=>{
        if(MAKEUP_CURATED_40 && !full && look.image && event.currentTarget.src.includes("/sm/"))
          event.currentTarget.src=look.image;
      }}/>
  </div>;
}
