"use client";

import { useEffect, useState } from "react";

import { useCart } from "./store";

/** True once the persisted cart has been read from localStorage. */
export function useCartHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useCart.persist.hasHydrated());
  useEffect(() => {
    const unsubscribe = useCart.persist.onFinishHydration(() => setHydrated(true));
    if (!useCart.persist.hasHydrated()) void useCart.persist.rehydrate();
    else setHydrated(true);
    return unsubscribe;
  }, []);
  return hydrated;
}
