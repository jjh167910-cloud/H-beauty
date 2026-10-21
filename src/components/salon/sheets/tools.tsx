import { useMemo, useState } from "react";
import { ArrowRight, Columns2, Copy, Send, X } from "lucide-react";
import { toast } from "sonner";
import { families, familyById, labelOf, lookSrc, persian, type Family } from "@/data/catalog";
import { SALON } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { copyText, shareText, whatsappLink } from "@/lib/share";
import { Button, EmptyState, Kicker, useSalonActions } from "../ui";

function resolve(ids: number[]) {
  return ids.map((id) => familyById.get(id)).filter((family): family is Family => Boolean(family));
}

export function CompareBody() {
  const { openSheet, go } = useSalonActions();
  const compare = useSalon((state) => state.compare);
  const clearCompare = useSalon((state) => state.clearCompare);
  const toggleCompare = useSalon((state) => state.toggleCompare);
  const selected = resolve(compare);

  if (!selected.length) {
    return (
      <div className="pb-8">
        <EmptyState
          icon={<Columns2 className="size-6" />}
          title="هنوز مدلی برای مقایسه ندارید"
          text="در لوک‌بوک روی آیکن دو ستون هر مدل بزنید. حداکثر سه مدل."
          action={<Button tone="solid" onClick={() => go("looks")}>رفتن به لوک‌بوک</Button>}
        />
      </div>
    );
  }

  return (
    <div className="px-5 pb-6">
      <div className={cn("grid gap-2.5", selected.length === 1 ? "grid-cols-1" : selected.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
        {selected.map((family) => (
          <article key={family.id} className="relative">
            <button type="button" className="press block w-full text-start" onClick={() => openSheet({ kind: "look", id: family.id })}>
              <img src={lookSrc(family.repId)} alt={family.name} className="aspect-[3/4] w-full rounded-2xl object-cover" />
              <span className="mt-2 line-clamp-2 block text-xs leading-5 font-bold">{family.name}</span>
              <span className="mt-0.5 block text-[0.68rem] text-muted">{labelOf(family.category)}</span>
            </button>
            <button type="button" className="glass-btn press absolute top-2 start-2 !size-8" onClick={() => toggleCompare(family.id)} aria-label={`حذف ${family.name} از مقایسه`}>
              <X className="size-3.5" />
            </button>
          </article>
        ))}
      </div>
      <div className="mt-6 flex gap-2">
        <Button tone="solid" className="flex-1" onClick={() => openSheet({ kind: "consult" })}>مشاوره درباره این مدل‌ها</Button>
        <Button tone="soft" onClick={clearCompare}>پاک کردن</Button>
      </div>
    </div>
  );
}

export function ConsultBody() {
  const { go } = useSalonActions();
  const compare = useSalon((state) => state.compare);
  const favs = useSalon((state) => state.favs);
  const profile = useSalon((state) => state.profile);
  const selected = useMemo(() => resolve([...new Set([...compare, ...favs])]), [compare, favs]);
  const [notes, setNotes] = useState("");

  const draft = useMemo(() => {
    const lines = ["سلام، وقت بخیر.", `برای مشاوره انتخاب مدل مو با ${SALON.name} پیام می‌دهم.`];
    if (profile.name.trim()) lines.push(`نام: ${profile.name.trim()}`);
    if (selected.length) {
      lines.push("مدل‌های انتخابی:");
      selected.forEach((family) => lines.push(`${family.code} — ${family.name}`));
    }
    if (notes.trim()) lines.push(`توضیحات: ${notes.trim()}`);
    lines.push("لطفاً راهنمایی بفرمایید.");
    return lines.join("\n");
  }, [notes, profile.name, selected]);
  const wa = whatsappLink(draft);

  return (
    <div className="grid grid-cols-1 gap-5 px-5 pb-6">
      <p className="text-sm leading-7 text-muted">
        مدل‌های ذخیره‌شده و مقایسه‌شده در یک پیام آماده می‌شوند تا برای آرتیست بفرستید.
      </p>
      {selected.length ? (
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {selected.map((family) => <img key={family.id} src={lookSrc(family.repId)} alt={family.name} className="size-16 shrink-0 rounded-2xl object-cover" />)}
        </div>
      ) : (
        <button type="button" className="press rounded-2xl border border-dashed border-border p-4 text-sm text-muted" onClick={() => go("looks")}>
          هنوز مدلی انتخاب نشده · افزودن از لوک‌بوک
        </button>
      )}
      <label className="field">
        <span>برای چه مراسم یا استایلی؟ (اختیاری)</span>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="مثلاً عروسی خواهرم، موهای بلند و نازک دارم" />
      </label>
      <details className="rounded-2xl bg-soft p-4 text-sm">
        <summary className="cursor-pointer font-semibold">پیش‌نمایش پیام · {persian(selected.length)} مدل</summary>
        <pre className="mt-3 font-sans text-xs leading-6 whitespace-pre-wrap text-muted">{draft}</pre>
      </details>
      <div className="grid gap-2">
        {wa ? (
          <a href={wa} target="_blank" rel="noreferrer" className="press gold-fill inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-on-accent"><Send className="size-4" /> ارسال در واتساپ</a>
        ) : (
          <Button tone="accent" onClick={async () => { const result = await shareText(draft, "درخواست مشاوره"); if (result === "copied") toast("متن درخواست کپی شد."); else if (result === "failed") toast("اشتراک‌گذاری ممکن نشد."); }}>
            <Send className="size-4" /> ارسال پیام مشاوره
          </Button>
        )}
        <Button tone="soft" onClick={async () => toast((await copyText(draft)) === "copied" ? "متن درخواست کپی شد." : "کپی ممکن نشد.")}>
          <Copy className="size-4" /> کپی متن
        </Button>
      </div>
      <p className="text-center text-[0.7rem] text-muted">این فرم خودکار چیزی ارسال نمی‌کند؛ پیام را خودتان می‌فرستید.</p>
    </div>
  );
}

const FACES = [
  { key: "oval", label: "بیضی", note: "پیشانی و فک متعادل" },
  { key: "round", label: "گرد", note: "گونه‌های نرم و فک منحنی" },
  { key: "square", label: "مربعی", note: "فک مشخص و زاویه‌دار" },
  { key: "heart", label: "قلبی", note: "پیشانی باز و چانه ظریف" },
  { key: "long", label: "کشیده", note: "طول صورت بیشتر از عرض" },
];
const TEXTURES = [
  { key: "fine", label: "نازک", note: "حجم کم، صاف" },
  { key: "natural", label: "نرمال", note: "متوسط و انعطاف‌پذیر" },
  { key: "curly", label: "موج‌دار / فر", note: "بافت طبیعی و پرحجم" },
];
const ROUTINES = [
  { key: "quick", label: "کمتر از ۱۰ دقیقه", note: "کم‌دردسر و سریع" },
  { key: "medium", label: "۱۵ تا ۲۰ دقیقه", note: "کمی حوصله دارم" },
  { key: "full", label: "عاشق استایل دادنم", note: "هر روز یک لوک تازه" },
];
const QUESTIONS = [
  { title: "فرم صورتت به کدام نزدیک‌تر است؟", options: FACES },
  { title: "جنس مویت بیشتر شبیه کدام است؟", options: TEXTURES },
  { title: "روزانه چقدر برای حالت دادن وقت داری؟", options: ROUTINES },
];

function recommend(face: string, texture: string, routine: string) {
  const preferred = face === "round" ? ["waves", "curly", "updo"] : face === "square" ? ["waves", "curly", "bob"] : face === "heart" ? ["bob", "braid", "waves"] : face === "long" ? ["curly", "bob", "waves"] : ["waves", "straight", "updo"];
  const textureBoost = texture === "curly" ? ["curly", "waves", ...preferred] : texture === "fine" ? ["straight", "bob", ...preferred] : preferred;
  const order = routine === "quick" ? ["bob", "straight", "pixie", ...textureBoost] : textureBoost;
  const picks = [...new Set(order)].map((category) => families.find((family) => family.category === category)).filter((family): family is Family => Boolean(family)).slice(0, 3);
  return picks.length ? picks : families.slice(0, 3);
}

export function FinderBody() {
  const { openSheet, openBooking, go } = useSalonActions();
  const setFilter = useSalon((state) => state.setFilter);
  const [answers, setAnswers] = useState<string[]>([]);
  const step = answers.length;

  if (step >= QUESTIONS.length) {
    const [face, texture, routine] = answers;
    const picks = recommend(face, texture, routine);
    return (
      <div className="rise px-5 pb-6">
        <Kicker>YOUR EDIT</Kicker>
        <h3 className="mt-1 text-xl font-bold">سه پیشنهاد برای شما</h3>
        <p className="mt-2 text-sm leading-7 text-muted">
          برای صورت <strong className="text-foreground">{FACES.find((item) => item.key === face)?.label}</strong> با موی {TEXTURES.find((item) => item.key === texture)?.label}، این خانواده‌ها هماهنگی بیشتری دارند.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {picks.map((family) => (
            <button key={family.id} type="button" onClick={() => openSheet({ kind: "look", id: family.id })} className="press text-start">
              <img src={lookSrc(family.repId)} alt={family.name} className="aspect-[3/4] w-full rounded-2xl object-cover" />
              <span className="mt-2 block text-[0.7rem] font-semibold text-accent-deep">{labelOf(family.category)}</span>
              <span className="line-clamp-2 block text-xs leading-5 font-bold">{family.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-2">
          <Button tone="accent" size="lg" onClick={() => openBooking({ service: "signature-cut", lookId: picks[0]?.id })}>رزرو مشاوره و کوپ</Button>
          <div className="flex gap-2">
            <Button tone="soft" className="flex-1" onClick={() => { setFilter(picks[0]?.category ?? "all"); go("looks"); }}>مدل‌های مشابه</Button>
            <Button tone="ghost" className="flex-1" onClick={() => setAnswers([])}>از نو</Button>
          </div>
        </div>
        <p className="mt-4 text-center text-[0.7rem] leading-6 text-muted">پیشنهاد بر اساس پاسخ‌های شماست، نه تحلیل عکس؛ آرتیست تناسب نهایی را در سالن تأیید می‌کند.</p>
      </div>
    );
  }

  const question = QUESTIONS[step];
  return (
    <div className="px-5 pb-6">
      <div className="flex items-center gap-3">
        {step > 0 ? (
          <button type="button" className="icon-btn" onClick={() => setAnswers(answers.slice(0, -1))} aria-label="سؤال قبل"><ArrowRight className="size-4" /></button>
        ) : null}
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft" role="progressbar" aria-valuemin={0} aria-valuemax={3} aria-valuenow={step + 1}>
          <div className="gold-fill h-full rounded-full transition-all duration-500" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
        <span className="text-xs text-muted tabular-nums">{persian(step + 1)} / {persian(QUESTIONS.length)}</span>
      </div>
      <h3 key={step} className="rise mt-6 text-xl font-bold">{question.title}</h3>
      <div key={`options-${step}`} className="rise mt-5 grid gap-2.5">
        {question.options.map((option) => (
          <button key={option.key} type="button" onClick={() => setAnswers([...answers, option.key])} className="choice press">
            <span className="flex-1 text-start"><strong className="block text-sm">{option.label}</strong><small className="text-xs text-muted">{option.note}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}
