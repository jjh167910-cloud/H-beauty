import { useState } from "react";
import { lookSrc } from "@/data/catalog";
import { SALON } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { Icon, type IconName } from "./icons";
import { BrandMark, Wordmark } from "./logo";
import { Button, Media } from "./ui";

const PROMISES: Array<{ icon: IconName; title: string }> = [
  { icon: "consult", title: "مشاوره خصوصی" },
  { icon: "diamond", title: "اجرای امضادار" },
  { icon: "care", title: "مراقبت پس از سالن" },
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
    <div className="welcome" data-leaving={leaving ? "" : undefined} role="dialog" aria-modal="true" aria-label={`به ${SALON.name} خوش آمدید`}>
      <div className="welcome__inner">
        <div className="enter flex items-center justify-between" style={{ animationDelay: "100ms" }}>
          <BrandMark className="h-12 w-10 text-[1.5rem] text-champagne" />
          <span className="t-latin text-champagne/70">Est. Tehran</span>
        </div>

        <Media src={lookSrc(30)} className="welcome__arch enter" style={{ animationDelay: "200ms" }} />

        <div className="mt-auto pt-4 text-center">
          <p className="t-caption enter text-champagne" style={{ animationDelay: "320ms" }}>به آتلیه زیبایی خوش آمدید</p>
          <div className="enter" style={{ animationDelay: "420ms" }}>
            <Wordmark className="justify-items-center text-[2.9rem] [&_.wordmark__en]:text-white/55" />
          </div>
          <p className="t-callout enter mx-auto mt-2 max-w-[17rem] text-white/70" style={{ animationDelay: "520ms" }}>
            جایی که زیبایی، با دقت و آرامش برای شما طراحی می‌شود.
          </p>

          <ul className="welcome__promises enter mt-5 grid grid-cols-3 border-y border-white/12 py-3" style={{ animationDelay: "640ms" }}>
            {PROMISES.map((item, index) => (
              <li key={item.title} className={index ? "grid justify-items-center gap-1 border-s border-white/12 px-2" : "grid justify-items-center gap-1 px-2"}>
                <Icon name={item.icon} size={20} weight="duotone" className="text-champagne" />
                <span className="t-caption text-white/80">{item.title}</span>
              </li>
            ))}
          </ul>

          <label className="enter mt-4 block" style={{ animationDelay: "780ms" }}>
            <span className="t-caption text-white/55">شما را چه صدا کنیم؟ (اختیاری)</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") enter(); }}
              autoComplete="given-name"
              placeholder="نام شما"
              className="mt-1 w-full border-b border-white/25 bg-transparent py-2.5 text-center text-lg font-light text-white outline-none placeholder:text-white/35 focus:border-champagne focus:shadow-none"
            />
          </label>

          <Button variant="gold" size="lg" block orb className="enter mt-5 justify-between ps-7" style={{ animationDelay: "900ms" }} onClick={enter}>
            ورود به آتلیه
          </Button>
          <p className="t-caption enter mt-3 text-center text-white/45" style={{ animationDelay: "1000ms" }}>اطلاعات شما فقط روی همین دستگاه می‌ماند.</p>
        </div>
      </div>
    </div>
  );
}
