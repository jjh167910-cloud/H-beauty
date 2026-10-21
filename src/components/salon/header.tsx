import { CalendarCheck, Heart, Search, Sparkles } from "lucide-react";
import { persian } from "@/data/catalog";
import { useSalon } from "@/lib/salon-store";
import { LogoMark } from "./logo";
import { useSalonActions } from "./ui";

const LINKS = [
  { id: "collections", label: "خانه" },
  { id: "services", label: "خدمات" },
  { id: "catalog", label: "گالری مدل‌ها" },
  { id: "about", label: "درباره آتلیه" },
];

export function Header({ section }: { section: string }) {
  const { go, openBooking, openAnalyzer } = useSalonActions();
  const favs = useSalon((state) => state.favs);
  const showSaved = useSalon((state) => state.showSaved);

  function openSearch() {
    go("catalog");
    window.setTimeout(() => document.getElementById("look-search")?.focus(), 280);
  }

  return (
    <header id="top" className="app-header sticky top-0 z-40">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => go("top")} className="brand-lockup" aria-label="بازگشت به خانه">
          <LogoMark className="size-10 shrink-0 text-accent" />
          <span className="brand-copy">
            <strong>حنانه</strong>
            <small dir="ltr">HAUTE BEAUTÉ</small>
          </span>
        </button>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="پیمایش اصلی">
          {LINKS.map((link) => (
            <button key={link.id} type="button" onClick={() => go(link.id)} className={`nav-link ${section === link.id ? "nav-link-active" : ""}`}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button type="button" className="header-icon-button xl:hidden" onClick={openSearch} aria-label="جست‌وجوی مدل"><Search className="size-[18px]" strokeWidth={1.8} /></button>
          <button type="button" className="header-icon-button hidden xl:grid" onClick={() => { showSaved(); go("catalog"); }} aria-label={favs.length ? `علاقه‌مندی‌ها، ${persian(favs.length)} مدل` : "علاقه‌مندی‌ها"}>
            <Heart className={favs.length ? "size-[18px] fill-current text-accent" : "size-[18px]"} strokeWidth={1.8} />
            {favs.length ? <span className="header-count">{persian(favs.length)}</span> : null}
          </button>
          <button type="button" className="hidden min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-accent-deep transition hover:bg-soft xl:inline-flex" onClick={openAnalyzer}>
            <Sparkles className="size-4" strokeWidth={1.8} /> AI استایل
          </button>
          <button type="button" className="header-book-button" onClick={openBooking}><CalendarCheck className="size-4" strokeWidth={2} /><span>رزرو</span><span className="hidden sm:inline"> نوبت</span></button>
        </div>
      </div>
    </header>
  );
}
