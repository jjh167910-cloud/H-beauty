import { useMemo, useState } from "react";
import { normalize, persian } from "@/data/catalog";
import { NAIL_STYLES, NAIL_FINISHES, NAIL_COLORS, NAIL_SHAPES, NAIL_LENGTHS, type NailFinish, type NailShape, type NailColor, type NailLength, type NailKind } from "@/data/nail-styles";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { NailVisual } from "../nail-visual";
import { Chip, Button, haptic, useSalonActions } from "../ui";

export function NailsScreen() {
  const { go, openSheet, openBooking } = useSalonActions();
  const [kind,setKind] = useState<NailKind>("manicure");
  const [finish, setFinish] = useState<NailFinish | "all">("all");
  const [shape, setShape] = useState<NailShape | "all">("all");
  const [color, setColor] = useState<NailColor | "all">("all");
  const [length, setLength] = useState<NailLength | "all">("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const favorites = useSalon((state) => state.favNails);
  const toggleFavorite = useSalon((state) => state.toggleFavNail);
  const results = useMemo(() => {
    const q = normalize(query).toLowerCase();
    return NAIL_STYLES.filter((style) =>
      (style.kind ?? "manicure") === kind &&
      (finish === "all" || finish === style.finish) &&
      (shape === "all" || shape === style.shape) &&
      (color === "all" || color === style.color) &&
      (length === "all" || length === style.length) &&
      (!savedOnly || favorites.includes(style.id)) &&
      (!q || normalize(`${style.title} ${style.en} ${style.description}`).toLowerCase().includes(q))
    );
  }, [kind, finish, shape, color, length, savedOnly, favorites, query]);

  const reset = () => {
    setFinish("all"); setShape("all"); setColor("all"); setLength("all"); setSavedOnly(false); setQuery("");
  };

  return (
    <div className="nail-page pt-2">
      <header className="nail-toolbar px-gutter">
        <button type="button" className="nail-toolbar__back" aria-label="بازگشت به خدمات" onClick={() => go("services")}>
          <Icon name="back" size={18} />
        </button>
        <span className="nail-toolbar__label" lang="en">HANANEH / NAIL ATELIER</span>
        <button type="button" className="nail-toolbar__saved" aria-pressed={savedOnly}
          onClick={() => setSavedOnly((value) => !value)} aria-label="طرح‌های ناخن ذخیره‌شده">
          <Icon name="heart" size={19} weight={savedOnly ? "fill" : "light"} />
          <span>{persian(favorites.length)}</span>
        </button>
      </header>

      <section className="nail-intro px-gutter" aria-labelledby="nail-heading">
        <span className="nail-kicker">THE NAIL EDIT · 01</span>
        <h1 id="nail-heading">هنر ناخن، <em>امضای شما.</em></h1>
        <p>ایدهٔ رنگ و فرم موردعلاقه‌تان را انتخاب کنید، ذخیره کنید و برای اجرای طرح با آرتیست سالن مشورت کنید.</p>
      </section>

      <section className="nail-hero px-gutter" aria-label="طرح منتخب ناخن">
        <div className="nail-hero__card">
          <div className="nail-hero__copy">
            <span lang="en">EDITOR'S SELECTION</span>
            <strong>زیبایی در جزئیات است.</strong>
            <p>از نود مینیمال تا فرنچ و کروم؛ گالری اختصاصی ایده‌های ناخن.</p>
            <button type="button" onClick={() => { haptic(); openSheet({ kind:"nail", id:"nail-pearl-chrome" }); }}>
              کشف طرح منتخب <Icon name="chevron" size={17}/>
            </button>
          </div>
          <NailVisual style={NAIL_STYLES[12]} className="nail-hero__art" priority />
        </div>
      </section>

      <section className="nail-filters" aria-label="فیلتر گالری ناخن">
        <div className="nail-filters__top px-gutter">
          <div>
            <span lang="en">THE COLLECTION</span>
            <h2>{kind === "pedicure" ? "گالری پدیکور" : "گالری طراحی ناخن"}</h2>
            <p>{persian(results.length)} طرح از {persian(NAIL_STYLES.filter(item=>(item.kind??"manicure")===kind).length)} ایده</p>
          </div>
          <Button size="sm" variant="tonal" icon="book" onClick={() => openBooking({ service: "luxe-manicure" })}>درخواست نوبت</Button>
        </div>
        <div className="nail-kind-control px-gutter" role="group" aria-label="انتخاب گالری دست یا پا">
          <button type="button" aria-pressed={kind==="manicure"} onClick={()=>{setKind("manicure");reset();}}>مانیکور · ۲۸ طرح</button>
          <button type="button" aria-pressed={kind==="pedicure"} onClick={()=>{setKind("pedicure");reset();}}>پدیکور · ۶ طرح</button>
        </div>
        <label className="nail-search mx-gutter">
          <Icon name="search" size={18} />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="جست‌وجوی رنگ، فرم یا سبک" aria-label="جست‌وجو در گالری ناخن"/>
        </label>
        <div className="nail-filter-label px-gutter">سبک و جلوه</div>
        <div className="chip-row studio-chip-row" role="group" aria-label="فیلتر نوع طراحی ناخن">
          {NAIL_FINISHES.map((option) => (
            <Chip key={option.key} active={finish === option.key} onClick={() => setFinish(option.key)}>{option.title}</Chip>
          ))}
        </div>
        <div className="nail-filter-label px-gutter">فرم ناخن</div>
        <div className="chip-row studio-chip-row" role="group" aria-label="فیلتر فرم ناخن">
          {NAIL_SHAPES.map((option) => (
            <Chip key={option.key} active={shape === option.key} onClick={() => setShape(option.key)}>{option.title}</Chip>
          ))}
        </div>
        <div className="nail-filter-label px-gutter">طول ناخن</div>
        <div className="chip-row studio-chip-row" role="group" aria-label="فیلتر طول ناخن">
          {NAIL_LENGTHS.map((option) => (
            <Chip key={option.key} active={length === option.key} onClick={() => setLength(option.key)}>{option.title}</Chip>
          ))}
        </div>
        <div className="nail-filter-label px-gutter">رنگ</div>
        <div className="chip-row studio-chip-row" role="group" aria-label="فیلتر رنگ ناخن">
          {NAIL_COLORS.map((option) => (
            <Chip key={option.key} active={color === option.key} onClick={() => setColor(option.key)}>{option.title}</Chip>
          ))}
        </div>
      </section>

      <section className="nail-collection px-gutter" aria-label="طرح‌های ناخن">
        {results.length ? (
          <div className="nail-grid">
            {results.map((style, index) => {
              const saved = favorites.includes(style.id);
              return (
                <article className="nail-card" key={style.id}>
                  <button type="button" className="nail-card__open" onClick={() => openSheet({ kind: "nail", id: style.id })}
                    aria-label={`مشاهده طرح ${style.title}`}>
                    <span className="nail-card__picture">
                      <NailVisual style={style} className="nail-card__art"/>
                    </span>
                    <span className="nail-card__info">
                      <small lang="en">{String(index + 1).padStart(2,"0")} / {style.en}</small>
                      <strong>{style.title}</strong>
                      <span>{style.description}</span>
                    </span>
                  </button>
                  <div className="nail-card__footer">
                    <span>نمونه الهام‌بخش</span>
                    <button type="button" className="nail-card__favorite"
                      onClick={() => { haptic(); toggleFavorite(style.id); }}
                      aria-label={saved ? `حذف ${style.title} از علاقه‌مندی‌ها` : `ذخیره طرح ${style.title}`}
                      aria-pressed={saved}>
                      <Icon name="heart" size={19} weight={saved ? "fill" : "light"}/>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="nail-empty" role="status">
            <Icon name="search" size={25} />
            <h3>طرحی با این فیلترها پیدا نشد.</h3>
            <p>رنگ یا فرم را تغییر دهید یا فیلترها را پاک کنید.</p>
            <Button variant="tonal" onClick={reset}>نمایش همه طرح‌ها</Button>
          </div>
        )}
      </section>

      <section className="nail-services px-gutter">
        <div className="nail-services__inner">
          <span lang="en">NAIL SERVICES</span>
          <h2>مانیکور، پدیکور و طراحی اختصاصی</h2>
          <p>برای خدمات زیبایی دست و پا، ژلیش یا اجرای طرح انتخابی درخواست نوبت بدهید. قیمت و زمان نهایی پس از مشاوره مشخص می‌شود.</p>
          <div>
            <Button variant="gold" size="md" onClick={() => openBooking({ service:"nail-art" })}>مشاوره اجرای طرح</Button>
            <Button variant="secondary" size="md" onClick={() => go("services")}>منوی خدمات ناخن</Button>
          </div>
        </div>
      </section>

      <p className="nail-disclaimer px-gutter">تصاویر این مجموعه نمونه‌های الهام‌بخش ساخته‌شده با هوش مصنوعی یا تصویرسازی برداری‌اند؛ عکس اجرای واقعی سالن نیستند. نتیجهٔ نهایی بسته به طول ناخن، رنگ و مواد مصرفی متفاوت خواهد بود.</p>
    </div>
  );
}
