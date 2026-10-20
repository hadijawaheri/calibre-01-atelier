/** Photographic layered stage. Public contract stays { progress: MotionValue<0..1>, strap }. */
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useState, type MouseEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LAYERS, type LayerDef, type StrapId } from "./watch-layers";
import { Strap } from "./Strap";

function Layer({ layer, progress, active, setActive }: { layer: LayerDef; progress: MotionValue<number>; active: string | null; setActive: (id: string | null) => void }) {
  const offset = layer.index - 2.5;
  const x = useTransform(progress, (p) => p * offset * 33);
  const y = useTransform(progress, (p) => p * offset * 67);
  const scale = useTransform(progress, [0, 1], [1.12, 0.88]);
  const rotateX = useTransform(progress, [0, 1], [0, 48]);
  const rotateZ = useTransform(progress, [0, 1], [0, -18]);
  const opacity = useTransform(progress, [0.06, 0.28], [0, 1]);
  const hotOpacity = useTransform(progress, [0.35, 0.65], [0, 1]);
  const [enabled, setEnabled] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setEnabled(p > 0.35));
  return (
    <motion.div className="watch-layer pointer-events-none absolute left-[25%] top-[25%] h-1/2 w-1/2" style={{ x, y, scale, rotateX, rotateZ, opacity, zIndex: 10 - layer.index }}>
      <img src={layer.image} alt={layer.name} width={512} height={512} className={`watch-component pointer-events-none h-full w-full object-contain ${layer.id === "crystal" ? "opacity-40" : ""}`} draggable={false} />
      <motion.div className="absolute z-10" style={{ left: `${layer.hotspot.x}%`, top: `${layer.hotspot.y}%`, opacity: hotOpacity }}>
        <Button variant="outline" size="icon" tabIndex={enabled ? 0 : -1} disabled={!enabled} aria-label={layer.hotspot.title} aria-pressed={active === layer.id} onClick={() => setActive(active === layer.id ? null : layer.id)} className="pointer-events-auto h-7 w-7 rounded-full border-gold/60 bg-background/90 text-gold"><Plus /></Button>
      </motion.div>
    </motion.div>
  );
}

export function ExplodedView({ progress, strap = "alligator" }: { progress: MotionValue<number>; strap?: StrapId }) {
  const [active, setActive] = useState<string | null>(null);
  useMotionValueEvent(progress, "change", (p) => { if (p < 0.35) setActive(null); });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const reducedMotion = useReducedMotion();
  const rotateY = useTransform(sx, (x) => reducedMotion ? 0 : x * 7);
  const rotateX = useTransform(sy, (y) => reducedMotion ? 0 : -y * 5);
  const assembledOpacity = useTransform(progress, [0, 0.25], [1, 0]);
  const assembledScale = useTransform(progress, [0, 0.3], [1, 0.94]);
  const current = LAYERS.find((l) => l.id === active);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <div className="watch-studio relative aspect-square w-full" onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <motion.div className="watch-stage absolute inset-0" style={{ rotateX, rotateY }}>
        <motion.div className="pointer-events-none absolute inset-[3%]" style={{ opacity: assembledOpacity, scale: assembledScale }}>
          <Strap type={strap} priority className="h-full w-full" />
        </motion.div>
        {[...LAYERS].reverse().map((layer) => <Layer key={layer.id} layer={layer} progress={progress} active={active} setActive={setActive} />)}
      </motion.div>
      <AnimatePresence>
        {current && <motion.div key={current.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-0 left-1/2 z-20 w-[min(90%,320px)] -translate-x-1/2 border border-gold/30 bg-card/95 p-4 backdrop-blur" role="status">
          <p className="eyebrow">0{current.index + 1} · {current.name}</p>
          <p className="mt-1 font-serif text-xl">{current.hotspot.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{current.hotspot.body}</p>
          <Button variant="ghost" size="sm" onClick={() => setActive(null)} className="mt-2 h-6 px-0 text-xs text-gold">Close</Button>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
