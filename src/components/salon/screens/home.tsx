import { useMemo, useState } from "react";
import { byRep, lookSrc, lookThumb } from "@/data/catalog";
import { MAKEUP_LOOKS } from "@/data/makeup";
import { MakeupArtwork } from "../makeup-artwork";
import { GalleryModeSwitch } from "../gallery-mode-switch";
import { photoObjectPosition } from "@/data/photo-focal";
import { SERVICES, dayOf, formatPrice, greeting, isPast, longDate, monthOf, summarize, timeLabel } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { Button, Media, TextLink, useSalonActions } from "../ui";

const STYLES = [
  { repId: 30, filter: "waves", label: "موج‌های نرم", caption: "WAVES" },
  { repId: 84, filter: "curly", label: "فرِ پرحجم", caption: "CURLS" },
  { repId: 77, filter: "braid", label: "بافتِ خلاق", caption: "BRAIDS" },
  { repId: 43, filter: "ponytail", label: "دم‌اسبی", caption: "PONYTAIL" },
  { repId: 125, filter: "pixie", label: "موی کوتاه", caption: "SHORT HAIR" },
] as const;

const FEATURED_SERVICES = ["signature-cut", "bespoke-balayage", "event-styling", "event-makeup", "luxe-manicure"];

export function HomeScreen() {
  const { go, openSheet, openBooking, openDiscover } = useSalonActions();
  const name = useSalon((state) => state.profile.name.trim());
  const bookings = useSalon((state) => state.bookings);
  const clearAll = useSalon((state) => state.clearAll);
  const setFilter = useSalon((state) => state.setFilter);
  const setGalleryMode = useSalon((state) => state.setGalleryMode);
  const galleryMode = useSalon((state) => state.galleryMode);
  const hero = byRep(30);
  const [heroFailed, setHeroFailed] = useState(false);
  const next = useMemo(
    () => bookings.filter((item) => !isPast(item.date, item.time))
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0],
    [bookings],
  );

  return (
    <div className="salon24-home">
      <header className="salon24-welcome px-gutter">
        <div className="salon24-welcome__micro">
          <span>{greeting()}{name ? `، ${name.split(" ")[0]}` : ""} <span aria-hidden="true">✦</span></span>
          <span lang="en">HANANEH BEAUTY SALON</span>
        </div>
        {galleryMode === "makeup" ? <h1>زیبایی، <span>اعتماد به نفس شما</span></h1> : <h1>زیبایی شما، <span>داستان ماست.</span></h1>}
        <p>{galleryMode === "makeup" ? "گالری میکاپ، رنگ‌های پیشنهادی و خدمات تخصصی زیبایی؛ با یک مدل واقعی و چهره‌ای ثابت." : "در سالن زیبایی حنانه، مدل‌های مو و خدمات زیبایی را کشف کنید و برای استایل دلخواهتان درخواست نوبت بدهید."}</p>
      </header>

      <GalleryModeSwitch variant="home" />

      <div role="tabpanel" id="hb-home-mode-panel" aria-labelledby={`hb-home-mode-${galleryMode}`}>
      {galleryMode === "makeup" ? (
        <section className="makeup-spotlight px-gutter" aria-label="معرفی خدمات میکاپ">
          <Button variant="gold" block icon="book" onClick={() => openBooking({ service:"event-makeup", makeupId:MAKEUP_LOOKS[8].id })}>درخواست نوبت میکاپ</Button>
          <button type="button" className="makeup-spotlight__image" aria-label="دیدن مجموعه میکاپ" onClick={() => { setGalleryMode("makeup");go("looks"); }}>
            <MakeupArtwork look={MAKEUP_LOOKS[8]} />
          </button>
          <div className="makeup-spotlight__categories">
            <button type="button" onClick={() => { setGalleryMode("hair");go("looks"); }}><Icon name="looks" size={24}/><span><strong>مدل مو</strong><small>مدل‌های جدید</small></span></button>
            <button type="button" onClick={() => { setGalleryMode("makeup");go("looks"); }}><Icon name="beauty" size={24}/><span><strong>میکاپ</strong><small>آرایش حرفه‌ای</small></span></button>
          </div>
          <p className="makeup-spotlight__disclaimer">تصویر ثابت مدل مرجع؛ رنگ‌های پیشنهادی در گالری معرفی می‌شوند، نه به‌صورت تغییر در عکس.</p>
        </section>
      ) : hero ? (
        <section className="salon24-hero px-gutter" aria-label="استایل منتخب سالن">
          <div className="salon26-hero__intro">
            <span lang="en">YOUR BEAUTY, YOUR WAY</span>
            <h2>استایل دلخواهتان را پیدا کنید.</h2>
            <p>مدل‌ها را ببینید، ایده‌هایتان را ذخیره کنید و درخواست نوبت را با انتخاب استایل آغاز کنید.</p>
          </div>
          <div className="salon24-hero__actions">
            <Button variant="gold" icon="book" onClick={() => openBooking({ service: "event-styling", lookId: hero.id })}>درخواست نوبت</Button>
            <Button variant="secondary" icon="looks" onClick={() => { clearAll(); setGalleryMode("hair"); go("looks"); }}>گالری مدل مو</Button>
          </div>
          <div className="salon24-hero__stage">
            <button type="button" className="salon24-hero__photo" data-image-error={heroFailed || undefined}
              onClick={(event) => openDiscover(hero.id, event.currentTarget.querySelector("img"))}
              aria-label={`دیدن مدل ${hero.name} در لوک‌بوک`}>
              <img src={lookSrc(hero.repId)} alt={hero.name} fetchPriority="high" style={{ objectPosition: photoObjectPosition(lookSrc(hero.repId), "30%") }} onError={() => setHeroFailed(true)} />
              {heroFailed ? <span className="salon26-hero__missing" aria-hidden="true">تصویر این مدل اکنون در دسترس نیست.</span> : null}
            </button>
            <div className="salon25-hero__caption">
              <div><span>استایل منتخب سالن</span><h2>{hero.name}</h2></div>
              <span lang="en">HANANEH BEAUTY</span>
            </div>
          </div>

          <p className="salon24-hero__fine">زمان انتخابی پیشنهادی است؛ سالن پس از دریافت درخواست آن را تأیید می‌کند.</p>
        </section>
      ) : null}
      </div>

      {next ? (
        <section className="px-gutter">
          <button type="button" className="modern-next salon24-next" onClick={() => go("bookings")}>
            <span className="modern-next__date"><strong>{dayOf(next.date)}</strong><small>{monthOf(next.date)}</small></span>
            <span className="modern-next__copy">
              <small>{next.sent ? "ارسال‌شده · در انتظار تأیید" : "پیش‌نویس درخواست · ارسال نشده"}</small>
              <strong>{summarize(next.services).items.map((item) => item.title).join("، ") || "مشاوره"}</strong>
              <span>{longDate(next.date)} · {timeLabel(next.time)}</span>
            </span>
            <Icon name="chevron" size={18} />
          </button>
        </section>
      ) : null}

      <section className="salon24-section" aria-labelledby="salon24-style-title">
        <div className="salon24-section__head px-gutter">
          <div><span className="salon24-eyebrow">STYLE INSPIRATION</span><h2 id="salon24-style-title">زیبایی از انتخاب شما شروع می‌شود</h2></div>
          <TextLink onClick={() => { clearAll(); setGalleryMode("hair"); go("looks"); }}>همه مدل‌ها</TextLink>
        </div>
        <div className="salon24-styles rail">
          {STYLES.map((style) => (
            <button key={style.filter} type="button" className="salon24-style-card"
              aria-label={`دیدن مدل‌های ${style.label}`}
              onClick={() => { clearAll(); setGalleryMode("hair"); setFilter(style.filter); go("looks"); }}>
              <Media src={lookThumb(style.repId)} alt="" loading="lazy" />
              <strong>{style.label}</strong>
              <span lang="en">{style.caption}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="makeup-home px-gutter" aria-labelledby="makeup-home-title">
        <div className="makeup-home__copy">
          <span lang="en">HANANEH / MAKEUP ATELIER</span>
          <h2 id="makeup-home-title">زیبایی در جزئیات چهره</h2>
          <p>۴۸ ایده میکاپ نچرال، گلم و عروس را ببینید، ذخیره کنید و برای اجرای اختصاصی درخواست نوبت بدهید.</p>
          <Button variant="gold" onClick={() => { setGalleryMode("makeup"); go("looks"); }}>گالری میکاپ</Button>
        </div>
        <button type="button" className="makeup-home__art" onClick={() => { setGalleryMode("makeup"); go("looks"); }}
          aria-label="مشاهده گالری میکاپ"><MakeupArtwork look={MAKEUP_LOOKS[9]}/></button>
      </section>

      <section className="salon24-section salon24-services" aria-labelledby="salon24-services-title">
        <div className="salon24-section__head px-gutter">
          <div><span className="salon24-eyebrow">BEAUTY SERVICES</span><h2 id="salon24-services-title">خدمات سالن زیبایی</h2></div>
          <TextLink onClick={() => go("services")}>تمام خدمات</TextLink>
        </div>
        <p className="salon24-section__intro px-gutter">از کوتاهی و رنگ مو تا میکاپ و مراقبت؛ هر خدمت را با جزئیات ببینید.</p>
        <div className="salon24-service-list px-gutter">
          {FEATURED_SERVICES.map((id) => {
            const service = SERVICES.find((item) => item.id === id);
            if (!service) return null;
            return (
              <button key={id} type="button" className="salon24-service-row"
                onClick={() => openSheet({ kind: "service", id })}>
                <span className="salon24-service-row__icon"><Icon name={service.category} size={23} weight="duotone" /></span>
                <span className="salon24-service-row__copy"><strong>{service.title}</strong><small>{service.detail}</small></span>
                <span className="salon24-service-row__price">{service.price ? `از ${formatPrice(service.price)}` : "مشاوره"}<small>{service.price ? "تومان" : ""}</small></span>
                <Icon name="chevron" size={16} className="salon24-service-row__chevron" />
              </button>
            );
          })}
        </div>
        <p className="salon24-section__footnote px-gutter">قیمت‌های نمایش‌داده‌شده «شروع از» هستند و باید توسط سالن تأیید شوند.</p>
      </section>

      <section className="salon24-concierge px-gutter" aria-labelledby="salon24-concierge-title">
        <div className="salon24-concierge__inner">
          <div className="salon24-concierge__header">
            <span className="salon24-concierge__icon"><Icon name="consult" size={25} weight="duotone" /></span>
            <span lang="en">A LITTLE BEAUTY ADVICE</span>
          </div>
          <h2 id="salon24-concierge-title">هنوز مدل موردعلاقه‌تان را پیدا نکردید؟</h2>
          <p>چند مدل را ذخیره کنید یا از راهنمای انتخاب استایل کمک بگیرید. بعد می‌توانید انتخاب‌هایتان را برای مشاوره آماده کنید.</p>
          <div className="salon24-concierge__actions">
            <Button variant="secondary" icon="finder" onClick={() => openSheet({ kind: "finder" })}>راهنمای استایل</Button>
            <Button variant="ghost" icon="consult" onClick={() => openSheet({ kind: "consult" })}>مشاوره</Button>
          </div>
        </div>
      </section>

      <section className="salon24-section" aria-labelledby="salon24-look-title">
        <div className="salon24-section__head px-gutter">
          <div><span className="salon24-eyebrow">THE LOOKBOOK</span><h2 id="salon24-look-title">مدل‌های محبوب برای الهام</h2></div>
          <TextLink onClick={() => { clearAll(); setGalleryMode("hair"); go("looks"); }}>گالری کامل</TextLink>
        </div>
        <div className="salon24-featured rail">
          {[27, 43, 84, 125].map((repId) => {
            const look = byRep(repId);
            if (!look) return null;
            return (
              <button key={repId} type="button" className="salon24-featured__card"
                aria-label={`مشاهده ${look.name}`}
                onClick={(event) => openDiscover(look.id, event.currentTarget.querySelector("img"))}>
                <Media src={lookThumb(repId)} alt={look.name} loading="lazy" />
                <span>{look.name}</span>
              </button>
            );
          })}
        </div>
      </section>
      <footer className="salon24-footer px-gutter">
        <span>حنانه بیوتی</span>
        <small>زیبایی، با سلیقه شما</small>
      </footer>
    </div>
  );
}
