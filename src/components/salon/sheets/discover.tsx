import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { CalendarPlus, ChevronUp, Columns2, Heart, Info, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { diverseOrder, families, labelOf, lookSrc, lookThumb, matchesFamily, persian, type Family } from "@/data/catalog";
import { SALON } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { shareText } from "@/lib/share";
import { haptic, useSalonActions } from "../ui";

const HINT_KEY = "hananeh-discover-hint";

function serviceFor(family: Family) {
  return family.category === "updo" || family.category === "braid" ? "event-styling" : family.tags.includes("color") ? "bespoke-balayage" : "signature-cut";
}

/** Full-screen, vertically snapping feed of looks — swipe up for the next, double-tap to save. */
export function Discover({ open, startId, onClose }: { open: boolean; startId: number; onClose: () => void }) {
  const { openSheet, openBooking } = useSalonActions();
  const filter = useSalon((state) => state.filter);
  const query = useSalon((state) => state.query);
  const savedOnly = useSalon((state) => state.savedOnly);
  const favs = useSalon((state) => state.favs);
  const compare = useSalon((state) => state.compare);
  const toggleFav = useSalon((state) => state.toggleFav);
  const toggleCompare = useSalon((state) => state.toggleCompare);
  const scroller = useRef<HTMLDivElement>(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [hint, setHint] = useState(() => {
    try {
      return !localStorage.getItem(HINT_KEY);
    } catch {
      return false;
    }
  });

  // Snapshot the list once so saving a look doesn't reshuffle the feed.
  const list = useMemo(() => {
    const favSet = new Set(useSalon.getState().favs);
    const filtered = diverseOrder(families.filter((family) => matchesFamily(family, query, filter, savedOnly, favSet)));
    return filtered.some((family) => family.id === startId) ? filtered : diverseOrder(families);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [active, setActive] = useState(() => Math.max(0, list.findIndex((family) => family.id === startId)));

  useLayoutEffect(() => {
    const node = scroller.current;
    if (node) node.scrollTop = active * node.clientHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function onScroll() {
    const node = scroller.current;
    if (!node) return;
    const index = Math.round(node.scrollTop / node.clientHeight);
    if (index !== active) {
      setActive(index);
      if (hint) {
        setHint(false);
        try {
          localStorage.setItem(HINT_KEY, "1");
        } catch {
          /* ignore */
        }
      }
    }
  }

  function onTap(event: PointerEvent<HTMLDivElement>, family: Family) {
    const now = performance.now();
    const { time, x, y } = lastTap.current;
    const near = Math.hypot(event.clientX - x, event.clientY - y) < 40;
    lastTap.current = { time: now, x: event.clientX, y: event.clientY };
    if (now - time > 320 || !near) return;
    lastTap.current.time = 0;
    haptic();
    if (!useSalon.getState().favs.includes(family.id)) toggleFav(family.id);
    const id = now;
    setHearts((current) => [...current, { id, x: event.clientX, y: event.clientY }]);
    window.setTimeout(() => setHearts((current) => current.filter((heart) => heart.id !== id)), 900);
  }

  async function share(family: Family) {
    const result = await shareText(`${family.name} (${family.code}) — لوک‌بوک ${SALON.name}`);
    if (result === "copied") toast("نام و کد مدل کپی شد.");
  }

  const current = list[active];

  return (
    <div className={cn("discover", !open && "discover-closed")} role="dialog" aria-modal="true" aria-label="کاوش لوک‌ها">
      <div ref={scroller} className="discover-scroll no-scrollbar" onScroll={onScroll}>
        {list.map((family, index) => {
          const near = Math.abs(index - active) <= 2;
          // Only slides around the active one carry content; the rest are empty snap stops.
          if (!near) return <section key={family.id} className="discover-slide" aria-hidden="true" />;
          const saved = favs.includes(family.id);
          const picked = compare.includes(family.id);
          return (
            <section key={family.id} className="discover-slide" aria-roledescription="اسلاید" aria-label={`${persian(index + 1)} از ${persian(list.length)}: ${family.name}`}>
              <img className="discover-ambient" src={lookThumb(family.repId)} alt="" aria-hidden="true" />
              <div className="discover-stage" onPointerUp={(event) => onTap(event, family)}>
                <div className="discover-frame" data-morph={family.id === startId ? "" : undefined}>
                  <img src={lookThumb(family.repId)} alt={family.name} draggable={false} />
                  {index === active ? <img className="discover-full" src={lookSrc(family.repId)} alt="" aria-hidden="true" draggable={false} onLoad={(event) => event.currentTarget.classList.add("is-loaded")} /> : null}
                </div>
              </div>

              <div className="discover-info">
                <p className="font-brand text-xs tracking-[0.3em] text-champagne" dir="ltr">{family.code} · {labelOf(family.category).toUpperCase()}</p>
                <h2 className="mt-1.5 font-display text-[1.9rem] leading-tight text-white">{family.name}</h2>
                <div className="mt-4 flex gap-2">
                  <button type="button" className="press foil inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-medium text-[#1a140e]" onClick={() => openBooking({ service: serviceFor(family), lookId: family.id })}>
                    <CalendarPlus className="size-4" /> رزرو این استایل
                  </button>
                  <button type="button" className="press glass-dark inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm text-white" onClick={() => openSheet({ kind: "look", id: family.id })}>
                    <Info className="size-4" /> جزئیات
                  </button>
                </div>
              </div>

              <div className="discover-rail">
                <button type="button" className={cn("discover-action press", saved && "discover-action-on")} aria-pressed={saved} aria-label={saved ? "حذف از ذخیره‌ها" : "ذخیره"} onClick={() => { haptic(); toggleFav(family.id); }}>
                  <Heart className={cn("size-[22px]", saved && "fill-current")} strokeWidth={1.6} />
                </button>
                <button type="button" className={cn("discover-action press", picked && "discover-action-on")} aria-pressed={picked} aria-label={picked ? "حذف از مقایسه" : "افزودن به مقایسه"} onClick={() => { haptic(); if (toggleCompare(family.id) === "limit") toast("برای مقایسه حداکثر سه مدل انتخاب کنید."); }}>
                  <Columns2 className="size-[22px]" strokeWidth={1.6} />
                </button>
                <button type="button" className="discover-action press" aria-label="اشتراک‌گذاری" onClick={() => share(family)}>
                  <Share2 className="size-[22px]" strokeWidth={1.6} />
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <div className="discover-top">
        <button type="button" className="glass-dark press grid size-11 place-items-center rounded-full text-white" onClick={onClose} aria-label="بستن">
          <X className="size-5" strokeWidth={1.6} />
        </button>
        <div className="discover-progress" aria-hidden="true">
          <span style={{ width: `${((active + 1) / list.length) * 100}%` }} />
        </div>
        <span className="glass-dark rounded-full px-3 py-1.5 text-xs text-white tabular-nums" aria-live="polite">
          {persian(active + 1)} / {persian(list.length)}
        </span>
      </div>

      {hint && current ? (
        <div className="discover-hint" aria-hidden="true">
          <ChevronUp className="size-5" />
          <span>برای مدل بعدی بالا بکشید · دو ضربه برای ذخیره</span>
        </div>
      ) : null}

      {hearts.map((heart) => (
        <Heart key={heart.id} className="heart-burst" style={{ left: heart.x, top: heart.y }} fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  );
}
