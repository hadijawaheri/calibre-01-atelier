import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { Gem, Activity, Droplets, BatteryCharging, ShieldCheck, Award, Volume2, VolumeX, ArrowRight } from "lucide-react";
import { ExplodedView } from "./ExplodedView";
import { STRAPS, Strap } from "./Strap";
import { LAYERS, type StrapId } from "./watch-layers";
import { useTicking } from "./useTicking";
import { Button } from "@/components/ui/button";

const btnGold = "inline-flex items-center gap-2 bg-gold-gradient px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary-foreground transition hover:brightness-110";
const btnGhost = "inline-flex items-center gap-2 border border-gold/40 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-gold transition hover:bg-gold/10";

export function Nav({ onReserve }: { onReserve: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <span className="font-serif text-2xl tracking-[0.35em]">KRONOS<span className="text-gold">.</span></span>
        <nav className="hidden gap-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex">
          <a href="#anatomy" className="hover:text-gold">Calibre</a>
          <a href="#fit" className="hover:text-gold">Fit & Finish</a>
          <a href="#craft" className="hover:text-gold">Atelier</a>
        </nav>
        <button onClick={onReserve} className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Reserve</button>
      </div>
    </header>
  );
}

export function Hero({ onReserve }: { onReserve: () => void }) {
  const progress = useMotionValue(0);
  const [val, setVal] = useState(0);
  const [sound, setSound] = useState(false);
  useTicking(sound);

  const toggle = () => {
    const to = val > 0.5 ? 0 : 1;
    animate(progress, to, { type: "spring", stiffness: 60, damping: 16, onUpdate: setVal });
  };

  return (
    <section className="relative overflow-hidden pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow">Calibre 01 · Edition of 88</p>
          <h1 className="mt-6 font-serif text-6xl font-light leading-[0.95] md:text-8xl">
            Engineering <em className="text-gold-gradient">Eternity</em>
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            A flying-tourbillon automatic, hand-finished across 412 hours in our Vallée de Joux atelier. Pull it apart. See every heartbeat.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button onClick={onReserve} className={btnGold}>Reserve Timepiece <ArrowRight className="h-4 w-4" /></button>
            <a href="#anatomy" className={btnGhost}>Explore Calibre</a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-6">
            {[[ShieldCheck, "COSC", "Chronometer"], [Award, "Swiss", "Made · Genève"], [Gem, "Nº 088", "Pieces only"]].map(([Icon, a, b], i) => {
              const I = Icon as typeof Gem;
              return (
                <div key={i}>
                  <I className="h-4 w-4 text-gold" />
                  <p className="mt-2 font-serif text-xl">{a as string}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{b as string}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <ExplodedView progress={progress} />
          <div className="mx-auto mt-2 flex max-w-md flex-col gap-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span>Assembled</span>
              <span className="text-gold">{Math.round(val * 100)}%</span>
              <span>Deconstructed</span>
            </div>
            <input
              type="range" min={0} max={1} step={0.001} value={val}
              aria-label="Deconstruct timepiece"
              onChange={(e) => { const v = +e.target.value; setVal(v); progress.set(v); }}
              className="w-full accent-[var(--gold)]"
            />
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={toggle} className={`${btnGhost} h-auto rounded-none`}>{val > 0.5 ? "Reassemble" : "Deconstruct"}</Button>
              <Button variant="outline" size="icon" title="Toggle ticking sound" onClick={() => setSound((s) => !s)} aria-label="Toggle ticking sound" className="h-auto rounded-none border-border text-gold hover:bg-gold/10">
                {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  return (
    <motion.span onViewportEnter={() => animate(0, to, { duration: 1.6, onUpdate: (v) => setN(Math.round(v)) })} viewport={{ once: true }}>
      {n}{suffix}
    </motion.span>
  );
}

export function Anatomy() {
  const [reserve, setReserve] = useState(72);
  useEffect(() => {
    const id = setInterval(() => setReserve((r) => (r <= 0 ? 72 : +(r - 0.1).toFixed(1))), 120);
    return () => clearInterval(id);
  }, []);
  const stats = [
    { icon: Gem, label: "Jewels", value: 33, suffix: "" },
    { icon: Activity, label: "Frequency", value: 4, suffix: "Hz" },
    { icon: Droplets, label: "Water Resistance", value: 100, suffix: "m" },
  ];
  return (
    <section id="anatomy" className="mx-auto max-w-7xl px-6 py-32">
      <p className="eyebrow">II — The Anatomy</p>
      <h2 className="mt-4 max-w-2xl font-serif text-5xl font-light md:text-6xl">The anatomy of Calibre 01</h2>
      <div className="mt-16 grid gap-px bg-border md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-background p-8">
            <s.icon className="h-5 w-5 text-gold" />
            <p className="mt-10 font-serif text-6xl font-light"><Counter to={s.value} suffix={s.suffix} /></p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.label}</p>
          </div>
        ))}
        <div className="bg-background p-8">
          <BatteryCharging className="h-5 w-5 text-gold" />
          <p className="mt-10 font-serif text-6xl font-light">{Math.round(reserve)}<span className="text-2xl">h</span></p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Power Reserve</p>
          <div className="mt-4 h-1 w-full bg-muted">
            <div className="h-full bg-gold-gradient transition-all" style={{ width: `${(reserve / 72) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-px grid gap-px bg-border md:grid-cols-3">
        {LAYERS.map((l) => (
          <div key={l.id} className="group flex gap-5 bg-background p-6 transition hover:bg-card">
            <span className="font-mono text-xs text-gold">0{l.index + 1}</span>
            <div>
              <p className="font-serif text-xl">{l.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l.hotspot.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WristFit({ strap, setStrap }: { strap: StrapId; setStrap: (s: StrapId) => void }) {
  const current = STRAPS.find((s) => s.id === strap) ?? STRAPS[0];
  return (
    <section id="fit" className="border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-32 lg:grid-cols-2">
        <div className="watch-studio relative mx-auto flex h-[580px] w-full max-w-lg items-center justify-center overflow-hidden">
          <motion.div key={strap} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="h-full w-full py-4">
            <Strap type={strap} className="h-full w-full" />
          </motion.div>
        </div>
        <div>
          <p className="eyebrow">III — Fit & Finish</p>
          <h2 className="mt-4 font-serif text-5xl font-light">Dressed for the wrist</h2>
          <p className="mt-4 max-w-md text-muted-foreground">42mm case, 10.8mm profile. Quick-release lugs let you change character in seconds.</p>
          <div className="mt-10 space-y-3">
            {STRAPS.map((s) => (
              <Button
                variant="ghost"
                aria-pressed={s.id === strap}
                key={s.id}
                onClick={() => setStrap(s.id)}
                className={`flex h-auto w-full items-center justify-between gap-4 whitespace-normal rounded-none border p-5 text-left transition ${s.id === strap ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`}
              >
                <div>
                  <p className="font-serif text-xl">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.note}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-gold">{s.price ? `+ CHF ${s.price.toLocaleString()}` : "Included"}</span>
              </Button>
            ))}
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Selected · <span className="text-gold">{current?.name ?? "Matte Alligator"}</span></p>
        </div>
      </div>
    </section>
  );
}

export function Craft() {
  const chapters = [
    { n: "412", u: "hours", t: "Hand-finishing", b: "Every bridge is anglaged by hand with wood and diamond paste until the bevel catches light at precisely 45°." },
    { n: "1,240", u: "stripes", t: "Côtes de Genève", b: "Parallel waves engraved across each plate, a signature of Genevan haute horlogerie since the 18th century." },
    { n: "1", u: "artisan", t: "Single-hand assembly", b: "One master watchmaker assembles, regulates and signs each Calibre 01 — their initials hidden beneath the rotor." },
  ];
  return (
    <section id="craft" className="mx-auto max-w-7xl px-6 py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="eyebrow">IV — The Atelier</p>
          <h2 className="mt-4 font-serif text-5xl font-light leading-tight">Made slowly,<br /><em className="text-gold-gradient">on purpose.</em></h2>
        </div>
        <div className="space-y-px bg-border">
          {chapters.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="grid gap-6 bg-background py-10 md:grid-cols-[180px_1fr]"
            >
              <div>
                <p className="font-serif text-6xl font-light text-gold-gradient">{c.n}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{c.u}</p>
              </div>
              <div>
                <p className="font-serif text-3xl">{c.t}</p>
                <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">{c.b}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ onReserve }: { onReserve: () => void }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-24 text-center">
        <h2 className="font-serif text-5xl font-light">Only 88 will ever exist.</h2>
        <button onClick={onReserve} className={btnGold}>Reserve your serial</button>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">KRONOS Atelier SA · Le Brassus, Suisse · © 2026</p>
      </div>
    </footer>
  );
}
