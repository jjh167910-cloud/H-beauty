import { useCallback, useEffect, useMemo, useState } from "react";
import { normalize, persian } from "@/data/catalog";
import { NAIL_ATLAS_FAMILIES } from "@/data/nail-expansion";
import { NAIL_STYLES, NAIL_COUNTS, NAIL_FINISHES, NAIL_COLORS, NAIL_SHAPES, NAIL_LENGTHS, type NailFinish, type NailShape, type NailColor, type NailLength, type NailKind } from "@/data/nail-styles";
import { nailKindFromHash } from "@/data/nail-links";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { NailVisual, NAIL_CUSTOMER_PHOTOS } from "../nail-visual";
import { NailCompareSheet } from "../sheets/nail-compare";
import { Chip, Button, haptic, useSalonActions } from "../ui";

const PAGE_SIZE = 24;

export function NailsScreen() {
  const { go, openSheet, openBooking } = useSalonActions();
  const [kind,setKind] = useState<NailKind>(() => nailKindFromHash(window.location.hash));
  const featuredId=kind==="pedicure" ? "pedi-french" : "nail-pearl-chrome";
  const featured=NAIL_STYLES.find(item=>item.id===featuredId)!;
  const [family,setFamily] = useState("all");
  const [finish, setFinish] = useState<NailFinish | "all">("all");
  const [shape, setShape] = useState<NailShape | "all">("all");
  const [color, setColor] = useState<NailColor | "all">("all");
  const [length, setLength] = useState<NailLength | "all">("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [photoOnly,setPhotoOnly] = useState(false);
  // Owner-selected temporarily displayed photos are separate from the strict
  // professional editorial photo gates. Track failed image loads per device.
  // A source whitelist alone cannot prove that a WebP is reachable
  // on this device. Keep a session-only record of failed asset requests.
  const [unavailablePhotos,setUnavailablePhotos] = useState<Set<string>>(()=>new Set());
  const markPhotoUnavailable=useCallback((id:string)=>{
    setUnavailablePhotos(previous=>{
      if(previous.has(id))return previous;
      const updated=new Set(previous);
      updated.add(id);
      return updated;
    });
  },[]);
  const [query, setQuery] = useState("");
  const [visibleCount,setVisibleCount] = useState(PAGE_SIZE);
  const [order,setOrder] = useState<"curated" | "alphabetical">("curated");
  const [compareIds,setCompareIds] = useState<string[]>([]);
  const [compareOpen,setCompareOpen] = useState(false);
  const toggleCompare=(id:string)=>{
    setCompareIds(previous=>previous.includes(id)
      ? previous.filter(item=>item!==id)
      : previous.length<2 ? [...previous,id] : previous);
  };
  const selectedForCompare = compareIds
    .map(id=>NAIL_STYLES.find(item=>item.id===id))
    .filter((style): style is (typeof NAIL_STYLES)[number]=>Boolean(style));
  useEffect(()=>{setCompareIds([]);setCompareOpen(false);},[kind]);
  const favorites = useSalon((state) => state.favNails);
  const toggleFavorite = useSalon((state) => state.toggleFavNail);
  const familyOptions = NAIL_ATLAS_FAMILIES[kind];
  const photographicCount = NAIL_STYLES.filter(style=>
    (style.kind ?? "manicure")===kind &&
    Boolean(NAIL_CUSTOMER_PHOTOS[style.id]) &&
    !unavailablePhotos.has(style.id)
  ).length;
  const activeFamily = familyOptions.find(item=>item.key===family);
  const results = useMemo(() => {
    const q = normalize(query).toLowerCase();
    const filtered = NAIL_STYLES.filter((style) =>
      (style.kind ?? "manicure") === kind &&
      (!activeFamily || style.id.startsWith(activeFamily.prefix)) &&
      (finish === "all" || finish === style.finish) &&
      (shape === "all" || shape === style.shape) &&
      (color === "all" || color === style.color) &&
      (length === "all" || length === style.length) &&
      (!savedOnly || favorites.includes(style.id)) &&
      (!photoOnly || (Boolean(NAIL_CUSTOMER_PHOTOS[style.id]) && !unavailablePhotos.has(style.id))) &&
      (!q || normalize(`${style.title} ${style.en} ${style.description}`).toLowerCase().includes(q))
    );
    if(order==="alphabetical") return [...filtered].sort((a,b)=>a.title.localeCompare(b.title,"fa"));
    return filtered;
  }, [kind, activeFamily, finish, shape, color, length, savedOnly, photoOnly, unavailablePhotos, favorites, query, order]);
  useEffect(()=>setVisibleCount(PAGE_SIZE),[kind,family,finish,shape,color,length,savedOnly,photoOnly,query,order]);
  const visible = results.slice(0,visibleCount);

  const reset = () => {
    setFamily("all"); setFinish("all"); setShape("all"); setColor("all"); setLength("all"); setSavedOnly(false); setPhotoOnly(false); setQuery(""); setOrder("curated"); setVisibleCount(PAGE_SIZE);
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
            <strong>{kind==="pedicure" ? "پدیکور، ظرافت در هر قدم." : "زیبایی در جزئیات است."}</strong>
            <p>{kind==="pedicure" ? "از فرنچ ظریف تا رنگ‌های کلاسیک؛ ایده‌های زیبایی ناخن پا." : "از نود مینیمال تا فرنچ و کروم؛ گالری اختصاصی ایده‌های ناخن."}</p>
            <button type="button" onClick={() => { haptic(); openSheet({ kind:"nail", id:featuredId }); }}>
              کشف طرح منتخب <Icon name="chevron" size={17}/>
            </button>
          </div>
          <NailVisual style={featured} className="nail-hero__art" priority onPhotoUnavailable={markPhotoUnavailable} />
        </div>
      </section>

      <section className="nail-filters" aria-label="فیلتر گالری ناخن">
        <div className="nail-filters__top px-gutter">
          <div>
            <span lang="en">THE COLLECTION</span>
            <h2>{kind === "pedicure" ? "گالری پدیکور" : "گالری طراحی ناخن"}</h2>
            <p>{persian(results.length)} طرح از {persian(NAIL_COUNTS[kind])} ایده</p>
          </div>
          <Button size="sm" variant="tonal" icon="book" onClick={() => openBooking({ service: kind==="pedicure" ? "classic-pedicure" : "luxe-manicure" })}>درخواست نوبت</Button>
        </div>
        <div className="nail-kind-control px-gutter" role="group" aria-label="انتخاب گالری دست یا پا">
          <button type="button" aria-pressed={kind==="manicure"} onClick={()=>{setKind("manicure");reset();}}>مانیکور · {persian(NAIL_COUNTS.manicure)} طرح</button>
          <button type="button" aria-pressed={kind==="pedicure"} onClick={()=>{setKind("pedicure");reset();}}>پدیکور · {persian(NAIL_COUNTS.pedicure)} طرح</button>
        </div>
        <label className="nail-search mx-gutter">
          <Icon name="search" size={18} />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="جست‌وجوی رنگ، فرم یا سبک" aria-label="جست‌وجو در گالری ناخن"/>
        </label>
        <div className="nail-photo-refine px-gutter" role="group" aria-label="نوع پیش‌نمایش ناخن">
          <div className="nail-photo-refine__description">
            <strong>نوع تصویر</strong>
            <span>{photographicCount
              ? `${persian(photographicCount)} مرجع عکاسی الهام‌بخش در این مجموعه`
              : kind==="pedicure"
                ? "در این مجموعه هنوز عکسِ تأییدشده نداریم؛ همه طرح‌ها تصویرسازی‌اند."
                : "عکس‌های تأییدشده در این دستگاه بارگذاری نشدند؛ پیش‌نمایش برداری در دسترس است."}</span>
          </div>
          <button type="button"
            aria-label="فقط طرح‌های دارای عکس الهام‌بخش"
            aria-pressed={photoOnly}
            disabled={photographicCount===0 && !photoOnly}
            onClick={()=>setPhotoOnly(value=>!value)}
            className="nail-photo-refine__toggle">
            {photoOnly ? "نمایش همه" : "فقط عکس‌ها"}
          </button>
        </div>
        <div className="nail-filter-label nail-filter-label--family px-gutter">
          <span>مجموعه‌های تخصصی</span>
          <span className="nail-filter-label__hint">{persian(familyOptions.length)} مجموعه · {kind==="pedicure"?"۶":"۱۲"} رنگ‌بندی در هر مجموعه</span>
        </div>
        <div className="chip-row studio-chip-row nail-families" role="group" aria-label="فیلتر مجموعه طراحی ناخن">
          <Chip active={family==="all"} onClick={()=>setFamily("all")}>همه مجموعه‌ها</Chip>
          {familyOptions.map(option=>(
            <Chip key={option.key} active={family===option.key} onClick={()=>setFamily(option.key)}>{option.title}</Chip>
          ))}
        </div>
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
        <div className="nail-compare-picker" aria-label="انتخاب طرح برای مقایسه">
          <div className="nail-compare-picker__copy">
            <strong>مقایسه دو طرح</strong>
            <span role="status" aria-live="polite">
              {persian(compareIds.length)} از ۲ طرح انتخاب شده
            </span>
          </div>
          <div className="nail-compare-picker__actions">
            {compareIds.length>0 ? (
              <button type="button" className="nail-compare-picker__clear"
                onClick={()=>setCompareIds([])}>پاک کردن</button>
            ) : null}
            <button type="button" className="nail-compare-picker__open"
              disabled={selectedForCompare.length!==2} onClick={()=>setCompareOpen(true)}>
              <Icon name="compare" size={17}/>
              مقایسه طرح‌ها
            </button>
          </div>
        </div>
        <div className="nail-collection__toolbar" role="group" aria-label="ترتیب و تعداد طرح‌ها">
          <span aria-live="polite">{persian(visible.length)} از {persian(results.length)} طرح</span>
          <label>چیدمان
            <select aria-label="چیدمان طرح‌ها" value={order} onChange={(e)=>setOrder(e.target.value as "curated"|"alphabetical")}>
              <option value="curated">منتخب آتلیه</option>
              <option value="alphabetical">نام فارسی</option>
            </select>
          </label>
        </div>
        {results.length ? (
          <div className="nail-grid">
            {visible.map((style, index) => {
              const saved = favorites.includes(style.id);
              return (
                <article className="nail-card" key={style.id} data-compared={compareIds.includes(style.id) ? "" : undefined}>
                  <button type="button" className="nail-card__open" onClick={() => openSheet({ kind: "nail", id: style.id })}
                    aria-label={`مشاهده طرح ${style.title}`}>
                    <span className="nail-card__picture">
                      <NailVisual style={style} className="nail-card__art" priority={photoOnly} onPhotoUnavailable={markPhotoUnavailable}/>
                    </span>
                    <span className="nail-card__info">
                      <small lang="en">{String(index + 1).padStart(2,"0")} / {style.en}</small>
                      <strong>{style.title}</strong>
                      <span className="nail-card__media-type">
                        <span className="nail-card__media-type--photo">عکس الهام‌بخشِ ساخته‌شده با هوش مصنوعی</span>
                        <span className="nail-card__media-type--illustration">تصویرسازی طرح</span>
                      </span>
                      <span>{style.description}</span>
                    </span>
                  </button>
                  <div className="nail-card__footer">
                    <button type="button" className="nail-card__compare"
                      aria-pressed={compareIds.includes(style.id)}
                      disabled={compareIds.length===2 && !compareIds.includes(style.id)}
                      aria-label={compareIds.includes(style.id)
                        ? `حذف ${style.title} از مقایسه`
                        : `مقایسه طرح ${style.title}`}
                      onClick={()=>{haptic();toggleCompare(style.id);}}>
                      <Icon name="compare" size={17}/>
                      <span>{compareIds.includes(style.id)?"انتخاب‌شده":"مقایسه"}</span>
                    </button>
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
        {results.length > visibleCount ? (
          <div className="nail-more">
            <div className="nail-more__track" aria-hidden="true"><span style={{width:`${Math.round(100*visible.length/results.length)}%`}} /></div>
            <p>نمایش {persian(visible.length)} از {persian(results.length)} طرح</p>
            <button type="button" onClick={()=>setVisibleCount(current=>current+PAGE_SIZE)}>
              نمایش طرح‌های بیشتر <Icon name="chevron" size={18}/>
            </button>
          </div>
        ) : null}
      </section>

      <section className="nail-services px-gutter">
        <div className="nail-services__inner">
          <span lang="en">NAIL SERVICES</span>
          <h2>مانیکور، پدیکور و طراحی اختصاصی</h2>
          <p>برای خدمات زیبایی دست و پا، ژلیش یا اجرای طرح انتخابی درخواست نوبت بدهید. قیمت و زمان نهایی پس از مشاوره مشخص می‌شود.</p>
          <div>
            <Button variant="gold" size="md" onClick={() => openBooking({ service:kind==="pedicure" ? "gel-pedicure" : "nail-art" })}>مشاوره اجرای طرح</Button>
            <Button variant="secondary" size="md" onClick={() => go("services")}>منوی خدمات ناخن</Button>
          </div>
        </div>
      </section>

      {selectedForCompare.length===2 ? (
        <NailCompareSheet
          open={compareOpen}
          first={selectedForCompare[0]}
          second={selectedForCompare[1]}
          onClose={()=>setCompareOpen(false)}
        />
      ) : null}
      <p className="nail-disclaimer px-gutter">تصاویر این مجموعه نمونه‌های الهام‌بخش ساخته‌شده با هوش مصنوعی یا تصویرسازی برداری‌اند؛ عکس اجرای واقعی سالن نیستند. نتیجهٔ نهایی بسته به طول ناخن، رنگ و مواد مصرفی متفاوت خواهد بود.</p>
    </div>
  );
}
