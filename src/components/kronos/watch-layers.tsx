/** Raster layer metadata; the stage can be replaced by a GLB canvas without changing its props. */
import crystal from "@/assets/watch-parts/crystal.png";
import dial from "@/assets/watch-parts/dial.png";
import complication from "@/assets/watch-parts/complication.png";
import movement from "@/assets/watch-parts/movement.png";
import rotor from "@/assets/watch-parts/rotor.png";
import caseback from "@/assets/watch-parts/caseback.png";

export type StrapId = "alligator" | "titanium" | "milanese";
export interface LayerDef {
  id: string;
  index: number;
  name: string;
  image: string;
  hotspot: { x: number; y: number; title: string; body: string };
}
export const LAYERS: LayerDef[] = [
  { id: "crystal", index: 0, name: "Sapphire Crystal", image: crystal, hotspot: { x: 30, y: 28, title: "Domed Sapphire", body: "9H synthetic sapphire, 7-layer anti-reflective coating on both faces." } },
  { id: "dial", index: 1, name: "Dauphine Hands & Indices", image: dial, hotspot: { x: 72, y: 30, title: "Rose-Gold Indices", body: "Hand-applied 18K rose-gold indices with Super-LumiNova® hands." } },
  { id: "complication", index: 2, name: "Skeleton Dial & Tourbillon", image: complication, hotspot: { x: 50, y: 72, title: "Flying Tourbillon", body: "60-second cage, 68 components weighing just 0.29 g. Cantilevered with no upper bridge." } },
  { id: "movement", index: 3, name: "Calibre 01 Movement", image: movement, hotspot: { x: 64, y: 52, title: "4Hz · 28,800 vph", body: "Co-axial escapement, free-sprung balance with Breguet overcoil hairspring." } },
  { id: "rotor", index: 4, name: "22K Gold Rotor", image: rotor, hotspot: { x: 32, y: 66, title: "72-Hour Power Reserve", body: "Bi-directional 22K gold oscillating weight on ceramic ball bearings; twin barrels." } },
  { id: "caseback", index: 5, name: "Titanium Caseback", image: caseback, hotspot: { x: 74, y: 70, title: "100m Water Resistance", body: "Grade 5 titanium exhibition caseback, screw-down, sapphire window." } },
];
