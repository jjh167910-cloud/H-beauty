import { useState } from "react";
import { Check, Clock3, Plus } from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES, formatMinutes, formatPrice, type ServiceCategory } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { Chip, Kicker, haptic, useSalonActions } from "../ui";

export function ServicesScreen() {
  const { openSheet } = useSalonActions();
  const cart = useSalon((state) => state.cart);
  const toggleCart = useSalon((state) => state.toggleCart);
  const [active, setActive] = useState<ServiceCategory | "all">("all");
  const groups = SERVICE_CATEGORIES.filter((category) => active === "all" || category.key === active);

  return (
    <div className="pt-2">
      <section className="rise px-5">
        <h1 className="text-[1.65rem] leading-snug font-bold">خدمات امضادار،<br /><span className="text-accent-deep">با دقتی بی‌نظیر</span></h1>
        <p className="mt-2 text-sm leading-7 text-muted">یک یا چند خدمت را انتخاب کنید و در یک نوبت رزرو کنید.</p>
      </section>

      <div className="chip-bar no-scrollbar">
        <Chip active={active === "all"} onClick={() => setActive("all")}>همه</Chip>
        {SERVICE_CATEGORIES.map((category) => (
          <Chip key={category.key} active={active === category.key} onClick={() => setActive(category.key)}>
            {category.label}
          </Chip>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-1 gap-8 px-5">
        {groups.map((category) => (
          <section key={category.key} className="rise">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-base font-bold">{category.label}</h2>
              <Kicker className="text-[0.58rem] text-muted">{category.en}</Kicker>
            </div>
            <div className="grid gap-2.5">
              {SERVICES.filter((service) => service.category === category.key).map((service) => {
                const picked = cart.includes(service.id);
                return (
                  <article key={service.id} className={cn("service-row", picked && "service-row-picked")}>
                    <button type="button" className="min-w-0 flex-1 text-start" onClick={() => openSheet({ kind: "service", id: service.id })}>
                      <span className="flex items-center gap-2">
                        <strong className="text-[0.92rem]">{service.title}</strong>
                        {service.popular ? <span className="badge">محبوب</span> : null}
                      </span>
                      <span className="mt-1 block text-xs leading-6 text-muted">{service.detail}</span>
                      <span className="mt-2 flex items-center gap-3 text-[0.72rem]">
                        <span className="inline-flex items-center gap-1 text-muted"><Clock3 className="size-3" />{formatMinutes(service.minutes)}</span>
                        <strong className="text-accent-deep">{service.price ? `از ${formatPrice(service.price)} تومان` : formatPrice(null)}</strong>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { haptic(); toggleCart(service.id); }}
                      className={cn("add-btn press", picked && "add-btn-on")}
                      aria-pressed={picked}
                      aria-label={picked ? `حذف ${service.title} از رزرو` : `افزودن ${service.title} به رزرو`}
                    >
                      {picked ? <Check className="size-4" strokeWidth={2.4} /> : <Plus className="size-4" strokeWidth={2.2} />}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
        <p className="text-center text-[0.7rem] leading-6 text-muted">قیمت‌ها شروع از هستند و بر اساس طول و حجم مو در سالن نهایی می‌شوند.</p>
      </div>
    </div>
  );
}
