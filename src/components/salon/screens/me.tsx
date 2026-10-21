import { toast } from "sonner";
import { familyById, lookThumb, persian, type Family } from "@/data/catalog";
import { SALON } from "@/data/salon";
import { useSalon, type ThemePref } from "@/lib/salon-store";
import { Icon, type IconName } from "../icons";
import { Wordmark } from "../logo";
import { Button, Media, SectionHead, TextLink, useSalonActions } from "../ui";

const THEMES: Array<{ key: ThemePref; label: string; icon: IconName }> = [
  { key: "light", label: "روشن", icon: "light" },
  { key: "dark", label: "تیره", icon: "dark" },
  { key: "system", label: "خودکار", icon: "auto" },
];

export function MeScreen() {
  const { go, openSheet } = useSalonActions();
  const profile = useSalon((state) => state.profile);
  const setProfile = useSalon((state) => state.setProfile);
  const favs = useSalon((state) => state.favs);
  const compare = useSalon((state) => state.compare);
  const bookings = useSalon((state) => state.bookings);
  const theme = useSalon((state) => state.theme);
  const setTheme = useSalon((state) => state.setTheme);
  const showSaved = useSalon((state) => state.showSaved);
  const clearData = useSalon((state) => state.clearData);
  const saved = favs.map((id) => familyById.get(id)).filter((family): family is Family => Boolean(family)).reverse();

  const rows: Array<{ label: string; note: string; icon: IconName; onClick: () => void }> = [
    { label: "مقایسه مدل‌ها", note: compare.length ? `${persian(compare.length)} مدل انتخاب‌شده` : "تا سه مدل را کنار هم ببینید", icon: "compare", onClick: () => openSheet({ kind: "compare" }) },
    { label: "استایل‌یاب", note: "پیشنهاد مدل بر اساس فرم چهره", icon: "finder", onClick: () => openSheet({ kind: "finder" }) },
    { label: "درخواست مشاوره", note: "مدل‌های منتخب را برای آرتیست بفرستید", icon: "consult", onClick: () => openSheet({ kind: "consult" }) },
  ];

  const stats = [
    { value: favs.length, label: "ذخیره", onClick: () => { showSaved(); go("looks"); } },
    { value: bookings.length, label: "درخواست نوبت", onClick: () => go("bookings") },
    { value: compare.length, label: "مقایسه", onClick: () => openSheet({ kind: "compare" }) },
  ];

  return (
    <div className="grid grid-cols-1 gap-[var(--spacing-section)] pt-2">
      <section className="enter px-gutter">
        <div className="member">
          <div className="flex items-start justify-between">
            <span className="t-caption text-champagne">عضو آتلیه</span>
            <Wordmark className="text-[1.05rem] [&_.wordmark__en]:text-white/45" latin={false} />
          </div>
          <label className="mt-5 block">
            <span className="sr-only">نام شما</span>
            <input
              value={profile.name}
              onChange={(event) => setProfile({ name: event.target.value })}
              placeholder="نام خود را بنویسید"
              autoComplete="name"
              className="t-calligraphy w-full bg-transparent text-[1.6rem] text-white outline-none placeholder:text-white/35 focus:shadow-none"
            />
          </label>
          <label className="block">
            <span className="sr-only">شماره همراه</span>
            <input
              value={profile.phone}
              onChange={(event) => setProfile({ phone: event.target.value })}
              placeholder="شماره همراه، برای پر کردن خودکار فرم رزرو"
              inputMode="tel"
              autoComplete="tel"
              className="t-footnote w-full bg-transparent text-white/75 outline-none placeholder:text-white/35 focus:shadow-none"
            />
          </label>
          <div className="mt-auto grid grid-cols-3 border-t border-white/12 pt-4 text-center">
            {stats.map((item) => (
              <button key={item.label} type="button" onClick={item.onClick} className="grid">
                <strong className="t-title-2 t-numeric">{persian(item.value)}</strong>
                <span className="t-caption text-white/55">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHead eyebrow="مجموعه شما" title="مدل‌های ذخیره‌شده" action={saved.length ? <TextLink onClick={() => { showSaved(); go("looks"); }}>همه</TextLink> : undefined} />
        {saved.length ? (
          <div className="rail">
            {saved.slice(0, 10).map((family) => (
              <button key={family.id} type="button" className="tile w-28" onClick={() => openSheet({ kind: "look", id: family.id })}>
                <Media src={lookThumb(family.repId)} alt={family.name} loading="lazy" className="tile__media" />
                <span className="t-caption mt-2 line-clamp-1">{family.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-gutter">
            <button type="button" className="list-row card" data-variant="outline" onClick={() => go("looks")}>
              <span className="list-row__icon" style={{ background: "var(--color-rose-soft)", color: "var(--color-rose)" }}><Icon name="heart" size={20} weight="duotone" /></span>
              <span className="flex-1"><strong className="t-headline block font-normal">هنوز مدلی ذخیره نشده</strong><span className="t-caption text-ink-2">لوک‌بوک را ببینید و روی قلب بزنید</span></span>
              <Icon name="chevron" size={18} className="text-ink-3" />
            </button>
          </div>
        )}
      </section>

      <section className="px-gutter">
        <div className="list">
          {rows.map((row) => (
            <button key={row.label} type="button" className="list-row" onClick={row.onClick}>
              <span className="list-row__icon"><Icon name={row.icon} size={20} weight="duotone" /></span>
              <span className="min-w-0 flex-1"><strong className="t-headline block font-normal">{row.label}</strong><span className="t-caption text-ink-2">{row.note}</span></span>
              <Icon name="chevron" size={18} className="text-ink-3" />
            </button>
          ))}
        </div>
      </section>

      <section className="px-gutter">
        <h2 className="t-headline mb-3">ظاهر برنامه</h2>
        <div className="segmented" role="radiogroup" aria-label="ظاهر برنامه">
          {THEMES.map((item) => (
            <button key={item.key} type="button" role="radio" aria-checked={theme === item.key} onClick={() => setTheme(item.key)}>
              <Icon name={item.icon} size={17} weight={theme === item.key ? "fill" : "light"} /> {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 px-gutter">
        <div className="card flex items-start gap-3" data-variant="sunken">
          <Icon name="privacy" size={20} weight="duotone" className="mt-0.5 shrink-0 text-gold-ink" />
          <p className="t-footnote text-ink-2">نام، شماره، ذخیره‌ها و درخواست‌های نوبت فقط روی همین دستگاه نگه داشته می‌شوند و تا زمانی که خودتان ارسال نکنید، برای {SALON.name} فرستاده نمی‌شوند.</p>
        </div>
        <Button variant="ghost" icon="palette" className="justify-self-center" onClick={() => go("design")}>سیستم طراحی حنانه بیوتی</Button>
        <Button
          variant="ghost"
          icon="trash"
          className="justify-self-center text-garnet"
          onClick={() => {
            if (window.confirm("همه اطلاعات ذخیره‌شده روی این دستگاه پاک شود؟")) {
              clearData();
              toast("اطلاعات این دستگاه پاک شد.");
            }
          }}
        >
          پاک کردن اطلاعات این دستگاه
        </Button>
      </section>
    </div>
  );
}
