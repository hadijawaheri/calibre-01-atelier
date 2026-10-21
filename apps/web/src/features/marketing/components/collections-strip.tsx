import type { CaseMaterial, Collection, DialLayout } from "@kronos/contracts";
import { COLLECTION_LABELS, COLLECTIONS } from "@kronos/contracts";
import Link from "next/link";

import { WatchRender } from "@/features/products";
import { paths } from "@/lib/paths";

interface Look {
  dial: string;
  accent: string;
  layout: DialLayout;
  material: CaseMaterial;
  line: string;
}

const LOOKS: Record<Collection, Look> = {
  tourbillon: {
    dial: "#2a2b30",
    accent: "#d9a27a",
    layout: "tourbillon",
    material: "titanium",
    line: "قفسی که هر دقیقه یک دور می‌چرخد",
  },
  chronograph: {
    dial: "#1d2b4a",
    accent: "#c9ced6",
    layout: "chronograph",
    material: "steel",
    line: "یک‌دهم ثانیه، با چرخ ستونی",
  },
  heritage: {
    dial: "#efe6d2",
    accent: "#8a6a3b",
    layout: "three-hand",
    material: "yellow-gold",
    line: "ثانیه‌شمار کوچک، مثل دهه‌ی پنجاه",
  },
  diver: {
    dial: "#0f2f2c",
    accent: "#e3c47a",
    layout: "three-hand",
    material: "steel",
    line: "سیصد متر زیر آب",
  },
  dress: {
    dial: "#f3f1ec",
    accent: "#30343c",
    layout: "three-hand",
    material: "platinum",
    line: "باریک‌تر از هشت میلی‌متر",
  },
};

export function CollectionsStrip() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">پنج کلکسیون</p>
        <h2 className="font-display text-4xl md:text-5xl">هر کلکسیون، یک عارضه</h2>
      </div>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {COLLECTIONS.map((collection) => {
          const look = LOOKS[collection];
          return (
            <li key={collection}>
              <Link
                href={`${paths.watches}?collection=${collection}`}
                className="group flex h-full flex-col items-center gap-3 border border-border p-5 text-center transition-colors outline-none hover:border-gold/40 focus-visible:ring-4 focus-visible:ring-ring/50"
              >
                <div className="size-28 transition-transform duration-500 group-hover:-translate-y-1 motion-reduce:transition-none">
                  <WatchRender
                    dial={look.dial}
                    accent={look.accent}
                    layout={look.layout}
                    material={look.material}
                  />
                </div>
                <span className="font-display text-2xl">{COLLECTION_LABELS[collection]}</span>
                <span className="text-xs leading-5 text-muted-foreground">{look.line}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
