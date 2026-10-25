import { useState } from "react";
import type { NailStyle } from "@/data/nail-styles";
import { nailStyleShareUrl } from "@/data/nail-links";
import { NAIL_FINISHES, NAIL_SHAPES, NAIL_STYLES } from "@/data/nail-styles";
import { NAIL_ATLAS_FAMILIES } from "@/data/nail-expansion";
import { serviceById, formatMinutes } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { NailVisual } from "../nail-visual";
import { Button, Sheet, haptic, useSalonActions } from "../ui";

export function NailSheet({ open, style, onClose }: { open: boolean; style: NailStyle; onClose: () => void }) {
  const { openBooking, openSheet } = useSalonActions();
  const [shareStatus, setShareStatus] = useState<"copied"|"manual"|null>(null);
  const [manualLink,setManualLink] = useState("");
  // The inspector is local to the currently selected design; changing
  // variants cannot inherit a stale crop/zoom position from another style.
  const [inspection,setInspection] = useState<{id:string;level:0|1|2}>({id:style.id,level:0});
  const inspectLevel=inspection.id===style.id ? inspection.level : 0;
  const nextInspection=()=>{
    haptic();
    setInspection({id:style.id,level:inspectLevel===2?0:(inspectLevel+1) as 0|1|2});
  };
  const inspectionLabel=inspectLevel===0 ? "نمایش تمام تصویر بدون برش"
    : inspectLevel===1 ? "بزرگ‌نمایی ۲ برابر و جابه‌جایی تصویر"
    : "بازگشت به پیش‌نمایش معمول";
  const share = async () => {
    const url = nailStyleShareUrl(style.id, window.location.href);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
    } catch {
      setManualLink(url);
      setShareStatus("manual");
    }
  };
  const favorites = useSalon((state) => state.favNails);
  const toggle = useSalon((state) => state.toggleFavNail);
  const saved = favorites.includes(style.id);
  const service = serviceById.get(style.serviceId);
  const finish = NAIL_FINISHES.find((entry) => entry.key === style.finish)?.title ?? style.finish;
  const shape = NAIL_SHAPES.find((entry) => entry.key === style.shape)?.title ?? style.shape;
  const family = NAIL_ATLAS_FAMILIES[style.kind ?? "manicure"].find(entry=>style.id.startsWith(entry.prefix));
  const familyVariants = family
    ? NAIL_STYLES.filter(item=>item.id.startsWith(family.prefix))
    : [];
  // A shade-only action must never silently change a saved design's shape
  // or length. Older catalog references had independently varied metadata,
  // so display those as explicitly different variants instead.
  const colorways = familyVariants.filter(item=>
    item.shape===style.shape && item.length===style.length);
  const otherVariants = familyVariants.filter(item=>
    item.shape!==style.shape || item.length!==style.length);
  const shapeLabel=(candidate:NailStyle)=>
    NAIL_SHAPES.find(item=>item.key===candidate.shape)?.title ?? candidate.shape;
  const lengthLabel=(candidate:NailStyle)=>
    candidate.length==="short"?"کوتاه":candidate.length==="medium"?"متوسط":"بلند";

  return (
    <Sheet open={open} onClose={onClose} title={style.title}>
      <article className="nail-detail">
        <div id="nail-detail-image" className={`nail-detail__visual${inspectLevel>0 ? " nail-detail__visual--full" : ""}${inspectLevel===2 ? " nail-detail__visual--zoom" : ""}`}
          data-inspection-level={inspectLevel}>
          <NailVisual style={style} priority />
        </div>
        <div className="nail-detail__inspect-actions">
          <button type="button" className="nail-detail__inspect-button"
            aria-controls="nail-detail-image" aria-label={inspectionLabel}
            onClick={nextInspection}>{inspectionLabel}</button>
          <span role="status" aria-live="polite">{inspectLevel===2
            ? "برای دیدن جزئیات، تصویر را با لمس یا اسکرول جابه‌جا کنید."
            : inspectLevel===1 ? "نمایش کامل طرح، بدون بریدن لبه‌های تصویر." : "نمایش پیش‌نمایش طرح"}</span>
        </div>
        <div className="nail-detail__source" aria-live="polite">
          <span className="nail-detail__source--photo">مرجع عکاسی الهام‌بخش؛ ساخته‌شده با هوش مصنوعی</span>
          <span className="nail-detail__source--illustration">پیش‌نمایش برداری رنگ و فرم ناخن</span>
        </div>
        <small className="nail-detail__en" lang="en">{style.en.toUpperCase()}</small>
        <h3>{style.title}</h3>
        <p>{style.description}</p>
        <div className="nail-detail__tags">
          <span>جلوه: {finish}</span>
          <span>فرم: {shape}</span>
          <span>طول: {style.length === "short" ? "کوتاه" : style.length === "medium" ? "متوسط" : "بلند"}</span>
        </div>
        {family && familyVariants.length ? (
          <section className="nail-detail__colorways" aria-label="رنگ‌بندی و فرم‌های همین مجموعه">
            <div className="nail-detail__colorways-head">
              <strong>رنگ‌بندی با فرم و طول یکسان</strong>
              <span>{colorways.length.toLocaleString("fa-IR")} رنگ</span>
            </div>
            <div className="nail-detail__swatches" role="group" aria-label="انتخاب رنگ‌بندی">
              {colorways.map(option=>(
                <button
                  key={option.id}
                  type="button"
                  aria-label={`انتخاب رنگ ${option.title}`}
                  aria-pressed={style.id===option.id}
                  title={option.title}
                  className="nail-detail__swatch"
                  onClick={()=>{ if(option.id!==style.id){haptic();openSheet({kind:"nail",id:option.id});} }}
                >
                  <span style={{background:`linear-gradient(135deg,${option.base} 52%,${option.accent})`}} />
                </button>
              ))}
            </div>
            {otherVariants.length ? (
              <div className="nail-detail__alternative-forms">
                <strong>رنگ‌ها با فرم یا طول متفاوت</strong>
                <p>انتخاب‌های زیر ممکن است علاوه بر رنگ، فرم یا طول ناخن را نیز تغییر دهند.</p>
                <div className="nail-detail__alternative-list" role="group" aria-label="انتخاب مدل با فرم یا طول متفاوت">
                  {otherVariants.map(option=>(
                    <button key={option.id} type="button"
                      aria-label={`انتخاب مدل ${option.title} با فرم ${shapeLabel(option)} و طول ${lengthLabel(option)}`}
                      title={option.title}
                      onClick={()=>{haptic();openSheet({kind:"nail",id:option.id});}}>
                      <span className="nail-detail__alternative-dot"
                        style={{background:`linear-gradient(135deg,${option.base},${option.accent})`}}/>
                      <span>{option.title}</span>
                      <small>{shapeLabel(option)} · {lengthLabel(option)}</small>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
        <p className="nail-detail__note">این طرح نمونهٔ الهام‌بخش ساخته‌شده با هوش مصنوعی یا تصویرسازی برداری است و عکس اجرای واقعی سالن نیست. انتخاب مواد، قیمت و زمان اجرا پس از مشاوره تعیین می‌شوند.</p>
        <div className="nail-detail__actions">
          <Button variant="gold" icon="book" onClick={() => {
            haptic();
            openBooking({ service: style.serviceId, nailStyleId: style.id });
          }}>درخواست اجرای همین طرح</Button>
          <button type="button" className="nail-card__favorite"
            aria-label={saved ? "حذف از علاقه‌مندی‌ها" : "ذخیره در علاقه‌مندی‌ها"}
            aria-pressed={saved} onClick={() => { haptic(); toggle(style.id); }}>
            <Icon name="heart" size={22} weight={saved ? "fill" : "light"} />
          </button>
        </div>
        <div className="nail-detail__share">
          <button type="button" className="nail-detail__share-button" onClick={share}
            aria-label={`کپی لینک طرح ${style.title}`}>
            <Icon name="share" size={19} />
            <span>اشتراک لینک همین طرح</span>
          </button>
          {shareStatus==="copied" ? <p role="status">لینک طرح کپی شد.</p> : null}
          {shareStatus==="manual" ? (
            <div className="nail-detail__share-fallback">
              <label htmlFor="nail-share-link">کپی خودکار ممکن نبود؛ لینک را از این بخش کپی کنید.</label>
              <input id="nail-share-link" dir="ltr" value={manualLink}
                onFocus={event=>event.currentTarget.select()} readOnly aria-label="لینک قابل کپی طرح"/>
            </div>
          ) : null}
        </div>
        {service ? <p className="nail-detail__note">خدمت پیشنهادی: {service.title} · مدت تقریبی {formatMinutes(service.minutes)} · قیمت پس از مشاوره</p> : null}
        <span className="nail-detail__en" lang="en">HANANEH BEAUTY / NAIL ATELIER</span>
      </article>
    </Sheet>
  );
}
