"use client";

import { useEffect, useSyncExternalStore } from "react";

import { useCart } from "./store";

const subscribe = (onChange: () => void) => useCart.persist.onFinishHydration(onChange);
const getSnapshot = () => useCart.persist.hasHydrated();
// The server and the first client render never see the persisted cart
const getServerSnapshot = () => false;

/** True once the persisted cart has been read from localStorage. */
export function useCartHydrated(): boolean {
  useEffect(() => {
    if (!useCart.persist.hasHydrated()) void useCart.persist.rehydrate();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
