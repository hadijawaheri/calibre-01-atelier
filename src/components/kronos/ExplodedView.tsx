/**
 * ExplodedView — 2.5D CSS stage. Public contract: { progress: 0..1, strap }.
 * Replace the internals with an R3F <Canvas> (.glb) and keep the same props.
 */
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useState, type MouseEvent } from "react";
import { Plus } from "lucide-react";
import { LAYERS, type LayerDef, type StrapId } from "./watch-layers";
import { Strap } from "./Strap";

const GAP = 52; // px per layer at full explosion

function Layer({ layer, progress, active, setActive }: { layer: LayerDef; progress: MotionValue<number>; active: string | null; setActive: (id: string | null) => void }) {
  const depth = (LAYERS.length - 1 - layer.index) * GAP;
  const z = useTransform(progress, (p) => p * depth - layer.index * 2);
  const blur = useTransform(progress, (p) => `blur(${Math.abs(p * (layer.index - 2.5)) * 0.35}px)`);
  const hotOpacity = useTransform(progress, [0.35, 0.7], [0, 1]);
  const labelX = useTransform(progress, [0, 1], [0, 1]);
  const isActive = active === layer.id;

  return (
    <motion.div className="absolute inset-0" style={{ z, filter: blur, transformStyle: "preserve-3d" }}>
      <div className="absolute inset-0 rounded-full" style={{ boxShadow: "0 30px 60px -20px oklch(0 0 0 / 0.8)" }}>
        {layer.art}
      </div>
      <motion.button
        type="button"
        aria-label={layer.hotspot.title}
        onClick={() => setActive(isActive ? null : layer.id)}
        onMouseEnter={() => setActive(layer.id)}
        style={{ left: `${layer.hotspot.x}%`, top: `${layer.hotspot.y}%`, opacity: hotOpacity }}
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <span className="relative flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-background/80 text-gold shadow-gold">
          <span className="absolute inset-0 animate-ping rounded-full border border-gold/50" />
          <Plus className="h-3 w-3" />
        </span>
      </motion.button>
      <motion.span style={{ opacity: labelX }} className="pointer-events-none absolute -right-36 top-1/2 hidden w-32 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:block">
        <span className="text-gold">0{layer.index + 1}</span> — {layer.name}
      </motion.span>
    </motion.div>
  );
}

export function ExplodedView({ progress, strap = "alligator" }: { progress: MotionValue<number>; strap?: StrapId }) {
  const [active, setActive] = useState<string | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const tiltX = useTransform(progress, (p) => 8 + p * 50);
  const rotX = useTransform([tiltX, sy], ([t, y]) => (t as number) - (y as number) * 10);
  const rotY = useTransform(sx, (x) => x * 14);
  const rotZ = useTransform(progress, (p) => -p * 24);
  const liftY = useTransform(progress, (p) => p * 110);
  const strapOpacity = useTransform(progress, [0, 0.4], [1, 0.25]);
  const current = LAYERS.find((l) => l.id === active);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      className="relative flex aspect-square w-full items-center justify-center overflow-hidden"
      style={{ perspective: 1400 }}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); setActive(null); }}
    >
      <div className="absolute inset-[15%] rounded-full bg-gold/10 blur-3xl" />
      <motion.div
        className="relative h-[62%] w-[62%]"
        style={{ y: liftY, rotateX: rotX, rotateY: rotY, rotateZ: rotZ, transformStyle: "preserve-3d" }}
      >
        <motion.div style={{ opacity: strapOpacity, z: -10 }} className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[46%] -translate-x-1/2 -translate-y-1/2">
          <Strap type={strap} className="h-full w-full" />
        </motion.div>
        {[...LAYERS].reverse().map((l) => (
          <Layer key={l.id} layer={l} progress={progress} active={active} setActive={setActive} />
        ))}
      </motion.div>

      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 left-1/2 w-72 -translate-x-1/2 border border-gold/30 bg-card/90 p-4 backdrop-blur"
        >
          <p className="eyebrow">{current.name}</p>
          <p className="mt-1 font-serif text-xl">{current.hotspot.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{current.hotspot.body}</p>
        </motion.div>
      )}
    </div>
  );
}
