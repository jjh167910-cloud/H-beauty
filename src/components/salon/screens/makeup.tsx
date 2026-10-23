import { useMemo, useState } from "react";
import { MAKEUP_CATEGORIES, MAKEUP_LOOKS, matchesMakeup, type MakeupCategory } from "@/data/makeup";
import { persian } from "@/data/catalog";
import { useSalon } from "@/lib/salon-store";
import { MakeupArtwork, MAKEUP_FINAL_IMAGES } from "../makeup-artwork";
import { Button, Chip, EmptyState, useSalonActions } from "../ui";
import { Icon } from "../icons";

export function MakeupScreen() {
  const {openSheet,openBooking}=useSalonActions();
  const [category,setCategory]=useState<MakeupCategory|"all">("all");
  const [query,setQuery]=useState("");
  const [savedOnly,setSavedOnly]=useState(false);
  const saved=useSalon(s=>s.makeupFavs);
  const toggle=useSalon(s=>s.toggleMakeupFav);
  const savedSet=useMemo(()=>new Set(saved),[saved]);
  const visible=useMemo(()=>MAKEUP_LOOKS.filter(item=>matchesMakeup(item,query,category,savedOnly,savedSet)),[query,category,savedOnly,savedSet]);
  const reset=()=>{setCategory("all");setQuery("");setSavedOnly(false)};
  const hero=MAKEUP_LOOKS[8];
  return <div className="studio-page makeup-page pt-2">
    <header className="studio-head px-gutter">
      <span className="studio-kicker">MAKEUP ATELIER / حنانه بیوتی</span>
      <h1>گالری <em>میکاپ و زیبایی</em></h1>
      <p>رنگ، بافت و سبک دلخواهتان را پیدا کنید و یک درخواست نوبت با آرتیست ثبت کنید.</p>
    </header>

    <section className="makeup-intro px-gutter" aria-label="معرفی گالری میکاپ">
      <div className="makeup-intro__copy">
        <span lang="en">THE ART OF YOU · 2026</span>
        <h2>چهره‌ای آشنا، سبک‌های تازه</h2>
        <p>{MAKEUP_FINAL_IMAGES ? "۴۸ تصویر اختصاصی از یک مدل ثابت در شش گروه میکاپ؛ جزئیات انتخابی را با آرتیست بررسی کنید." : "یک مدل واقعی، شش گروه میکاپ و پالت‌های پیشنهادی؛ برای اجرای اختصاصی با آرتیست مشورت کنید."}</p>
        <Button variant="gold" onClick={()=>openBooking({service:"event-makeup"})} icon="book">درخواست نوبت میکاپ</Button>
      </div>
      <button className="makeup-intro__portrait" type="button" aria-label={`مشاهده ${hero.name}`} onClick={()=>openSheet({kind:"makeup",id:hero.id})}>
        <MakeupArtwork look={hero}/><span className="makeup-intro__portrait-label">{hero.name}</span>
      </button>
    </section>

    <section className="makeup-search px-gutter" aria-label="جست‌وجوی میکاپ">
      <label className="search">
        <span className="sr-only">جست‌وجوی مدل میکاپ</span>
        <Icon name="search" size={20} className="text-ink-3"/>
        <input value={query} onChange={e=>setQuery(e.target.value)} type="search" enterKeyHint="search"
          placeholder="رزگلد، مات، نچرال، اسموکی..." autoComplete="off"/>
        {query ? <button type="button" aria-label="پاک کردن جست‌وجو" onClick={()=>setQuery("")}>×</button> : null}
      </label>
    </section>
    <div className="chip-row studio-chip-row" role="group" aria-label="دسته‌بندی میکاپ">
      <Chip active={savedOnly} onClick={()=>setSavedOnly(!savedOnly)}>
        <Icon name="heart" size={15} weight={savedOnly?"fill":"regular"}/> ذخیره‌ها · {persian(saved.length)}
      </Chip>
      <Chip active={category==="all"&&!savedOnly} onClick={()=>{setCategory("all");setSavedOnly(false)}}>همه</Chip>
      {MAKEUP_CATEGORIES.map(cat=><Chip key={cat.key} active={category===cat.key&&!savedOnly}
        onClick={()=>{setCategory(cat.key);setSavedOnly(false)}}>{cat.label}</Chip>)}
    </div>

    <div className="makeup-count px-gutter" aria-live="polite">
      <span>{persian(visible.length)} ایده از {persian(MAKEUP_LOOKS.length)}</span>
      {savedOnly||query||category!=="all"? <Button variant="ghost" size="sm" onClick={reset}>پاک کردن فیلتر</Button> : null}
    </div>
    <p className="makeup-editorial-note px-gutter">{MAKEUP_FINAL_IMAGES ? "هر سبک تصویر مستقل و تأییدشده خود را دارد. منشأ واقعی یا ویرایش‌شده تصویر باید به‌درستی مشخص باشد؛ تأیید نوبت پس از مشاوره انجام می‌شود." : "عکس تمام مدل‌ها متعلق به یک چهره مرجع ثابت است؛ سبک‌ها و رنگ‌های پیشنهادی زیر عکس معرفی می‌شوند و عکس، نتیجه هر میکاپ یا نمونه‌کار سالن نیست."}</p>

    {visible.length ? <div className="makeup-grid px-gutter">
      {visible.map((look,index)=>{
        const isSaved=savedSet.has(look.id);
        const cat=MAKEUP_CATEGORIES.find(x=>x.key===look.category);
        return <article key={look.id} className="makeup-card">
          <button type="button" className="makeup-card__view" onClick={()=>openSheet({kind:"makeup",id:look.id})}
            aria-label={`جزئیات ${look.name}`}>
            <div className="makeup-card__art"><MakeupArtwork look={look}/></div>
            <span className="makeup-card__caption">
              <strong>{look.name}</strong>
              <span className="makeup-card__tag">{cat?.label} · {look.finish}</span>
              <span className="makeup-card__palette" aria-label="پالت رنگ پیشنهادی این سبک">
                <i style={{background:look.lid}}/><i style={{background:look.pigment}}/><i style={{background:look.blush}}/>
              </span>
            </span>
          </button>
          <div className="makeup-card__actions">
            <button type="button" aria-pressed={isSaved} aria-label={isSaved?`حذف ${look.name} از ذخیره‌ها`:`ذخیره ${look.name}`}
              onClick={()=>toggle(look.id)}>
              <Icon name="heart" size={17} weight={isSaved?"fill":"regular"}/> {isSaved?"ذخیره شد":"ذخیره"}
            </button>
            <button type="button" onClick={()=>openBooking({service:look.serviceId,makeupId:look.id})}
              aria-label={`درخواست نوبت برای ${look.name}`}>
              <Icon name="book" size={16}/> درخواست
            </button>
          </div>
        </article>;
      })}
    </div> : <EmptyState icon="search" title={savedOnly?"هنوز میکاپی ذخیره نکرده‌اید":"سبکی پیدا نشد"}
      text={savedOnly?"از زیر هر تصویر، گزینه ذخیره را انتخاب کنید.":"فیلتر یا عبارت جست‌وجو را تغییر دهید."}
      action={<Button variant="tonal" onClick={reset}>نمایش همه ایده‌ها</Button>}/>}
    <section className="makeup-end px-gutter">
      <h2>میکاپ اختصاصی برای شما</h2>
      <p>انتخاب تصاویر فقط برای الهام است. نوع پوست، رنگ دلخواه و جزئیات مراسم در مشاوره نهایی مشخص می‌شوند.</p>
      <Button variant="gold" orb onClick={()=>openBooking({service:"natural-makeup"})}>درخواست مشاوره و نوبت</Button>
    </section>
  </div>;
}
