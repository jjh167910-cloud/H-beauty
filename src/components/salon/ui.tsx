import { createContext, useContext, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SalonActions = {
  openLook: (id: number) => void;
  openCompare: () => void;
  openConsult: () => void;
  openBooking: () => void;
  openAnalyzer: () => void;
  go: (anchor: string) => void;
  applyFilter: (key: string) => void;
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

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "solid" | "ghost" | "accent" | "soft";
};

export function Button({ tone = "soft", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "btn inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition duration-200",
        "disabled:cursor-default disabled:opacity-40",
        tone === "solid" && "bg-foreground text-surface shadow-[0_10px_24px_rgb(38_34_30_/_0.16)] hover:bg-[#3b342e] active:scale-[0.98]",
        tone === "accent" && "bg-accent text-on-accent shadow-[0_10px_24px_rgb(163_123_70_/_0.2)] hover:bg-accent-deep active:scale-[0.98]",
        tone === "ghost" && "border border-border bg-surface text-foreground hover:border-accent/50 hover:bg-soft active:scale-[0.98]",
        tone === "soft" && "bg-soft text-foreground hover:bg-[#eae2d8] active:scale-[0.98]",
        className,
      )}
      {...props}
    />
  );
}

export function IconButton({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn("grid size-11 place-items-center rounded-2xl text-muted transition duration-200 hover:bg-soft hover:text-foreground active:scale-95", className)} {...props} />;
}

export function Overline({ children }: { children: string }) {
  return <p className="text-xs font-semibold tracking-[0.16em] text-accent-deep uppercase">{children}</p>;
}

export function SectionHead({ kicker, title, text, action }: { kicker: string; title: string; text?: string; action?: ReactNode }) {
  return <div className="mb-5 flex items-end justify-between gap-4"><div><Overline>{kicker}</Overline><h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">{title}</h2>{text ? <p className="mt-2 text-sm text-muted">{text}</p> : null}</div>{action}</div>;
}

export function TextLink({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn("shrink-0 text-sm font-bold text-accent-deep underline-offset-4 hover:underline", className)} {...props} />;
}
