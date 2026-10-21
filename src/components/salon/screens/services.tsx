import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES, formatMinutes, formatPrice, type ServiceCategory } from "@/data/salon";
import { cn } from "@/lib/cn";
import { useSalon } from "@/lib/salon-store";
import { Chip, Ornament, haptic, useSalonActions } from "../ui";

export function ServicesScreen() {
  const { openSheet } = useSalonActions();
  const cart = useSalon((state) => state.cart);
  const toggleCart = useSalon((state) => state.toggleCart);
  const [active, setActive] = useState<ServiceCategory | "all">("all");
  const groups = SERVICE_CATEGORIES.filter((category) => active === "all" || category.key === active);

  return (
    <div className="pt-4">
      <section className="px-6">
        <p className="reveal font-brand text-[0.7rem] tracking-[0.3em] text-accent-deep" dir="ltr">THE ATELIER MENU</p>
        <h1 className="reveal mt-3 text-[2.2rem] leading-[1.35] font-extralight tracking-tight" style={{ animationDelay: "80ms" }}>
          ریچوال‌های
          <br />
          <span className="font-display text-[2.4rem] text-accent-deep">امضادار</span>
        </h1>
        <p className="reveal mt-3 max-w-xs text-[0.82rem] leading-7 text-muted" style={{ animationDelay: "140ms" }}>یک یا چند ریچوال را انتخاب کنید تا در یک نوبت برایتان آماده شود.</p>
      </section>

      <div className="chip-bar no-scrollbar">
        <Chip active={active === "all"} onClick={() => setActive("all")}>همه</Chip>
        {SERVICE_CATEGORIES.map((category) => (
          <Chip key={category.key} active={active === category.key} onClick={() => setActive(category.key)}>
            {category.label}
          </Chip>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-12 px-6">
        {groups.map((category, groupIndex) => (
          <section key={category.key} className="reveal" style={{ animationDelay: `${groupIndex * 60}ms` }}>
            <div className="mb-2 flex items-baseline justify-between border-b border-foreground/80 pb-2.5">
              <h2 className="text-lg font-normal">{category.label}</h2>
              <span className="font-brand text-[0.66rem] tracking-[0.28em] text-muted" dir="ltr">{category.en}</span>
            </div>
            {SERVICES.filter((service) => service.category === category.key).map((service) => {
              const picked = cart.includes(service.id);
              return (
                <article key={service.id} className="flex items-start gap-4 border-b border-foreground/10 py-5">
                  <button type="button" className="press min-w-0 flex-1 text-start" onClick={() => openSheet({ kind: "service", id: service.id })}>
                    <span className="flex items-baseline gap-2">
                      <strong className="text-[0.98rem] font-normal">{service.title}</strong>
                      <span className="menu-leader translate-y-[-0.2rem]" />
                      <span className="shrink-0 text-[0.82rem] text-accent-deep tabular-nums">{service.price ? formatPrice(service.price) : "مشاوره"}</span>
                    </span>
                    <span className="mt-1.5 block text-[0.78rem] leading-6 text-muted">{service.detail}</span>
                    <span className="mt-2 flex items-center gap-2 text-[0.7rem] text-muted">
                      <span className="font-brand tracking-[0.18em]" dir="ltr">{service.en}</span>
                      <span className="size-0.5 rounded-full bg-muted" />
                      <span>{formatMinutes(service.minutes)}</span>
                      {service.popular ? <><span className="size-0.5 rounded-full bg-muted" /><span className="text-accent-deep">انتخاب آرتیست‌ها</span></> : null}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { haptic(); toggleCart(service.id); }}
                    className={cn("add-btn press mt-0.5", picked && "add-btn-on")}
                    aria-pressed={picked}
                    aria-label={picked ? `حذف ${service.title} از رزرو` : `افزودن ${service.title} به رزرو`}
                  >
                    {picked ? <Check className="size-4" strokeWidth={2} /> : <Plus className="size-4" strokeWidth={1.5} />}
                  </button>
                </article>
              );
            })}
          </section>
        ))}
        <div>
          <Ornament />
          <p className="mt-4 text-center text-[0.7rem] leading-6 text-muted">قیمت‌ها به تومان و «شروع از» هستند؛<br />مبلغ نهایی پس از بررسی مو در سالن اعلام می‌شود.</p>
        </div>
      </div>
    </div>
  );
}
