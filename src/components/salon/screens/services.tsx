import { useState } from "react";
import { SERVICES, SERVICE_CATEGORIES, formatMinutes, formatPrice, type ServiceCategory } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { Chip, IconButton, Ornament, PageHead, haptic, useSalonActions } from "../ui";

export function ServicesScreen() {
  const { openSheet } = useSalonActions();
  const cart = useSalon((state) => state.cart);
  const toggleCart = useSalon((state) => state.toggleCart);
  const [active, setActive] = useState<ServiceCategory | "all">("all");
  const groups = SERVICE_CATEGORIES.filter((category) => active === "all" || category.key === active);

  return (
    <div className="pt-2">
      <PageHead eyebrow="منوی آتلیه" title="ریچوال‌های" accent="امضادار" lead="یک یا چند ریچوال را انتخاب کنید تا در یک نوبت برایتان آماده شود." />

      <div className="chip-row mt-5" data-sticky="" role="toolbar" aria-label="دسته‌بندی خدمات">
        <Chip active={active === "all"} onClick={() => setActive("all")}>همه</Chip>
        {SERVICE_CATEGORIES.map((category) => (
          <Chip key={category.key} active={active === category.key} onClick={() => setActive(category.key)}>
            <Icon name={category.key} size={16} weight={active === category.key ? "fill" : "light"} />
            {category.label}
          </Chip>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-12 px-gutter">
        {groups.map((category, groupIndex) => (
          <section key={category.key} className="rise" style={{ animationDelay: `${groupIndex * 60}ms` }}>
            <div className="mb-1 flex items-center gap-3 border-b border-ink pb-3">
              <span className="list-row__icon size-9"><Icon name={category.key} size={18} weight="duotone" /></span>
              <h2 className="t-title-3 flex-1">{category.label}</h2>
              <span className="t-latin text-ink-3">{category.en}</span>
            </div>
            {SERVICES.filter((service) => service.category === category.key).map((service) => {
              const picked = cart.includes(service.id);
              return (
                <article key={service.id} className="flex items-start gap-4 border-b border-line py-5">
                  <button type="button" className="min-w-0 flex-1 text-start" onClick={() => openSheet({ kind: "service", id: service.id })}>
                    <span className="flex items-baseline gap-2">
                      <strong className="t-headline font-normal">{service.title}</strong>
                      <span className="leader" />
                      <span className="t-footnote shrink-0 text-gold-ink">{service.price ? formatPrice(service.price) : "مشاوره"}</span>
                    </span>
                    <span className="t-footnote mt-1 block text-ink-2">{service.detail}</span>
                    <span className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="badge" data-tone="neutral"><Icon name="clock" size={12} />{formatMinutes(service.minutes)}</span>
                      {service.popular ? <span className="badge"><Icon name="diamond" size={12} weight="fill" />انتخاب آرتیست‌ها</span> : null}
                    </span>
                  </button>
                  <IconButton
                    icon={picked ? "check" : "plus"}
                    label={picked ? `حذف ${service.title} از رزرو` : `افزودن ${service.title} به رزرو`}
                    pressed={picked}
                    onClick={() => { haptic(); toggleCart(service.id); }}
                  />
                </article>
              );
            })}
          </section>
        ))}
        <div>
          <Ornament />
          <p className="t-caption mt-4 text-center text-ink-2">قیمت‌ها به تومان و «شروع از» هستند؛<br />مبلغ نهایی پس از بررسی مو در سالن اعلام می‌شود.</p>
        </div>
      </div>
    </div>
  );
}
