import { createContext, useContext, useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { X } from "lucide-react";
import { Drawer } from "vaul";
import { cn } from "@/lib/cn";
import type { Tab } from "@/lib/salon-store";

export type SheetState =
  | { kind: "look"; id: number }
  | { kind: "discover"; id: number }
  | { kind: "service"; id: string }
  | { kind: "booking" }
  | { kind: "compare" }
  | { kind: "consult" }
  | { kind: "finder" }
  | null;

/** `services` replaces the cart (rebooking); `service` adds one service to it. */
export type BookingIntent = { service?: string; services?: string[]; stylist?: string; lookId?: number };

export type SalonActions = {
  go: (tab: Tab) => void;
  openSheet: (sheet: Exclude<SheetState, null>) => void;
  openBooking: (intent?: BookingIntent) => void;
  /** Opens the immersive feed; pass the tapped image to morph it into place. */
  openDiscover: (id: number, from?: HTMLElement | null) => void;
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
        "press inline-flex items-center justify-center gap-2 rounded-full px-6 text-sm font-medium tracking-wide transition duration-200",
        size === "lg" ? "min-h-14 text-[0.95rem]" : "min-h-12",
        "disabled:cursor-default disabled:opacity-40 disabled:shadow-none",
        tone === "solid" && "bg-ink text-on-ink shadow-[0_14px_30px_-10px_rgb(20_14_10_/_0.45)]",
        tone === "accent" && "foil text-[#1a140e] shadow-[0_14px_30px_-10px_rgb(150_110_60_/_0.55)]",
        tone === "ghost" && "border border-foreground/15 bg-transparent text-foreground",
        tone === "soft" && "bg-soft text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-brand text-[0.7rem] font-semibold tracking-[0.28em] text-accent-deep uppercase", className)} dir="ltr">
      {children}
    </p>
  );
}

export function SectionHead({ title, kicker, index, action }: { title: string; kicker?: string; index?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 px-6">
      <div>
        {kicker ? (
          <p className="flex items-center gap-2 font-brand text-[0.7rem] tracking-[0.28em] text-accent-deep uppercase" dir="ltr">
            {index ? <span className="italic tracking-normal">{index}</span> : null}
            {index ? <span className="h-px w-5 bg-accent/50" /> : null}
            {kicker}
          </p>
        ) : null}
        <h2 className="mt-1.5 text-[1.4rem] leading-snug font-light tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/** Hairline rule with a centred diamond — the atelier's signature divider. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("ornament", className)} aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  );
}

/** Circular engraved text seal. */
export function Seal({ text, className, children }: { text: string; className?: string; children?: ReactNode }) {
  const id = `seal${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <span className={cn("seal", className)} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="seal-ring" direction="ltr">
        <defs>
          <path id={id} d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
        </defs>
        <text>
          <textPath href={`#${id}`} startOffset="0">{text}</textPath>
        </text>
      </svg>
      <span className="seal-core" dir="ltr">{children}</span>
    </span>
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

export function Monogram({ name, tone, className, arch }: { name: string; tone: string; className?: string; arch?: boolean }) {
  return (
    <span className={cn("relative grid place-items-center overflow-hidden bg-gradient-to-b font-display text-white", arch ? "arch" : "rounded-full", tone, className)}>
      <span className="monogram-sheen" />
      <span className="relative">{name.slice(0, 1)}</span>
    </span>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="mx-6 flex flex-col items-center px-6 py-14 text-center">
      <span className="arch grid h-20 w-16 place-items-center border border-accent/40 text-accent-deep">{icon}</span>
      <p className="mt-5 text-lg font-light">{title}</p>
      <p className="mt-1.5 max-w-xs text-sm leading-7 text-muted">{text}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
