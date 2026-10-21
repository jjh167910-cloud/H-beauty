import { useState } from "react";
import { CalendarPlus, Columns2, Heart, HeartHandshake, Share2 } from "lucide-react";
import { toast } from "sonner";
import { labelOf, lookSrc, type Family } from "@/data/catalog";
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
      <div className="px-5 pb-6">
        <div className="look-hero">
          <img src={lookSrc(imageId)} alt={name} />
          <div className="absolute top-3 flex gap-2 start-3">
            <button type="button" className={cn("glass-btn press", saved && "glass-btn-on")} aria-pressed={saved} aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره"} onClick={() => { haptic(); toggleFav(family.id); if (!saved) toast("به ذخیره‌ها اضافه شد."); }}>
              <Heart className={cn("size-[18px]", saved && "fill-current")} />
            </button>
            <button type="button" className={cn("glass-btn press", picked && "glass-btn-on")} aria-pressed={picked} aria-label={picked ? "حذف از مقایسه" : "افزودن به مقایسه"} onClick={() => { haptic(); if (toggleCompare(family.id) === "limit") toast("برای مقایسه حداکثر سه مدل انتخاب کنید."); }}>
              <Columns2 className="size-[18px]" />
            </button>
            <button type="button" className="glass-btn press" aria-label="اشتراک‌گذاری" onClick={share}>
              <Share2 className="size-[18px]" />
            </button>
          </div>
        </div>

        {family.variantIds.length > 1 ? (
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {family.variantIds.map((id, itemIndex) => (
              <button key={id} type="button" onClick={() => setIndex(itemIndex)} className={cn("press shrink-0 overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-background transition", itemIndex === index ? "ring-accent" : "ring-transparent opacity-60")} aria-label={family.variantNames[itemIndex] ?? family.name}>
                <img src={lookSrc(id)} alt="" className="size-16 object-cover" />
              </button>
            ))}
          </div>
        ) : null}

        <p className="mt-5 font-brand text-xs font-semibold tracking-[0.22em] text-accent-deep" dir="ltr">{family.code}</p>
        <h2 className="mt-1 text-2xl leading-snug font-bold">{name}</h2>
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
