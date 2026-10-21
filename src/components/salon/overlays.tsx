import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CalendarDays, Check, Clock3, Columns2, Copy, Heart, Home, LayoutGrid, MapPin, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { families, familyById, labelOf, lookSrc, persian, type Family } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { Button, useSalonActions } from "./ui";

export type DialogMode = "look" | "compare" | "consult" | "booking" | "analyzer" | null;

export function Overlays({
  mode,
  look,
  variantIndex,
  onVariant,
  onClose,
}: {
  mode: DialogMode;
  look: Family | null;
  variantIndex: number;
  onVariant: (index: number) => void;
  onClose: () => void;
}) {
  const title = mode === "compare" ? "مقایسه مدل‌ها" : mode === "consult" ? "درخواست مشاوره" : mode === "booking" ? "رزرو نوبت اختصاصی" : mode === "analyzer" ? "راهنمای فرم چهره" : "مشاهده مدل";

  return (
    <>
      <Dialog.Root open={mode !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="veil fixed inset-0 z-50" />
          <Dialog.Content
            className={cn(
              "fixed z-50 overflow-y-auto bg-background text-foreground focus:outline-none",
              mode === "look" ? "look-sheet lg:overflow-hidden" : "dialog-panel top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-surface shadow-lift",
            )}
          >
            {mode === "look" && look ? (
              <LookBody family={look} variantIndex={variantIndex} onVariant={onVariant} />
            ) : (
              <>
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
                  <Dialog.Title className="text-base font-medium">{title}</Dialog.Title>
                  <Dialog.Close className="grid size-11 place-items-center" aria-label="بستن">
                    <X className="size-4" />
                  </Dialog.Close>
                </div>
                <div className="p-4 sm:p-6">
                  {mode === "compare" ? <CompareBody /> : null}
                  {mode === "consult" ? <ConsultBody /> : null}
                  {mode === "booking" ? <BookingBody /> : null}
                  {mode === "analyzer" ? <AnalyzerBody /> : null}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <CompareDock />
      <MobileNav />
    </>
  );
}

function LookBody({
  family,
  variantIndex,
  onVariant,
}: {
  family: Family;
  variantIndex: number;
  onVariant: (index: number) => void;
}) {
  const { openConsult, openBooking } = useSalonActions();
  const favs = useSalon((state) => state.favs);
  const compare = useSalon((state) => state.compare);
  const toggleFav = useSalon((state) => state.toggleFav);
  const toggleCompare = useSalon((state) => state.toggleCompare);
  const index = Math.min(variantIndex, family.variantIds.length - 1);
  const imageId = family.variantIds[index] ?? family.repId;
  const name = family.variantNames[index] ?? family.name;
  const saved = favs.includes(family.id);
  const picked = compare.includes(family.id);
  const chips = [family.category, ...family.tags.filter((tag) => tag !== family.category && labelOf(tag) !== tag)].slice(0, 3);

  return (
    <div className="look-layout">
      <div className="look-photo-wrap bg-blush lg:bg-background">
        <img src={lookSrc(imageId)} alt={name} className="look-photo" />
      </div>
      <div className="look-copy flex flex-col px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium tracking-widest text-accent" dir="ltr">
            {family.code}
          </p>
          <Dialog.Close className="min-h-11 px-2 text-sm text-muted hover:text-foreground">بستن</Dialog.Close>
        </div>
        <Dialog.Title className="text-4xl leading-tight font-semibold sm:text-5xl">{family.name}</Dialog.Title>
        <p className="mt-4 text-sm text-muted">{chips.map((chip) => labelOf(chip)).join(" · ")}</p>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
          {family.description ||
            (family.variantIds.length > 1
              ? "چند برداشت نزدیک از این خانواده پایین آمده است."
              : "این تصویر نمونه استایل است. تناسب نهایی با جنس و طول مو در سالن بررسی می‌شود.")}
        </p>
        {family.variantIds.length > 1 ? (
          <div className="mt-6 flex gap-3">
            {family.variantIds.map((id, itemIndex) => (
              <button
                key={id}
                type="button"
                onClick={() => onVariant(itemIndex)}
                className={cn("w-20 text-start", itemIndex === index ? "opacity-100" : "opacity-50 hover:opacity-100")}
              >
                <img src={lookSrc(id)} alt={family.variantNames[itemIndex] ?? family.name} className="aspect-square w-full rounded-xl object-cover" />
                <span className="mt-1 block text-xs leading-snug">{family.variantNames[itemIndex]}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-2">
          <Button tone={saved ? "accent" : "soft"} onClick={() => toggleFav(family.id)}>
            <Heart className={saved ? "size-4 fill-current" : "size-4"} />
            {saved ? "ذخیره شد" : "ذخیره"}
          </Button>
          <Button
            tone={picked ? "solid" : "soft"}
            onClick={() => {
              const result = toggleCompare(family.id);
              if (result === "limit") toast("برای مقایسه حداکثر سه مدل انتخاب کنید.");
            }}
          >
            <Columns2 className="size-4" />
            {picked ? "در مقایسه" : "مقایسه"}
          </Button>
          <Button tone="ghost" onClick={openConsult}>
            مشاوره
          </Button>
          <Button tone="solid" onClick={openBooking}>
            رزرو این مدل
          </Button>
        </div>
      </div>
    </div>
  );
}

function selectedFamilies(compare: number[], favs: number[]) {
  const ids = [...new Set([...compare, ...favs])];
  return ids.map((id) => familyById.get(id)).filter((family): family is Family => Boolean(family));
}

function CompareBody() {
  const { openLook, openConsult } = useSalonActions();
  const compare = useSalon((state) => state.compare);
  const clearCompare = useSalon((state) => state.clearCompare);
  const toggleCompare = useSalon((state) => state.toggleCompare);
  const selected = compare.map((id) => familyById.get(id)).filter((family): family is Family => Boolean(family));

  if (!selected.length) {
    return (
      <p className="py-8 text-sm leading-relaxed text-muted">
        برای مقایسه، علامت دو ستون را زیر تصویر مدل بزنید. حداکثر سه مدل.
      </p>
    );
  }

  return (
    <div>
      <div className={cn("grid gap-3", selected.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
        {selected.map((family) => (
          <article key={family.id}>
            <button type="button" className="block w-full text-start" onClick={() => openLook(family.id)}>
              <img src={lookSrc(family.repId)} alt={family.name} className="aspect-square w-full rounded-2xl object-cover" />
              <span className="mt-2 block text-sm font-medium">{family.name}</span>
            </button>
            <span className="mt-1 block text-xs text-muted">
              <span dir="ltr">{family.code}</span>
              <span> · {labelOf(family.category)}</span>
            </span>
            <button type="button" className="mt-2 min-h-11 text-sm text-muted hover:text-foreground" onClick={() => toggleCompare(family.id)}>
              حذف
            </button>
          </article>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button tone="solid" onClick={openConsult}>
          آماده‌سازی درخواست مشاوره
        </Button>
        <Button tone="ghost" onClick={clearCompare}>
          پاک کردن مقایسه
        </Button>
      </div>
    </div>
  );
}

function ConsultBody() {
  const { go } = useSalonActions();
  const compare = useSalon((state) => state.compare);
  const favs = useSalon((state) => state.favs);
  const selected = useMemo(() => selectedFamilies(compare, favs), [compare, favs]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  const draft = useMemo(() => {
    const lines = ["سلام، وقت بخیر.", "برای مشاوره انتخاب مدل مو با حنانه بیوتی پیام می‌دهم."];
    if (name.trim()) lines.push(`نام: ${name.trim()}`);
    if (selected.length) {
      lines.push("مدل‌های انتخابی:");
      selected.forEach((family) => lines.push(`${family.code} — ${family.name}`));
    }
    if (notes.trim()) lines.push(`توضیحات: ${notes.trim()}`);
    lines.push("لطفاً راهنمایی بفرمایید.");
    return lines.join("\n");
  }, [name, notes, selected]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("متن درخواست کپی شد.");
    } catch {
      setStatus("کپی خودکار ممکن نشد. متن را انتخاب کنید و دستی کپی کنید.");
    }
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm leading-relaxed text-muted">
        مدل‌های ذخیره‌شده و مقایسه‌شده را در یک پیام آماده کنید و از کانال رسمی سالن بفرستید.
        {selected.length ? ` ${persian(selected.length)} مدل در متن آمده است.` : " هنوز مدلی انتخاب نشده."}
      </p>
      <label className="grid gap-1.5 text-sm font-semibold">
        نام (اختیاری)
        <input value={name} onChange={(event) => setName(event.target.value)} className="h-12 rounded-2xl border border-border bg-surface px-4 text-base font-normal" placeholder="نام شما" />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold">
        توضیحات شما (اختیاری)
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="rounded-2xl border border-border bg-surface px-4 py-3 text-base font-normal"
          placeholder="برای چه مراسم یا استایلی مدل می‌خواهید؟"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold">
        متن آماده ارسال
        <textarea readOnly value={draft} rows={8} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed font-normal" />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button tone="solid" onClick={copy}>
          <Copy className="size-4" />
          کپی متن درخواست
        </Button>
        <Button tone="ghost" onClick={() => go("catalog")}>
          انتخاب مدل‌های بیشتر
        </Button>
      </div>
      <p className="text-xs text-muted">این فرم چیزی ارسال نمی‌کند و فقط متن درخواست را آماده می‌سازد.</p>
      <p className="text-sm font-medium" role="status">
        {status}
      </p>
    </div>
  );
}

function AnalyzerBody() {
  const { openLook, openBooking } = useSalonActions();
  const [face, setFace] = useState("");
  const [texture, setTexture] = useState("");
  const [routine, setRoutine] = useState("");
  const [result, setResult] = useState(false);

  const options = [
    { key: "oval", label: "بیضی", note: "پیشانی و فک متعادل" },
    { key: "round", label: "گرد", note: "گونه‌های نرم و فک منحنی" },
    { key: "square", label: "مربعی", note: "فک مشخص و زاویه‌دار" },
    { key: "heart", label: "قلبی", note: "پیشانی باز و چانه ظریف" },
    { key: "long", label: "کشیده", note: "طول صورت بیشتر از عرض" },
  ];

  function recommend() {
    const preferred = face === "round" ? ["waves", "curly", "updo"] : face === "square" ? ["waves", "curly", "bob"] : face === "heart" ? ["bob", "braid", "waves"] : face === "long" ? ["curly", "bob", "waves"] : ["waves", "straight", "updo"];
    const textureBoost = texture === "curly" ? ["curly", "waves", ...preferred] : texture === "fine" ? ["straight", "bob", ...preferred] : preferred;
    const routineBoost = routine === "quick" ? ["bob", "straight", "pixie", ...textureBoost] : textureBoost;
    const picks = [...new Set(routineBoost)].flatMap((category) => families.filter((family) => family.category === category)).filter((family, index, all) => all.findIndex((item) => item.id === family.id) === index).slice(0, 3);
    return picks.length ? picks : families.slice(0, 3);
  }

  const recommendations = recommend();
  if (result) return <div className="analyzer-result"><div className="mb-6 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-accent text-2xl text-on-accent">✦</span><div><p className="text-xs font-semibold tracking-widest text-accent-deep" dir="ltr">AI STYLE CONCIERGE</p><h3 className="text-xl font-bold">پیشنهاد اختصاصی شما آماده است</h3></div></div><p className="mb-5 text-sm leading-relaxed text-muted">بر اساس فرم چهره <strong className="text-foreground">{options.find((item) => item.key === face)?.label}</strong>، جنس مو و میزان زمان روزانه شما، این سه خانواده بیشترین هماهنگی را دارند.</p><div className="grid grid-cols-3 gap-2">{recommendations.map((family) => <button key={family.id} type="button" onClick={() => openLook(family.id)} className="text-start"><img src={lookSrc(family.repId)} alt={family.name} className="aspect-square w-full rounded-2xl object-cover" /><span className="mt-2 block text-xs font-semibold leading-snug">{family.name}</span><span className="mt-1 block text-[11px] text-muted">مشاهده مدل</span></button>)}</div><div className="mt-7 flex flex-wrap gap-2"><Button tone="solid" onClick={openBooking}>رزرو استایل پیشنهادی</Button><Button tone="ghost" onClick={() => setResult(false)}>تغییر پاسخ‌ها</Button></div><p className="mt-4 text-xs text-muted">تحلیل اولیه است؛ آرتیست سالن تناسب نهایی را با طول و حالت طبیعی مو تأیید می‌کند.</p></div>;

  return <div className="analyzer-flow"><div className="rounded-3xl bg-soft p-5"><p className="text-xs font-semibold tracking-[0.2em] text-accent-deep" dir="ltr">HANANEH AI</p><h3 className="mt-2 text-2xl font-bold">مدل موی مناسب چهره‌ات را پیدا کن</h3><p className="mt-2 text-sm leading-relaxed text-muted">با سه پاسخ کوتاه، گالری را برای فرم چهره و سبک زندگی تو شخصی‌سازی می‌کنیم.</p></div><label className="mt-6 grid gap-3 text-sm font-semibold">۱. فرم صورتت به کدام نزدیک‌تر است؟<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{options.map((item) => <button key={item.key} type="button" onClick={() => setFace(item.key)} className={cn("booking-choice flex-col items-start gap-0", face === item.key && "booking-choice-active")}><span className="text-base">{item.label}</span><small className="font-normal text-muted">{item.note}</small></button>)}</div></label><label className="mt-6 grid gap-3 text-sm font-semibold">۲. جنس مو بیشتر شبیه کدام است؟<div className="grid grid-cols-3 gap-2">{[["fine", "نازک"], ["natural", "نرمال"], ["curly", "موج‌دار / فر"]].map(([key, label]) => <button key={key} type="button" onClick={() => setTexture(key)} className={cn("booking-choice justify-center", texture === key && "booking-choice-active")}>{label}</button>)}</div></label><label className="mt-6 grid gap-3 text-sm font-semibold">۳. روزانه چقدر برای حالت دادن وقت داری؟<div className="grid grid-cols-3 gap-2">{[["quick", "کمتر از ۱۰ دقیقه"], ["medium", "۱۵ تا ۲۰ دقیقه"], ["full", "عاشق استایل دادن"]].map(([key, label]) => <button key={key} type="button" onClick={() => setRoutine(key)} className={cn("booking-choice justify-center text-center", routine === key && "booking-choice-active")}>{label}</button>)}</div></label><div className="mt-7 flex justify-end"><Button tone="solid" disabled={!face || !texture || !routine} onClick={() => setResult(true)}>تحلیل و پیشنهاد مدل ✦</Button></div></div>;
}

function BookingBody() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [service, setService] = useState("کوپ و فرم‌دهی اختصاصی");
  const [slot, setSlot] = useState("شنبه، ۲۶ مهر · ۱۶:۰۰");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (done) {
    return <div className="booking-success py-8 text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-on-accent"><Check className="size-8" /></span><h3 className="mt-5 text-2xl font-bold">پیش‌نویس درخواست آماده است</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">این وب‌سایت هنوز به سیستم رزرو سالن متصل نیست. برای ثبت قطعی نوبت، جزئیات را مستقیماً با سالن هماهنگ کنید.</p><div className="mx-auto mt-6 max-w-sm rounded-2xl border border-border bg-background p-4 text-start text-sm"><p className="font-semibold">وضعیت: <span>ثبت‌نشده؛ نیازمند تأیید سالن</span></p><p className="mt-2 text-muted">{service} · {slot}</p></div><Button className="mt-6" tone="solid" onClick={() => setDone(false)}>رزرو نوبت دیگر</Button></div>;
  }

  const next = () => setStep((current) => Math.min(3, current + 1));
  return <div className="booking-flow">
    <div className="mb-6 grid grid-cols-3 gap-2" aria-label="مراحل رزرو">{["خدمت", "زمان", "اطلاعات"].map((label, index) => { const current = index + 1; return <div key={label} className={cn("booking-step", current <= step && "booking-step-active")}><span>{current}</span><small>{label}</small></div>; })}</div>
    {step === 1 ? <div className="grid gap-3"><p className="text-sm text-muted">نوع تجربه‌ای که می‌خواهید را انتخاب کنید:</p>{["کوپ و فرم‌دهی اختصاصی", "بالیاژ و لایت سفارشی", "براشینگ و استایل مراسم", "پکیج امضای عروس"].map((item) => <button key={item} type="button" onClick={() => setService(item)} className={cn("booking-choice text-start", service === item && "booking-choice-active")}><span>{service === item ? "●" : "○"}</span>{item}</button>)}</div> : null}
    {step === 2 ? <div className="grid gap-5"><label className="grid gap-2 text-sm font-semibold">آرتیست موردنظر<select className="booking-input"><option>اولین آرتیست در دسترس</option><option>حنانه · مستر استایلیست</option><option>سارا · کالریست ارشد</option></select></label><div><p className="mb-2 text-sm font-semibold">زمان‌های پیشنهادی</p><div className="grid gap-2 sm:grid-cols-2">{["شنبه، ۲۶ مهر · ۱۶:۰۰", "یکشنبه، ۲۷ مهر · ۱۱:۳۰", "دوشنبه، ۲۸ مهر · ۱۸:۰۰", "سه‌شنبه، ۲۹ مهر · ۱۳:۰۰"].map((item) => <button key={item} type="button" onClick={() => setSlot(item)} className={cn("booking-choice text-start", slot === item && "booking-choice-active")}><CalendarDays className="size-4" />{item}</button>)}</div></div></div> : null}
    {step === 3 ? <div className="grid gap-4"><p className="rounded-2xl bg-soft p-4 text-sm leading-relaxed"><Clock3 className="me-1 inline size-4 text-accent" />{slot}<br /><MapPin className="me-1 mt-2 inline size-4 text-accent" />محل سالن را پیش از مراجعه تأیید کنید · {service}</p><label className="grid gap-1.5 text-sm font-semibold">نام و نام خانوادگی<input value={name} onChange={(event) => setName(event.target.value)} className="booking-input" placeholder="نام شما" /></label><label className="grid gap-1.5 text-sm font-semibold">شماره همراه<input value={phone} onChange={(event) => setPhone(event.target.value)} className="booking-input" placeholder="۰۹۱۲..." dir="ltr" /></label><p className="text-xs text-muted">این فرم نمایشی است و اطلاعات به سالن ارسال نمی‌شود.</p></div> : null}
    <div className="mt-7 flex items-center justify-between gap-2"><button type="button" className="min-h-11 px-3 text-sm text-muted disabled:opacity-30" disabled={step === 1} onClick={() => setStep((current) => current - 1)}>بازگشت</button><Button tone="solid" disabled={step === 3 && (!name.trim() || !phone.trim())} onClick={() => step === 3 ? setDone(true) : next()}>{step === 3 ? "نمایش پیش‌نویس درخواست" : "ادامه"}</Button></div>
  </div>;
}

function CompareDock() {
  const { openCompare } = useSalonActions();
  const compare = useSalon((state) => state.compare);
  const clearCompare = useSalon((state) => state.clearCompare);
  if (!compare.length) return null;
  const selected = compare.map((id) => familyById.get(id)).filter((family): family is Family => Boolean(family));

  return (
    <div className="compare-dock fixed inset-x-3 z-30 mx-auto flex max-w-3xl items-center gap-3 rounded-3xl border border-border bg-surface px-3 py-2 shadow-lift">
      <div className="flex -space-x-2 rtl:space-x-reverse">
        {selected.map((family) => (
          <img key={family.id} src={lookSrc(family.repId)} alt="" className="size-11 rounded-xl border border-surface object-cover" />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">مقایسه</p>
        <p className="text-xs text-muted">{persian(selected.length)} از ۳ مدل</p>
      </div>
      <Button tone="solid" onClick={openCompare}>
        مشاهده
      </Button>
      <button type="button" onClick={clearCompare} className="px-2 text-xs font-bold text-muted">
        پاک کردن
      </button>
    </div>
  );
}

function MobileNav() {
  const { go, openAnalyzer, openCompare } = useSalonActions();
  const showSaved = useSalon((state) => state.showSaved);
  const favs = useSalon((state) => state.favs);
  const compare = useSalon((state) => state.compare);

  const items = [
    { label: "خانه", icon: Home, onClick: () => go("top") },
    { label: "مدل‌ها", icon: LayoutGrid, onClick: () => go("catalog") },
    { label: "AI استایل", icon: Sparkles, onClick: openAnalyzer, featured: true },
    {
      label: "علاقه‌مندی",
      icon: Heart,
      count: favs.length,
      onClick: () => {
        showSaved();
        go("catalog");
      },
    },
    { label: "مقایسه", icon: Columns2, count: compare.length, onClick: openCompare },
  ];

  return (
    <nav className="mobile-nav fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface xl:hidden" aria-label="پیمایش سریع">
      {items.map((item) => (
        <button key={item.label} type="button" onClick={item.onClick} className={cn("mobile-nav-item", item.featured && "mobile-nav-item-featured")}>
          <span className="mobile-nav-icon"><item.icon className="size-[18px]" strokeWidth={1.8} /></span>
          <span>
            {item.label}
            {item.count ? <span className="ms-1">{persian(item.count)}</span> : null}
          </span>
        </button>
      ))}
    </nav>
  );
}
