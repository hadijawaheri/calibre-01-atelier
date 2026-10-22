"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

/** Steps out of the way while the visitor reads down the page and comes back the moment they scroll up. */
export function HeaderReveal({ children }: PropsWithChildren) {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last.current;
      if (Math.abs(delta) < 6) return;
      setHidden(delta > 0 && y > 120);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-hidden={hidden || undefined}
      // A keyboard visitor tabbing into the header always gets it back
      onFocus={() => setHidden(false)}
      className="fixed inset-x-0 top-0 z-40 transition-[opacity,translate] duration-700 ease-glide data-hidden:-translate-y-4 data-hidden:opacity-0 data-hidden:not-focus-within:pointer-events-none motion-reduce:transition-none"
    >
      {children}
    </div>
  );
}
