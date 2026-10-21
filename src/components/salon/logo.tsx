export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="63" height="63" rx="21" stroke="currentColor" strokeWidth="1.25" />
      <path d="M23 19.5v33M49 19.5v33" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M23 37c6-5.4 20-5.4 26 0" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M28.5 23.5c3.6-3.5 8.6-4.6 13.1-2.8 2.1.8 3.9 2.3 5.1 4.2" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M25.3 48.2c4.2 3.8 10.3 5 15.7 3 2.4-.9 4.4-2.5 5.9-4.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <circle cx="36" cy="36" r="2.4" fill="currentColor" />
    </svg>
  );
}
