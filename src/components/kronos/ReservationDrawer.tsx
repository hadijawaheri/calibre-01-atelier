import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X, Check, Lock } from "lucide-react";
import { STRAPS } from "./Strap";
import type { StrapId } from "./watch-layers";

const BASE = 148000;
const ENGRAVING = 1200;
const TAKEN = [1, 7, 8, 12, 21, 33, 44, 88];

export function ReservationDrawer({ open, onClose, strap, setStrap }: { open: boolean; onClose: () => void; strap: StrapId; setStrap: (s: StrapId) => void }) {
  const [serial, setSerial] = useState<number | null>(null);
  const [engraving, setEngraving] = useState("");
  const [done, setDone] = useState(false);
  const strapPrice = STRAPS.find((s) => s.id === strap)!.price;
  const engr = engraving.trim() ? ENGRAVING : 0;
  const subtotal = BASE + strapPrice + engr;
  const deposit = Math.round(subtotal * 0.3);
  const fmt = (n: number) => `CHF ${n.toLocaleString("en-CH")}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-onyx/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog" aria-label="Reserve timepiece"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-gold/20 bg-card"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <p className="eyebrow">Bespoke Atelier</p>
                <p className="font-serif text-2xl">Calibre 01 Reservation</p>
              </div>
              <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-muted-foreground hover:text-gold" /></button>
            </div>

            {done ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold"><Check /></div>
                <p className="font-serif text-3xl">Serial Nº {String(serial).padStart(3, "0")} is held for you.</p>
                <p className="text-sm text-muted-foreground">Your atelier concierge will be in touch within 24 hours.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-8 p-6">
                <div>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">1 · Choose serial / 088</p>
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 88 }, (_, i) => i + 1).map((n) => {
                      const taken = TAKEN.includes(n);
                      return (
                        <button
                          key={n} disabled={taken} onClick={() => setSerial(n)}
                          className={`py-1.5 font-mono text-[10px] transition ${taken ? "cursor-not-allowed text-muted-foreground/30 line-through" : serial === n ? "bg-gold text-primary-foreground" : "border border-border hover:border-gold"}`}
                        >{String(n).padStart(2, "0")}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">2 · Strap</p>
                  <div className="grid grid-cols-3 gap-2">
                    {STRAPS.map((s) => (
                      <button key={s.id} onClick={() => setStrap(s.id)} className={`border p-3 text-left text-xs ${s.id === strap ? "border-gold text-gold" : "border-border"}`}>{s.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">3 · Caseback engraving (optional)</p>
                  <input
                    value={engraving} maxLength={24} onChange={(e) => setEngraving(e.target.value)}
                    placeholder="e.g. For A., always"
                    className="w-full border border-input bg-background px-4 py-3 font-serif text-lg italic outline-none focus:border-gold"
                  />
                  <p className="mt-1 text-right font-mono text-[10px] text-muted-foreground">{engraving.length}/24</p>
                </div>
                <div className="space-y-2 border-t border-border pt-6 text-sm">
                  <Row l="Calibre 01 · 42mm Titanium" r={fmt(BASE)} />
                  <Row l={STRAPS.find((s) => s.id === strap)!.name} r={strapPrice ? fmt(strapPrice) : "Included"} />
                  <Row l="Hand engraving" r={engr ? fmt(engr) : "—"} />
                  <div className="flex justify-between border-t border-border pt-3 font-serif text-2xl"><span>Total</span><span className="text-gold-gradient">{fmt(subtotal)}</span></div>
                  <Row l="Reservation deposit (30%)" r={fmt(deposit)} />
                </div>
              </div>
            )}

            {!done && (
              <div className="border-t border-border p-6">
                <button
                  disabled={!serial} onClick={() => setDone(true)}
                  className="flex w-full items-center justify-center gap-2 bg-gold-gradient py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-primary-foreground disabled:opacity-40"
                >
                  <Lock className="h-3.5 w-3.5" /> {serial ? `Reserve Nº ${String(serial).padStart(3, "0")} · ${fmt(deposit)}` : "Select a serial"}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

const Row = ({ l, r }: { l: string; r: string }) => (
  <div className="flex justify-between text-muted-foreground"><span>{l}</span><span className="font-mono text-foreground">{r}</span></div>
);
