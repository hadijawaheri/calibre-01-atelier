"use client";

import type { ProductDto } from "@kronos/contracts";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { ProductMedia } from "./product-media";

export function ProductGallery({ product }: { product: ProductDto }) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const media = { ...product, caseMaterial: product.case.material };
  const count = Math.max(1, product.images.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="studio-light bg-surface border-border relative overflow-hidden border">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProductMedia product={media} index={index} sizes="(min-width: 1024px) 50vw, 100vw" priority className="p-[4%]" />
          </motion.div>
        </AnimatePresence>
      </div>
      {count > 1 && (
        <div className="grid grid-cols-4 gap-3" role="group" aria-label="تصاویر محصول">
          {product.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`تصویر ${i + 1}`}
              aria-pressed={index === i}
              className={cn(
                "studio-light bg-surface border-border focus-visible:ring-ring/50 border transition-colors outline-none focus-visible:ring-4",
                index === i ? "border-gold" : "hover:border-gold/40",
              )}
            >
              <ProductMedia product={media} index={i} sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
