import { useState } from "react";
import { toast } from "sonner";
import { labelOf, lookSrc, persian, type Family } from "@/data/catalog";
import { SALON } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { shareText } from "@/lib/share";
import { Button, IconButton, Sheet, haptic, useSalonActions } from "../ui";

export function LookSheet({ open, family, onClose }: { open: boolean; family: Family; onClose: () => void }) {
  const { openBooking, openSheet } = useSalonActions();
  const saved = useSalon((state) => state.favs.includes(family.id));
  const picked = useSalon((state) => state.compare.includes(family.id));
  const toggleFav = useSalon((state) => state.toggleFav);
  const toggleCompare = useSalon((state) => state.toggleCompare);
  const [index, setIndex] = useState(0);
  const name = family.variantNames[index] ?? family.name;
  const chips = [family.category, ...family.tags.filter((tag) => tag !== family.category && labelOf(tag) !== tag)].slice(0, 3);
  const service = family.category === "updo" || family.category === "braid" ? "event-styling" : family.tags.includes("color") ? "bespoke-balayage" : "signature-cut";

  async function share() {
    const result = await shareText(`${family.name} (${family.code}) — لوک‌بوک ${SALON.name}`);
    if (result === "copied") toast("نام و کد مدل کپی شد.");
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={family.name}
      full
      footer={
        <div className="flex gap-2">
          <IconButton icon="consult" label="مشاوره درباره این مدل" size="lg" onClick={() => openSheet({ kind: "consult" })} />
          <Button variant="gold" size="lg" icon="book" className="flex-1" onClick={() => openBooking({ service, lookId: family.id })}>درخواست این استایل</Button>
        </div>
      }
    >
      <div className="studio-look-detail__header"><span lang="en">HANANEH · THE LOOK EDIT</span><span lang="en">{family.code}</span></div>
      <div className="look-hero studio-look-detail__hero">
        <div
          className="carousel"
          onScroll={(event) => {
            const node = event.currentTarget;
            const next = Math.round(Math.abs(node.scrollLeft) / node.clientWidth);
            if (next !== index) setIndex(next);
          }}
        >
          {family.variantIds.map((id, itemIndex) => (
            <img key={id} src={lookSrc(id)} alt={family.variantNames[itemIndex] ?? family.name} loading={itemIndex ? "lazy" : "eager"} draggable={false} style={{ animation: "fade 500ms ease both" }} />
          ))}
        </div>
        {family.variantIds.length > 1 ? (
          <div className="glass-dark absolute top-5 start-1/2 flex translate-x-1/2 gap-1.5 rounded-full px-2.5 py-1.5" aria-hidden="true">
            {family.variantIds.map((id, itemIndex) => (
              <span key={id} className={cn("h-1.5 rounded-full bg-white transition-all duration-300", itemIndex === index ? "w-4" : "w-1.5 opacity-50")} />
            ))}
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          <IconButton icon="heart" variant="glass" love pressed={saved} label={saved ? "حذف از ذخیره‌ها" : "ذخیره"} onClick={() => { haptic(); toggleFav(family.id); if (!saved) toast("به ذخیره‌ها اضافه شد."); }} />
          <IconButton icon="compare" variant="glass" pressed={picked} label={picked ? "حذف از مقایسه" : "افزودن به مقایسه"} onClick={() => { haptic(); if (toggleCompare(family.id) === "limit") toast("برای مقایسه حداکثر سه مدل انتخاب کنید."); }} />
          <IconButton icon="share" variant="glass" label="اشتراک‌گذاری" onClick={share} />
        </div>
      </div>
      {family.variantIds.length > 1 ? <p className="t-caption mt-3 text-center text-ink-2">برای دیدن {persian(family.variantIds.length)} برداشت، تصویر را بکشید</p> : null}

      <p className="t-caption mt-6 text-gold-ink" dir="ltr">{family.code}</p>
      <h2 className="t-title-1 studio-look-detail__title mt-1">{name}</h2>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {chips.map((chip) => <span key={chip} className="badge" data-tone="outline">{labelOf(chip)}</span>)}
      </div>
      <p className="studio-look-detail__note">تصاویر برای الهام‌اند؛ انتخاب نهایی با بررسی فرم چهره و جنس مو انجام می‌شود.</p>
      <p className="t-body mt-4 text-ink-2">
        {family.description ||
          (family.variantIds.length > 1
            ? "چند برداشت نزدیک از این استایل را بالا ببینید. تناسب نهایی با جنس و طول موی شما در سالن بررسی می‌شود."
            : "این تصویر نمونه استایل است. تناسب نهایی با جنس و طول موی شما در سالن بررسی می‌شود.")}
      </p>
    </Sheet>
  );
}
