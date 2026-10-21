"use client";

import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { trainPose } from "../kinematics";
import type { PartId } from "../parts";
import { ENERGY_PATH } from "../parts";
import type { CadModel, CadRule, CadSpin } from "./cad-model";
import type { MovementControls } from "./controls";
import { createMaterials, disposeMaterials } from "./materials";
import type { Scatter } from "./scatter";
import { scatter, seedOf } from "./scatter";

const COVER_LAYER = 4;
const LIFT_HEIGHT = 9;
const TAU = Math.PI * 2;

interface Unit {
  /** Moves the unit when the movement comes apart. */
  holder: THREE.Group;
  /** Sits on the unit's own axis, so spinning turns it in place. */
  pivot: THREE.Group;
  rule: Omit<CadRule, "match">;
  base: THREE.Vector3;
  centre: [number, number];
  seed: number;
}

interface Prepared {
  root: THREE.Group;
  units: Unit[];
  /** Per-part materials, cloned so a selected part can glow on its own. */
  materials: Map<PartId, THREE.MeshStandardMaterial[]>;
  dispose: () => void;
}

/** CAD exports carry no UVs; a top-down projection in millimetres lets the finish textures land on the faces. */
function planarUvs(mesh: THREE.Mesh) {
  const geometry = mesh.geometry.clone();
  const position = geometry.getAttribute("position");
  const uv = new Float32Array(position.count * 2);
  const p = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    p.fromBufferAttribute(position, i).applyMatrix4(mesh.matrixWorld);
    uv[i * 2] = p.x;
    uv[i * 2 + 1] = p.y;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  mesh.geometry = geometry;
  return geometry;
}

function prepare(source: THREE.Object3D, model: CadModel): Prepared {
  const rules = model.rules.map((rule) => ({ ...rule, re: new RegExp(rule.match, "i") }));
  const ruleFor = (name: string) => rules.find((rule) => rule.re.test(name));

  const scene = source.clone(true);
  if (model.rotation) scene.rotation.set(...model.rotation);
  if (model.scale) scene.scale.setScalar(model.scale);
  scene.updateMatrixWorld(true);

  // Centre the movement on its axis with the dial side of the plate at z = 0, in millimetres
  const box = new THREE.Box3().setFromObject(scene);
  const shift = new THREE.Vector3(
    -(box.min.x + box.max.x) / 2,
    -(box.min.y + box.max.y) / 2,
    -box.min.z - 4.4,
  );

  // A unit is the highest node a rule names, or any mesh no named ancestor claimed
  const claimed: { object: THREE.Object3D; rule: Omit<CadRule, "match"> }[] = [];
  const walk = (object: THREE.Object3D) => {
    const rule = object.name ? ruleFor(object.name) : undefined;
    if (rule) {
      claimed.push({ object, rule });
      return;
    }
    if ((object as THREE.Mesh).isMesh) {
      claimed.push({ object, rule: model.fallback });
      return;
    }
    for (const child of object.children) walk(child);
  };
  walk(scene);

  const base = createMaterials();
  const materials = new Map<PartId, THREE.MeshStandardMaterial[]>();
  const owned: { dispose: () => void }[] = [];
  const cloneFor = (part: PartId, material: THREE.Material) => {
    const copy = (material as THREE.MeshStandardMaterial).clone();
    owned.push(copy);
    const list = materials.get(part) ?? [];
    list.push(copy);
    materials.set(part, list);
    return copy;
  };

  const root = new THREE.Group();
  const units: Unit[] = [];
  const centre = new THREE.Vector3();
  for (const { object, rule } of claimed) {
    object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && rule.material && !mesh.geometry.getAttribute("uv"))
        owned.push(planarUvs(mesh));
    });
    const world = object.matrixWorld.clone();
    box.setFromObject(object).getCenter(centre).add(shift);
    const holder = new THREE.Group();
    const pivot = new THREE.Group();
    holder.position.copy(centre);
    holder.add(pivot);
    // Re-parent with the world transform baked in, measured from the unit's own centre
    object.removeFromParent();
    world.premultiply(
      new THREE.Matrix4().makeTranslation(
        shift.x - centre.x,
        shift.y - centre.y,
        shift.z - centre.z,
      ),
    );
    world.decompose(object.position, object.quaternion, object.scale);
    pivot.add(object);
    object.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.userData.part = rule.part;
      mesh.material = cloneFor(
        rule.part,
        rule.material ? base[rule.material] : (mesh.material as THREE.Material),
      );
    });
    root.add(holder);
    units.push({
      holder,
      pivot,
      rule,
      base: centre.clone(),
      centre: [centre.x, centre.y],
      seed: seedOf(object.name || String(units.length)),
    });
  }

  return {
    root,
    units,
    materials,
    dispose: () => {
      disposeMaterials(base);
      for (const material of owned) material.dispose();
    },
  };
}

interface CadMovementProps {
  model: CadModel;
  controls: React.RefObject<MovementControls>;
  onSelect?: (id: PartId) => void;
  onHover?: (id: PartId | null) => void;
}

/** A real movement converted from its CAD file, taken apart and driven by the same kinematics as the lab. */
export function CadMovement({ model, controls, onSelect, onHover }: CadMovementProps) {
  const gltf = useGLTF(model.url, false, true);
  const prepared = useMemo(() => prepare(gltf.scene, model), [gltf.scene, model]);
  useEffect(() => () => prepared.dispose(), [prepared]);

  const eased = useRef({ explode: 0, lift: 0 });
  const sim = useRef({ t: 0, wall: 0, rotor: 0 });
  const offset = useRef<Scatter>({ x: 0, y: 0, z: 0, rx: 0, ry: 0 });

  useFrame((_, rawDelta) => {
    const c = controls.current;
    const delta = Math.min(rawDelta, 0.1);
    const s = sim.current;
    s.wall += delta;
    s.t += delta * c.timeScale;
    const pose = trainPose(s.t);
    const wrist = Math.sin(s.wall * 0.7) * 0.9 + Math.sin(s.wall * 0.23) * 1.6 + c.windTurns * TAU;
    s.rotor += (wrist - s.rotor) * Math.min(1, delta * 2);
    const angle: Record<CadSpin, number> = {
      ...pose.arbors,
      pallet: pose.pallet,
      balance: pose.balance,
      rotor: s.rotor,
    };

    const ease = Math.min(1, delta * 4);
    const e = eased.current;
    e.explode += (c.explode - e.explode) * ease;
    e.lift += (c.lift - e.lift) * ease;
    for (const unit of prepared.units) {
      const { layer, spin } = unit.rule;
      const lifted =
        layer >= COVER_LAYER ? e.lift * LIFT_HEIGHT * (1 + (layer - COVER_LAYER) * 0.35) : 0;
      const o = scatter(unit.centre, layer, unit.seed, e.explode, offset.current);
      unit.holder.position.set(unit.base.x + o.x, unit.base.y + o.y, unit.base.z + o.z + lifted);
      unit.holder.rotation.set(o.rx, o.ry, 0);
      if (spin) unit.pivot.rotation.set(0, 0, angle[spin]);
    }

    for (const [part, list] of prepared.materials) {
      let glow = 0;
      if (c.selected === part) glow = 0.35 + 0.15 * Math.sin(s.wall * 4);
      else if (c.hovered === part) glow = 0.2;
      if (c.energy) {
        const index = ENERGY_PATH.indexOf(part);
        if (index >= 0) {
          const phase = (s.wall * 1.6 - index * 0.55) % (ENERGY_PATH.length * 0.55);
          glow = Math.max(glow, Math.max(0, 1 - Math.abs(phase) * 2.2) * 0.8);
        }
      }
      for (const m of list) m.emissive.setRGB(0.95 * glow, 0.62 * glow, 0.2 * glow);
    }
  });

  const partOf = (e: ThreeEvent<PointerEvent | MouseEvent>) =>
    e.object.userData.part as PartId | undefined;

  return (
    <primitive
      object={prepared.root}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        const part = partOf(e);
        if (!part) return;
        e.stopPropagation();
        onSelect?.(part);
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover?.(partOf(e) ?? null);
      }}
      onPointerOut={() => onHover?.(null)}
    />
  );
}
