import type { NailStyle } from "@/data/nail-styles";
import { NAIL_FINISHES, NAIL_SHAPES } from "@/data/nail-styles";
import { serviceById, formatMinutes } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { NailVisual } from "../nail-visual";
import { Button, Sheet, haptic, useSalonActions } from "../ui";

export function NailSheet({ open, style, onClose }: { open: boolean; style: NailStyle; onClose: () => void }) {
  const { openBooking } = useSalonActions();
  const favorites = useSalon((state) => state.favNails);
  const toggle = useSalon((state) => state.toggleFavNail);
  const saved = favorites.includes(style.id);
  const service = serviceById.get(style.serviceId);
  const finish = NAIL_FINISHES.find((entry) => entry.key === style.finish)?.title ?? style.finish;
  const shape = NAIL_SHAPES.find((entry) => entry.key === style.shape)?.title ?? style.shape;

  return (
    <Sheet open={open} onClose={onClose} title={style.title}>
      <article className="nail-detail">
        <div className="nail-detail__visual">
          <NailVisual style={style} />
        </div>
        <small className="nail-detail__en" lang="en">{style.en.toUpperCase()}</small>
        <h3>{style.title}</h3>
        <p>{style.description}</p>
        <div className="nail-detail__tags">
          <span>جلوه: {finish}</span>
          <span>فرم: {shape}</span>
          <span>طول: {style.length === "short" ? "کوتاه" : style.length === "medium" ? "متوسط" : "بلند"}</span>
        </div>
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
        {service ? <p className="nail-detail__note">خدمت پیشنهادی: {service.title} · مدت تقریبی {formatMinutes(service.minutes)} · قیمت پس از مشاوره</p> : null}
        <span className="nail-detail__en" lang="en">HANANEH BEAUTY / NAIL ATELIER</span>
      </article>
    </Sheet>
  );
}
