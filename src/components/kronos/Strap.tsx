import type { StrapId } from "./watch-layers";
import alligator from "@/assets/watch-alligator.png";
import titanium from "@/assets/watch-titanium.png";
import milanese from "@/assets/watch-milanese.png";

export const STRAPS: { id: StrapId; name: string; note: string; price: number }[] = [
  { id: "alligator", name: "Matte Alligator", note: "Hand-stitched Mississippi alligator, gold pin buckle", price: 0 },
  { id: "titanium", name: "Brushed Titanium", note: "Integrated Grade 5 bracelet, hidden folding clasp", price: 6800 },
  { id: "milanese", name: "Milanese Mesh", note: "Hand-woven steel mesh, micro-adjust slider", price: 3200 },
];
export const WATCH_IMAGES: Record<StrapId, string> = { alligator, titanium, milanese };

/** Complete raster watch preserves the natural case-to-lug-to-strap junction. */
export function Strap({ type, className = "", priority = false }: { type: StrapId; className?: string; priority?: boolean }) {
  const name = STRAPS.find((s) => s.id === type)?.name ?? type;
  return <img src={WATCH_IMAGES[type]} alt={`Calibre 01 with ${name} strap`} width={1024} height={1536} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} draggable={false} className={`watch-photograph object-contain ${className}`} />;
}
