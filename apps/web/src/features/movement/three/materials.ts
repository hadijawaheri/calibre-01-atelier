/* Physical materials of a fine movement. Finishes (Côtes de Genève, perlage, snailing) are drawn once
   on a canvas and used as roughness and bump maps, so the stripes catch the studio light like the real
   thing instead of being painted on. */
import * as THREE from "three";

const SIZE = 512;

function canvasTexture(
  draw: (ctx: CanvasRenderingContext2D) => void,
  repeat: number,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // UVs of extruded caps are in millimetres; one canvas tile covers `1 / repeat` mm
  texture.repeat.set(repeat, repeat);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

/** Parallel bands, each made of fine concentric arcs left by a rotating polishing wheel. */
function cotesDeGeneve(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, SIZE, SIZE);
  const bands = 4;
  const w = SIZE / bands;
  for (let b = 0; b < bands; b++) {
    const x0 = b * w;
    const g = ctx.createLinearGradient(x0, 0, x0 + w, 0);
    g.addColorStop(0, "#5a5a5a");
    g.addColorStop(0.5, "#b0b0b0");
    g.addColorStop(1, "#5a5a5a");
    ctx.fillStyle = g;
    ctx.fillRect(x0, 0, w, SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, 0, w, SIZE);
    ctx.clip();
    ctx.lineWidth = 1;
    for (let k = 0; k < 140; k++) {
      const r = SIZE * 0.6 + k * 2.2;
      ctx.strokeStyle = k % 2 ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";
      ctx.beginPath();
      ctx.arc(x0 + w / 2, SIZE * 1.55, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(x0, 0, 1.5, SIZE);
  }
}

/** Overlapping spots, each with radial brushing, laid in offset rows. */
function perlage(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#777";
  ctx.fillRect(0, 0, SIZE, SIZE);
  const r = SIZE / 8;
  const step = r * 1.15;
  for (let row = -1; row < SIZE / step + 1; row++) {
    for (let col = -1; col < SIZE / step + 1; col++) {
      const cx = col * step + (row % 2 ? step / 2 : 0);
      const cy = row * step;
      const g = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r);
      g.addColorStop(0, "#c8c8c8");
      g.addColorStop(0.7, "#8c8c8c");
      g.addColorStop(1, "#4a4a4a");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      for (let k = 0; k < 36; k++) {
        const a = (k / 36) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.stroke();
      }
    }
  }
}

/** Sunray brushing for the dial and the ratchet wheel. */
function sunray(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, SIZE, SIZE);
  const c = SIZE / 2;
  for (let k = 0; k < 720; k++) {
    const a = (k / 720) * Math.PI * 2;
    ctx.strokeStyle = k % 2 ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.lineTo(c + Math.cos(a) * SIZE, c + Math.sin(a) * SIZE);
    ctx.stroke();
  }
}

export interface MovementMaterials {
  plate: THREE.MeshPhysicalMaterial;
  bridge: THREE.MeshPhysicalMaterial;
  gilt: THREE.MeshPhysicalMaterial;
  steel: THREE.MeshPhysicalMaterial;
  polished: THREE.MeshPhysicalMaterial;
  balance: THREE.MeshPhysicalMaterial;
  ruby: THREE.MeshPhysicalMaterial;
  blued: THREE.MeshPhysicalMaterial;
  rotor: THREE.MeshPhysicalMaterial;
  dial: THREE.MeshPhysicalMaterial;
  hands: THREE.MeshPhysicalMaterial;
  ratchet: THREE.MeshPhysicalMaterial;
}

export function createMaterials(): MovementMaterials {
  const stripes = canvasTexture(cotesDeGeneve, 1 / 9);
  const pearls = canvasTexture(perlage, 1 / 5);
  const rays = canvasTexture(sunray, 1 / 26);
  rays.offset.set(0.5, 0.5);
  const raysSmall = canvasTexture(sunray, 1 / 5);
  raysSmall.offset.set(0.5, 0.5);

  const metal = (params: THREE.MeshPhysicalMaterialParameters) =>
    new THREE.MeshPhysicalMaterial({ metalness: 1, envMapIntensity: 1.1, ...params });

  return {
    plate: metal({
      color: "#cfd3d8",
      roughness: 0.42,
      roughnessMap: pearls,
      bumpMap: pearls,
      bumpScale: 0.15,
    }),
    bridge: metal({
      color: "#dde1e6",
      roughness: 0.32,
      roughnessMap: stripes,
      bumpMap: stripes,
      bumpScale: 0.2,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
    }),
    gilt: metal({ color: "#d9b46a", roughness: 0.28 }),
    steel: metal({ color: "#c7ccd2", roughness: 0.18 }),
    polished: metal({ color: "#e9ecef", roughness: 0.06 }),
    balance: metal({ color: "#cfa660", roughness: 0.22 }),
    ruby: new THREE.MeshPhysicalMaterial({
      color: "#b3122d",
      roughness: 0.04,
      metalness: 0,
      transmission: 0.55,
      thickness: 0.4,
      ior: 1.76,
      clearcoat: 1,
      attenuationColor: new THREE.Color("#5a0010"),
      attenuationDistance: 0.4,
    }),
    blued: metal({ color: "#25428f", roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05 }),
    rotor: metal({
      color: "#e2bd72",
      roughness: 0.3,
      roughnessMap: stripes,
      bumpMap: stripes,
      bumpScale: 0.2,
      clearcoat: 0.4,
    }),
    dial: new THREE.MeshPhysicalMaterial({
      color: "#0f1f3a",
      metalness: 0.6,
      roughness: 0.35,
      roughnessMap: rays,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    hands: metal({ color: "#e8c98a", roughness: 0.12 }),
    ratchet: metal({
      color: "#d6dae0",
      roughness: 0.25,
      roughnessMap: raysSmall,
      bumpMap: raysSmall,
      bumpScale: 0.4,
    }),
  };
}

export function disposeMaterials(materials: MovementMaterials) {
  for (const material of Object.values(materials)) {
    for (const key of ["roughnessMap", "bumpMap"] as const) material[key]?.dispose();
    material.dispose();
  }
}
