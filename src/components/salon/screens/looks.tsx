import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { FAMILY_COUNT, FILTERS, diverseOrder, families, labelOf, lookThumb, matchesFamily, persian } from "@/data/catalog";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { Button, Chip, EmptyState, IconButton, Media, PageHead, haptic, useSalonActions } from "../ui";

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

  const narrowed = savedOnly || filter !== "all" || Boolean(query.trim());

  return (
    <div className="pt-2">
      <PageHead
        eyebrow={`لوک‌بوک · ${persian(FAMILY_COUNT)} استایل`}
        title="الهام برای"
        accent="نوبت بعدی"
        action={list.length ? <Button variant="secondary" size="sm" icon="play" className="enter mb-3 shrink-0" onClick={() => openDiscover(list[0].id)}>تمام‌صفحه</Button> : undefined}
      />

      <div className="px-gutter pt-5">
        <label className="search">
          <span className="sr-only">جست‌وجوی مدل</span>
          <Icon name="search" size={20} className="text-ink-3" />
          <input id="look-search" value={query} onChange={(event) => setQuery(event.target.value)} type="search" enterKeyHint="search" autoComplete="off" placeholder="باب، پیکسی، بافت، فر، چتری…" />
          {query ? <IconButton icon="close" label="پاک کردن جست‌وجو" size="sm" variant="tonal" onClick={() => setQuery("")} /> : null}
        </label>
      </div>

      <div className="chip-row" data-sticky="" role="toolbar" aria-label="فیلتر گروه‌ها">
        <Chip active={savedOnly} onClick={toggleSaved}>
          <Icon name="heart" size={15} weight={savedOnly ? "fill" : "light"} />
          ذخیره‌ها{favs.length ? ` · ${persian(favs.length)}` : ""}
        </Chip>
        {FILTERS.map((item) => (
          <Chip key={item.key} active={filter === item.key && !savedOnly} onClick={() => setFilter(item.key)}>
            {SHORT[item.key] ?? item.label}
          </Chip>
        ))}
      </div>

      <div className="flex min-h-10 items-center justify-between px-gutter" aria-live="polite">
        <span className="t-caption text-ink-2">
          {savedOnly ? "ذخیره‌ها" : query.trim() ? `«${query.trim()}»` : labelOf(filter)} · <span className="t-numeric">{persian(list.length)}</span> از {persian(FAMILY_COUNT)}
        </span>
        {narrowed ? <Button variant="ghost" size="sm" onClick={clearAll}>نمایش همه</Button> : null}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={savedOnly ? "heart" : "search"}
          title={savedOnly ? "هنوز مدلی ذخیره نکرده‌اید" : "مدلی پیدا نشد"}
          text={savedOnly ? "روی قلب هر مدل بزنید تا اینجا برای مشاوره و رزرو نگه داشته شود." : "عبارت دیگری امتحان کنید یا فیلترها را پاک کنید."}
          action={<Button variant="tonal" onClick={clearAll}>مشاهده همه مدل‌ها</Button>}
        />
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-8 px-gutter sm:grid-cols-3">
          {visible.map((family, index) => {
            const saved = favSet.has(family.id);
            const picked = compareSet.has(family.id);
            return (
              <article key={family.id} className="look-card rise" style={{ animationDelay: `${(index % PAGE_SIZE) * 18}ms` }}>
                <button type="button" className="block w-full text-start" onClick={(event) => openDiscover(family.id, event.currentTarget.querySelector("img"))}>
                  <Media src={lookThumb(family.repId)} alt={family.name} loading="lazy" className="look-card__media" />
                  <h3 className="t-footnote mt-3 line-clamp-2 min-h-11 font-medium">{family.name}</h3>
                  <p className="t-caption mt-0.5 text-ink-3" dir="ltr">{family.code} · {labelOf(family.category)}</p>
                </button>
                <div className="look-card__actions">
                  <IconButton icon="heart" variant="glass" love pressed={saved} label={saved ? `حذف ${family.name} از ذخیره‌ها` : `ذخیره ${family.name}`} onClick={() => { haptic(); toggleFav(family.id); }} />
                  <IconButton
                    icon="compare"
                    variant="glass"
                    pressed={picked}
                    label={picked ? `حذف ${family.name} از مقایسه` : `افزودن ${family.name} به مقایسه`}
                    onClick={() => {
                      haptic();
                      if (toggleCompare(family.id) === "limit") toast("برای مقایسه حداکثر سه مدل انتخاب کنید.");
                    }}
                  />
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
