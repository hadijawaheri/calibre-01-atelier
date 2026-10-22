/** Photographic layered stage. Contract stays { progress: MotionValue<0..1>, strap }. */
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useState, type PointerEvent } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LAYERS, type LayerDef, type StrapId } from "./watch-layers";
import { Strap } from "./Strap";
import { ATELIER_TRANSITION } from "./motion";

function Layer({ layer, progress, active, setActive }: { layer: LayerDef; progress: MotionValue<number>; active: string | null; setActive: (id: string | null) => void }) {
  const offset = layer.index - 2.5;
  const x = useTransform(progress, p => p * offset * 24);
  const y = useTransform(progress, p => p * offset * 49);
  const z = useTransform(progress, p => (2.5 - layer.index) * p * 38);
  const scale = useTransform(progress, [0, 1], [0.95, 0.77]);
  const rotateX = useTransform(progress, [0, 1], [0, 48]);
  const rotateZ = useTransform(progress, [0, 1], [0, -18]);
  const opacity = useTransform(progress, [0.06, 0.28], [0, 1]);
  const hotOpacity = useTransform(progress, [0.35, 0.65], [0, 1]);
  const [enabled, setEnabled] = useState(false);
  useMotionValueEvent(progress, "change", p => setEnabled(p > 0.35));
  return <motion.div className="watch-layer pointer-events-none absolute left-[25%] top-[25%] h-1/2 w-1/2" style={{ x, y, z, scale, rotateX, rotateZ, opacity, zIndex: 10 - layer.index }}>
    <img src={layer.image} alt={layer.name} width={512} height={512} className={`watch-component h-full w-full object-contain ${layer.id === "crystal" ? "opacity-40" : ""}`} draggable={false} />
    <motion.div className="absolute z-10" style={{ left: `${layer.hotspot.x}%`, top: `${layer.hotspot.y}%`, opacity: hotOpacity }}><Button variant="outline" size="icon" tabIndex={enabled ? 0 : -1} disabled={!enabled} aria-label={layer.hotspot.title} aria-pressed={active === layer.id} onClick={() => setActive(active === layer.id ? null : layer.id)} className="pointer-events-auto h-7 w-7 rounded-full border-gold/50 bg-background/90 text-gold"><Plus /></Button></motion.div>
  </motion.div>;
}

export function ExplodedView({ progress, strap = "alligator" }: { progress: MotionValue<number>; strap?: StrapId }) {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  useMotionValueEvent(progress, "change", p => { if (p < 0.35) setActive(null); });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const reduced = useReducedMotion();
  const rotateY = useTransform(mx, x => reduced ? 0 : x * 5);
  const rotateX = useTransform(my, y => reduced ? 0 : -y * 3);
  const assembledOpacity = useTransform(progress, [0, 0.25], [1, 0]);
  const assembledScale = useTransform(progress, [0, 0.3], [1, 0.96]);
  const current = LAYERS.find(l => l.id === active);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    cx.set(e.clientX - r.left); cy.set(e.clientY - r.top);
    setHovered(true);
    animate(mx, (e.clientX - r.left) / r.width - 0.5, { ...ATELIER_TRANSITION, duration: reduced ? 0 : 0.8 });
    animate(my, (e.clientY - r.top) / r.height - 0.5, { ...ATELIER_TRANSITION, duration: reduced ? 0 : 0.8 });
  };
  return <div className="watch-studio flagship-watch relative h-full w-full" onPointerMove={move} onPointerLeave={() => { setHovered(false); animate(mx, 0, ATELIER_TRANSITION); animate(my, 0, ATELIER_TRANSITION); }}>
    <motion.div className="watch-stage absolute inset-0" style={{ rotateX, rotateY }}><motion.div className="pointer-events-none absolute inset-0" style={{ opacity: assembledOpacity, scale: assembledScale }}><Strap type={strap} priority className="h-full w-full" /></motion.div>{[...LAYERS].reverse().map(layer => <Layer key={layer.id} layer={layer} progress={progress} active={active} setActive={setActive} />)}</motion.div>
    <motion.div aria-hidden="true" initial={{ opacity: 0 }} className="inspection-cursor pointer-events-none absolute left-0 top-0 z-30" style={{ x: cx, y: cy }} animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }} transition={ATELIER_TRANSITION}><span>Inspect</span></motion.div>
    <AnimatePresence>{current && <motion.div key={current.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={ATELIER_TRANSITION} className="layer-caption absolute bottom-0 left-1/2 z-20 w-[min(92%,360px)] -translate-x-1/2 border border-gold/30 bg-background/95 p-5 backdrop-blur" role="status"><div className="flex items-center justify-between gap-3"><p className="eyebrow">0{current.index + 1} / Detail</p><Button variant="ghost" size="icon" onClick={() => setActive(null)} aria-label="Close detail"><X /></Button></div><p className="mt-2">{current.hotspot.title}</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{current.hotspot.body}</p></motion.div>}</AnimatePresence>
  </div>;
}
