"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { createContext, use, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { trainPose } from "../kinematics";
import type { Vec2 } from "../layout";
import { ARBOR, BALANCE_RADIUS, ESCAPE_RADIUS, MOVEMENT_RADIUS, WHEEL, Z } from "../layout";
import type { PartId } from "../parts";
import { ENERGY_PATH } from "../parts";
import type { MovementControls } from "./controls";
import {
  balanceShape,
  escapeWheelShape,
  extrude,
  gearShape,
  hairspringPoints,
  hullShape,
  palletShape,
  ringShape,
  rotorShape,
} from "./geometry";
import type { MovementMaterials } from "./materials";
import { createMaterials, disposeMaterials } from "./materials";
import type { Scatter } from "./scatter";
import { scatter, seedOf } from "./scatter";

/** How far each assembly travels (in layer units) when the movement is taken apart. */
const EXPLODE_LAYER: Record<string, number> = {
  hands: -3.2,
  dial: -2.2,
  plate: 0,
  barrel: 1,
  escape: 1.35,
  pallet: 1.35,
  centre: 1.7,
  third: 2.05,
  fourth: 2.4,
  balance: 3.1,
  bridges: 4.3,
  cock: 4.8,
  ratchet: 5.4,
  reverser: 6,
  rotor: 7.2,
};
/** Assemblies from this layer up are the "covers" that lifting removes. */
const COVER_LAYER = 4.3;
const LIFT_HEIGHT = 9;

const TAU = Math.PI * 2;
const polar = (r: number, deg: number): Vec2 => [
  Math.cos((deg * Math.PI) / 180) * r,
  Math.sin((deg * Math.PI) / 180) * r,
];
const add = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]];
const angleOf = (from: Vec2, to: Vec2) => Math.atan2(to[1] - from[1], to[0] - from[0]);

const RATCHET = { teeth: 48, module: 0.15 };
const CROWN = { teeth: 20, module: 0.15 };
const CROWN_POS = add(
  ARBOR.barrel,
  polar(((RATCHET.teeth + CROWN.teeth) * RATCHET.module) / 2, 100),
);
const REVERSER_POS: Vec2[] = [polar(2.05, 196), polar(2.05, 244)];
const TRANSMISSION_POS = add(REVERSER_POS[0]!, polar(2.6, 185));
const COCK_ANCHOR: Vec2 = (() => {
  const [x, y] = ARBOR.balance;
  const len = Math.hypot(x, y);
  return [(x / len) * 10.6, (y / len) * 10.6];
})();

interface MeshSpec {
  geometry: THREE.BufferGeometry;
  material: keyof MovementMaterials;
  part: PartId;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

type Geometries = ReturnType<typeof useGeometries>;

function useGeometries() {
  return useMemo(() => {
    const cylinder = (r: number, h: number, seg = 32) => {
      const g = new THREE.CylinderGeometry(r, r, h, seg);
      g.rotateX(Math.PI / 2);
      return g;
    };
    const pinion = (teeth: number, module: number, length: number) =>
      extrude(gearShape({ teeth, module }), length, 0, 6);

    const wheel = (teeth: number, module: number, spokes: number, depth: number) =>
      extrude(gearShape({ teeth, module, spokes, bore: 0.12 }), depth, 0, 8);

    const barrelBridge = hullShape([
      { c: ARBOR.barrel, r: 5.25 },
      { c: ARBOR.centre, r: 1.1 },
      { c: polar(11.6, 178), r: 0.9 },
    ]);
    const trainBridge = hullShape([
      { c: ARBOR.third, r: 1.05 },
      { c: ARBOR.fourth, r: 1.15 },
      { c: ARBOR.escape, r: 0.95 },
      { c: polar(10.7, 300), r: 1.1 },
    ]);
    const palletBridge = hullShape([
      { c: ARBOR.pallet, r: 0.75 },
      { c: add(ARBOR.pallet, polar(2.4, -55)), r: 0.75 },
    ]);
    const cock = hullShape([
      { c: ARBOR.balance, r: 1.25 },
      { c: COCK_ANCHOR, r: 1.7 },
    ]);
    const rimSector = new THREE.Shape();
    rimSector.absarc(0, 0, MOVEMENT_RADIUS - 0.4, Math.PI * 1.02, Math.PI * 1.98, false);
    rimSector.absarc(0, 0, MOVEMENT_RADIUS - 2.2, Math.PI * 1.98, Math.PI * 1.02, true);
    rimSector.closePath();

    return {
      plate: extrude(ringShape(MOVEMENT_RADIUS, 0.25), 1, 0.08, 64),
      dial: extrude(ringShape(MOVEMENT_RADIUS - 0.2, 0.3), 0.3, 0.05, 64),
      index: new THREE.BoxGeometry(0.5, 1.6, 0.18),
      indexTwelve: new THREE.BoxGeometry(1.1, 1.9, 0.18),
      hourHand: handGeometry(6.4, 0.55),
      minuteHand: handGeometry(9.6, 0.42),
      secondHand: handGeometry(10.8, 0.12, 2.6),
      handCap: cylinder(0.55, 0.12),
      barrelDrum: cylinder(
        WHEEL.barrel.module * WHEEL.barrel.teeth * 0.5 - 0.25,
        Z.barrelHeight,
        72,
      ),
      barrelTeeth: extrude(
        gearShape({ teeth: WHEEL.barrel.teeth, module: WHEEL.barrel.module, bore: 1 }),
        0.32,
        0,
        6,
      ),
      barrelCover: extrude(
        ringShape(WHEEL.barrel.module * WHEEL.barrel.teeth * 0.5 - 0.5, 0.55),
        0.08,
        0.03,
        64,
      ),
      barrelArbor: cylinder(0.55, 0.3, 4),
      centreWheel: wheel(WHEEL.centre.teeth, WHEEL.centre.module, 5, 0.2),
      centrePinion: pinion(WHEEL.centre.pinion, WHEEL.centre.pinionModule, 0.85),
      thirdWheel: wheel(WHEEL.third.teeth, WHEEL.third.module, 5, 0.18),
      thirdPinion: pinion(WHEEL.third.pinion, WHEEL.third.pinionModule, 0.55),
      fourthWheel: wheel(WHEEL.fourth.teeth, WHEEL.fourth.module, 4, 0.16),
      fourthPinion: pinion(WHEEL.fourth.pinion, WHEEL.fourth.pinionModule, 0.5),
      escapeWheel: extrude(escapeWheelShape(WHEEL.escape.teeth, ESCAPE_RADIUS), 0.14, 0, 6),
      escapePinion: pinion(WHEEL.escape.pinion, WHEEL.escape.pinionModule, 1.05),
      pallet: extrude(palletShape(), 0.14, 0.02, 4),
      palletStone: new THREE.BoxGeometry(0.42, 0.16, 0.2),
      balance: extrude(balanceShape(BALANCE_RADIUS), 0.24, 0.03, 64),
      balanceScrew: cylinder(0.22, 0.3, 12),
      roller: cylinder(0.55, 0.12),
      impulsePin: cylinder(0.08, 0.35, 8),
      arbor: (length: number) => cylinder(0.11, length, 10),
      barrelBridge: extrude(barrelBridge, 0.6, 0.08, 4),
      trainBridge: extrude(trainBridge, 0.6, 0.08, 4),
      palletBridge: extrude(palletBridge, 0.55, 0.07, 4),
      cock: extrude(cock, 0.5, 0.08, 4),
      jewel: cylinder(0.3, 0.14, 24),
      chaton: extrude(ringShape(0.52, 0.3), 0.1, 0.03, 24),
      shockSpring: extrude(ringShape(0.75, 0.62), 0.06, 0, 32),
      screwHead: cylinder(0.4, 0.22, 24),
      screwSlot: new THREE.BoxGeometry(0.8, 0.09, 0.1),
      ratchet: extrude(
        gearShape({ teeth: RATCHET.teeth, module: RATCHET.module, bore: 0.3 }),
        0.3,
        0.02,
        6,
      ),
      crown: extrude(
        gearShape({ teeth: CROWN.teeth, module: CROWN.module, bore: 0.25 }),
        0.26,
        0.02,
        6,
      ),
      reverser: wheel(30, 0.09, 4, 0.18),
      transmission: wheel(36, 0.09, 4, 0.18),
      rotor: extrude(rotorShape(MOVEMENT_RADIUS - 0.4), 0.42, 0.05, 48),
      rotorRim: extrude(rimSector, 0.95, 0.08, 48),
      bearing: extrude(ringShape(1.9, 0.5), 0.5, 0.05, 48),
    };
  }, []);
}

interface PartContextValue {
  mat: (part: PartId, key: keyof MovementMaterials) => THREE.Material;
  pick: (part: PartId) => Record<string, (e: never) => void>;
}
const PartContext = createContext<PartContextValue | null>(null);
const usePart = () => use(PartContext)!;
const at = (p: Vec2, z = 0): [number, number, number] => [p[0], p[1], z];

function Mesh({ geometry, material, part, position, rotation }: MeshSpec) {
  const { mat, pick } = usePart();
  return (
    <mesh
      geometry={geometry}
      material={mat(part, material)}
      position={position}
      rotation={rotation}
      {...pick(part)}
    />
  );
}

function Screw({ p, z, part, g }: { p: Vec2; z: number; part: PartId; g: Geometries }) {
  return (
    <group position={at(p, z)}>
      <Mesh geometry={g.screwHead} material="blued" part={part} />
      <mesh
        geometry={g.screwSlot}
        position={[0, 0, 0.08]}
        rotation={[0, 0, (p[0] * 7 + p[1] * 3) % 3]}
      >
        <meshBasicMaterial color="#0a1230" />
      </mesh>
    </group>
  );
}

function Jewel({ p, z, g }: { p: Vec2; z: number; g: Geometries }) {
  return (
    <group position={at(p, z)}>
      <Mesh geometry={g.chaton} material="polished" part="jewels" />
      <Mesh geometry={g.jewel} material="ruby" part="jewels" position={[0, 0, 0.02]} />
    </group>
  );
}

function handGeometry(length: number, width: number, tail = 1.2) {
  const s = new THREE.Shape();
  s.moveTo(-width / 2, -tail);
  s.lineTo(width / 2, -tail);
  s.lineTo(width * 0.35, length * 0.92);
  s.lineTo(0, length);
  s.lineTo(-width * 0.35, length * 0.92);
  s.closePath();
  return extrude(s, 0.06, 0.01, 4);
}

interface LayerEntry {
  name: string;
  group: THREE.Object3D;
  base: THREE.Vector3;
  centre: [number, number];
  seed: number;
}

interface MovementModelProps {
  controls: React.RefObject<MovementControls>;
  onSelect?: (id: PartId) => void;
  onHover?: (id: PartId | null) => void;
}

export function MovementModel({ controls, onSelect, onHover }: MovementModelProps) {
  const g = useGeometries();
  // One set of materials per part so a selected part can glow on its own
  const materials = useMemo(() => {
    const base = createMaterials();
    const perPart = new Map<PartId, MovementMaterials>();
    const get = (part: PartId) => {
      let set = perPart.get(part);
      if (!set) {
        set = Object.fromEntries(
          Object.entries(base).map(([key, material]) => [key, material.clone()]),
        ) as unknown as MovementMaterials;
        perPart.set(part, set);
      }
      return set;
    };
    return { base, get, perPart };
  }, []);

  useEffect(
    () => () => {
      disposeMaterials(materials.base);
      for (const set of materials.perPart.values()) for (const m of Object.values(set)) m.dispose();
      for (const value of Object.values(g))
        if (value instanceof THREE.BufferGeometry) value.dispose();
    },
    [materials, g],
  );

  const mat = (part: PartId, key: keyof MovementMaterials) => materials.get(part)[key];

  // Assemblies are found by name once, so the render tree stays free of callback refs
  const root = useRef<THREE.Group>(null);
  const index = useRef<{ layers: LayerEntry[]; spin: Map<string, THREE.Object3D> } | null>(null);
  const offset = useRef<Scatter>({ x: 0, y: 0, z: 0, rx: 0, ry: 0 });
  const eased = useRef({ explode: 0, lift: 0 });
  const sim = useRef({ t: secondsSinceMidnight(), rotor: 0, rotorVel: 0, ratchet: 0, wall: 0 });
  const springPoints = useMemo(() => new Float32Array(260 * 3), []);
  const springGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(hairspringPoints(11, 0.45, 2.55, 0, springPoints), 3),
    );
    return geometry;
  }, [springPoints]);
  const springLine = useMemo(
    () => new THREE.Line(springGeometry, new THREE.LineBasicMaterial({ color: "#d9dde3" })),
    [springGeometry],
  );

  useFrame((_, rawDelta) => {
    const c = controls.current;
    const delta = Math.min(rawDelta, 0.1);
    const s = sim.current;
    s.wall += delta;
    s.t += delta * c.timeScale;
    const pose = trainPose(s.t);

    // Explode: ease towards the target so scroll and sliders feel physical
    if (!index.current && root.current) {
      const layers: LayerEntry[] = [];
      const spinners = new Map<string, THREE.Object3D>();
      const box = new THREE.Box3();
      const centre = new THREE.Vector3();
      root.current.traverse((o) => {
        if (o.name.startsWith("layer:")) {
          box.setFromObject(o).getCenter(centre);
          const name = o.name.slice(6);
          layers.push({
            name,
            group: o,
            base: o.position.clone(),
            centre: [centre.x, centre.y],
            seed: seedOf(name),
          });
        } else if (o.name.startsWith("spin:")) spinners.set(o.name.slice(5), o);
      });
      index.current = { layers, spin: spinners };
    }
    const found = index.current;
    if (!found) return;
    const ease = Math.min(1, delta * 4);
    const e = eased.current;
    e.explode += (c.explode - e.explode) * ease;
    e.lift += (c.lift - e.lift) * ease;
    for (const layer of found.layers) {
      const layerIndex = EXPLODE_LAYER[layer.name] ?? 0;
      const lifted =
        layerIndex >= COVER_LAYER
          ? e.lift * LIFT_HEIGHT * (1 + (layerIndex - COVER_LAYER) * 0.35)
          : 0;
      const o = scatter(layer.centre, layerIndex, layer.seed, e.explode, offset.current);
      layer.group.position.set(layer.base.x + o.x, layer.base.y + o.y, layer.base.z + o.z + lifted);
      layer.group.rotation.set(o.rx, o.ry, 0);
    }

    const set = (name: string, angle: number) => {
      const o = found.spin.get(name);
      if (o) o.rotation.z = angle;
    };
    set("barrel", pose.arbors.barrel);
    set("centre", pose.arbors.centre);
    set("third", pose.arbors.third);
    set("fourth", pose.arbors.fourth);
    set("escape", pose.arbors.escape);
    set("pallet", angleOf(ARBOR.pallet, ARBOR.balance) + pose.pallet);
    set("balance", pose.balance);
    hairspringPoints(11, 0.45, 2.55, pose.balance, springPoints);
    springGeometry.getAttribute("position").needsUpdate = true;

    // Wrist motion: a lazy pendulum, plus whatever the winding control asks for
    const wrist = Math.sin(s.wall * 0.7) * 0.9 + Math.sin(s.wall * 0.23) * 1.6;
    const target = wrist + c.windTurns * TAU;
    const previous = s.rotor;
    s.rotor += (target - s.rotor) * Math.min(1, delta * 2);
    const travel = Math.abs(s.rotor - previous);
    // The reversers rectify both directions; a ~1:150 reduction reaches the ratchet wheel
    s.ratchet += travel / 150 + c.crownWinding * delta * 0.8;
    set("rotor", s.rotor);
    set("reverserA", s.rotor * 3.1);
    set("reverserB", -s.rotor * 3.1);
    set("transmission", s.ratchet * 12);
    set("ratchet", -s.ratchet);
    set("crown", s.ratchet * (RATCHET.teeth / CROWN.teeth));

    // Hands show the simulated time, which starts at the real local time
    set("hour", (s.t / 43_200) * TAU);
    set("minute", (s.t / 3600) * TAU);
    set("second", Math.abs(pose.arbors.fourth));

    // Highlight: the selected part glows; in energy view a pulse runs along the power path
    const now = s.wall;
    for (const [part, set] of materials.perPart) {
      let glow = 0;
      if (c.selected === part) glow = 0.35 + 0.15 * Math.sin(now * 4);
      else if (c.hovered === part) glow = 0.2;
      if (c.energy) {
        const index = ENERGY_PATH.indexOf(part);
        if (index >= 0) {
          const phase = (now * 1.6 - index * 0.55) % (ENERGY_PATH.length * 0.55);
          glow = Math.max(glow, Math.max(0, 1 - Math.abs(phase) * 2.2) * 0.8);
        }
      }
      for (const m of Object.values(set)) {
        m.emissive.setRGB(0.95 * glow, 0.62 * glow, 0.2 * glow);
      }
    }
  });

  const pick = (part: PartId) => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect?.(part);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onHover?.(part);
    },
    onPointerOut: () => onHover?.(null),
  });

  const bridgeTop = Z.bridge + Z.bridgeHeight / 2 + 0.08;
  const cockTop = Z.cock + 0.25 + 0.08;
  const palletDir = angleOf(ARBOR.pallet, ARBOR.balance);

  return (
    <PartContext value={{ mat, pick }}>
      <group ref={root}>
        {/* Dial side */}
        <group name="layer:dial">
          <Mesh geometry={g.dial} material="dial" part="dial" position={[0, 0, Z.dial]} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * TAU;
            const r = MOVEMENT_RADIUS - 2.1;
            return (
              <Mesh
                key={i}
                geometry={i === 0 ? g.indexTwelve : g.index}
                material="hands"
                part="dial"
                position={[-Math.sin(a) * r, Math.cos(a) * r, Z.dial - 0.2]}
                rotation={[0, 0, a]}
              />
            );
          })}
        </group>
        <group name="layer:hands">
          <group name="spin:hour" position={[0, 0, Z.hands + 0.25]}>
            <Mesh geometry={g.hourHand} material="hands" part="dial" />
          </group>
          <group name="spin:minute" position={[0, 0, Z.hands + 0.1]}>
            <Mesh geometry={g.minuteHand} material="hands" part="dial" />
          </group>
          <group name="spin:second" position={[0, 0, Z.hands - 0.05]}>
            <Mesh geometry={g.secondHand} material="hands" part="dial" />
          </group>
          <Mesh
            geometry={g.handCap}
            material="hands"
            part="dial"
            position={[0, 0, Z.hands - 0.15]}
          />
        </group>

        {/* Frame */}
        <group name="layer:plate">
          <Mesh
            geometry={g.plate}
            material="plate"
            part="plate"
            position={[0, 0, (Z.plate + Z.plateTop) / 2]}
          />
        </group>

        {/* Mainspring barrel */}
        <group name="layer:barrel" position={at(ARBOR.barrel)}>
          <group name="spin:barrel">
            <Mesh
              geometry={g.barrelDrum}
              material="gilt"
              part="barrel"
              position={[0, 0, Z.barrel + Z.barrelHeight / 2]}
            />
            <Mesh
              geometry={g.barrelTeeth}
              material="gilt"
              part="barrel"
              position={[0, 0, Z.barrel + 0.3]}
            />
            <Mesh
              geometry={g.barrelCover}
              material="gilt"
              part="barrel"
              position={[0, 0, Z.barrel + Z.barrelHeight + 0.02]}
            />
          </group>
          <Mesh
            geometry={g.barrelArbor}
            material="steel"
            part="barrel"
            position={[0, 0, Z.barrel + Z.barrelHeight + 0.1]}
          />
        </group>

        {/* Going train */}
        <group name="layer:centre" position={at(ARBOR.centre)}>
          <group name="spin:centre">
            <Mesh
              geometry={g.centreWheel}
              material="gilt"
              part="centre"
              position={[0, 0, Z.centre]}
            />
            <Mesh
              geometry={g.centrePinion}
              material="steel"
              part="centre"
              position={[0, 0, Z.barrel + 0.55]}
            />
            <Mesh geometry={g.arbor(3)} material="steel" part="centre" position={[0, 0, 2.3]} />
          </group>
        </group>
        <group name="layer:third" position={at(ARBOR.third)}>
          <group name="spin:third">
            <Mesh geometry={g.thirdWheel} material="gilt" part="third" position={[0, 0, Z.third]} />
            <Mesh
              geometry={g.thirdPinion}
              material="steel"
              part="third"
              position={[0, 0, Z.centre + 0.05]}
            />
            <Mesh geometry={g.arbor(2.9)} material="steel" part="third" position={[0, 0, 2.45]} />
          </group>
        </group>
        <group name="layer:fourth" position={at(ARBOR.fourth)}>
          <group name="spin:fourth">
            <Mesh
              geometry={g.fourthWheel}
              material="gilt"
              part="fourth"
              position={[0, 0, Z.fourth]}
            />
            <Mesh
              geometry={g.fourthPinion}
              material="steel"
              part="fourth"
              position={[0, 0, Z.third]}
            />
            <Mesh geometry={g.arbor(3.1)} material="steel" part="fourth" position={[0, 0, 2.5]} />
          </group>
        </group>

        {/* Escapement */}
        <group name="layer:escape" position={at(ARBOR.escape)}>
          <group name="spin:escape">
            <Mesh
              geometry={g.escapeWheel}
              material="polished"
              part="escape"
              position={[0, 0, Z.escape]}
            />
            <Mesh geometry={g.escapePinion} material="steel" part="escape" position={[0, 0, 2.4]} />
            <Mesh geometry={g.arbor(2.8)} material="steel" part="escape" position={[0, 0, 2.4]} />
          </group>
        </group>
        <group name="layer:pallet" position={at(ARBOR.pallet)}>
          <group name="spin:pallet" rotation={[0, 0, palletDir]}>
            <Mesh
              geometry={g.pallet}
              material="polished"
              part="pallet"
              position={[0, 0, Z.pallet]}
            />
            <Mesh
              geometry={g.palletStone}
              material="ruby"
              part="pallet"
              position={[-1.08, 1.27, Z.pallet]}
              rotation={[0, 0, -0.95]}
            />
            <Mesh
              geometry={g.palletStone}
              material="ruby"
              part="pallet"
              position={[-1.08, -1.27, Z.pallet]}
              rotation={[0, 0, 0.95]}
            />
            <Mesh geometry={g.arbor(2.2)} material="steel" part="pallet" position={[0, 0, 2.6]} />
          </group>
        </group>

        {/* Regulating organ */}
        <group name="layer:balance" position={at(ARBOR.balance)}>
          <group name="spin:balance">
            <Mesh
              geometry={g.balance}
              material="balance"
              part="balance"
              position={[0, 0, Z.balance]}
            />
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * TAU + Math.PI / 4;
              const r = BALANCE_RADIUS - 0.2;
              return (
                <Mesh
                  key={i}
                  geometry={g.balanceScrew}
                  material="balance"
                  part="balance"
                  position={[Math.cos(a) * r, Math.sin(a) * r, Z.balance]}
                />
              );
            })}
            <Mesh
              geometry={g.roller}
              material="polished"
              part="balance"
              position={[0, 0, Z.pallet + 0.05]}
            />
            <Mesh
              geometry={g.impulsePin}
              material="ruby"
              part="balance"
              position={[
                Math.cos(palletDir + Math.PI) * 0.85,
                Math.sin(palletDir + Math.PI) * 0.85,
                Z.pallet,
              ]}
            />
            <Mesh geometry={g.arbor(2.4)} material="steel" part="balance" position={[0, 0, 2.9]} />
          </group>
          <primitive
            object={springLine}
            position={[0, 0, Z.hairspring]}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onSelect?.("hairspring");
            }}
          />
        </group>

        {/* Bridges, jewels and screws */}
        <group name="layer:bridges">
          <Mesh
            geometry={g.barrelBridge}
            material="bridge"
            part="bridges"
            position={[0, 0, Z.bridge]}
          />
          <Mesh
            geometry={g.trainBridge}
            material="bridge"
            part="bridges"
            position={[0, 0, Z.bridge]}
          />
          <Mesh
            geometry={g.palletBridge}
            material="bridge"
            part="bridges"
            position={[0, 0, Z.bridge]}
          />
          {[ARBOR.centre, ARBOR.third, ARBOR.fourth, ARBOR.escape, ARBOR.pallet].map((p, i) => (
            <Jewel g={g} key={i} p={p} z={bridgeTop} />
          ))}
          {[
            polar(11.2, 175),
            polar(10.4, 210),
            add(ARBOR.centre, polar(1.9, 70)),
            polar(10.2, 300),
            add(ARBOR.third, polar(1.6, 20)),
            add(ARBOR.pallet, polar(2.4, -55)),
          ].map((p, i) => (
            <Screw g={g} key={i} p={p} z={bridgeTop} part="bridges" />
          ))}
        </group>
        <group name="layer:cock">
          <Mesh geometry={g.cock} material="bridge" part="cock" position={[0, 0, Z.cock]} />
          <Jewel g={g} p={ARBOR.balance} z={cockTop} />
          <Mesh
            geometry={g.shockSpring}
            material="hands"
            part="cock"
            position={at(ARBOR.balance, cockTop + 0.08)}
          />
          <Screw g={g} p={COCK_ANCHOR} z={cockTop} part="cock" />
        </group>

        {/* Winding */}
        <group name="layer:ratchet">
          <group position={at(ARBOR.barrel, Z.ratchet)} name="spin:ratchet">
            <Mesh geometry={g.ratchet} material="ratchet" part="ratchet" />
          </group>
          <Screw g={g} p={ARBOR.barrel} z={Z.ratchet + 0.25} part="ratchet" />
          <group position={at(CROWN_POS, Z.ratchet)} name="spin:crown">
            <Mesh geometry={g.crown} material="ratchet" part="ratchet" />
          </group>
          <Screw g={g} p={CROWN_POS} z={Z.ratchet + 0.22} part="ratchet" />
        </group>
        <group name="layer:reverser">
          <group position={at(REVERSER_POS[0]!, Z.reverser)} name="spin:reverserA">
            <Mesh geometry={g.reverser} material="gilt" part="reverser" />
          </group>
          <group position={at(REVERSER_POS[1]!, Z.reverser)} name="spin:reverserB">
            <Mesh geometry={g.reverser} material="gilt" part="reverser" />
          </group>
          <group position={at(TRANSMISSION_POS, Z.reverser)} name="spin:transmission">
            <Mesh geometry={g.transmission} material="gilt" part="reverser" />
          </group>
        </group>
        <group name="layer:rotor">
          <group name="spin:rotor">
            <Mesh geometry={g.rotor} material="rotor" part="rotor" position={[0, 0, Z.rotor]} />
            <Mesh
              geometry={g.rotorRim}
              material="rotor"
              part="rotor"
              position={[0, 0, Z.rotor - 0.1]}
            />
          </group>
          <Mesh geometry={g.bearing} material="polished" part="rotor" position={[0, 0, Z.rotor]} />
        </group>
      </group>
    </PartContext>
  );
}

function secondsSinceMidnight() {
  const now = new Date();
  return (
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000
  );
}
