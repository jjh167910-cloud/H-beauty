import {
  ArrowUpLeft,
  CalendarCheck,
  ChevronLeft,
  Clock3,
  Crown,
  Gem,
  HeartHandshake,
  MapPin,
  Scissors,
  Sparkles,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import { families, lookSrc } from "@/data/catalog";
import { LogoMark } from "./logo";
import { Button, useSalonActions } from "./ui";

const CURATED_LOOKS = [
  { repId: 30, label: "موج هالیوودی", caption: "Hollywood wave" },
  { repId: 27, label: "صاف براق", caption: "Glass hair" },
  { repId: 77, label: "دو بافت", caption: "Modern braid" },
  { repId: 43, label: "دم‌اسبی", caption: "Sleek pony" },
  { repId: 84, label: "فر حجیم", caption: "Soft volume" },
  { repId: 125, label: "پیکسی مدرن", caption: "Modern pixie" },
] as const;

const SERVICES: Array<{
  title: string;
  en: string;
  detail: string;
  time: string;
  price: string;
  Icon: LucideIcon;
  accent: string;
}> = [
  {
    title: "کوپ و فرم‌دهی اختصاصی",
    en: "SIGNATURE CUT",
    detail: "مشاوره فرم چهره، شست‌وشو و استایل نهایی",
    time: "۶۰ دقیقه",
    price: "از ۹۸۰ هزار تومان",
    Icon: Scissors,
    accent: "bg-[#efe7dd] text-[#8a6540]",
  },
  {
    title: "بالیاژ و لایت سفارشی",
    en: "BESPOKE BALAYAGE",
    detail: "فرمول‌سازی شخصی، باند بیلدر و تونینگ لوکس",
    time: "۱۸۰ دقیقه",
    price: "از ۳.۹ میلیون تومان",
    Icon: WandSparkles,
    accent: "bg-[#f3e8e4] text-[#98675d]",
  },
  {
    title: "استایل مراسم",
    en: "EVENT STYLING",
    detail: "استایل ماندگار برای مهمانی، عکاسی و مراسم",
    time: "۷۵ دقیقه",
    price: "از ۱.۲ میلیون تومان",
    Icon: Gem,
    accent: "bg-[#e8ece8] text-[#5e7669]",
  },
  {
    title: "پکیج امضای عروس",
    en: "BRIDAL SIGNATURE",
    detail: "تست مو، شینیون و همراهی روز مراسم",
    time: "رزرو اختصاصی",
    price: "مشاوره قیمت",
    Icon: Crown,
    accent: "bg-[#f4eadb] text-[#9a7136]",
  },
];

function familyByRep(repId: number) {
  return families.find((family) => family.repId === repId);
}

export function Stage() {
  const { openLook, openConsult, openAnalyzer, openBooking, go } = useSalonActions();
  const heroLook = familyByRep(30);

  return (
    <section id="collections" className="hero-section scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <Sparkles className="size-3.5" strokeWidth={1.8} />
              <span dir="ltr">PRIVATE BEAUTY ATELIER</span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <LogoMark className="size-12 text-accent" />
              <div>
                <p className="font-display text-3xl leading-none text-foreground">حنانه بیوتی</p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-muted" dir="ltr">HAUTE BEAUTÉ · TEHRAN</p>
              </div>
            </div>
            <h1 className="hero-title mt-7">
              زیباییِ امضادار،
              <span>برای چهره‌ی منحصربه‌فرد شما.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
              از مشاوره چهره‌شناسی تا اجرای رنگ و استایل، هر جزئیات برای شما طراحی می‌شود.
            </p>
            <div className="hero-stats mt-6">
              <span><strong>+۱۲K</strong> مهمان راضی</span>
              <span><strong>۴.۹/۵</strong> رضایت مهمانان</span>
              <span><strong>۱۴</strong> سال تجربه</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Button tone="solid" onClick={openBooking}>
                <CalendarCheck className="size-4" strokeWidth={2} />
                رزرو نوبت
              </Button>
              <Button tone="ghost" onClick={openAnalyzer}>
                <Sparkles className="size-4 text-accent" strokeWidth={2} />
                پیشنهاد مدل با AI
              </Button>
            </div>
          </div>

          {heroLook ? (
            <button type="button" className="hero-image-card group" onClick={() => openLook(heroLook.id)} aria-label={`مشاهده ${heroLook.name}`}>
              <img src={lookSrc(heroLook.repId)} alt={heroLook.name} fetchPriority="high" decoding="sync" />
              <span className="hero-image-shade" />
              <span className="hero-image-copy">
                <span className="hero-image-tag"><Sparkles className="size-3" /> LOOK OF THE WEEK</span>
                <strong>{heroLook.name}</strong>
                <small>برای مشاهده جزئیات لمس کنید</small>
              </span>
              <span className="hero-image-arrow"><ArrowUpLeft className="size-4" /></span>
            </button>
          ) : null}
        </div>

        <div className="mt-9 border-t border-border pt-5 sm:mt-12">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-accent-deep" dir="ltr">CURATED LOOKBOOK</p>
              <p className="mt-1 text-sm font-semibold">استایل‌های منتخب آتلیه</p>
            </div>
            <button type="button" className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-accent-deep" onClick={() => go("catalog")}>
              همه مدل‌ها <ChevronLeft className="size-4" />
            </button>
          </div>
          <div className="look-rail no-scrollbar">
            {CURATED_LOOKS.map((item) => {
              const look = familyByRep(item.repId);
              if (!look) return null;
              return (
                <button key={item.repId} type="button" className="look-chip" onClick={() => openLook(look.id)} aria-label={`${item.label}، ${look.name}`}>
                  <img src={lookSrc(item.repId)} alt="" loading="eager" />
                  <span><strong>{item.label}</strong><small dir="ltr">{item.caption}</small></span>
                </button>
              );
            })}
          </div>
        </div>

        <button type="button" className="ai-prompt mt-7 w-full text-start" onClick={openAnalyzer}>
          <span className="ai-prompt-icon"><Sparkles className="size-5" /></span>
          <span className="min-w-0 flex-1"><strong>مدل متناسب با فرم چهره‌ات را پیدا کن</strong><small>تحلیل هوشمند و پیشنهاد مدل در کمتر از دو دقیقه</small></span>
          <ChevronLeft className="size-5 text-accent" />
        </button>
      </div>
    </section>
  );
}

export function Services() {
  const { openBooking } = useSalonActions();
  return (
    <section id="services" className="border-y border-border bg-surface px-4 py-11 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="section-intro">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent-deep" dir="ltr">THE ATELIER MENU</p>
            <h2>خدمات امضادار، با دقتی بی‌نظیر</h2>
            <p>هر لاین با مشاوره کوتاه شروع می‌شود تا نتیجه دقیقاً برای مو و سبک زندگی شما طراحی شود.</p>
          </div>
          <Button tone="soft" className="hidden sm:inline-flex" onClick={openBooking}><CalendarCheck className="size-4" /> رزرو نوبت آنلاین</Button>
        </div>
        <div className="service-grid mt-7">
          {SERVICES.map((service, index) => (
            <article key={service.en} className="service-card">
              <div className="flex items-start justify-between gap-3">
                <span className={`service-icon ${service.accent}`}><service.Icon className="size-5" strokeWidth={1.8} /></span>
                <span className="service-number" dir="ltr">0{index + 1}</span>
              </div>
              <p className="mt-5 text-[10px] font-semibold tracking-[0.16em] text-muted" dir="ltr">{service.en}</p>
              <h3>{service.title}</h3>
              <p className="service-detail">{service.detail}</p>
              <div className="service-meta"><span><Clock3 className="size-3.5" />{service.time}</span><strong>{service.price}</strong></div>
            </article>
          ))}
        </div>
        <Button tone="soft" className="mt-5 w-full sm:hidden" onClick={openBooking}><CalendarCheck className="size-4" /> رزرو نوبت آنلاین</Button>
      </div>
    </section>
  );
}

export function Footer() {
  const { openConsult, openBooking } = useSalonActions();
  return (
    <footer id="about" className="footer-shell scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="footer-card">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-accent"><LogoMark className="size-11" /><span className="text-xs font-semibold tracking-[0.18em]" dir="ltr">HANANEH HAUTE BEAUTÉ</span></div>
            <h2>نوبت خودت را به یک تجربه‌ی ویژه تبدیل کن.</h2>
            <p>برای انتخاب مدل، رنگ یا پکیج مناسب، آرتیست‌های حنانه همراه شما هستند.</p>
            <div className="mt-6 flex flex-wrap gap-2"><Button tone="solid" onClick={openBooking}><CalendarCheck className="size-4" /> رزرو نوبت</Button><Button tone="ghost" onClick={openConsult}><HeartHandshake className="size-4 text-accent" /> مشاوره رایگان</Button></div>
          </div>
          <div className="footer-info">
            <div><MapPin className="size-4 text-accent" /><span><strong>تهران، الهیه</strong><small>برج پالادیوم، طبقه چهارم</small></span></div>
            <div><Clock3 className="size-4 text-accent" /><span><strong>شنبه تا پنج‌شنبه</strong><small>۱۰ صبح تا ۷ عصر</small></span></div>
          </div>
        </div>
        <p className="mt-6 text-center text-[11px] text-muted">© ۲۰۲۶ حنانه بیوتی · با عشق به جزئیات</p>
      </div>
    </footer>
  );
}
