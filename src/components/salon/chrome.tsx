import { useEffect, useState, type CSSProperties } from "react";
import { CalendarDays, CalendarPlus, Columns2, Home, LayoutGrid, Sparkles, UserRound, X } from "lucide-react";
import { familyById, lookThumb, persian, type Family } from "@/data/catalog";
import { formatMinutes, formatPrice, summarize } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon, type Tab } from "@/lib/salon-store";
import { LogoMark } from "./logo";
import { haptic, useSalonActions } from "./ui";

const TITLES: Record<Tab, { title: string; en: string }> = {
  home: { title: "حنانه", en: "HAUTE BEAUTÉ" },
  services: { title: "منوی خدمات", en: "THE ATELIER MENU" },
  looks: { title: "لوک‌بوک", en: "THE LOOKBOOK" },
  bookings: { title: "نوبت‌های من", en: "MY APPOINTMENTS" },
  me: { title: "پروفایل", en: "MY ATELIER" },
};

export function TopBar() {
  const tab = useSalon((state) => state.tab);
  const name = useSalon((state) => state.profile.name);
  const { go } = useSalonActions();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const head = TITLES[tab];

  return (
    <header className={cn("top-bar", scrolled && "top-bar-scrolled glass-soft")}>
      <button type="button" className="press flex min-h-11 items-center gap-2.5 text-start" onClick={() => go("home")} aria-label="خانه">
        <LogoMark className="size-9 shrink-0 text-accent" />
        <span className="grid leading-none">
          <strong className={cn(tab === "home" ? "font-display text-[1.5rem] font-normal" : "text-[1.05rem] font-normal")}>{head.title}</strong>
          <small className="mt-1 font-brand text-[0.62rem] tracking-[0.28em] text-muted" dir="ltr">{head.en}</small>
        </span>
      </button>
      <button
        type="button"
        onClick={() => go("me")}
        className={cn("press grid size-10 place-items-center rounded-full transition", tab === "me" ? "bg-ink text-champagne" : "text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_15%,transparent)]")}
        aria-label="پروفایل"
      >
        {name.trim() ? <span className="font-display text-lg leading-none">{name.trim().slice(0, 1)}</span> : <UserRound className="size-[18px]" strokeWidth={1.4} />}
      </button>
    </header>
  );
}

const ITEMS: Array<{ tab: Tab; label: string; Icon: typeof Home }> = [
  { tab: "home", label: "خانه", Icon: Home },
  { tab: "services", label: "خدمات", Icon: Sparkles },
  { tab: "looks", label: "لوک‌بوک", Icon: LayoutGrid },
  { tab: "bookings", label: "نوبت‌ها", Icon: CalendarDays },
];

/** Scroll direction hook: true while the user scrolls down past the fold. */
function useMinimized() {
  const [min, setMin] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setMin(y > last && y > 160);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return min;
}

export function TabBar() {
  const tab = useSalon((state) => state.tab);
  const pending = useSalon((state) => state.bookings.filter((item) => !item.sent).length);
  const { go, openBooking } = useSalonActions();
  const minimized = useMinimized();
  // Grid column of the active tab (the centre column is the booking button).
  const tabIndex = ITEMS.findIndex((item) => item.tab === tab);
  const column = tabIndex < 0 ? -1 : tabIndex < 2 ? tabIndex : tabIndex + 1;

  const render = (item: (typeof ITEMS)[number]) => {
    const active = tab === item.tab;
    return (
      <button
        key={item.tab}
        type="button"
        onClick={() => { haptic(); go(item.tab); }}
        className={cn("tab-item", active && "tab-item-active")}
        aria-current={active ? "page" : undefined}
      >
        <span className="relative">
          <item.Icon className="size-[22px]" strokeWidth={active ? 1.7 : 1.35} />
          {item.tab === "bookings" && pending ? <span className="tab-dot" aria-label={`${persian(pending)} درخواست ارسال‌نشده`} /> : null}
        </span>
        <span className="tab-label">{item.label}</span>
      </button>
    );
  };

  return (
    <nav className={cn("tab-bar glass", minimized && "tab-bar-min")} aria-label="پیمایش اصلی" style={{ "--col": column } as CSSProperties}>
      {column >= 0 ? <span className="tab-lens" aria-hidden="true" /> : null}
      {ITEMS.slice(0, 2).map(render)}
      <div className="grid place-items-center">
        <button type="button" className="tab-book foil press" onClick={() => { haptic(); openBooking(); }} aria-label="رزرو نوبت">
          <CalendarPlus className="size-[22px]" strokeWidth={1.5} />
        </button>
      </div>
      {ITEMS.slice(2).map(render)}
    </nav>
  );
}

export function Docks() {
  const tab = useSalon((state) => state.tab);
  const cart = useSalon((state) => state.cart);
  const compare = useSalon((state) => state.compare);
  const clearCompare = useSalon((state) => state.clearCompare);
  const setCart = useSalon((state) => state.setCart);
  const { openSheet } = useSalonActions();

  if (cart.length && (tab === "home" || tab === "services")) {
    const { items, minutes, price, hasUnpriced } = summarize(cart);
    return (
      <div className="dock glass" role="region" aria-label="خدمات انتخاب‌شده">
        <button type="button" className="press grid size-9 shrink-0 place-items-center rounded-full bg-soft" onClick={() => setCart([])} aria-label="پاک کردن انتخاب‌ها">
          <X className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[0.8rem] font-medium">{persian(items.length)} خدمت · {formatMinutes(minutes)}</p>
          <p className="truncate text-[0.7rem] text-muted">{price ? `از ${formatPrice(price)} تومان` : "قیمت پس از مشاوره"}{hasUnpriced && price ? " + مشاوره" : ""}</p>
        </div>
        <button type="button" className="press foil min-h-11 rounded-full px-5 text-sm font-medium text-[#1a140e]" onClick={() => openSheet({ kind: "booking" })}>
          ادامه رزرو
        </button>
      </div>
    );
  }

  if (compare.length && (tab === "looks" || tab === "me")) {
    const selected = compare.map((id) => familyById.get(id)).filter((family): family is Family => Boolean(family));
    return (
      <div className="dock glass" role="region" aria-label="مقایسه">
        <div className="flex -space-x-3 rtl:space-x-reverse">
          {selected.map((family) => (
            <img key={family.id} src={lookThumb(family.repId)} alt="" className="size-10 rounded-full border-2 border-surface object-cover" />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[0.8rem] font-bold"><Columns2 className="size-3.5" /> مقایسه</p>
          <p className="text-[0.7rem] text-muted">{persian(selected.length)} از ۳ مدل</p>
        </div>
        <button type="button" className="press min-h-11 px-2 text-xs text-muted" onClick={clearCompare}>پاک کردن</button>
        <button type="button" className="press foil min-h-11 rounded-full px-5 text-sm font-medium text-[#1a140e]" onClick={() => openSheet({ kind: "compare" })}>
          مشاهده
        </button>
      </div>
    );
  }

  return null;
}
