import { useState } from "react";
import { SERVICES, SERVICE_CATEGORIES, formatMinutes, formatPrice, type ServiceCategory } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { Icon } from "../icons";
import { Button, Chip, Ornament, haptic, useSalonActions } from "../ui";

export function ServicesScreen() {
  const { openSheet, openBooking } = useSalonActions();
  const cart = useSalon((state) => state.cart);
  const toggleCart = useSalon((state) => state.toggleCart);
  const [active, setActive] = useState<ServiceCategory | "all">("all");
  const groups = SERVICE_CATEGORIES.filter((category) => active === "all" || category.key === active);
  const featured = SERVICES.find((service) => service.popular);

  return (
    <div className="studio-page studio-services pt-2">
      <header className="studio-head px-gutter">
        <span className="studio-kicker"><span className="studio-line" /> HANANEH · SERVICE MENU</span>
        <span className="studio-count">01 / ATELIER</span>
        <h1>هنرِ رسیدگی <em>به شما</em></h1>
        <p>از فرم مو تا رنگ و مراقبت؛ خدمات را کشف کنید، جزئیات هر آیتم را ببینید و درخواست خودتان را بسازید.</p>
      </header>

      {featured ? (
        <section className="px-gutter">
          <div className="studio-feature studio-feature--service">
            <span className="studio-feature__edition" lang="en">SIGNATURE RITUAL / 001</span>
            <span className="studio-feature__ring" aria-hidden="true" />
            <div className="studio-feature__copy">
              <span className="studio-feature__overline">منتخب مجموعه</span>
              <h2>{featured.title}</h2>
              <p>{featured.detail}</p>
              <Button variant="gold" orb onClick={() => openSheet({ kind: "service", id: featured.id })}>جزئیات این خدمت</Button>
            </div>
          </div>
        </section>
      ) : null}

      <section aria-label="دسته‌های خدمات">
        <div className="studio-section-title px-gutter">
          <span>کشف مجموعه</span>
          <small lang="en">CURATED SERVICES</small>
        </div>
        <div className="chip-row studio-chip-row" data-sticky="" role="group" aria-label="دسته‌بندی خدمات">
          <Chip active={active === "all"} onClick={() => setActive("all")}>همه خدمات</Chip>
          {SERVICE_CATEGORIES.map((category) => (
            <Chip key={category.key} active={active === category.key} onClick={() => setActive(category.key)}>
              {category.label}
            </Chip>
          ))}
        </div>
      </section>

      <div className="studio-service-groups px-gutter">
        {groups.map((category, groupIndex) => {
          const services = SERVICES.filter((service) => service.category === category.key);
          return (
            <section key={category.key} className="studio-service-group" aria-labelledby={`category-${category.key}`}>
              <header className="studio-group-head">
                <span className="studio-group-head__number">{String(groupIndex + 1).padStart(2, "0")}</span>
                <div>
                  <p lang="en">{category.en}</p>
                  <h2 id={`category-${category.key}`}>{category.label}</h2>
                </div>
                <span className="studio-group-head__rule" aria-hidden="true" />
              </header>
              <div className="studio-service-list">
                {services.map((service, index) => {
                  const selected = cart.includes(service.id);
                  return (
                    <article className="studio-service-item" key={service.id} data-selected={selected ? "" : undefined}>
                      <button className="studio-service-item__details" onClick={() => openSheet({ kind: "service", id: service.id })} type="button">
                        <span className="studio-service-item__index" lang="en">{String(index + 1).padStart(2, "0")}</span>
                        <span className="studio-service-item__content">
                          <span className="studio-service-item__en" lang="en">{service.en}</span>
                          <strong>{service.title}</strong>
                          <span className="studio-service-item__description">{service.detail}</span>
                          <span className="studio-service-item__meta"><Icon name="clock" size={14} />{formatMinutes(service.minutes)}</span>
                        </span>
                        <span className="studio-service-item__price">
                          <strong>{service.price ? formatPrice(service.price) : "مشاوره"}</strong>
                          {service.price ? <small>تومان · از</small> : null}
                        </span>
                      </button>
                      <button
                        className="studio-service-item__add"
                        type="button"
                        aria-label={selected ? `حذف ${service.title} از انتخاب‌ها` : `افزودن ${service.title} به انتخاب‌ها`}
                        aria-pressed={selected}
                        onClick={() => { haptic(); toggleCart(service.id); }}
                      >
                        <Icon name={selected ? "check" : "plus"} size={18} weight="regular" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="studio-service-footer px-gutter">
        <Ornament />
        <p>قیمت‌ها برآورد «شروع از» هستند و پس از بررسی شرایط مو در سالن مشخص می‌شوند. همه خدمات قابل درخواست‌اند؛ تأیید نوبت توسط سالن انجام می‌شود.</p>
        <Button variant="gold" orb onClick={() => openBooking()}>ساخت درخواست نوبت</Button>
      </section>
    </div>
  );
}
