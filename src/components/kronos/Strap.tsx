import type { StrapId } from "./watch-layers";

export const STRAPS: { id: StrapId; name: string; note: string; price: number }[] = [
  { id: "alligator", name: "Matte Alligator", note: "Hand-stitched Mississippi alligator, gold pin buckle", price: 0 },
  { id: "titanium", name: "Brushed Titanium", note: "Integrated Grade 5 bracelet, hidden folding clasp", price: 6800 },
  { id: "milanese", name: "Milanese Mesh", note: "Hand-woven steel mesh, micro-adjust slider", price: 3200 },
];

/** Vertical strap ribbon rendered behind the case. */
export function Strap({ type, className = "" }: { type: StrapId; className?: string }) {
  const fill =
    type === "alligator"
      ? "url(#croc)"
      : type === "titanium"
        ? "url(#links)"
        : "url(#mesh)";
  return (
    <svg viewBox="0 0 120 400" className={className} preserveAspectRatio="none">
      <defs>
        <pattern id="croc" width="14" height="10" patternUnits="userSpaceOnUse">
          <rect width="14" height="10" className="fill-onyx" />
          <rect x="1" y="1" width="12" height="8" rx="3" className="fill-card stroke-foreground/5" />
        </pattern>
        <pattern id="links" width="120" height="22" patternUnits="userSpaceOnUse">
          <rect width="120" height="22" className="fill-titanium/60" />
          <rect x="2" y="1" width="36" height="20" className="fill-titanium/80" />
          <rect x="42" y="1" width="36" height="20" className="fill-titanium" />
          <rect x="82" y="1" width="36" height="20" className="fill-titanium/80" />
        </pattern>
        <pattern id="mesh" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" className="fill-titanium/40" />
          <path d="M0 4 L4 0" className="stroke-titanium" strokeWidth="0.8" />
        </pattern>
      </defs>
      <path d="M14 0 L106 0 L100 400 L20 400 Z" fill={fill} />
      {type === "alligator" && (
        <>
          <path d="M18 0 L22 400" className="stroke-gold/30" strokeWidth="0.6" strokeDasharray="3 3" />
          <path d="M102 0 L98 400" className="stroke-gold/30" strokeWidth="0.6" strokeDasharray="3 3" />
        </>
      )}
    </svg>
  );
}
