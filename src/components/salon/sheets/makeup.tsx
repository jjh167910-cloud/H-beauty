import { MAKEUP_CATEGORIES, type MakeupLook } from "@/data/makeup";
import { formatMinutes, formatPrice, serviceById } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { MakeupArtwork, makeupPortraitSrc, MAKEUP_FINAL_IMAGES, MAKEUP_CURATED_40 } from "../makeup-artwork";
import { Button, Sheet, useSalonActions } from "../ui";
import { Icon } from "../icons";

export function MakeupSheet({open,look,onClose}:{open:boolean;look:MakeupLook;onClose:()=>void}) {
  const {openBooking}=useSalonActions();
  const isSaved=useSalon(s=>s.makeupFavs.includes(look.id));
  const toggle=useSalon(s=>s.toggleMakeupFav);
  const category=MAKEUP_CATEGORIES.find(c=>c.key===look.category);
  const service=serviceById.get(look.serviceId);
  return <Sheet open={open} onClose={onClose} title={look.name} full
    footer={<div className="flex gap-2">
      <Button variant="secondary" size="lg" aria-pressed={isSaved} onClick={()=>toggle(look.id)}>
        <Icon name="heart" size={18} weight={isSaved?"fill":"regular"}/>{isSaved?"ذخیره شد":"ذخیره"}
      </Button>
      <Button variant="gold" size="lg" className="flex-1" icon="book"
        onClick={()=>openBooking({service:look.serviceId,makeupId:look.id})}>درخواست این میکاپ</Button>
    </div>}>
    <div className="makeup-detail">
      <div className="makeup-detail__art"><MakeupArtwork look={look} full/></div>
      <div className="makeup-detail__meta"><span lang="en">{look.code} / MAKEUP ATELIER</span><span>{category?.label}</span></div>
      <h2>{look.name}</h2><p>{look.description}</p>
      <div className="makeup-detail__palette-wrap">
        <span>پالت رنگ پیشنهادی</span>
        <div className="makeup-detail__palette" aria-label="پالت پیشنهادی میکاپ">
          <span style={{background:look.lid}}/><span style={{background:look.pigment}}/>
          <span style={{background:look.blush}}/><span style={{background:look.skin}}/>
        </div>
      </div>
      <div className="makeup-detail__thumbs" aria-label={MAKEUP_CURATED_40 ? "نمای نزدیک چشم و لب همین پرتره" : MAKEUP_FINAL_IMAGES ? "نماهای نزدیک از همین تصویر اختصاصی" : "برش‌های مختلف از همان چهره مرجع"}>
        <div className="makeup-detail__thumb makeup-detail__thumb--eyes"><img src={makeupPortraitSrc(look)} alt="نمای نزدیک چشم همان مدل مرجع" /></div>
        <div className="makeup-detail__thumb makeup-detail__thumb--lips"><img src={makeupPortraitSrc(look)} alt="نمای نزدیک لب همان مدل مرجع" /></div>
        <div className="makeup-detail__thumb makeup-detail__thumb--face"><img src={makeupPortraitSrc(look)} alt="نمای صورت همان مدل مرجع" /></div>
      </div>
      {service ? (
        <div className="makeup-detail__service">
          <span className="makeup-detail__service-label">خدمت پیشنهادی</span>
          <strong>{service.title}</strong>
          <div>
            <span>{formatMinutes(service.minutes)}</span>
            <b>{service.price === null ? "قیمت پس از مشاوره" : `از ${formatPrice(service.price)} تومان`}</b>
          </div>
        </div>
      ) : null}
      <dl className="makeup-detail__facts">
        <div><dt>نوع آرایش</dt><dd>{category?.label}</dd></div>
        <div><dt>فینیش</dt><dd>{look.finish}</dd></div>
        <div><dt>رنگ پیشنهادی</dt><dd>قابل تنظیم با سلیقه شما</dd></div>
      </dl>
      <p className="makeup-detail__disclaimer">{MAKEUP_CURATED_40 ? "این پرتره از مجموعه انتخابی هوش مصنوعی برای الهام میکاپ است و نمونه‌کار اجراشده یا قبل و بعد سالن نیست. امتحان مجازی فعال نیست." : MAKEUP_FINAL_IMAGES ? "پرتره این سبک به‌صورت اختصاصی تهیه شده است؛ روش تولید و اصالت تصویر در پرونده تصاویر بررسی می‌شود. امتحان مجازی در این بخش فعال نیست." : "عکس واقعی همان مدل مرجع بدون تغییر چهره استفاده شده است. رنگ‌های پیشنهادی بالا روی عکس اعمال نشده‌اند؛ این صفحه نمونه اجرای میکاپ، قبل/بعد یا قابلیت امتحان مجازی نیست."}</p>
    </div>
  </Sheet>;
}
