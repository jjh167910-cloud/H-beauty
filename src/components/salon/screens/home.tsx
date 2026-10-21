import { useMemo } from "react";
import { FAMILY_COUNT, byRep, lookSrc, lookThumb, persian } from "@/data/catalog";
import { SALON, SERVICES, STYLISTS, dayOf, formatPrice, greeting, isPast, longDate, monthOf, openStatus, stylistName, summarize, timeLabel } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { Wordmark } from "../logo";
import { Avatar, Button, Media, Ornament, Seal, SectionHead, TextLink, useSalonActions } from "../ui";

const CURATED = [
  { repId: 30, label: "موج هالیوودی" },
  { repId: 27, label: "صاف براق" },
  { repId: 77, label: "دو بافت" },
  { repId: 43, label: "دم‌اسبی" },
  { repId: 84, label: "فر حجیم" },
  { repId: 125, label: "پیکسی مدرن" },
];

const EXPERIENCE = [
  { title: "مشاوره", text: "گفت‌وگوی بی‌عجله درباره فرم چهره، جنس مو و حسی که می‌خواهید." },
  { title: "ریچوال", text: "شست‌وشوی آرامش‌بخش، ماساژ سر و اجرای دقیق توسط آرتیست ارشد." },
  { title: "امضا", text: "استایل نهایی، عکس یادگاری و روتین مراقبت مخصوص شما." },
];

export function HomeScreen() {
  const { go, openSheet, openBooking, openDiscover } = useSalonActions();
  const name = useSalon((state) => state.profile.name.trim());
  const bookings = useSalon((state) => state.bookings);
  const hero = byRep(30);
  const status = openStatus();
  const next = useMemo(
    () => bookings.filter((item) => !isPast(item.date, item.time)).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0],
    [bookings],
  );
  const braid = byRep(77);

  return (
    <div className="grid grid-cols-1 gap-[var(--spacing-section)] pt-2">
      <section className="px-gutter">
        <p className="enter flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="t-footnote text-ink-2">{greeting()}{name ? `، ${name.split(" ")[0]}` : ""}</span>
          <span className="status" data-tone={status.open ? "sage" : "garnet"}>{status.label}</span>
        </p>
        <h1 className="t-display enter mt-3" style={{ animationDelay: "60ms" }}>
          زیبایی،
          <br />
          <span className="t-calligraphy text-[0.95em] text-gold-ink">به امضای شما</span>
        </h1>
      </section>

      {hero ? (
        <section className="enter relative px-gutter" style={{ animationDelay: "140ms" }}>
          <button type="button" className="hero" onClick={(event) => openDiscover(hero.id, event.currentTarget.querySelector("img"))} aria-label={`مشاهده ${hero.name}`}>
            <img src={lookSrc(hero.repId)} alt={hero.name} fetchPriority="high" className="absolute inset-0 size-full object-cover" />
            <span className="hero__shade" />
            <span className="hero__caption">
              <span className="t-caption text-champagne">استایل هفته</span>
              <span className="t-title-1 mt-1 block font-light">{hero.name}</span>
            </span>
          </button>
          <Seal text="HANANEH BEAUTY · TEHRAN · " className="-top-5 start-3">
            <span className="font-serif text-[0.6rem] italic">N°</span>
            <span className="font-serif text-lg">{hero.code.slice(-2)}</span>
          </Seal>
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="t-footnote text-ink-2">موج نرم و درخششی<br />که تا آخر شب می‌ماند.</p>
            <Button variant="gold" orb onClick={() => openBooking({ service: "event-styling", lookId: hero.id })}>رزرو این استایل</Button>
          </div>
        </section>
      ) : null}

      {next ? (
        <section className="px-gutter">
          <button type="button" className="flex w-full items-center gap-4 border-y border-line py-4 text-start" onClick={() => go("bookings")}>
            <span className="date-tile">
              <strong>{dayOf(next.date)}</strong>
              <small>{monthOf(next.date)}</small>
            </span>
            <span className="min-w-0 flex-1">
              <span className="status" data-tone={next.sent ? "gold" : "garnet"}>{next.sent ? "در انتظار تأیید سالن" : "پیش‌نویس · ارسال نشده"}</span>
              <span className="t-headline mt-0.5 block truncate">{summarize(next.services).items.map((item) => item.title).join("، ") || "مشاوره"}</span>
              <span className="t-caption block truncate text-ink-2">{longDate(next.date)} · {timeLabel(next.time)} · {stylistName(next.stylist)}</span>
            </span>
            <Icon name="chevron" size={18} className="text-ink-3" />
          </button>
        </section>
      ) : null}

      <section className="reveal-on-scroll bento px-gutter" aria-label="دسترسی سریع">
        <button type="button" className="bento__tile" data-tall="" onClick={(event) => openDiscover(braid?.id ?? 1, event.currentTarget.querySelector("img"))}>
          <img src={lookThumb(77)} alt="" loading="lazy" />
          <span className="mt-auto">
            <span className="glass-dark inline-grid size-10 place-items-center rounded-full"><Icon name="play" size={16} weight="fill" /></span>
            <strong className="t-title-3 mt-3 block font-normal">کاوش لوک‌ها</strong>
            <span className="t-caption text-white/70">{persian(FAMILY_COUNT)} استایل · بکشید و ببینید</span>
          </span>
        </button>
        <button type="button" className="bento__tile foil" onClick={() => openBooking()}>
          <Icon name="book" size={28} weight="duotone" />
          <span className="mt-auto"><strong className="t-headline block">رزرو نوبت</strong><span className="t-caption opacity-70">در چهار قدم ساده</span></span>
        </button>
        <button type="button" className="bento__tile card" data-variant="inverse" onClick={() => openSheet({ kind: "finder" })}>
          <Icon name="finder" size={28} weight="duotone" className="text-champagne" />
          <span className="mt-auto"><strong className="t-headline block font-normal">استایل‌یاب</strong><span className="t-caption text-white/60">مدل مناسب چهره‌تان</span></span>
        </button>
        <button type="button" className="bento__tile glass" data-wide="" onClick={() => openSheet({ kind: "consult" })}>
          <span className="list-row__icon"><Icon name="consult" size={22} weight="duotone" /></span>
          <span className="flex-1"><strong className="t-headline block font-normal">مشاوره خصوصی با آرتیست</strong><span className="t-caption text-ink-2">مدل‌های منتخبتان را بفرستید</span></span>
          <Icon name="chevron" size={18} className="text-ink-3" />
        </button>
      </section>

      <section className="reveal-on-scroll">
        <SectionHead eyebrow="ریچوال‌های امضادار" title="منوی محبوب آتلیه" action={<TextLink onClick={() => go("services")}>منوی کامل</TextLink>} />
        <div className="px-gutter">
          {SERVICES.filter((service) => service.popular).map((service, index) => (
            <button key={service.id} type="button" className="menu-row" onClick={() => openSheet({ kind: "service", id: service.id })}>
              <span className="w-6 font-serif text-sm italic text-gold">{persian(index + 1).padStart(2, "۰")}</span>
              <span className="min-w-0">
                <strong className="t-headline block font-normal">{service.title}</strong>
                <span className="t-latin text-ink-3">{service.en}</span>
              </span>
              <span className="leader" />
              <span className="t-footnote text-gold-ink">{service.price ? formatPrice(service.price) : "مشاوره"}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="reveal-on-scroll">
        <SectionHead eyebrow="دستان هنرمند" title="آرتیست‌های آتلیه" />
        <div className="rail">
          {STYLISTS.map((stylist) => (
            <button key={stylist.id} type="button" className="tile w-[8.25rem]" onClick={() => openBooking({ stylist: stylist.id })}>
              <Avatar name={stylist.name} tone={stylist.tone} arch className="h-36 w-full text-5xl" />
              <strong className="t-headline mt-3 font-medium">{stylist.name}</strong>
              <span className="t-caption text-ink-2">{stylist.role}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="reveal-on-scroll">
        <SectionHead eyebrow="لوک‌بوک" title="استایل‌های منتخب" action={<TextLink onClick={() => go("looks")}>همه</TextLink>} />
        <div className="rail">
          {CURATED.map((item) => {
            const look = byRep(item.repId);
            if (!look) return null;
            return (
              <button key={item.repId} type="button" className="tile w-[8.75rem]" onClick={(event) => openDiscover(look.id, event.currentTarget.querySelector("img"))} aria-label={`${item.label}، ${look.name}`}>
                <Media src={lookThumb(item.repId)} loading="lazy" className="tile__media" />
                <strong className="t-callout mt-2.5 font-medium">{item.label}</strong>
                <span className="t-caption text-ink-2" dir="ltr">{look.code}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="reveal-on-scroll px-gutter">
        <Ornament />
        <p className="t-eyebrow mt-8">تجربه آتلیه</p>
        <h2 className="t-title-1 mt-1">یک ساعت، <span className="t-calligraphy text-gold-ink">فقط برای خودتان</span></h2>
        <ol className="mt-6 grid gap-6">
          {EXPERIENCE.map((item, index) => (
            <li key={item.title} className="flex gap-5">
              <span className="w-8 shrink-0 font-serif text-3xl leading-none italic text-gold">{persian(index + 1)}</span>
              <span>
                <strong className="t-headline block">{item.title}</strong>
                <span className="t-callout mt-1 block text-ink-2">{item.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="reveal-on-scroll px-gutter">
        <div className="card" data-variant="inverse">
          <div className="relative flex items-center gap-4">
            <span className="min-w-0 flex-1">
              <span className="t-eyebrow text-champagne">استایل‌یاب</span>
              <strong className="t-title-2 mt-1 block">مدل متناسب با فرم چهره‌تان</strong>
              <span className="t-caption text-white/60">سه پرسش کوتاه، سه پیشنهاد اختصاصی</span>
            </span>
            <button type="button" className="icon-btn text-champagne ring-1 ring-champagne/40" style={{ boxShadow: "none" }} onClick={() => openSheet({ kind: "finder" })} aria-label="شروع استایل‌یاب">
              <Icon name="forward" size={20} />
            </button>
          </div>
        </div>
      </section>

      <section className="reveal-on-scroll px-gutter">
        <p className="t-eyebrow">دیدار از آتلیه</p>
        <div className="mt-4 grid grid-cols-2 border-y border-line">
          <div className="py-4 pe-4">
            <Icon name="pin" size={18} className="text-gold" />
            <p className="t-headline mt-2">{SALON.city}</p>
            <p className="t-caption text-ink-2">{SALON.address}</p>
          </div>
          <div className="border-s border-line py-4 ps-4">
            <Icon name="clock" size={18} className="text-gold" />
            <p className="t-headline mt-2">شنبه تا پنج‌شنبه</p>
            <p className="t-caption text-ink-2">۱۰ صبح تا ۷ عصر</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <a className="btn flex-1" data-variant="secondary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SALON.mapsQuery)}`} target="_blank" rel="noreferrer">
            <Icon name="directions" size={18} /> مسیریابی
          </a>
          {SALON.phone ? (
            <a className="btn flex-1" data-variant="secondary" href={`tel:${SALON.phone}`}>
              <Icon name="phone" size={18} /> تماس
            </a>
          ) : null}
        </div>
      </section>

      <footer className="grid justify-items-center gap-1 px-gutter text-center">
        <Wordmark className="text-[2rem]" />
        <p className="t-caption mt-2 text-ink-3">با عشق به جزئیات · تهران</p>
      </footer>
    </div>
  );
}
