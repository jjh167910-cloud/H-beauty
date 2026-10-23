import { useSalon } from "@/lib/salon-store";
import type { KeyboardEvent } from "react";

type GalleryMode = "hair" | "makeup";
type Props = { variant: "home" | "gallery" };

/** Accessible, RTL-aware, controlled tabs shared by the home and gallery views. */
export function GalleryModeSwitch({ variant }: Props) {
  const mode = useSalon((state) => state.galleryMode);
  const setMode = useSalon((state) => state.setGalleryMode);
  const prefix = variant === "home" ? "hb-home-mode" : "hb-gallery-mode";
  const panelId = `${prefix}-panel`;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    const current: GalleryMode = mode;
    let next: GalleryMode | null = null;
    // Visual order is hair (right) then makeup (left) in the Persian RTL layout.
    if (event.key === "ArrowLeft") next = current === "hair" ? "makeup" : "hair";
    else if (event.key === "ArrowRight") next = current === "makeup" ? "hair" : "makeup";
    else if (event.key === "Home") next = "hair";
    else if (event.key === "End") next = "makeup";
    if (!next) return;
    event.preventDefault();
    setMode(next);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-gallery-mode="${next}"]`)?.focus();
  }

  return (
    <nav
      className={variant === "home" ? "makeup-home-tabs px-gutter" : "makeup-gallery-switch px-gutter"}
      role="tablist"
      aria-label={variant === "home" ? "انتخاب بخش اصلی" : "نوع گالری"}
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
    >
      {([
        ["hair", "مدل مو"],
        ["makeup", "میکاپ"],
      ] as const).map(([value, label]) => (
        <button
          key={value}
          id={`${prefix}-${value}`}
          type="button"
          data-gallery-mode={value}
          role="tab"
          aria-controls={panelId}
          aria-selected={mode === value}
          tabIndex={mode === value ? 0 : -1}
          onClick={() => setMode(value)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
