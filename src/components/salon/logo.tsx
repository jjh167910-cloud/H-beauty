import { cn } from "@/lib/cn";

/** Brand mark: the atelier arch framing a calligraphic ح. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-grid place-items-center text-gold", className)} aria-hidden="true">
      <svg viewBox="0 0 40 48" className="absolute inset-0 size-full" fill="none">
        <path d="M3 46V20C3 10.6 10.6 3 20 3s17 7.6 17 17v26H3Z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6.5 43V20.5C6.5 13 12.5 6.8 20 6.8S33.5 13 33.5 20.5V43" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      </svg>
      <span className="relative mt-[18%] font-calligraphy text-[1em] leading-none">ح</span>
    </span>
  );
}

/** Wordmark: «حنانه بیوتی» in Nastaliq above HANANEH BEAUTY in Bodoni. */
export function Wordmark({ className, latin = true }: { className?: string; latin?: boolean }) {
  return (
    <span className={cn("wordmark", className)}>
      <span className="wordmark__fa">حنانه بیوتی</span>
      {latin ? <span className="wordmark__en" lang="en">HANANEH BEAUTY</span> : null}
    </span>
  );
}
