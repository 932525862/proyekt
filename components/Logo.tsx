/** Belgi — benzol halqasi (oltiburchak) ichida aromatik doira */
export function Logo({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden="true">
        <path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5z" fill="var(--accent)" />
        <path d="M20 9.5 29.1 14.75v10.5L20 30.5 10.9 25.25v-10.5z" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="20" cy="20" r="4.6" fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.85" />
        <circle cx="29.1" cy="14.75" r="2.2" fill="var(--signal)" />
      </svg>
      <span className="leading-none">
        <span className={`block text-[19px] font-semibold tracking-[-0.02em] ${inverted ? "text-white" : ""}`}>NovaLab</span>
        <span className={`mt-1 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] ${inverted ? "block text-white/55" : "hidden text-muted sm:block"}`}>
          Analytical Solutions
        </span>
      </span>
    </span>
  );
}
