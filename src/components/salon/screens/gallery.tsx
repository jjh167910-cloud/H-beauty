import { useSalon } from "@/lib/salon-store";
import { GalleryModeSwitch } from "../gallery-mode-switch";
import { LooksScreen } from "./looks";
import { MakeupScreen } from "./makeup";

export function GalleryScreen() {
  const mode=useSalon(s=>s.galleryMode);
  return <div className="salon-gallery" data-mode={mode}>
    <GalleryModeSwitch variant="gallery" />
    <div role="tabpanel" id="hb-gallery-mode-panel" aria-labelledby={`hb-gallery-mode-${mode}`}>
      {mode==="hair"?<LooksScreen/>:<MakeupScreen/>}
    </div>
  </div>;
}
