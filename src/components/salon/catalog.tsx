import { useEffect, useMemo } from "react";
import { Columns2, Heart, Search } from "lucide-react";
import { toast } from "sonner";
import {
  FAMILY_COUNT,
  FILTERS,
  families,
  labelOf,
  lookSrc,
  matchesFamily,
  persian,
  diverseOrder,
} from "@/data/catalog";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { useSalonActions } from "./ui";

const PAGE_SIZE = 24;

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

export function Catalog() {
  const { openLook } = useSalonActions();
  const favs = useSalon((state) => state.favs);
  const compare = useSalon((state) => state.compare);
  const filter = useSalon((state) => state.filter);
  const query = useSalon((state) => state.query);
  const savedOnly = useSalon((state) => state.savedOnly);
  const page = useSalon((state) => state.page);
  const setFilter = useSalon((state) => state.setFilter);
  const setQuery = useSalon((state) => state.setQuery);
  const toggleSaved = useSalon((state) => state.toggleSaved);
  const clearAll = useSalon((state) => state.clearAll);
  const setPage = useSalon((state) => state.setPage);
  const toggleFav = useSalon((state) => state.toggleFav);
  const toggleCompare = useSalon((state) => state.toggleCompare);

  const favSet = useMemo(() => new Set(favs), [favs]);
  const compareSet = useMemo(() => new Set(compare), [compare]);
  const list = useMemo(() => {
    const filtered = families.filter((family) => matchesFamily(family, query, filter, savedOnly, favSet));
    if (query.trim()) return filtered;
    return diverseOrder(filtered);
  }, [query, filter, savedOnly, favSet]);
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const slice = list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const narrowed = Boolean(query.trim()) || filter !== "all" || savedOnly;
  const title = savedOnly ? "ذخیره‌ها" : query.trim() ? `«${query.trim()}»` : labelOf(filter);

  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [page, pages, setPage]);

  function changePage(next: number) {
    setPage(next);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="catalog" className="scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <div className="catalog-intro flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-accent-deep" dir="ltr">THE LOOKBOOK</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">گالری استایل‌ها</h2>
            <p className="mt-2 text-sm text-muted" aria-live="polite">
              {title}
              <span className="mx-2 text-border">/</span>
              <span className="tabular-nums">{persian(list.length)}</span>
              <span> از {persian(FAMILY_COUNT)}</span>
            </p>
          </div>
          <label className="catalog-search relative block w-full sm:max-w-sm">
            <span className="sr-only">جست‌وجوی مدل</span>
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              id="look-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              enterKeyHint="search"
              autoComplete="off"
              suppressHydrationWarning
              placeholder="باب، پیکسی، بافت، فر، چتری"
              className="h-12 w-full rounded-full border border-border bg-surface ps-11 pe-4 text-base outline-none placeholder:text-muted"
            />
          </label>
        </div>

        <div className="no-scrollbar mt-7 flex gap-x-5 overflow-x-auto scroll-mt-24 border-b border-border" aria-label="فیلتر گروه‌ها">
          {FILTERS.map((item) => {
            const active = filter === item.key && !savedOnly;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                aria-pressed={active}
                className={cn(
                  "-mb-px min-h-11 shrink-0 border-b-2 px-1 text-sm",
                  active ? "border-accent font-semibold text-foreground" : "border-transparent text-muted hover:text-foreground",
                )}
              >
                {SHORT[item.key] ?? item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={toggleSaved}
            aria-pressed={savedOnly}
            className={cn(
              "-mb-px min-h-11 shrink-0 border-b-2 px-1 text-sm",
              savedOnly ? "border-accent font-semibold text-accent" : "border-transparent text-muted hover:text-foreground",
            )}
          >
            ذخیره‌ها {persian(favs.length)}
          </button>
          {narrowed ? (
            <button type="button" onClick={clearAll} className="min-h-11 shrink-0 px-1 text-sm font-medium text-accent">
              پاک کردن
            </button>
          ) : null}
        </div>

        {slice.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted">{savedOnly ? "هنوز مدلی ذخیره نشده." : "مدلی با این عبارت پیدا نشد."}</p>
            <button type="button" onClick={clearAll} className="mt-4 min-h-11 text-sm font-semibold text-accent">
              نمایش همه
            </button>
          </div>
        ) : (
          <div className="look-grid mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            {slice.map((family) => {
              const saved = favSet.has(family.id);
              const picked = compareSet.has(family.id);
              return (
                <article key={family.id} className="look-card">
                  <div className="relative">
                    <button type="button" className="group block w-full text-start" onClick={() => openLook(family.id)}>
                    <span className="portrait-frame look-card-image">
                      <img
                        src={lookSrc(family.repId)}
                        alt={family.name}
                        loading="lazy"
                        decoding="async"
                        className="aspect-square w-full object-cover"
                      />
                      <span className="look-category-pill">{labelOf(family.category)}</span>
                    </span>
                    <h3 className="mt-3 line-clamp-2 min-h-10 text-sm leading-snug font-bold">
                      {family.name}
                    </h3>
                    <p className="mt-1 truncate text-[11px] text-muted">
                      <span dir="ltr" className="tracking-[0.08em]">{family.code}</span>
                    </p>
                    </button>
                    <div className="look-card-actions">
                    <button
                      type="button"
                      aria-label={saved ? `حذف ${family.name} از علاقه‌مندی` : `ذخیره ${family.name}`}
                      aria-pressed={saved}
                      onClick={() => toggleFav(family.id)}
                      className={cn("look-action", saved ? "look-action-active" : "")}
                    >
                      <Heart className={saved ? "size-4 fill-current" : "size-4"} strokeWidth={1.75} />
                    </button>
                    <button
                      type="button"
                      aria-label={picked ? `حذف ${family.name} از مقایسه` : `افزودن ${family.name} به مقایسه`}
                      aria-pressed={picked}
                      onClick={() => {
                        const result = toggleCompare(family.id);
                        if (result === "limit") toast("برای مقایسه حداکثر سه مدل انتخاب کنید.");
                      }}
                      className={cn("look-action", picked ? "look-action-active" : "")}
                    >
                      <Columns2 className="size-4" strokeWidth={1.75} />
                    </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {list.length > PAGE_SIZE ? (
          <div className="mt-10 flex items-center justify-center gap-6 border-t border-border pt-4">
            <button type="button" className="min-h-11 text-sm font-semibold disabled:opacity-30" disabled={safePage <= 1} onClick={() => changePage(safePage - 1)}>
              قبلی
            </button>
            <span className="text-xs tabular-nums text-muted">
              {persian(safePage)} / {persian(pages)}
            </span>
            <button type="button" className="min-h-11 text-sm font-semibold disabled:opacity-30" disabled={safePage >= pages} onClick={() => changePage(safePage + 1)}>
              بعدی
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
