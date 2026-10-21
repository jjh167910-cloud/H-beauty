import { Check, Clock3, Plus, Wallet } from "lucide-react";
import { toast } from "sonner";
import { SERVICE_CATEGORIES, STYLISTS, formatMinutes, formatPrice, type Service } from "@/data/salon";
import { useSalon } from "@/lib/salon-store";
import { Button, Kicker, Monogram, Sheet, haptic, useSalonActions } from "../ui";

export function ServiceSheet({ open, service, onClose }: { open: boolean; service: Service; onClose: () => void }) {
  const { openBooking } = useSalonActions();
  const picked = useSalon((state) => state.cart.includes(service.id));
  const toggleCart = useSalon((state) => state.toggleCart);
  const category = SERVICE_CATEGORIES.find((item) => item.key === service.category);
  const artists = STYLISTS.filter((stylist) => stylist.focus.includes(service.category));

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={category?.label ?? "خدمت"}
      footer={
        <div className="flex gap-2">
          <Button
            tone="ghost"
            size="lg"
            onClick={() => {
              haptic();
              const added = toggleCart(service.id);
              toast(added ? "به رزرو اضافه شد." : "از رزرو حذف شد.");
            }}
            aria-pressed={picked}
          >
            {picked ? <Check className="size-5" /> : <Plus className="size-5" />}
            {picked ? "انتخاب شد" : "افزودن"}
          </Button>
          <Button tone="accent" size="lg" className="flex-1" onClick={() => openBooking({ service: service.id })}>
            رزرو این خدمت
          </Button>
        </div>
      }
    >
      <div className="px-6 pb-6">
        <Kicker>{service.en}</Kicker>
        <h2 className="mt-1.5 text-2xl font-light tracking-tight">{service.title}</h2>
        <p className="mt-2 text-sm leading-7 text-muted">{service.detail}</p>
        <div className="mt-6 grid grid-cols-2 border-y border-foreground/10">
          <div className="py-4 pe-4"><Clock3 className="size-4 text-accent" strokeWidth={1.4} /><p className="mt-2 text-[0.7rem] text-muted">مدت تقریبی</p><p className="text-sm">{formatMinutes(service.minutes)}</p></div>
          <div className="border-s border-foreground/10 py-4 ps-4"><Wallet className="size-4 text-accent" strokeWidth={1.4} /><p className="mt-2 text-[0.7rem] text-muted">شروع قیمت</p><p className="text-sm">{service.price ? `${formatPrice(service.price)} تومان` : formatPrice(null)}</p></div>
        </div>
        <h3 className="mt-6 text-sm font-medium">شامل</h3>
        <ul className="mt-3 grid gap-2.5">
          {service.includes.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm"><span className="size-1.5 shrink-0 rotate-45 border border-accent" />{item}</li>
          ))}
        </ul>
        {artists.length ? (
          <>
            <h3 className="mt-6 text-sm font-medium">آرتیست‌های این خدمت</h3>
            <div className="mt-3 grid gap-2">
              {artists.map((stylist) => (
                <button key={stylist.id} type="button" className="press flex items-center gap-3 rounded-full p-1.5 pe-4 text-start shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-foreground)_10%,transparent)]" onClick={() => openBooking({ service: service.id, stylist: stylist.id })}>
                  <Monogram name={stylist.name} tone={stylist.tone} className="size-10 text-lg" />
                  <span className="flex-1"><strong className="block text-sm">{stylist.name}</strong><small className="text-xs text-muted">{stylist.role}</small></span>
                  <span className="text-xs font-medium text-accent-deep">رزرو</span>
                </button>
              ))}
            </div>
          </>
        ) : null}
        <p className="mt-6 text-[0.7rem] leading-6 text-muted">قیمت نهایی پس از بررسی طول، حجم و سابقه رنگ مو در سالن اعلام می‌شود.</p>
      </div>
    </Sheet>
  );
}
