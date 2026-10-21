// Converts a CAD movement (STEP) into a compact GLB for the browser, keeping every part as its own
// named node so the lab can take the movement apart.
//
//   node scripts/step-to-glb.mjs <input.stp> <output.glb> [--deflection 0.004] [--simplify 0.5]
//
/* eslint-disable no-console -- a command-line tool reports its progress on stdout */
// --deflection is the tessellation tolerance in millimetres; --simplify keeps that share of triangles.
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

import { Document, NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRMeshQuantization } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, simplify, weld } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";

const require = createRequire(import.meta.url);
const occtimportjs = require("occt-import-js");

const args = process.argv.slice(2);
const [input, output] = args.filter((a) => !a.startsWith("--") && !/^[\d.]+$/.test(a));
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : fallback;
};
if (!input || !output) {
  console.error(
    "usage: node scripts/step-to-glb.mjs <input.stp> <output.glb> [--deflection 0.004] [--simplify 0.5]",
  );
  process.exit(1);
}
const deflection = option("deflection", 0.004);
const keep = option("simplify", 1);

console.log(`Reading ${path.basename(input)} …`);
const occt = await occtimportjs();
const result = occt.ReadStepFile(new Uint8Array(await readFile(input)), {
  linearUnit: "millimeter",
  linearDeflectionType: "absolute_value",
  linearDeflection: deflection,
  angularDeflection: 0.35,
});
if (!result.success) {
  console.error("The STEP file could not be read.");
  process.exit(1);
}
console.log(`${result.meshes.length} solids`);

const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene("movement");
const materials = new Map();
const materialFor = (color) => {
  const key = color ? color.map((c) => c.toFixed(3)).join(",") : "default";
  if (!materials.has(key)) {
    const [r, g, b] = color ?? [0.8, 0.8, 0.8];
    materials.set(
      key,
      doc
        .createMaterial(`cad-${materials.size}`)
        .setBaseColorFactor([r, g, b, 1])
        .setMetallicFactor(1)
        .setRoughnessFactor(0.3),
    );
  }
  return materials.get(key);
};

const meshes = result.meshes.map((m, i) => {
  const prim = doc
    .createPrimitive()
    .setAttribute(
      "POSITION",
      doc
        .createAccessor()
        .setType("VEC3")
        .setArray(new Float32Array(m.attributes.position.array))
        .setBuffer(buffer),
    )
    .setIndices(
      doc
        .createAccessor()
        .setType("SCALAR")
        .setArray(new Uint32Array(m.index.array))
        .setBuffer(buffer),
    )
    .setMaterial(materialFor(m.color));
  if (m.attributes.normal) {
    prim.setAttribute(
      "NORMAL",
      doc
        .createAccessor()
        .setType("VEC3")
        .setArray(new Float32Array(m.attributes.normal.array))
        .setBuffer(buffer),
    );
  }
  return doc.createMesh(m.name || `part-${i}`).addPrimitive(prim);
});

const names = new Map();
const unique = (name) => {
  const base = (name || "part").trim() || "part";
  const n = names.get(base) ?? 0;
  names.set(base, n + 1);
  return n ? `${base}.${n}` : base;
};
const build = (node) => {
  const out = doc.createNode(unique(node.name));
  for (const index of node.meshes ?? []) {
    out.addChild(
      doc.createNode(unique(result.meshes[index].name || node.name)).setMesh(meshes[index]),
    );
  }
  for (const child of node.children ?? []) out.addChild(build(child));
  return out;
};
scene.addChild(build(result.root));

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
doc.createExtension(KHRMeshQuantization);
doc
  .createExtension(EXTMeshoptCompression)
  .setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
const transforms = [weld(), dedup()];
if (keep < 1)
  transforms.push(simplify({ simplifier: MeshoptSimplifier, ratio: keep, error: 0.0005 }));
transforms.push(prune(), meshopt({ encoder: MeshoptEncoder, level: "medium" }));
await doc.transform(...transforms);

const io = new NodeIO()
  .registerExtensions([KHRMeshQuantization, EXTMeshoptCompression])
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });
const glb = await io.writeBinary(doc);
await writeFile(output, glb);

let triangles = 0;
for (const mesh of doc.getRoot().listMeshes())
  for (const p of mesh.listPrimitives()) triangles += (p.getIndices()?.getCount() ?? 0) / 3;
console.log(
  `Wrote ${output}: ${(glb.byteLength / 1e6).toFixed(2)} MB, ${Math.round(triangles).toLocaleString()} triangles, ${doc.getRoot().listNodes().length} nodes`,
);
