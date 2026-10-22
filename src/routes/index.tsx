import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav, Hero, Anatomy, WristFit, Craft, Footer } from "@/components/kronos/Sections";
import { ReservationDrawer } from "@/components/kronos/ReservationDrawer";
import type { StrapId } from "@/components/kronos/watch-layers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KRONOS Atelier — Calibre 01 Flying Tourbillon" },
      { name: "description", content: "Explore and reserve the KRONOS Calibre 01: a Swiss automatic flying tourbillon, limited to 88 pieces." },
      { property: "og:title", content: "KRONOS Atelier — Calibre 01" },
      { property: "og:description", content: "The architecture of time. A private study of the Calibre 01 flying tourbillon, edition of 88." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [open, setOpen] = useState(false);
  const [strap, setStrap] = useState<StrapId>("alligator");
  const reserve = () => setOpen(true);
  return (
    <main>
      <Nav onReserve={reserve} />
      <Hero onReserve={reserve} />
      <Anatomy />
      <WristFit strap={strap} setStrap={setStrap} />
      <Craft />
      <Footer onReserve={reserve} />
      <ReservationDrawer open={open} onClose={() => setOpen(false)} strap={strap} setStrap={setStrap} />
    </main>
  );
}
