import { createContext, useContext, type ButtonHTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import { Drawer } from "vaul";
import { cn } from "@/lib/cn";
import type { Tab } from "@/lib/salon-store";

export type SheetState =
  | { kind: "look"; id: number }
  | { kind: "service"; id: string }
  | { kind: "booking" }
  | { kind: "compare" }
  | { kind: "consult" }
  | { kind: "finder" }
  | null;

export type BookingIntent = { service?: string; stylist?: string; lookId?: number };

export type SalonActions = {
  go: (tab: Tab) => void;
  openSheet: (sheet: Exclude<SheetState, null>) => void;
  openBooking: (intent?: BookingIntent) => void;
  closeSheet: () => void;
};

const SalonContext = createContext<SalonActions | null>(null);

export function SalonProvider({ value, children }: { value: SalonActions; children: ReactNode }) {
  return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>;
}

export function useSalonActions() {
  const value = useContext(SalonContext);
  if (!value) throw new Error("Salon actions missing");
  return value;
}

/** Light haptic tick on devices that support it. */
export function haptic() {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* unsupported */
  }
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "solid" | "ghost" | "accent" | "soft";
  size?: "md" | "lg";
};

export function Button({ tone = "soft", size = "md", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition duration-200",
        size === "lg" ? "min-h-14 text-[0.95rem]" : "min-h-12",
        "disabled:cursor-default disabled:opacity-40 disabled:shadow-none",
        tone === "solid" && "bg-ink text-on-ink shadow-[0_12px_28px_rgb(20_14_10_/_0.22)]",
        tone === "accent" && "gold-fill text-on-accent shadow-[0_12px_28px_rgb(150_110_60_/_0.28)]",
        tone === "ghost" && "border border-border bg-surface text-foreground",
        tone === "soft" && "bg-soft text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-brand text-[0.68rem] font-semibold tracking-[0.22em] text-accent-deep uppercase", className)} dir="ltr">
      {children}
    </p>
  );
}

export function SectionHead({ title, kicker, action }: { title: string; kicker?: string; action?: ReactNode }) {
  return (
    <div className="mb-3.5 flex items-end justify-between gap-4 px-5">
      <div>
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <h2 className="mt-0.5 text-lg font-bold">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function TextLink({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn("min-h-10 shrink-0 text-[0.8rem] font-semibold text-accent-deep", className)} {...props} />;
}

export function Chip({ active, className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return <button type={type} aria-pressed={active} className={cn("chip", active && "chip-active", className)} {...props} />;
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  full,
  bare,
  leading,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  full?: boolean;
  bare?: boolean;
  leading?: ReactNode;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }} repositionInputs={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="sheet-overlay fixed inset-0 z-50" />
        <Drawer.Content className={cn("sheet", full && "sheet-full")} aria-describedby={undefined}>
          <div className="sheet-handle" aria-hidden="true" />
          {bare ? (
            <Drawer.Title className="sr-only">{title}</Drawer.Title>
          ) : (
            <div className="sheet-head">
              <div className="flex min-w-0 items-center gap-1">
                {leading}
                <Drawer.Title className="truncate text-[0.95rem] font-bold">{title}</Drawer.Title>
              </div>
              <Drawer.Close className="icon-btn" aria-label="بستن">
                <X className="size-[18px]" />
              </Drawer.Close>
            </div>
          )}
          <div className="sheet-body">{children}</div>
          {footer ? <div className="sheet-foot">{footer}</div> : null}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function Monogram({ name, tone, className }: { name: string; tone: string; className?: string }) {
  return (
    <span className={cn("grid place-items-center rounded-full bg-gradient-to-br font-display text-white shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.25)]", tone, className)}>
      {name.slice(0, 1)}
    </span>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="mx-5 flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-soft text-accent-deep">{icon}</span>
      <p className="mt-4 font-bold">{title}</p>
      <p className="mt-1.5 max-w-xs text-sm leading-7 text-muted">{text}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
