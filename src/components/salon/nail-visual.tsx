import { useEffect, useState } from "react";
import { NAIL_STYLES, type NailStyle } from "@/data/nail-styles";
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

const BASE_MANICURE_EDITORIAL_PHOTOS: Readonly<Record<string, string>> =
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

// Independent one-photo release; never expands or alters the V4 nine-photo whitelist.
const MANICURE_EDITORIAL_PHOTOS: Readonly<Record<string,string>> = {
  ...BASE_MANICURE_EDITORIAL_PHOTOS,
  ...(import.meta.env.VITE_MANICURE_MIDNIGHT_GLITTER === "true"
    ? { "nail-midnight-glitter": "/nails/photos/nail-midnight-glitter.webp" }
    : {})
};

/** Only the complete, SHA-locked 78-image release may enable these URLs.
 * Missing/mismatched files keep the vector artwork in place.
 */
const PEDICURE_EDITORIAL_PHOTOS: Record<string,string> =
  import.meta.env.VITE_PEDICURE_78 === "true"
    ? Object.fromEntries(NAIL_STYLES
        .filter(style => style.kind === "pedicure")
        .map(style => [style.id, `/nails/photos/${style.id}.webp`]))
    : {};

export const NAIL_EDITORIAL_PHOTOS: Readonly<Record<string,string>> = {
  ...MANICURE_EDITORIAL_PHOTOS,
  ...PEDICURE_EDITORIAL_PHOTOS
};

export function NailVisual({
  style,
  className = "",
  priority = false,
  onPhotoUnavailable,
}: {
  style: NailStyle;
  className?: string;
  priority?: boolean;
  /** The gallery can remove broken assets from its photo-only results. */
  onPhotoUnavailable?: (styleId: string) => void;
}) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { setFailed(false); setReady(false); }, [style.id]);
  const source = NAIL_EDITORIAL_PHOTOS[style.id];
  const photo = Boolean(source && !failed);

  return (
    <span className={`nail-visual ${className}`} data-media-source={photo && ready ? "ai-photo" : "vector"} role="img" aria-label={photo && ready ? `عکس الهام‌بخش ساخته‌شده با هوش مصنوعی، طرح ${style.title}؛ اجرای واقعی سالن نیست` : `تصویرسازی برداری طرح ${style.title}؛ اجرای واقعی سالن نیست`}>
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
          onError={() => {
            setFailed(true);
            onPhotoUnavailable?.(style.id);
          }}
        />
      ) : null}
    </span>
  );
}
