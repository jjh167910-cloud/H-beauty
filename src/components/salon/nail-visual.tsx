import { useEffect, useState } from "react";
import type { NailStyle } from "@/data/nail-styles";
import { NailPreview } from "./nail-preview";

/**
 * Four licensed-to-project, AI-generated editorial references, delivered as
 * separate WebP assets. Missing files must never break the offline gallery:
 * the original vector swatch stays visible behind the optional photo.
 *
 * Upload assets into public/nails/photos/ from Hananeh_Nail_Photo_Pack_v1.zip.
 */
export const NAIL_EDITORIAL_PHOTOS: Readonly<Record<string, string>> = {
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
        <NailPreview style={style} />
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
