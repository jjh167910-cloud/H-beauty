import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { lookSrc } from "@/data/catalog";
import { SALON } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { LogoMark } from "./logo";

const PROMISES = [
  { n: "I", title: "مشاوره خصوصی", text: "فرم چهره، جنس مو و سبک زندگی شما" },
  { n: "II", title: "اجرای امضادار", text: "آرتیست‌های ارشد، مواد درجه‌یک" },
  { n: "III", title: "مراقبت پس از سالن", text: "روتین اختصاصی برای ماندگاری" },
];

/** First-launch concierge welcome. */
export function Welcome() {
  const welcome = useSalon((state) => state.welcome);
  const setProfile = useSalon((state) => state.setProfile);
  const [name, setName] = useState("");
  const [leaving, setLeaving] = useState(false);

  function enter() {
    if (name.trim()) setProfile({ name: name.trim() });
    setLeaving(true);
    window.setTimeout(welcome, 420);
  }

  return (
    <div className={`welcome ${leaving ? "welcome-leave" : ""}`} role="dialog" aria-modal="true" aria-label={`به ${SALON.name} خوش آمدید`}>
      <div className="welcome-inner">
        <div className="reveal flex items-center justify-between" style={{ animationDelay: "100ms" }}>
          <LogoMark className="size-11 text-champagne" />
          <span className="font-brand text-[0.68rem] tracking-[0.35em] text-champagne/80" dir="ltr">EST. TEHRAN</span>
        </div>

        <div className="welcome-arch reveal" style={{ animationDelay: "180ms" }}>
          <img src={lookSrc(30)} alt="" />
        </div>

        <div className="mt-auto pt-5 text-center">
          <p className="reveal font-brand text-base italic text-champagne" dir="ltr" style={{ animationDelay: "320ms" }}>Haute Beauté Atelier</p>
          <h1 className="reveal font-display text-[3rem] leading-[1.2] text-white" style={{ animationDelay: "420ms" }}>حنانه</h1>
          <p className="reveal mx-auto mt-2 max-w-[17rem] text-[0.9rem] leading-7 font-light text-white/70" style={{ animationDelay: "520ms" }}>
            جایی که زیبایی، با دقت و آرامش برای شما طراحی می‌شود.
          </p>

          <ul className="welcome-promises reveal mt-5 grid grid-cols-3 border-y border-white/12 py-3" style={{ animationDelay: "640ms" }}>
            {PROMISES.map((item, index) => (
              <li key={item.n} className={index ? "border-s border-white/12 px-2" : "px-2"} title={item.text}>
                <span className="block font-brand text-sm italic text-champagne" dir="ltr">{item.n}</span>
                <span className="mt-0.5 block text-[0.72rem] text-white/80">{item.title}</span>
              </li>
            ))}
          </ul>

          <label className="reveal mt-4 block" style={{ animationDelay: "780ms" }}>
            <span className="text-[0.7rem] tracking-wide text-white/55">شما را چه صدا کنیم؟ (اختیاری)</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") enter(); }}
              autoComplete="given-name"
              placeholder="نام شما"
              className="mt-1 w-full border-b border-white/25 bg-transparent py-2.5 text-center text-lg font-light text-white outline-none placeholder:text-white/35 focus:border-champagne"
            />
          </label>

          <button type="button" onClick={enter} className="reveal press foil mt-5 flex min-h-14 w-full items-center justify-between rounded-full ps-7 pe-2 text-[0.95rem] font-medium text-[#1a140e]" style={{ animationDelay: "900ms" }}>
            ورود به آتلیه
            <span className="grid size-10 place-items-center rounded-full bg-[#1a140e] text-champagne"><ArrowLeft className="size-4" /></span>
          </button>
          <p className="reveal mt-4 text-center text-[0.65rem] text-white/45" style={{ animationDelay: "1000ms" }}>اطلاعات شما فقط روی همین دستگاه می‌ماند.</p>
        </div>
      </div>
    </div>
  );
}
