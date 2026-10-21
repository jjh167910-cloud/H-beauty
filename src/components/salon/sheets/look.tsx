import { useState } from "react";
import { CalendarPlus, Columns2, Heart, HeartHandshake, Share2 } from "lucide-react";
import { toast } from "sonner";
import { labelOf, lookSrc, persian, type Family } from "@/data/catalog";
import { SALON } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { shareText } from "@/lib/share";
import { Button, Sheet, haptic, useSalonActions } from "../ui";

export function LookSheet({ open, family, onClose }: { open: boolean; family: Family; onClose: () => void }) {
  const { openBooking, openSheet } = useSalonActions();
  const saved = useSalon((state) => state.favs.includes(family.id));
  const picked = useSalon((state) => state.compare.includes(family.id));
  const toggleFav = useSalon((state) => state.toggleFav);
  const toggleCompare = useSalon((state) => state.toggleCompare);
  const [index, setIndex] = useState(0);
  const imageId = family.variantIds[index] ?? family.repId;
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
          <Button tone="ghost" className="min-h-14 px-4" onClick={() => openSheet({ kind: "consult" })} aria-label="مشاوره درباره این مدل">
            <HeartHandshake className="size-5" />
          </Button>
          <Button tone="accent" size="lg" className="flex-1" onClick={() => openBooking({ service, lookId: family.id })}>
            <CalendarPlus className="size-5" /> رزرو با این استایل
          </Button>
        </div>
      }
    >
      <div className="px-6 pb-6">
        <div className="look-hero">
          <div
            className="look-carousel no-scrollbar"
            onScroll={(event) => {
              const node = event.currentTarget;
              const next = Math.round(Math.abs(node.scrollLeft) / node.clientWidth);
              if (next !== index) setIndex(next);
            }}
          >
            {family.variantIds.map((id, itemIndex) => (
              <img key={id} src={lookSrc(id)} alt={family.variantNames[itemIndex] ?? family.name} loading={itemIndex ? "lazy" : "eager"} draggable={false} />
            ))}
          </div>
          {family.variantIds.length > 1 ? (
            <div className="glass-dark absolute top-4 start-1/2 flex translate-x-1/2 gap-1.5 rounded-full px-2.5 py-1.5" aria-hidden="true">
              {family.variantIds.map((id, itemIndex) => (
                <span key={id} className={cn("h-1.5 rounded-full bg-white transition-all duration-300", itemIndex === index ? "w-4" : "w-1.5 opacity-50")} />
              ))}
            </div>
          ) : null}
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            <button type="button" className={cn("glass-btn glass press", saved && "glass-btn-on")} aria-pressed={saved} aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره"} onClick={() => { haptic(); toggleFav(family.id); if (!saved) toast("به ذخیره‌ها اضافه شد."); }}>
              <Heart className={cn("size-[18px]", saved && "fill-current")} />
            </button>
            <button type="button" className={cn("glass-btn glass press", picked && "glass-btn-on")} aria-pressed={picked} aria-label={picked ? "حذف از مقایسه" : "افزودن به مقایسه"} onClick={() => { haptic(); if (toggleCompare(family.id) === "limit") toast("برای مقایسه حداکثر سه مدل انتخاب کنید."); }}>
              <Columns2 className="size-[18px]" />
            </button>
            <button type="button" className="glass-btn glass press" aria-label="اشتراک‌گذاری" onClick={share}>
              <Share2 className="size-[18px]" />
            </button>
          </div>
        </div>
        {family.variantIds.length > 1 ? <p className="mt-3 text-center text-[0.7rem] text-muted">برای دیدن {persian(family.variantIds.length)} برداشت، تصویر را بکشید</p> : null}

        <p className="mt-5 font-brand text-xs font-medium tracking-[0.22em] text-accent-deep" dir="ltr">{family.code}</p>
        <h2 className="mt-1 text-2xl leading-snug font-light tracking-tight">{name}</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((chip) => <span key={chip} className="badge">{labelOf(chip)}</span>)}
        </div>
        <p className="mt-4 text-sm leading-7 text-muted">
          {family.description ||
            (family.variantIds.length > 1
              ? "چند برداشت نزدیک از این استایل را بالا ببینید. تناسب نهایی با جنس و طول موی شما در سالن بررسی می‌شود."
              : "این تصویر نمونه استایل است. تناسب نهایی با جنس و طول موی شما در سالن بررسی می‌شود.")}
        </p>
      </div>
    </Sheet>
  );
}
