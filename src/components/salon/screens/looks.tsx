import { useEffect, useMemo, useRef, useState } from "react";
import { Columns2, Heart, Play, Search, X } from "lucide-react";
import { toast } from "sonner";
import { FAMILY_COUNT, FILTERS, diverseOrder, families, labelOf, lookThumb, matchesFamily, persian } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { Chip, EmptyState, haptic, useSalonActions } from "../ui";

const PAGE_SIZE = 20;

// Survives tab switches so Back can restore the scroll offset over the same number of loaded looks.
const memory = { count: PAGE_SIZE, key: "" };

const SHORT: Record<string, string> = {
  all: "همه",
  straight: "صاف",
  waves: "موج",
  curly: "فر",
  bob: "باب",
  pixie: "کوتاه",
  updo: "شینیون",
  ponytail: "دم‌اسبی",
  braid: "بافت",
  editorial: "خاص",
  color: "رنگ",
  fringe: "چتری",
};

export function LooksScreen() {
  const { openDiscover } = useSalonActions();
  const favs = useSalon((state) => state.favs);
  const compare = useSalon((state) => state.compare);
  const filter = useSalon((state) => state.filter);
  const query = useSalon((state) => state.query);
  const savedOnly = useSalon((state) => state.savedOnly);
  const setFilter = useSalon((state) => state.setFilter);
  const setQuery = useSalon((state) => state.setQuery);
  const toggleSaved = useSalon((state) => state.toggleSaved);
  const clearAll = useSalon((state) => state.clearAll);
  const toggleFav = useSalon((state) => state.toggleFav);
  const toggleCompare = useSalon((state) => state.toggleCompare);
  const listKey = `${query}|${filter}|${savedOnly}`;
  const [count, setCount] = useState(() => (memory.key === listKey ? memory.count : PAGE_SIZE));
  const sentinel = useRef<HTMLDivElement>(null);

  const favSet = useMemo(() => new Set(favs), [favs]);
  const compareSet = useMemo(() => new Set(compare), [compare]);
  const list = useMemo(() => {
    const filtered = families.filter((family) => matchesFamily(family, query, filter, savedOnly, favSet));
    return query.trim() ? filtered : diverseOrder(filtered);
  }, [query, filter, savedOnly, favSet]);
  const visible = list.slice(0, count);

  useEffect(() => {
    if (memory.key !== listKey) {
      memory.key = listKey;
      setCount(PAGE_SIZE);
    }
  }, [listKey]);

  useEffect(() => {
    memory.count = count;
  }, [count]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setCount((current) => current + PAGE_SIZE);
    }, { rootMargin: "600px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [list.length, count]);

  return (
    <div className="pt-2">
      <section className="px-6">
        <p className="reveal font-brand text-[0.7rem] tracking-[0.3em] text-accent-deep" dir="ltr">THE LOOKBOOK · {FAMILY_COUNT} LOOKS</p>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h1 className="reveal mt-3 text-[2.2rem] leading-[1.35] font-extralight tracking-tight" style={{ animationDelay: "80ms" }}>
            الهام برای
            <br />
            <span className="font-display text-[2.4rem] text-accent-deep">نوبت بعدی</span>
          </h1>
          {list.length ? (
            <button type="button" className="reveal press glass inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full ps-3 pe-4 text-[0.8rem]" style={{ animationDelay: "160ms" }} onClick={() => openDiscover(list[0].id)}>
              <span className="grid size-7 place-items-center rounded-full bg-ink text-champagne"><Play className="size-3 fill-current" /></span>
              تمام‌صفحه
            </button>
          ) : null}
        </div>
        <label className="search-field">
          <span className="sr-only">جست‌وجوی مدل</span>
          <Search className="size-[18px] shrink-0 text-muted" />
          <input
            id="look-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="باب، پیکسی، بافت، فر، چتری…"
          />
          {query ? (
            <button type="button" className="grid size-8 place-items-center rounded-full bg-soft" onClick={() => setQuery("")} aria-label="پاک کردن جست‌وجو">
              <X className="size-3.5" />
            </button>
          ) : null}
        </label>
      </section>

      <div className="chip-bar no-scrollbar" aria-label="فیلتر گروه‌ها">
        <Chip active={savedOnly} onClick={toggleSaved} className="gap-1.5">
          <Heart className={cn("size-3.5", savedOnly && "fill-current")} /> ذخیره‌ها {favs.length ? persian(favs.length) : ""}
        </Chip>
        {FILTERS.map((item) => (
          <Chip key={item.key} active={filter === item.key && !savedOnly} onClick={() => setFilter(item.key)}>
            {SHORT[item.key] ?? item.label}
          </Chip>
        ))}
      </div>

      <div className="mt-1 flex items-center justify-between px-6 text-xs text-muted" aria-live="polite">
        <span>
          {savedOnly ? "ذخیره‌ها" : query.trim() ? `«${query.trim()}»` : labelOf(filter)} · <span className="tabular-nums">{persian(list.length)}</span> از {persian(FAMILY_COUNT)}
        </span>
        {savedOnly || filter !== "all" || query.trim() ? <button type="button" className="min-h-9 font-medium text-accent-deep" onClick={clearAll}>نمایش همه</button> : null}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={savedOnly ? <Heart className="size-6" /> : <Search className="size-6" />}
            title={savedOnly ? "هنوز مدلی ذخیره نکرده‌اید" : "مدلی پیدا نشد"}
            text={savedOnly ? "روی قلب هر مدل بزنید تا اینجا برای مشاوره و رزرو نگه داشته شود." : "عبارت دیگری امتحان کنید یا فیلترها را پاک کنید."}
            action={<button type="button" className="press min-h-11 rounded-2xl bg-soft px-6 text-sm font-medium" onClick={clearAll}>مشاهده همه مدل‌ها</button>}
          />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 px-6 sm:grid-cols-3">
          {visible.map((family, index) => {
            const saved = favSet.has(family.id);
            const picked = compareSet.has(family.id);
            return (
              <article key={family.id} className="look-card rise" style={{ animationDelay: `${(index % PAGE_SIZE) * 18}ms` }}>
                <button type="button" className="press block w-full text-start" onClick={(event) => openDiscover(family.id, event.currentTarget.querySelector("img"))}>
                  <span className="look-image">
                    <img src={lookThumb(family.repId)} alt={family.name} loading="lazy" decoding="async" />
                  </span>
                  <h3 className="mt-3 line-clamp-2 min-h-10 text-[0.82rem] leading-5">{family.name}</h3>
                  <p className="mt-0.5 font-brand text-[0.75rem] italic tracking-[0.08em] text-muted" dir="ltr">{family.code}</p>
                </button>
                <div className="look-actions">
                  <button
                    type="button"
                    aria-label={saved ? `حذف ${family.name} از ذخیره‌ها` : `ذخیره ${family.name}`}
                    aria-pressed={saved}
                    onClick={() => { haptic(); toggleFav(family.id); }}
                    className={cn("look-action", saved && "look-action-on")}
                  >
                    <Heart className={cn("size-4", saved && "fill-current")} strokeWidth={1.8} />
                  </button>
                  <button
                    type="button"
                    aria-label={picked ? `حذف ${family.name} از مقایسه` : `افزودن ${family.name} به مقایسه`}
                    aria-pressed={picked}
                    onClick={() => {
                      haptic();
                      if (toggleCompare(family.id) === "limit") toast("برای مقایسه حداکثر سه مدل انتخاب کنید.");
                    }}
                    className={cn("look-action", picked && "look-action-on")}
                  >
                    <Columns2 className="size-4" strokeWidth={1.8} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {visible.length < list.length ? <div ref={sentinel} className="h-10" aria-hidden="true" /> : null}
    </div>
  );
}
