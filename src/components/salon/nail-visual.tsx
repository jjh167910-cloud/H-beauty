import { useEffect, useState } from "react";
import type { NailStyle } from "@/data/nail-styles";
import photoQuality from "@/data/nail-photo-quality.json";
import { NailPreview } from "./nail-preview";
import { PedicurePreview } from "./pedicure-preview";

/**
 * An optional, quality-reviewed editorial WebP collection; missing assets
 * fall back to local vectors and never break offline navigation.
 */
/**
 * Nail Atelier editorial quality policy.
 * The V3 ZIP has 34 WebP files, but only nine sources have individual/native
 * crops of at least 600px AND a matching visible finish. The others derive
 * from small contact sheets (some as little as 186px) or resemble other looks.
 * Keep those styles on their accurate, sharp SVG design illustrations.
 *
 * This is deliberate: upscaling a tiny reference is not real photographic
 * detail, and mildly recoloring an existing nail pose does not create a new
 * genuine style. None are claimed to be photographs of the salon's work.
 */
const quality: Record<string, { native: number; photo: boolean; reason?: string }> = photoQuality.styles;

export const NAIL_EDITORIAL_PHOTOS: Readonly<Record<string, string>> =
  import.meta.env.VITE_NAIL_EDITORIAL_V2 === "true"
    ? Object.fromEntries(Object.entries(quality)
        .filter(([id, q]) =>
          q.photo && q.native >= 600 &&
          (id !== "nail-marble" || import.meta.env.VITE_NAIL_EDITORIAL_V3 === "true"))
        .map(([id]) => [id, `/nails/photos/${id}.webp`]))
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
