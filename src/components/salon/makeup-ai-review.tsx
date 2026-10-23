import { useMemo, useState } from "react";
import catalog from "@/data/makeup-ai-40.json";
import "./makeup-ai-review.css";

type AiLook = (typeof catalog.looks)[number];
const categoryLabels: Record<string,string> = {
  natural:"نچرال", soft:"سافت گلم", evening:"مجلسی",
  bridal:"عروس", eyes:"آرایش چشم", lips:"آرایش لب"
};
const categories = ["all","natural","soft","evening","bridal","eyes","lips"] as const;
const stagedAssetsPresent = import.meta.env.VITE_HB_AI_CANDIDATES_PRESENT === "true";

export function MakeupAiReview() {
  const [active, setActive] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all"|"candidate"|"missing">("all");
  const [broken, setBroken] = useState<Record<string,boolean>>({});
  const [selected, setSelected] = useState<AiLook|null>(null);

  const looks = useMemo(() => catalog.looks.filter(look => {
    if (active !== "all" && look.category !== active) return false;
    if (status === "candidate" && !look.candidate) return false;
    if (status === "missing" && look.candidate) return false;
    return [look.nameFa,look.slug,look.description,look.id]
      .some(value => value.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  }),[active,search,status]);

  const modalImage = selected && selected.asset && stagedAssetsPresent && !broken[selected.id] ? selected.asset : null;
  return (
    <section className="hb-ai-shell" dir="rtl" aria-label="آرشیو بررسی چهل سبک میکاپ">
      <header className="hb-ai-hero">
        <p className="hb-ai-eyebrow" lang="en">HANANEH BEAUTY · EDITORIAL ATELIER</p>
        <h1>گالری اختصاصی <em>میکاپ</em></h1>
        <p>۴۰ سبک مشخص، یک چهره مرجع. این مجموعه برای بازبینی داخلی است و عکس‌های هوش مصنوعی، نمونه‌کار واقعی سالن محسوب نمی‌شوند.</p>
        <div className="hb-ai-stats">
          <span><strong>۴۰</strong> سبک برنامه‌ریزی‌شده</span>
          <span><strong>۲۲</strong> فایل پیشنهادی در بسته بازبینی</span>
          <span><strong>۱۸</strong> تصویر باقی‌مانده</span>
          <span><strong>۰</strong> تصویر تأییدشده برای انتشار</span>
        </div>
      </header>
      <div className="hb-ai-toolbar">
        <div className="hb-ai-filters" aria-label="فیلتر گروه">
          {categories.map(key => <button type="button" key={key} onClick={()=>setActive(key)}
            aria-pressed={active===key} className={active===key?"is-selected":""}>{key==="all"?"همه":categoryLabels[key]}</button>)}
        </div>
        <div className="hb-ai-controls">
          <label className="hb-ai-search-label">جستجوی سبک
            <input aria-label="جستجوی سبک میکاپ" value={search} onChange={e=>setSearch(e.target.value)} placeholder="نام یا ویژگی میکاپ…" />
          </label>
          <select aria-label="وضعیت فایل" value={status} onChange={e=>setStatus(e.target.value as "all"|"candidate"|"missing")}>
            <option value="all">همه وضعیت‌ها</option>
            <option value="candidate">تصاویر نامزد بررسی</option>
            <option value="missing">تصاویر تهیه‌نشده</option>
          </select>
        </div>
      </div>
      <p className="hb-ai-result" role="status">{looks.length.toLocaleString("fa-IR")} سبک نمایش داده می‌شود · هنوز هیچ تصویری مجوز انتشار نگرفته است.</p>
      <div className="hb-ai-grid">
        {looks.map(look=>{
          const ready = look.candidate && !!look.asset && stagedAssetsPresent && !broken[look.id];
          return <button key={look.id} className="hb-ai-look" type="button" onClick={()=>setSelected(look)}
            aria-label={`جزئیات میکاپ ${look.nameFa}`}>
            <div className="hb-ai-photo">
              {ready ? <img src={look.asset!} alt={`پرتره پیشنهادی هوش مصنوعی برای ${look.nameFa}`} loading="lazy"
                onError={()=>setBroken(s=>({...s,[look.id]:true}))} /> :
                <div className="hb-ai-placeholder" aria-label="تصویر در نسخه بازبینی حاضر نیست">
                  <span className="hb-ai-placeholder-icon" aria-hidden="true">✦</span>
                  <span>{look.candidate?"فایل در بسته بازبینی آفلاین":"در انتظار تصویر اختصاصی"}</span>
                </div>}
            </div>
            <div className="hb-ai-look-copy">
              <span className="hb-ai-look-number">{look.id.slice(-2)}</span>
              <span className="hb-ai-look-title">{look.nameFa}</span>
            </div>
            <div className="hb-ai-look-bottom">
              <small>{categoryLabels[look.category]??look.category}</small>
              <small className={look.candidate?"hb-ai-review-status":"hb-ai-missing-status"}>{look.candidate?"نامزد بازبینی":"تصویر موجود نیست"}</small>
            </div>
          </button>;
        })}
      </div>
      {looks.length===0 && <p className="hb-ai-none">سبکی با این فیلتر پیدا نشد.</p>}
      <p className="hb-ai-disclaimer">تصاویر این مجموعه الهام‌های ساخته‌شده با هوش مصنوعی هستند، نه عکس قبل/بعد یا سند انجام خدمات سالن. تأیید هویت چهره، تفاوت واقعی سبک‌ها و حق انتشار پیش از عرضه الزامی است.</p>
      {selected && <div className="hb-ai-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}>
        <section className="hb-ai-detail" role="dialog" aria-modal="true" aria-labelledby="hb-ai-modal-title">
          <button className="hb-ai-close" type="button" onClick={()=>setSelected(null)} aria-label="بستن">×</button>
          {modalImage ? <img src={modalImage} alt={selected.nameFa} onError={()=>setBroken(s=>({...s,[selected.id]:true}))} /> : <div className="hb-ai-detail-empty">تصویر برای نمایش در این شاخه هنوز افزوده نشده است.</div>}
          <div className="hb-ai-detail-copy">
            <p lang="en" className="hb-ai-eyebrow">LOOK {selected.id.slice(-2)}</p>
            <h2 id="hb-ai-modal-title">{selected.nameFa}</h2>
            <p>{selected.description}</p>
            <strong>وضعیت: {selected.candidate?"نامزد بازبینی، تأیید نشده":"تصویر در دست تهیه"}</strong>
          </div>
        </section>
      </div>}
    </section>
  );
}
