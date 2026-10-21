# 0005. A watch reference site with real CAD movements

Status: accepted

The store is gone. Kronos is now a Persian watch encyclopedia in the spirit of Fragrantica: model and calibre pages,
brand history, and later reviews, ratings and have/had/want lists. The shop code stays readable in PR #1. The API and
contracts stay in the repo for the community features.

The centre of the site is the movement lab. The owner asked for real movements, not drawings, so:

- 3D movements come from CAD files of real calibres (STEP), converted by `apps/web/scripts/step-to-glb.mjs`
  (OpenCascade via `occt-import-js`, then glTF-Transform with meshopt). Every CAD part stays a named node, and
  `CadModel` rules in `calibres.ts` map those names to lab parts, explode layers, finishes and spinning arbors.
- Until a family's CAD file arrives, its page shows the facts and an honest "model on its way" panel. The automatic
  calibre keeps a procedural stand-in, built to the real ETA 2824-2 gear ratios, so the lab works today.
- The explode follows the owner's reference films: parts rise by layer and drift outward with a slight tumble, and the
  studio darkens while they float. Lighting is built from drei Lightformers, so no HDR file is fetched.
- Kinematics (beat rate, train ratios, balance amplitude) live in plain functions with unit tests and drive both the
  procedural and the CAD model.
