import { ChevronLeft, Columns2, Heart, HeartHandshake, Monitor, Moon, ScanFace, ShieldCheck, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { familyById, lookThumb, persian, type Family } from "@/data/catalog";
import { SALON } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon, type ThemePref } from "@/lib/salon-store";
import { Kicker, SectionHead, TextLink, useSalonActions } from "../ui";

const THEMES: Array<{ key: ThemePref; label: string; Icon: typeof Sun }> = [
  { key: "light", label: "روشن", Icon: Sun },
  { key: "dark", label: "تیره", Icon: Moon },
  { key: "system", label: "خودکار", Icon: Monitor },
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

  const rows = [
    { label: "مقایسه مدل‌ها", note: compare.length ? `${persian(compare.length)} مدل انتخاب‌شده` : "تا سه مدل را کنار هم ببینید", Icon: Columns2, onClick: () => openSheet({ kind: "compare" }) },
    { label: "استایل‌یاب", note: "پیشنهاد مدل بر اساس فرم چهره", Icon: ScanFace, onClick: () => openSheet({ kind: "finder" }) },
    { label: "درخواست مشاوره", note: "مدل‌های منتخب را برای آرتیست بفرستید", Icon: HeartHandshake, onClick: () => openSheet({ kind: "consult" }) },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 pt-2">
      <section className="rise px-6">
        <div className="member-card">
          <div className="flex items-center justify-between">
            <Kicker className="text-champagne">ATELIER MEMBER</Kicker>
            <span className="font-brand text-xs tracking-[0.2em] opacity-60" dir="ltr">HB</span>
          </div>
          <label className="mt-6 block">
            <span className="sr-only">نام شما</span>
            <input
              value={profile.name}
              onChange={(event) => setProfile({ name: event.target.value })}
              placeholder="نام خود را بنویسید"
              className="w-full bg-transparent font-display text-[1.75rem] leading-tight text-white outline-none placeholder:text-white/40"
              autoComplete="name"
            />
          </label>
          <label className="mt-1 block">
            <span className="sr-only">شماره همراه</span>
            <input
              value={profile.phone}
              onChange={(event) => setProfile({ phone: event.target.value })}
              placeholder="شماره همراه (برای پر کردن خودکار فرم رزرو)"
              className="w-full bg-transparent text-sm text-white/80 outline-none placeholder:text-white/40"
              inputMode="tel"
              autoComplete="tel"
            />
          </label>
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
            <button type="button" onClick={() => { showSaved(); go("looks"); }} className="press grid gap-0.5"><strong className="text-lg">{persian(favs.length)}</strong><small className="text-[0.68rem] opacity-60">ذخیره</small></button>
            <button type="button" onClick={() => go("bookings")} className="press grid gap-0.5"><strong className="text-lg">{persian(bookings.length)}</strong><small className="text-[0.68rem] opacity-60">درخواست نوبت</small></button>
            <button type="button" onClick={() => openSheet({ kind: "compare" })} className="press grid gap-0.5"><strong className="text-lg">{persian(compare.length)}</strong><small className="text-[0.68rem] opacity-60">مقایسه</small></button>
          </div>
        </div>
      </section>

      <section>
        <SectionHead kicker="SAVED LOOKS" title="مدل‌های ذخیره‌شده" action={saved.length ? <TextLink onClick={() => { showSaved(); go("looks"); }}>همه</TextLink> : undefined} />
        {saved.length ? (
          <div className="rail no-scrollbar">
            {saved.slice(0, 10).map((family) => (
              <button key={family.id} type="button" className="press saved-tile" onClick={() => openSheet({ kind: "look", id: family.id })}>
                <img src={lookThumb(family.repId)} alt={family.name} loading="lazy" />
                <span className="line-clamp-1">{family.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <button type="button" className="press mx-6 flex w-[calc(100%-3rem)] items-center gap-3 rounded-3xl border border-dashed border-border p-4 text-start" onClick={() => go("looks")}>
            <span className="grid size-11 place-items-center rounded-full bg-soft text-accent-deep"><Heart className="size-5" /></span>
            <span className="flex-1 text-sm"><strong className="block">هنوز مدلی ذخیره نشده</strong><small className="text-xs text-muted">لوک‌بوک را ببینید و روی قلب بزنید</small></span>
            <ChevronLeft className="size-5 text-muted" />
          </button>
        )}
      </section>

      <section className="px-6">
        <div className="overflow-hidden rounded-[1.75rem] bg-surface shadow-card">
          {rows.map(({ label, note, Icon, onClick }) => (
            <button key={label} type="button" onClick={onClick} className="press flex w-full items-center gap-3.5 border-b border-foreground/10 p-4 text-start last:border-b-0">
              <span className="grid size-10 place-items-center rounded-full bg-soft text-accent-deep"><Icon className="size-[18px]" strokeWidth={1.7} /></span>
              <span className="min-w-0 flex-1"><strong className="block text-sm">{label}</strong><small className="text-xs text-muted">{note}</small></span>
              <ChevronLeft className="size-4 text-muted" />
            </button>
          ))}
        </div>
      </section>

      <section className="px-6">
        <h2 className="mb-3 text-sm font-medium">ظاهر برنامه</h2>
        <div className="segmented" role="radiogroup" aria-label="ظاهر برنامه">
          {THEMES.map(({ key, label, Icon }) => (
            <button key={key} type="button" role="radio" aria-checked={theme === key} onClick={() => setTheme(key)} className={cn(theme === key && "segmented-on")}>
              <Icon className="size-4" strokeWidth={1.8} /> {label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6">
        <div className="flex items-start gap-3 rounded-3xl bg-soft p-4 text-xs leading-6 text-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent-deep" />
          <p>نام، شماره، ذخیره‌ها و درخواست‌های نوبت فقط روی همین دستگاه نگه داشته می‌شوند و تا زمانی که خودتان ارسال نکنید، برای {SALON.name} فرستاده نمی‌شوند.</p>
        </div>
        <button
          type="button"
          className="press mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-medium text-[#b4483c]"
          onClick={() => {
            if (window.confirm("همه اطلاعات ذخیره‌شده روی این دستگاه پاک شود؟")) {
              clearData();
              toast("اطلاعات این دستگاه پاک شد.");
            }
          }}
        >
          <Trash2 className="size-4" /> پاک کردن اطلاعات این دستگاه
        </button>
      </section>
    </div>
  );
}
