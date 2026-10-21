import { useMemo } from "react";
import { ArrowUpLeft, CalendarPlus, ChevronLeft, Clock3, HeartHandshake, LayoutGrid, MapPin, Navigation, Phone, ScanFace, Sparkles } from "lucide-react";
import { byRep, lookSrc } from "@/data/catalog";
import { SALON, SERVICES, STYLISTS, dayOf, formatMinutes, formatPrice, greeting, isPast, monthOf, openStatus, stylistName, summarize, timeLabel, longDate } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { Kicker, Monogram, SectionHead, TextLink, useSalonActions } from "../ui";

const CURATED = [
  { repId: 30, label: "موج هالیوودی", caption: "Hollywood wave" },
  { repId: 27, label: "صاف براق", caption: "Glass hair" },
  { repId: 77, label: "دو بافت", caption: "Modern braid" },
  { repId: 43, label: "دم‌اسبی", caption: "Sleek pony" },
  { repId: 84, label: "فر حجیم", caption: "Soft volume" },
  { repId: 125, label: "پیکسی مدرن", caption: "Modern pixie" },
];

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
    { label: "رزرو نوبت", Icon: CalendarPlus, onClick: () => openBooking() },
    { label: "استایل‌یاب", Icon: ScanFace, onClick: () => openSheet({ kind: "finder" }) },
    { label: "مشاوره", Icon: HeartHandshake, onClick: () => openSheet({ kind: "consult" }) },
    { label: "لوک‌بوک", Icon: LayoutGrid, onClick: () => go("looks") },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 pt-2">
      <section className="rise px-5">
        <p className="text-sm text-muted">{greeting()}{name.trim() ? `، ${name.trim().split(" ")[0]}` : ""}</p>
        <h1 className="mt-1 text-[1.65rem] leading-snug font-bold">امروز برای خودت<br /><span className="text-accent-deep">چه زیبایی‌ای</span> رقم بزنیم؟</h1>
        <span className={cn("status-pill mt-3", status.open && "status-pill-open")}>
          <span className="status-dot" />
          {status.label}
        </span>
      </section>

      {next ? (
        <section className="rise px-5" style={{ animationDelay: "40ms" }}>
          <button type="button" onClick={() => go("bookings")} className="press flex w-full items-center gap-4 rounded-3xl border border-border bg-surface p-3.5 text-start shadow-card">
            <span className="date-tile">
              <strong>{dayOf(next.date)}</strong>
              <small>{monthOf(next.date)}</small>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.7rem] font-semibold text-accent-deep">{next.sent ? "در انتظار تأیید سالن" : "پیش‌نویس · هنوز ارسال نشده"}</span>
              <span className="mt-0.5 block truncate text-sm font-bold">{summarize(next.services).items.map((item) => item.title).join("، ") || "مشاوره"}</span>
              <span className="mt-0.5 block truncate text-xs text-muted">{longDate(next.date)} · {timeLabel(next.time)} · {stylistName(next.stylist)}</span>
            </span>
            <ChevronLeft className="size-5 shrink-0 text-muted" />
          </button>
        </section>
      ) : null}

      {hero ? (
        <section className="rise px-5" style={{ animationDelay: "80ms" }}>
          <div className="hero-card">
            <img src={lookSrc(hero.repId)} alt={hero.name} fetchPriority="high" />
            <span className="hero-shade" />
            <button type="button" className="hero-open press" onClick={() => openSheet({ kind: "look", id: hero.id })} aria-label={`مشاهده ${hero.name}`}>
              <ArrowUpLeft className="size-4" />
            </button>
            <div className="hero-copy">
              <span className="glass-tag"><Sparkles className="size-3" /> <span dir="ltr">LOOK OF THE WEEK</span></span>
              <p className="mt-3 font-display text-[1.9rem] leading-tight">{hero.name}</p>
              <p className="mt-1 text-xs text-white/75">طراحی‌شده برای حرکت نرم و درخشش ماندگار</p>
              <button type="button" className="press mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#1c1714]" onClick={() => openBooking({ service: "event-styling", lookId: hero.id })}>
                <CalendarPlus className="size-4" /> رزرو این استایل
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rise grid grid-cols-4 gap-2 px-5" style={{ animationDelay: "120ms" }}>
        {quick.map(({ label, Icon, onClick }) => (
          <button key={label} type="button" onClick={onClick} className="press quick-action">
            <span><Icon className="size-[22px]" strokeWidth={1.6} /></span>
            <small>{label}</small>
          </button>
        ))}
      </section>

      <section>
        <SectionHead kicker="SIGNATURE SERVICES" title="خدمات محبوب" action={<TextLink onClick={() => go("services")}>همه خدمات</TextLink>} />
        <div className="rail no-scrollbar">
          {SERVICES.filter((service) => service.popular).map((service) => (
            <button key={service.id} type="button" className="press service-tile" onClick={() => openSheet({ kind: "service", id: service.id })}>
              <Kicker className="text-[0.58rem]">{service.en}</Kicker>
              <strong>{service.title}</strong>
              <span className="mt-auto flex items-center justify-between gap-2 text-[0.7rem] text-muted">
                <span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{formatMinutes(service.minutes)}</span>
              </span>
              <span className="text-[0.78rem] font-bold text-accent-deep">{service.price ? `از ${formatPrice(service.price)}` : formatPrice(null)}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHead kicker="THE ARTISTS" title="آرتیست‌های آتلیه" />
        <div className="rail no-scrollbar">
          {STYLISTS.map((stylist) => (
            <button key={stylist.id} type="button" className="press artist-tile" onClick={() => openBooking({ stylist: stylist.id })}>
              <Monogram name={stylist.name} tone={stylist.tone} className="size-16 text-2xl" />
              <strong>{stylist.name}</strong>
              <small>{stylist.role}</small>
              <span className="artist-cta">رزرو با {stylist.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHead kicker="CURATED LOOKBOOK" title="استایل‌های منتخب" action={<TextLink onClick={() => go("looks")}>همه مدل‌ها</TextLink>} />
        <div className="rail no-scrollbar">
          {CURATED.map((item) => {
            const look = byRep(item.repId);
            if (!look) return null;
            return (
              <button key={item.repId} type="button" className="press curated-tile" onClick={() => openSheet({ kind: "look", id: look.id })} aria-label={`${item.label}، ${look.name}`}>
                <img src={lookSrc(item.repId)} alt="" loading="lazy" />
                <span>
                  <strong>{item.label}</strong>
                  <small dir="ltr">{item.caption}</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-5">
        <button type="button" className="press finder-banner" onClick={() => openSheet({ kind: "finder" })}>
          <span className="finder-icon"><ScanFace className="size-6" strokeWidth={1.5} /></span>
          <span className="min-w-0 flex-1 text-start">
            <Kicker className="text-champagne">STYLE FINDER</Kicker>
            <strong className="mt-1 block text-[0.95rem]">مدل متناسب با فرم چهره‌ات</strong>
            <small className="mt-0.5 block text-xs opacity-70">سه سؤال کوتاه، سه پیشنهاد اختصاصی</small>
          </span>
          <ChevronLeft className="size-5 shrink-0 text-champagne" />
        </button>
      </section>

      <section className="px-5">
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-card">
          <Kicker>VISIT THE ATELIER</Kicker>
          <div className="mt-4 grid gap-3.5">
            <p className="flex items-start gap-3 text-sm"><MapPin className="mt-0.5 size-4 shrink-0 text-accent" /><span><strong className="block">{SALON.city}</strong><span className="text-xs text-muted">{SALON.address}</span></span></p>
            <p className="flex items-start gap-3 text-sm"><Clock3 className="mt-0.5 size-4 shrink-0 text-accent" /><span><strong className="block">شنبه تا پنج‌شنبه</strong><span className="text-xs text-muted">۱۰ صبح تا ۷ عصر · جمعه تعطیل</span></span></p>
          </div>
          <div className="mt-5 flex gap-2">
            <a className="press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-soft text-sm font-semibold" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SALON.mapsQuery)}`} target="_blank" rel="noreferrer">
              <Navigation className="size-4" /> مسیریابی
            </a>
            {SALON.phone ? (
              <a className="press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-soft text-sm font-semibold" href={`tel:${SALON.phone}`}>
                <Phone className="size-4" /> تماس
              </a>
            ) : null}
          </div>
        </div>
        <p className="mt-6 text-center text-[0.68rem] text-muted">© ۲۰۲۶ {SALON.name} · با عشق به جزئیات</p>
      </section>
    </div>
  );
}
