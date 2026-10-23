import { useSalon } from "@/lib/salon-store";
import { LooksScreen } from "./looks";
import { MakeupScreen } from "./makeup";

export function GalleryScreen() {
  const mode=useSalon(s=>s.galleryMode);
  const setMode=useSalon(s=>s.setGalleryMode);
  return <div className="salon-gallery" data-mode={mode}>
    <nav className="makeup-gallery-switch px-gutter" role="tablist" aria-label="نوع گالری">
      <button type="button" role="tab" aria-selected={mode==="hair"} onClick={()=>setMode("hair")}>مدل مو</button>
      <button type="button" role="tab" aria-selected={mode==="makeup"} onClick={()=>setMode("makeup")}>میکاپ</button>
    </nav>
    {mode==="hair"?<LooksScreen/>:<MakeupScreen/>}
  </div>;
}
