import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ArrowDown, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { ExplodedView } from "./ExplodedView";
import { STRAPS, Strap, WATCH_IMAGES } from "./Strap";
import { LAYERS, type StrapId } from "./watch-layers";
import { useTicking } from "./useTicking";
import { ATELIER_TRANSITION } from "./motion";
import { Button } from "@/components/ui/button";

export function Nav({ onReserve }: { onReserve: () => void }) {
  return <header className="atelier-nav fixed inset-x-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
    <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-6 md:px-12">
      <a href="#" aria-label="KRONOS Atelier home" className="brand">KRONOS<span className="ml-3 text-muted-foreground">ATELIER</span></a>
      <nav aria-label="Main navigation" className="hidden items-center gap-10 lg:flex"><a href="#anatomy" className="micro nav-link">The Calibre</a><a href="#fit" className="micro nav-link">Expressions</a><a href="#craft" className="micro nav-link">The Atelier</a></nav>
      <Button variant="ghost" onClick={onReserve} className="micro h-auto rounded-none px-0 text-gold hover:bg-transparent">Private curation <ArrowRight /></Button>
    </div>
  </header>;
}

export function Hero({ onReserve }: { onReserve: () => void }) {
  const progress = useMotionValue(0);
  const [val, setVal] = useState(0);
  const [sound, setSound] = useState(false);
  const reduced = useReducedMotion();
  useTicking(sound);
  const toggle = () => animate(progress, val > 0.5 ? 0 : 1, { ...ATELIER_TRANSITION, duration: reduced ? 0 : 1.2, onUpdate: setVal });
  return <section className="flagship relative overflow-hidden border-b border-border">
    <div className="relative z-10 px-6 text-center">
      <p className="eyebrow">Swiss haute horlogerie · Edition of 88</p>
      <h1 className="display mt-5">KRONOS <em>Calibre 01</em></h1>
      <p className="mt-4 text-muted-foreground">The architecture of time.</p>
    </div>
    <div className="flagship-stage relative mx-auto">
      <div className="hero-caption hero-caption-left"><p className="eyebrow">01 / The timepiece</p><p className="mt-4 leading-loose text-muted-foreground">Flying tourbillon<br />Grade 5 titanium<br />Hand-finished in Switzerland</p></div>
      <ExplodedView progress={progress} />
      <div className="hero-caption hero-caption-right"><p className="eyebrow">Mastery in motion</p><p className="mt-4 leading-loose text-muted-foreground">33 jewels<br />28,800 vibrations / hour<br />72-hour power reserve</p></div>
    </div>
    <div className="mx-auto w-full max-w-[360px] px-6">
      <div className="flex items-center justify-between gap-3"><Button variant="ghost" onClick={toggle} className="micro h-auto rounded-none px-0 text-gold hover:bg-transparent">{val > 0.5 ? "Reassemble" : "Deconstruct"}</Button><span className="micro tabular-nums text-muted-foreground">{Math.round(val * 100).toString().padStart(3, "0")}%</span><Button variant="ghost" size="icon" title={sound ? "Mute mechanical ticking" : "Listen to mechanical ticking"} aria-label="Toggle ticking sound" aria-pressed={sound} onClick={() => setSound(s => !s)} className="text-muted-foreground">{sound ? <Volume2 /> : <VolumeX />}</Button></div>
      <input type="range" min={0} max={1} step={0.001} value={val} aria-label="Deconstruct timepiece" onChange={e => { const v = Number(e.target.value); progress.stop(); setVal(v); progress.set(v); }} className="atelier-range mt-2 w-full" />
    </div>
    <div className="mt-8 flex flex-wrap justify-center gap-4 px-6"><Button variant="atelier" onClick={onReserve} className="h-12 px-6">Request private curation <ArrowRight /></Button><Button asChild variant="atelier" className="h-12 px-6"><a href="#anatomy">Explore complications <ArrowDown /></a></Button></div>
    <p className="micro mt-8 text-center text-muted-foreground">Swiss made <span className="mx-4 text-gold">/</span> Mechanical by nature</p>
  </section>;
}

export function Anatomy() {
  return <section id="anatomy" className="exhibition-section">
    <div className="section-heading"><p className="eyebrow">II / The calibre</p><h2 className="display mt-6">Mastery in <em>motion.</em></h2><p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">A universe of precision, held within 42 millimetres. Every surface considered. Every heartbeat revealed.</p></div>
    <dl className="specifications mt-16 grid grid-cols-2 gap-y-10 border-y border-border py-10 md:grid-cols-4">{[["33", "Jewels"], ["4 Hz", "Frequency"], ["100 m", "Water resistance"], ["72 h", "Power reserve"]].map(([value, label]) => <div key={label}><dd className="display">{value}</dd><dt className="micro mt-4 text-muted-foreground">{label}</dt></div>)}</dl>
    <div className="mt-16 grid gap-x-20 md:grid-cols-2">{LAYERS.map(l => <details key={l.id} className="anatomy-detail border-b border-border py-6"><summary className="flex cursor-pointer list-none items-center gap-5"><span className="micro text-gold">0{l.index + 1}</span><span className="flex-1">{l.name}</span><span className="detail-plus text-gold" aria-hidden="true">+</span></summary><p className="pl-10 pt-5 leading-relaxed text-muted-foreground">{l.hotspot.body}</p></details>)}</div>
  </section>;
}

export function WristFit({ strap, setStrap }: { strap: StrapId; setStrap: (s: StrapId) => void }) {
  const current = STRAPS.find(s => s.id === strap) ?? STRAPS[0];
  const reduced = useReducedMotion();
  return <section id="fit" className="expression-section border-y border-border">
    <div className="exhibition-section grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
      <div className="watch-studio expression-watch relative mx-auto w-full"><motion.div key={strap} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...ATELIER_TRANSITION, duration: reduced ? 0 : 1 }} className="h-full w-full"><Strap type={strap} className="h-full w-full" /></motion.div></div>
      <div><p className="eyebrow">III / Personal expressions</p><h2 className="display mt-6">One calibre.<br /><em>Your character.</em></h2><p className="mt-6 max-w-md leading-relaxed text-muted-foreground">Sculpted lugs. An effortless embrace. Three expressions of the same uncompromising craft.</p>
      <div role="group" aria-label="Strap selection" className="mt-12 border-t border-border">{STRAPS.map((s, i) => <Button key={s.id} variant="ghost" aria-pressed={strap === s.id} onClick={() => setStrap(s.id)} className={`strap-choice flex h-auto w-full justify-start gap-5 whitespace-normal rounded-none border-b border-border px-0 py-6 text-left hover:bg-transparent ${strap === s.id ? "text-foreground" : "text-muted-foreground"}`}><span className="micro text-gold">0{i + 1}</span><span className="flex-1">{s.name}</span><span className={`selection-dot ${strap === s.id ? "is-selected" : ""}`} /><ArrowRight className={strap === s.id ? "opacity-100" : "opacity-0"} /></Button>)}</div>
      <p className="mt-6 leading-relaxed text-muted-foreground">{current?.note}</p><p className="micro mt-4 text-gold">{current?.price ? `Additional CHF ${current.price.toLocaleString("en-CH")}` : "Included with the timepiece"}</p></div>
    </div>
  </section>;
}

export function Craft() {
  return <section id="craft" className="exhibition-section">
    <div className="section-heading"><p className="eyebrow">IV / The atelier</p><h2 className="display mt-6">Made slowly.<br /><em>Made to endure.</em></h2></div>
    <div className="craft-photograph relative mt-16 overflow-hidden"><img src={WATCH_IMAGES.alligator} alt="Close study of Calibre 01 titanium case, rose-gold indices and skeleton movement" loading="lazy" className="h-full w-full object-cover" /><span className="micro absolute bottom-8 left-8 text-foreground">Calibre 01 / A study in detail</span></div>
    <div className="mt-16 grid gap-12 md:grid-cols-3">{[{ n: "412 hours", t: "The human touch", b: "Each bridge is bevelled by hand. Wood, diamond paste, and patience bring every edge to light." }, { n: "Côtes de Genève", t: "A signature in light", b: "Genevan stripes travel across the movement. A quiet rhythm, engraved into metal." }, { n: "One watchmaker", t: "A personal undertaking", b: "One artisan assembles, regulates, and signs each Calibre 01. A lifetime of knowledge in a single timepiece." }].map(c => <div key={c.t} className="border-t border-gold/20 pt-6"><p className="eyebrow">{c.n}</p><h3 className="mt-6">{c.t}</h3><p className="mt-4 leading-relaxed text-muted-foreground">{c.b}</p></div>)}</div>
  </section>;
}

export function Footer({ onReserve }: { onReserve: () => void }) {
  return <footer className="border-t border-border"><div className="exhibition-section text-center"><p className="eyebrow">A private invitation</p><h2 className="display mt-6">Time, <em>on your terms.</em></h2><p className="mx-auto mt-6 max-w-md leading-relaxed text-muted-foreground">Discover your expression of Calibre 01.</p><Button variant="atelier" onClick={onReserve} className="mt-10 h-12 px-6">Request private curation <ArrowRight /></Button></div><div className="micro flex flex-wrap justify-between gap-6 border-t border-border px-6 py-8 text-muted-foreground md:px-12"><span>KRONOS Atelier · Le Brassus, Suisse</span><span>© 2026 KRONOS Atelier</span></div></footer>;
}
