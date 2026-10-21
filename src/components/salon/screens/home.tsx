import { useMemo } from "react";
import { ArrowLeft, CalendarPlus, ChevronLeft, HeartHandshake, LayoutGrid, Navigation, Phone, ScanFace } from "lucide-react";
import { byRep, lookSrc } from "@/data/catalog";
import { SALON, SERVICES, STYLISTS, dayOf, formatPrice, greeting, isPast, longDate, monthOf, openStatus, stylistName, summarize, timeLabel } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { Monogram, Ornament, Seal, SectionHead, TextLink, useSalonActions } from "../ui";

const CURATED = [
  { repId: 30, label: "موج هالیوودی", caption: "Hollywood wave" },
  { repId: 27, label: "صاف براق", caption: "Glass hair" },
  { repId: 77, label: "دو بافت", caption: "Modern braid" },
  { repId: 43, label: "دم‌اسبی", caption: "Sleek pony" },
  { repId: 84, label: "فر حجیم", caption: "Soft volume" },
  { repId: 125, label: "پیکسی مدرن", caption: "Modern pixie" },
];

const EXPERIENCE = [
  { n: "I", title: "مشاوره", text: "گفت‌وگوی بی‌عجله درباره فرم چهره، جنس مو و حسی که می‌خواهید." },
  { n: "II", title: "ریچوال", text: "شست‌وشوی آرامش‌بخش، ماساژ سر و اجرای دقیق توسط آرتیست ارشد." },
  { n: "III", title: "امضا", text: "استایل نهایی، عکس یادگاری و روتین مراقبت مخصوص شما." },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export function HomeScreen() {
  const { go, openSheet, openBooking } = useSalonActions();
  const name = useSalon((state) => state.profile.name);
  const bookings = useSalon((state) => state.bookings);
  const hero = byRep(30);
  const status = openStatus();
  const next = useMemo(
    () => bookings.filter((item) => !isPast(item.date, item.time)).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0],
    [bookings],
  );

  const quick = [
    { label: "رزرو", Icon: CalendarPlus, onClick: () => openBooking() },
    { label: "استایل‌یاب", Icon: ScanFace, onClick: () => openSheet({ kind: "finder" }) },
    { label: "مشاوره", Icon: HeartHandshake, onClick: () => openSheet({ kind: "consult" }) },
    { label: "لوک‌بوک", Icon: LayoutGrid, onClick: () => go("looks") },
  ];

  return (
    <div className="grid grid-cols-1 gap-12 pt-4">
      <section className="px-6">
        <p className="reveal flex items-center gap-2 text-[0.8rem] text-muted">
          <span className={cn("status-dot", status.open && "status-dot-open")} />
          {greeting()}{name.trim() ? `، ${name.trim().split(" ")[0]}` : ""}
          <span className="text-border">|</span>
          <span>{status.label}</span>
        </p>
        <h1 className="reveal mt-4 text-[2.35rem] leading-[1.35] font-extralight tracking-tight" style={{ animationDelay: "80ms" }}>
          زیبایی،
          <br />
          <span className="font-display text-[2.6rem] text-accent-deep">به امضای شما</span>
        </h1>
      </section>

      {hero ? (
        <section className="reveal relative px-6" style={{ animationDelay: "160ms" }}>
          <button type="button" className="hero-arch press block w-full" onClick={() => openSheet({ kind: "look", id: hero.id })} aria-label={`مشاهده ${hero.name}`}>
            <img src={lookSrc(hero.repId)} alt={hero.name} fetchPriority="high" />
            <span className="hero-arch-shade" />
            <span className="absolute inset-x-6 bottom-6 text-start text-white">
              <span className="font-brand text-[0.7rem] tracking-[0.3em] text-champagne" dir="ltr">LOOK OF THE WEEK</span>
              <span className="mt-1.5 block font-display text-[1.75rem] leading-tight">{hero.name}</span>
            </span>
          </button>
          <Seal text="HAUTE BEAUTÉ · TEHRAN · ATELIER · " className="absolute -top-5 start-2">
            <span className="font-brand text-[0.6rem] italic">N°</span>
            <span className="font-brand text-lg leading-none">{hero.code.slice(-2)}</span>
          </Seal>
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-xs leading-6 text-muted">موج نرم، درخشش آینه‌ای و حرکتی<br />که تا آخر شب می‌ماند.</p>
            <button type="button" className="press foil inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full ps-5 pe-1.5 text-sm font-medium text-[#1a140e]" onClick={() => openBooking({ service: "event-styling", lookId: hero.id })}>
              رزرو این استایل
              <span className="grid size-9 place-items-center rounded-full bg-[#1a140e] text-champagne"><ArrowLeft className="size-4" /></span>
            </button>
          </div>
        </section>
      ) : null}

      {next ? (
        <section className="px-6">
          <button type="button" onClick={() => go("bookings")} className="press flex w-full items-center gap-4 border-y border-foreground/10 py-4 text-start">
            <span className="grid w-12 shrink-0 justify-items-center">
              <strong className="font-brand text-3xl leading-none font-medium">{dayOf(next.date)}</strong>
              <small className="mt-1 text-[0.65rem] text-muted">{monthOf(next.date)}</small>
            </span>
            <span className="h-10 w-px bg-foreground/10" />
            <span className="min-w-0 flex-1">
              <span className="block text-[0.68rem] tracking-wide text-accent-deep">{next.sent ? "در انتظار تأیید سالن" : "پیش‌نویس · هنوز ارسال نشده"}</span>
              <span className="mt-0.5 block truncate text-sm font-medium">{summarize(next.services).items.map((item) => item.title).join("، ") || "مشاوره"}</span>
              <span className="mt-0.5 block truncate text-xs text-muted">{longDate(next.date)} · {timeLabel(next.time)} · {stylistName(next.stylist)}</span>
            </span>
            <ChevronLeft className="size-4 shrink-0 text-muted" />
          </button>
        </section>
      ) : null}

      <section className="grid grid-cols-4 px-6">
        {quick.map(({ label, Icon, onClick }, index) => (
          <button key={label} type="button" onClick={onClick} className={cn("press quick-action", index > 0 && "border-s border-foreground/10")}>
            <Icon className="size-[22px] text-accent-deep" strokeWidth={1.25} />
            <small>{label}</small>
          </button>
        ))}
      </section>

      <section>
        <SectionHead index="01" kicker="THE RITUALS" title="منوی امضادار" action={<TextLink onClick={() => go("services")}>منوی کامل</TextLink>} />
        <div className="px-6">
          {SERVICES.filter((service) => service.popular).map((service, index) => (
            <button key={service.id} type="button" className="press menu-line" onClick={() => openSheet({ kind: "service", id: service.id })}>
              <span className="w-7 font-brand text-sm italic text-accent" dir="ltr">{ROMAN[index]}</span>
              <span className="min-w-0 text-start">
                <strong className="block text-[0.95rem] font-normal">{service.title}</strong>
                <small className="font-brand text-[0.65rem] tracking-[0.2em] text-muted" dir="ltr">{service.en}</small>
              </span>
              <span className="menu-leader" />
              <span className="text-[0.8rem] text-accent-deep tabular-nums">{service.price ? formatPrice(service.price) : "—"}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHead index="02" kicker="THE ARTISTS" title="آرتیست‌های آتلیه" />
        <div className="rail no-scrollbar">
          {STYLISTS.map((stylist) => (
            <button key={stylist.id} type="button" className="press artist-tile" onClick={() => openBooking({ stylist: stylist.id })}>
              <Monogram name={stylist.name} tone={stylist.tone} arch className="h-36 w-full text-5xl" />
              <strong>{stylist.name}</strong>
              <small>{stylist.role}</small>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHead index="03" kicker="CURATED LOOKBOOK" title="استایل‌های منتخب" action={<TextLink onClick={() => go("looks")}>همه</TextLink>} />
        <div className="rail no-scrollbar">
          {CURATED.map((item) => {
            const look = byRep(item.repId);
            if (!look) return null;
            return (
              <button key={item.repId} type="button" className="press curated-tile" onClick={() => openSheet({ kind: "look", id: look.id })} aria-label={`${item.label}، ${look.name}`}>
                <span className="arch block aspect-[3/4] overflow-hidden bg-soft">
                  <img src={lookSrc(item.repId)} alt="" loading="lazy" />
                </span>
                <strong>{item.label}</strong>
                <small dir="ltr">{item.caption}</small>
              </button>
            );
          })}
        </div>
      </section>

      <Ornament className="px-6" />

      <section className="px-6">
        <p className="font-brand text-[0.7rem] tracking-[0.28em] text-accent-deep" dir="ltr">THE ATELIER EXPERIENCE</p>
        <h2 className="mt-1.5 text-[1.4rem] font-light tracking-tight">یک ساعت، فقط برای خودتان</h2>
        <ol className="mt-6 grid gap-6">
          {EXPERIENCE.map((item) => (
            <li key={item.n} className="flex gap-5">
              <span className="w-8 shrink-0 font-brand text-2xl leading-none italic text-accent" dir="ltr">{item.n}</span>
              <span>
                <strong className="block text-[0.95rem] font-medium">{item.title}</strong>
                <span className="mt-1 block text-[0.8rem] leading-7 text-muted">{item.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-6">
        <button type="button" className="press finder-banner" onClick={() => openSheet({ kind: "finder" })}>
          <span className="relative z-10 min-w-0 flex-1 text-start">
            <span className="font-brand text-[0.7rem] tracking-[0.3em] text-champagne" dir="ltr">STYLE FINDER</span>
            <strong className="mt-2 block text-[1.2rem] font-light">مدل متناسب با فرم چهره‌تان</strong>
            <small className="mt-1 block text-xs text-white/55">سه پرسش کوتاه، سه پیشنهاد اختصاصی</small>
          </span>
          <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-champagne/40 text-champagne"><ArrowLeft className="size-5" strokeWidth={1.5} /></span>
        </button>
      </section>

      <section className="px-6">
        <p className="font-brand text-[0.7rem] tracking-[0.28em] text-accent-deep" dir="ltr">VISIT THE ATELIER</p>
        <div className="mt-4 grid grid-cols-2 border-y border-foreground/10">
          <div className="py-4 pe-4">
            <p className="text-[0.68rem] text-muted">نشانی</p>
            <p className="mt-1 text-sm font-medium">{SALON.city}</p>
            <p className="text-xs leading-6 text-muted">{SALON.address}</p>
          </div>
          <div className="border-s border-foreground/10 py-4 ps-4">
            <p className="text-[0.68rem] text-muted">ساعات پذیرایی</p>
            <p className="mt-1 text-sm font-medium">شنبه تا پنج‌شنبه</p>
            <p className="text-xs leading-6 text-muted">۱۰ صبح تا ۷ عصر</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <a className="press inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-foreground/15 text-sm" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SALON.mapsQuery)}`} target="_blank" rel="noreferrer">
            <Navigation className="size-4" strokeWidth={1.5} /> مسیریابی
          </a>
          {SALON.phone ? (
            <a className="press inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-foreground/15 text-sm" href={`tel:${SALON.phone}`}>
              <Phone className="size-4" strokeWidth={1.5} /> تماس
            </a>
          ) : null}
        </div>
      </section>

      <footer className="px-6 pb-4 text-center">
        <p className="font-display text-3xl text-accent-deep">حنانه</p>
        <p className="mt-1 font-brand text-xs italic text-muted" dir="ltr">Haute Beauté — since the first appointment, with love for detail.</p>
      </footer>
    </div>
  );
}
