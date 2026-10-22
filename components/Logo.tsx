import { MARK_FILL, MARK_HOLE, MARK_OUTER, MARK_STROKE, MARK_VIEWBOX } from "@/lib/brand";
import { company } from "@/lib/i18n";

/**
 * Spectrum Peak belgisi (vektor). Ranglar CSS o'zgaruvchilaridan olinadi:
 * yorug' fonda asl gradient, `.dark` yoki `.mark-on-dark` ichida yorqinroq variant.
 */
export function BrandMark({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} role="img" aria-label={company.brand}>
      <defs>
        <linearGradient id={`${id}-f`} x1="0" y1="35" x2="0" y2="968" gradientUnits="userSpaceOnUse">
          {MARK_FILL.map(([o], i) => (
            <stop key={o} offset={o} style={{ stopColor: `var(--mark-f${i})` }} />
          ))}
        </linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="35" x2="0" y2="968" gradientUnits="userSpaceOnUse">
          {MARK_STROKE.map(([o], i) => (
            <stop key={o} offset={o} style={{ stopColor: `var(--mark-s${i})` }} />
          ))}
        </linearGradient>
        <path id={`${id}-p`} d={`${MARK_OUTER} ${MARK_HOLE}`} />
        <clipPath id={`${id}-c`}>
          <use href={`#${id}-p`} />
        </clipPath>
      </defs>
      <use href={`#${id}-p`} fill={`url(#${id}-f)`} stroke={`url(#${id}-s)`} strokeWidth="36" clipPath={`url(#${id}-c)`} />
    </svg>
  );
}

export function Logo({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${inverted ? "mark-on-dark" : ""} ${className}`}>
      <BrandMark id={inverted ? "mark-ft" : "mark-hd"} className="h-8 w-auto shrink-0 sm:h-9" />
      <span className="leading-none">
        <span className={`flex items-baseline gap-1.5 whitespace-nowrap text-[17px] font-semibold tracking-[-0.02em] sm:text-[19px] ${inverted ? "text-white" : ""}`}>
          {company.brand}
          <span className={`hidden text-[13px] font-medium tracking-normal sm:inline ${inverted ? "text-white/60" : "text-muted"}`}>LLC</span>
        </span>
        <span className={`mt-1 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] ${inverted ? "block text-white/55" : "hidden text-muted sm:block"}`}>
          Analytical Solutions
        </span>
      </span>
    </span>
  );
}
