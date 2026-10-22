import { useMemo } from "react";
import { byRep, lookSrc, lookThumb, persian } from "@/data/catalog";
import { SERVICES, dayOf, formatPrice, greeting, isPast, longDate, monthOf, stylistName, summarize, timeLabel } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { Button, Media, SectionHead, TextLink, useSalonActions } from "../ui";

const MOODS = [
  { id: 30, filter: "waves", label: "موج‌های نرم", en: "Soft waves" },
  { id: 84, filter: "curly", label: "فرِ پرحجم", en: "Curly" },
  { id: 77, filter: "braid", label: "بافتِ خلاق", en: "Braids" },
] as const;
const PICKS = [
  { repId: 30, label: "موج هالیوودی" },
  { repId: 27, label: "صاف و براق" },
  { repId: 77, label: "بافت" },
  { repId: 43, label: "دم‌اسبی" },
  { repId: 84, label: "فر" },
  { repId: 125, label: "پیکسی" },
];

export function HomeScreen() {
  const { go, openSheet, openBooking, openDiscover } = useSalonActions();
  const name = useSalon((state) => state.profile.name.trim());
  const bookings = useSalon((state) => state.bookings);
  const clearAll = useSalon((state) => state.clearAll);
  const setFilter = useSalon((state) => state.setFilter);
  const hero = byRep(30);
  const next = useMemo(
    () => bookings.filter((item) => !isPast(item.date, item.time))
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0],
    [bookings],
  );

  return (
    <div className="modern-home">
      <header className="modern-home__intro px-gutter">
        <div className="modern-home__hello">
          <span>{greeting()}{name ? `، ${name.split(" ")[0]}` : ""}</span>
          <span className="modern-home__edition" lang="en">HANANEH BEAUTY</span>
        </div>
        <h1>زیبایی شما، <span>به سبک شما.</span></h1>
        <p>مدل دلخواهتان را پیدا کنید، خدمات را ببینید و برای مراجعه بعدی درخواست نوبت بدهید.</p>
      </header>

      {hero ? (
        <section className="modern-home__hero px-gutter" aria-label="استایل منتخب">
          <div className="modern-home__hero-card">
            <button type="button" className="modern-home__hero-photo"
              onClick={(event) => openDiscover(hero.id, event.currentTarget.querySelector("img"))}
              aria-label={`دیدن مدل ${hero.name} در لوک‌بوک`}>
              <img src={lookSrc(hero.repId)} alt={hero.name} fetchPriority="high" />
              <span className="modern-home__hero-shade" aria-hidden="true" />
              <span className="modern-home__hero-label"><span>استایل منتخب</span><strong>{hero.name}</strong><small>مشاهده مدل <Icon name="chevron" size={15} /></small></span>
            </button>
          </div>
          <div className="modern-home__hero-actions">
            <Button variant="primary" icon="book" onClick={() => openBooking({ service: "event-styling", lookId: hero.id })}>درخواست این استایل</Button>
            <Button variant="secondary" icon="looks" onClick={() => { clearAll(); go("looks"); }}>مشاهده مدل‌ها</Button>
          </div>
        </section>
      ) : null}

      {next ? (
        <section className="px-gutter">
          <button type="button" className="modern-next" onClick={() => go("bookings")}>
            <span className="modern-next__date"><strong>{dayOf(next.date)}</strong><small>{monthOf(next.date)}</small></span>
            <span className="modern-next__copy">
              <small>{next.sent ? "ارسال‌شده · در انتظار تأیید سالن" : "درخواست آماده ارسال"}</small>
              <strong>{summarize(next.services).items.map((item) => item.title).join("، ") || "مشاوره"}</strong>
              <span>{longDate(next.date)} · {timeLabel(next.time)} · {stylistName(next.stylist)}</span>
            </span>
            <Icon name="chevron" size={19} />
          </button>
        </section>
      ) : null}

      <section className="modern-section" aria-labelledby="mood-title">
        <div className="modern-section__title px-gutter">
          <div><p>الهام بگیرید</p><h2 id="mood-title">چه مدلی دوست دارید؟</h2></div>
          <TextLink onClick={() => { clearAll(); go("looks"); }}>همه مدل‌ها</TextLink>
        </div>
        <div className="modern-moods px-gutter">
          {MOODS.map((mood) => (
            <button key={mood.filter} type="button" className="modern-mood"
              onClick={() => { clearAll(); setFilter(mood.filter); go("looks"); }}
              aria-label={`دیدن مدل‌های ${mood.label}`}>
              <img src={lookThumb(mood.id)} alt="" loading="lazy" />
              <strong>{mood.label}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="modern-section modern-section--panel px-gutter" aria-labelledby="steps-title">
        <div className="modern-action-panel">
          <p>ساده و سریع</p>
          <h2 id="steps-title">از انتخاب مدل تا درخواست نوبت</h2>
          <div className="modern-action-list">
            <button type="button" onClick={() => { clearAll(); go("looks"); }}>
              <span className="modern-action-list__icon"><Icon name="looks" size={21} /></span>
              <span><strong>انتخاب استایل</strong><small>مدل‌ها را مرور و ذخیره کنید</small></span><Icon name="chevron" size={18} />
            </button>
            <button type="button" onClick={() => openSheet({ kind: "consult" })}>
              <span className="modern-action-list__icon"><Icon name="consult" size={21} /></span>
              <span><strong>مشاوره استایل</strong><small>درباره انتخاب‌هایتان گفت‌وگو کنید</small></span><Icon name="chevron" size={18} />
            </button>
            <button type="button" onClick={() => openBooking()}>
              <span className="modern-action-list__icon"><Icon name="book" size={21} /></span>
              <span><strong>درخواست نوبت</strong><small>خدمت و زمان پیشنهادی را انتخاب کنید</small></span><Icon name="chevron" size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="modern-section">
        <SectionHead eyebrow="خدمات سالن" title="خدمات پرطرفدار" action={<TextLink onClick={() => go("services")}>همه خدمات</TextLink>} />
        <div className="modern-service-preview px-gutter">
          {SERVICES.filter((service) => service.popular).slice(0, 4).map((service) => (
            <button key={service.id} type="button" onClick={() => openSheet({ kind: "service", id: service.id })}>
              <span className="modern-service-preview__icon"><Icon name={service.category} size={22} weight="duotone" /></span>
              <span><strong>{service.title}</strong><small>{service.detail}</small></span>
              <span className="modern-service-preview__price">{service.price ? `از ${formatPrice(service.price)}` : "مشاوره"}<small>{service.price ? "تومان" : ""}</small></span>
            </button>
          ))}
        </div>
        <p className="modern-service-disclaimer px-gutter">قیمت‌ها و زمان‌ها پیشنهادی‌اند و تأیید نهایی با سالن است.</p>
      </section>

      <section className="modern-section">
        <SectionHead eyebrow="آرشیو مدل‌ها" title="استایل‌های منتخب" action={<TextLink onClick={() => go("looks")}>دیدن آرشیو</TextLink>} />
        <div className="modern-picks rail">
          {PICKS.map((item) => {
            const look = byRep(item.repId);
            if (!look) return null;
            return (
              <button key={item.repId} type="button" className="modern-pick"
                onClick={(event) => openDiscover(look.id, event.currentTarget.querySelector("img"))}
                aria-label={`${item.label}، ${look.name}`}>
                <Media src={lookThumb(item.repId)} alt={item.label} loading="lazy" />
                <strong>{item.label}</strong>
              </button>
            );
          })}
        </div>
      </section>
      <footer className="modern-home__footer px-gutter">
        <span>حنانه بیوتی</span>
        <small lang="en">YOUR STYLE, BEAUTIFULLY SIMPLE.</small>
      </footer>
    </div>
  );
}
