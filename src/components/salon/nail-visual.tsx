import { useEffect, useState } from "react";
import type { NailStyle } from "@/data/nail-styles";
import { NailPreview } from "./nail-preview";
import { PedicurePreview } from "./pedicure-preview";

/**
 * An optional, quality-reviewed editorial WebP collection; missing assets
 * fall back to local vectors and never break offline navigation.
 */
// Editorial images are illustrative concepts, not customer results. The 34-look
// asset set has 24 visually matched photo references. For the ten references whose
// generated images do not faithfully show the named finish, keep accurate vector
// art instead of misrepresenting them. Enabling requires the complete verified pack.
export const V2_APPROVED_PHOTOS = [
  "nail-milky-silk","nail-ballet-pink","nail-old-money","nail-ruby-red",
  "nail-merlot","nail-cocoa","nail-classic-french","nail-gold-french",
  "nail-pearl-chrome","nail-rose-chrome","nail-silver-chrome",
  "nail-peach-ombre","nail-champagne","nail-rose-glitter",
  "nail-midnight-glitter","nail-botanical","nail-modern-lines",
  "nail-cobalt-lines",
  "pedi-classic-nude","pedi-french","pedi-ruby",
  "pedi-blush","pedi-lavender","pedi-sparkle",
] as const;
export const NAIL_EDITORIAL_PHOTOS: Readonly<Record<string,string>> =
  import.meta.env.VITE_NAIL_EDITORIAL_V2 === "true"
  ? Object.fromEntries([...V2_APPROVED_PHOTOS, ...(import.meta.env.VITE_NAIL_EDITORIAL_V3 === "true" ? ["nail-marble"] : [])].map(id=>[id,`/nails/photos/${id}.webp`]))
  : {
    "nail-milky-silk": "/nails/photos/nail-milky-silk.webp",
    "nail-classic-french": "/nails/photos/nail-classic-french.webp",
    "nail-ruby-red": "/nails/photos/nail-ruby-red.webp",
    "nail-pearl-chrome": "/nails/photos/nail-pearl-chrome.webp",
  };

export function NailVisual({
  style,
  className = "",
  priority = false,
}: {
  style: NailStyle;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { setFailed(false); setReady(false); }, [style.id]);
  const source = NAIL_EDITORIAL_PHOTOS[style.id];
  const photo = Boolean(source && !failed);

  return (
    <span className={`nail-visual ${className}`} role="img" aria-label={`نمونه الهام‌بخش طرح ناخن ${style.title}؛ تصویرسازی نمایشی، نه اجرای واقعی سالن`}>
      <span className="nail-visual__fallback" aria-hidden="true">
        {style.kind === "pedicure" ? <PedicurePreview style={style} /> : <NailPreview style={style} />}
      </span>
      {photo ? (
        <img
          className="nail-visual__photo"
          data-ready={ready || undefined}
          src={source}
          alt=""
          aria-hidden="true"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          width={600}
          height={600}
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}
