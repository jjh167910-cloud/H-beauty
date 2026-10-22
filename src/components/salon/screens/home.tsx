import { useMemo } from "react";
import { byRep, lookSrc, lookThumb, persian } from "@/data/catalog";
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

const MOODS = [
  { id: 30, filter: "waves", label: "موج‌های نرم", en: "SOFT WAVES" },
  { id: 84, filter: "curly", label: "فرِ پرحجم", en: "CURL STORY" },
  { id: 77, filter: "braid", label: "بافتِ خلاق", en: "BRAID EDIT" },
] as const;

const EXPERIENCE = [
  { title: "مشاوره", text: "گفت‌وگوی بی‌عجله درباره فرم چهره، جنس مو و حسی که می‌خواهید." },
  { title: "ریچوال", text: "شست‌وشوی آرامش‌بخش، ماساژ سر و اجرای دقیق توسط آرتیست ارشد." },
  { title: "امضا", text: "استایل نهایی، عکس یادگاری و روتین مراقبت مخصوص شما." },
];

export function HomeScreen() {
  const { go, openSheet, openBooking, openDiscover } = useSalonActions();
  const name = useSalon((state) => state.profile.name.trim());
  const bookings = useSalon((state) => state.bookings);
  const clearAll = useSalon((state) => state.clearAll);
  const setFilter = useSalon((state) => state.setFilter);
  const hero = byRep(30);
  const status = openStatus();
  const next = useMemo(
    () => bookings.filter((item) => !isPast(item.date, item.time)).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0],
    [bookings],
  );

  return (
    <div className="grid grid-cols-1 gap-[var(--spacing-section)] pt-2">
      <section className="atelier-heading px-gutter">
        <div className="atelier-heading__meta enter">
          <span className="t-footnote">{greeting()}{name ? `، ${name.split(" ")[0]}` : ""}</span>
          <span className="status" data-tone={status.open ? "sage" : "garnet"}>{status.label}</span>
        </div>
        <p className="atelier-heading__index enter" lang="en">HANANEH · THE ATELIER</p>
        <h1 className="atelier-heading__title enter mt-3" style={{ animationDelay: "60ms" }}>
          زیبایی شما،
          <br />
          <span className="t-calligraphy text-gold-ink">امضای شما</span>
        </h1>
        <p className="atelier-heading__lead enter" style={{ animationDelay: "110ms" }}>
          از اولین جرقهٔ الهام تا انتخاب استایل و درخواست نوبت؛ تجربه‌ای شخصی با سلیقهٔ شما.
        </p>
      </section>

      {hero ? (
        <section className="atelier-hero-wrap enter px-gutter" style={{ animationDelay: "140ms" }}>
          <button type="button" className="hero atelier-hero" onClick={(event) => openDiscover(hero.id, event.currentTarget.querySelector("img"))} aria-label={`دیدن مدل ${hero.name} در لوک‌بوک`}>
            <img src={lookSrc(hero.repId)} alt={hero.name} fetchPriority="high" className="absolute inset-0 size-full object-cover" />
            <span className="atelier-hero__vignette" aria-hidden="true" />
            <span className="atelier-hero__edge" lang="en" aria-hidden="true">THE EDIT · 001</span>
            <span className="atelier-hero__caption">
              <span className="t-latin text-champagne" lang="en">LOOK OF THE WEEK</span>
              <span className="t-title-1 block font-light">{hero.name}</span>
              <span className="t-caption text-white/85">برای دیدن جزئیات لمس کنید</span>
            </span>
          </button>
          <Seal text="HANANEH BEAUTY · TEHRAN · " className="-top-5 start-3">
            <span className="font-serif text-[0.6rem] italic">N°</span>
            <span className="font-serif text-lg">{hero.code.slice(-2)}</span>
          </Seal>
          <div className="atelier-hero-actions">
            <p className="atelier-hero-actions__copy">از آرشیو الهام بگیرید؛ با انتخاب مدل، مشاورهٔ شخصی خود را آغاز کنید.</p>
            <Button variant="gold" orb onClick={() => openBooking({ service: "event-styling", lookId: hero.id })}>درخواست این استایل</Button>
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

      <section className="atelier-mood reveal-on-scroll px-gutter" aria-labelledby="mood-title">
        <div className="atelier-mood__intro">
          <div>
            <p className="t-eyebrow">THE LOOK EDIT / انتخاب شما</p>
            <h2 id="mood-title" className="t-title-1 mt-1">امروز کدام <span className="text-gold-ink">حال‌وهوا</span> را دوست دارید؟</h2>
          </div>
        </div>
        <div className="atelier-mood__cards">
          {MOODS.map((mood) => (
            <button key={mood.filter} type="button" className="atelier-mood__card" onClick={() => {
              clearAll();
              setFilter(mood.filter);
              go("looks");
            }} aria-label={`دیدن مدل‌های ${mood.label}`}>
              <img src={lookThumb(mood.id)} loading="lazy" alt="" />
              <span className="atelier-mood__caption">
                <strong>{mood.label}</strong>
                <small lang="en">{mood.en}</small>
              </span>
            </button>
          ))}
        </div>
        <div className="atelier-mood__footer">
          <span>مدل دلخواهتان را ذخیره یا با دو مدل دیگر مقایسه کنید.</span>
          <TextLink onClick={() => { clearAll(); go("looks"); }}>تمام لوک‌بوک</TextLink>
        </div>
      </section>

      <section className="reveal-on-scroll px-gutter" aria-labelledby="journey-title">
        <div className="mb-4">
          <p className="t-eyebrow">گام بعدی</p>
          <h2 id="journey-title" className="t-title-2">انتخابتان را به واقعیت نزدیک‌تر کنید</h2>
        </div>
        <div className="atelier-journeys">
          <button type="button" className="atelier-journey" data-primary="" onClick={() => openBooking()}>
            <span className="atelier-journey__number" lang="en">01</span>
            <span><strong className="atelier-journey__title">درخواست نوبت</strong><span className="atelier-journey__note">خدمات، آرتیست و زمان دلخواه</span></span>
            <Icon name="book" size={22} weight="light" className="text-champagne" />
          </button>
          <button type="button" className="atelier-journey" onClick={() => openSheet({ kind: "consult" })}>
            <span className="atelier-journey__number" lang="en">02</span>
            <span><strong className="atelier-journey__title">مشاورهٔ استایل</strong><span className="atelier-journey__note">انتخاب‌هایتان را با آرتیست مطرح کنید</span></span>
            <Icon name="consult" size={22} weight="light" className="text-gold-ink" />
          </button>
          <button type="button" className="atelier-journey" data-wide="" onClick={() => openSheet({ kind: "finder" })}>
            <span className="atelier-journey__number" lang="en">03</span>
            <span className="min-w-0 flex-1"><strong className="atelier-journey__title">هنوز مطمئن نیستید؟ استایل‌یاب را امتحان کنید</strong><span className="atelier-journey__note">با سه پرسش، چند پیشنهاد متناسب با سلیقه‌تان ببینید؛ بدون ادعای شبیه‌سازی هوش مصنوعی.</span></span>
            <Icon name="finder" size={24} weight="duotone" className="text-gold-ink" />
          </button>
        </div>
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
