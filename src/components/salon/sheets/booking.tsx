import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarCheck2, Check, Clock3, Copy, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { familyById, lookSrc, persian } from "@/data/catalog";
import {
  ANY_STYLIST,
  SERVICES,
  SERVICE_CATEGORIES,
  STYLISTS,
  formatMinutes,
  formatPrice,
  longDate,
  normalizePhone,
  slotsFor,
  stylistName,
  summarize,
  timeLabel,
  upcomingDays,
} from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon, type BookingRequest } from "@/lib/salon-store";
import { bookingMessage, copyText, shareText, whatsappLink } from "@/lib/share";
import { Button, Monogram, Sheet, haptic, useSalonActions } from "../ui";

const STEPS = ["خدمات", "آرتیست", "زمان", "اطلاعات"];
const PARTS = { morning: "صبح", afternoon: "ظهر", evening: "عصر" } as const;

export function BookingSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useSalon((state) => state.cart);
  const draft = useSalon((state) => state.draft);
  const profile = useSalon((state) => state.profile);
  const toggleCart = useSalon((state) => state.toggleCart);
  const setDraft = useSalon((state) => state.setDraft);
  const setProfile = useSalon((state) => state.setProfile);
  const addBooking = useSalon((state) => state.addBooking);
  const [step, setStep] = useState(() => (cart.length ? (draft.stylist !== ANY_STYLIST ? 2 : 1) : 0));
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState<BookingRequest | null>(null);

  const summary = summarize(cart);
  const days = useMemo(() => upcomingDays(21), []);
  const date = draft.date || days.find((day) => day.open && slotsFor(day.iso, summary.minutes).length)?.iso || "";
  const slots = useMemo(() => (date ? slotsFor(date, summary.minutes) : []), [date, summary.minutes]);
  const validPhone = normalizePhone(phone);
  const look = draft.lookId != null ? familyById.get(draft.lookId) : null;

  useEffect(() => {
    if (draft.time && !slots.some((slot) => slot.time === draft.time)) setDraft({ time: "" });
  }, [draft.time, setDraft, slots]);

  const canNext = [cart.length > 0, true, Boolean(date && draft.time), Boolean(name.trim() && validPhone)][step];

  function next() {
    haptic();
    if (step < 3) {
      if (step === 1 && !draft.date) setDraft({ date });
      setStep(step + 1);
      return;
    }
    setTouched(true);
    if (!canNext || !validPhone) return;
    const booking: BookingRequest = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      services: cart,
      stylist: draft.stylist,
      date,
      time: draft.time,
      name: name.trim(),
      phone: validPhone,
      note: draft.note,
      lookId: draft.lookId,
      createdAt: Date.now(),
      sent: false,
    };
    setProfile({ name: name.trim(), phone: validPhone });
    addBooking(booking);
    setDone(booking);
  }

  if (done) return <BookingDone open={open} booking={done} onClose={onClose} />;

  const back = step > 0 ? (
    <button type="button" className="icon-btn" onClick={() => setStep(step - 1)} aria-label="مرحله قبل">
      <ArrowRight className="size-[18px]" />
    </button>
  ) : null;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="رزرو نوبت"
      full
      leading={back}
      footer={
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            {cart.length ? (
              <>
                <p className="truncate text-[0.8rem] font-bold">{persian(cart.length)} خدمت · {formatMinutes(summary.minutes)}</p>
                <p className="truncate text-[0.72rem] text-muted">{summary.price ? `از ${formatPrice(summary.price)} تومان` : "قیمت پس از مشاوره"}</p>
              </>
            ) : (
              <p className="text-xs text-muted">حداقل یک خدمت انتخاب کنید</p>
            )}
          </div>
          <Button tone="accent" size="lg" className="min-w-36" disabled={!canNext && !(step === 3 && !touched)} onClick={next}>
            {step === 3 ? "ثبت درخواست" : "ادامه"}
          </Button>
        </div>
      }
    >
      <div className="px-5 pb-6">
        <ol className="stepper" aria-label="مراحل رزرو">
          {STEPS.map((label, index) => (
            <li key={label} className={cn(index < step && "stepper-done", index === step && "stepper-now")} aria-current={index === step ? "step" : undefined}>
              <span>{index < step ? <Check className="size-3" strokeWidth={3} /> : persian(index + 1)}</span>
              <small>{label}</small>
            </li>
          ))}
        </ol>

        {step === 0 ? (
          <div className="rise mt-6 grid gap-6">
            {SERVICE_CATEGORIES.map((category) => (
              <section key={category.key}>
                <h3 className="mb-2 text-xs font-bold text-muted">{category.label}</h3>
                <div className="grid gap-2">
                  {SERVICES.filter((service) => service.category === category.key).map((service) => {
                    const picked = cart.includes(service.id);
                    return (
                      <button key={service.id} type="button" onClick={() => { haptic(); toggleCart(service.id); }} aria-pressed={picked} className={cn("choice press", picked && "choice-on")}>
                        <span className={cn("check", picked && "check-on")}>{picked ? <Check className="size-3" strokeWidth={3} /> : null}</span>
                        <span className="min-w-0 flex-1 text-start">
                          <strong className="block text-sm">{service.title}</strong>
                          <small className="text-xs text-muted">{formatMinutes(service.minutes)} · {service.price ? `از ${formatPrice(service.price)}` : formatPrice(null)}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="rise mt-6 grid gap-2.5">
            <p className="mb-1 text-sm text-muted">با چه کسی راحت‌ترید؟</p>
            <button type="button" onClick={() => setDraft({ stylist: ANY_STYLIST })} aria-pressed={draft.stylist === ANY_STYLIST} className={cn("choice press", draft.stylist === ANY_STYLIST && "choice-on")}>
              <span className="grid size-12 place-items-center rounded-full bg-ink text-champagne"><Sparkles className="size-5" /></span>
              <span className="flex-1 text-start"><strong className="block text-sm">اولین آرتیست در دسترس</strong><small className="text-xs text-muted">سریع‌ترین زمان ممکن</small></span>
            </button>
            {[...STYLISTS]
              .sort((a, b) => Number(summary.items.some((item) => b.focus.includes(item.category))) - Number(summary.items.some((item) => a.focus.includes(item.category))))
              .map((stylist) => {
                const match = summary.items.some((item) => stylist.focus.includes(item.category));
                return (
                  <button key={stylist.id} type="button" onClick={() => setDraft({ stylist: stylist.id })} aria-pressed={draft.stylist === stylist.id} className={cn("choice press", draft.stylist === stylist.id && "choice-on")}>
                    <Monogram name={stylist.name} tone={stylist.tone} className="size-12 text-xl" />
                    <span className="flex-1 text-start">
                      <strong className="flex items-center gap-2 text-sm">{stylist.name}{match ? <span className="badge">متخصص</span> : null}</strong>
                      <small className="text-xs text-muted">{stylist.role}</small>
                    </span>
                  </button>
                );
              })}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="rise mt-6">
            <p className="text-sm font-bold">{date ? longDate(date) : "روز را انتخاب کنید"}</p>
            <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
              {days.map((day) => {
                const active = day.iso === date;
                return (
                  <button key={day.iso} type="button" disabled={!day.open} onClick={() => { haptic(); setDraft({ date: day.iso }); }} aria-pressed={active} className={cn("day press", active && "day-on")}>
                    <small>{day.weekday}</small>
                    <strong>{day.day}</strong>
                    <small>{day.open ? day.month : "تعطیل"}</small>
                  </button>
                );
              })}
            </div>
            {slots.length ? (
              (Object.keys(PARTS) as Array<keyof typeof PARTS>).map((part) => {
                const list = slots.filter((slot) => slot.part === part);
                if (!list.length) return null;
                return (
                  <section key={part} className="mt-5">
                    <h3 className="mb-2 text-xs font-bold text-muted">{PARTS[part]}</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {list.map((slot) => (
                        <button key={slot.time} type="button" onClick={() => { haptic(); setDraft({ date, time: slot.time }); }} aria-pressed={draft.time === slot.time} className={cn("slot press", draft.time === slot.time && "slot-on")}>
                          {timeLabel(slot.time)}
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              <p className="mt-6 rounded-2xl bg-soft p-4 text-sm text-muted">برای این روز زمان آزادی با این مدت خدمت باقی نمانده؛ روز دیگری انتخاب کنید.</p>
            )}
            <p className="mt-5 flex items-start gap-2 text-[0.72rem] leading-6 text-muted"><Clock3 className="mt-1 size-3.5 shrink-0" />زمان انتخابی پیشنهاد شماست و پس از هماهنگی، سالن آن را تأیید می‌کند.</p>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="rise mt-6 grid gap-4">
            <div className="rounded-2xl bg-soft p-4 text-sm leading-7">
              <p className="font-bold">{summary.items.map((item) => item.title).join("، ")}</p>
              <p className="text-muted">{longDate(date)} · ساعت {timeLabel(draft.time)}</p>
              <p className="text-muted">{stylistName(draft.stylist)} · {formatMinutes(summary.minutes)}</p>
            </div>
            {look ? (
              <div className="flex items-center gap-3 rounded-2xl border border-border p-2.5">
                <img src={lookSrc(look.repId)} alt="" className="size-12 rounded-xl object-cover" />
                <span className="min-w-0 flex-1 text-sm"><small className="block text-xs text-muted">مدل منتخب</small><strong className="block truncate">{look.name}</strong></span>
                <button type="button" className="icon-btn" onClick={() => setDraft({ lookId: null })} aria-label="حذف مدل منتخب"><X className="size-4" /></button>
              </div>
            ) : null}
            <label className="field">
              <span>نام و نام خانوادگی</span>
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" placeholder="نام شما" aria-invalid={touched && !name.trim()} />
            </label>
            <label className="field">
              <span>شماره همراه</span>
              <input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰" dir="ltr" aria-invalid={touched && !validPhone} />
              {touched && phone && !validPhone ? <small className="text-[#b4483c]">شماره همراه معتبر وارد کنید (مثل ۰۹۱۲۳۴۵۶۷۸۹).</small> : null}
            </label>
            <label className="field">
              <span>توضیحات (اختیاری)</span>
              <textarea value={draft.note} onChange={(event) => setDraft({ note: event.target.value })} rows={3} placeholder="سابقه رنگ، مراسم، یا هر نکته‌ای که آرتیست باید بداند" />
            </label>
          </div>
        ) : null}
      </div>
    </Sheet>
  );
}

function BookingDone({ open, booking, onClose }: { open: boolean; booking: BookingRequest; onClose: () => void }) {
  const { go } = useSalonActions();
  const markSent = useSalon((state) => state.markSent);
  const { items, minutes } = summarize(booking.services);
  const message = bookingMessage(booking);
  const wa = whatsappLink(message);

  async function send() {
    const result = await shareText(message, "درخواست نوبت");
    if (result === "shared" || result === "copied") {
      markSent(booking.id);
      toast(result === "copied" ? "متن کپی شد؛ آن را برای سالن بفرستید." : "درخواست آماده ارسال شد.");
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="درخواست ثبت شد"
      footer={
        <div className="grid gap-2">
          {wa ? (
            <a href={wa} target="_blank" rel="noreferrer" onClick={() => markSent(booking.id)} className="press gold-fill inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl text-[0.95rem] font-semibold text-on-accent">
              <Send className="size-5" /> ارسال در واتساپ
            </a>
          ) : (
            <Button tone="accent" size="lg" onClick={send}><Send className="size-5" /> ارسال برای سالن</Button>
          )}
          <Button tone="soft" onClick={() => go("bookings")}>مشاهده نوبت‌های من</Button>
        </div>
      }
    >
      <div className="px-5 pb-6 text-center">
        <span className="success-mark mx-auto"><CalendarCheck2 className="size-8" strokeWidth={1.6} /></span>
        <h2 className="mt-5 text-xl font-bold">درخواست شما آماده است</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted">
          این برنامه هنوز به سیستم نوبت‌دهی سالن متصل نیست. برای قطعی شدن نوبت، درخواست را برای سالن بفرستید تا زمان را تأیید کنند.
        </p>
        <div className="mt-6 rounded-3xl border border-border bg-surface p-4 text-start text-sm leading-7 shadow-card">
          <p className="font-bold">{items.map((item) => item.title).join("، ")}</p>
          <p className="text-muted">{longDate(booking.date)} · ساعت {timeLabel(booking.time)}</p>
          <p className="text-muted">{stylistName(booking.stylist)} · {formatMinutes(minutes)}</p>
          <p className="mt-2 inline-flex rounded-full bg-soft px-2.5 text-[0.7rem] font-semibold text-accent-deep">وضعیت: در انتظار ارسال و تأیید سالن</p>
        </div>
        <button
          type="button"
          className="press mx-auto mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-deep"
          onClick={async () => toast((await copyText(message)) === "copied" ? "متن درخواست کپی شد." : "کپی ممکن نشد.")}
        >
          <Copy className="size-4" /> کپی متن درخواست
        </button>
      </div>
    </Sheet>
  );
}
