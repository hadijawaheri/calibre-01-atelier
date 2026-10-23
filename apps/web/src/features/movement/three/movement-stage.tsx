"use client";

import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

import type { PartId } from "../parts";
import type { CadModel } from "./cad-model";
import { CadMovement } from "./cad-movement";
import type { MovementControls } from "./controls";
import { MovementModel } from "./movement-model";

interface MovementStageProps {
  controls: React.RefObject<MovementControls>;
  orbit?: boolean;
  onSelect?: (id: PartId | null) => void;
  onHover?: (id: PartId | null) => void;
  /** The visitor took the camera; scripted views must stop steering it. */
  onOrbitStart?: () => void;
  /** studio: a light table that darkens as the movement comes apart; night: always dark, for dark pages. */
  backdrop?: "studio" | "night";
  cad?: CadModel;
  className?: string;
  label: string;
}

// The page's own ivory and matte black, so the stage reads as the same room
const LIGHT = new THREE.Color("#ece8e0");
const DARK = new THREE.Color("#080706");
const FLOOR_Z = -4.6;

/** The room behind the movement. Like the reference films, the light studio turns dark while the parts float. */
function Backdrop({
  controls,
  mode,
}: {
  controls: React.RefObject<MovementControls>;
  mode: "studio" | "night";
}) {
  const background = useRef<THREE.Color>(null);
  const dark = useRef(mode === "night" ? 1 : 0);

  useFrame((_, delta) => {
    const goal = mode === "night" ? 1 : Math.min(1, controls.current.explode * 1.6);
    dark.current += (goal - dark.current) * Math.min(1, delta * 2);
    background.current?.copy(LIGHT).lerp(DARK, dark.current);
  });

  // No lit table: a lit plane drifts off the page's colour under the studio lights, so only the contact shadow
  // grounds the movement and the room stays exactly the page's ivory or black
  return <color ref={background} attach="background" args={[mode === "night" ? DARK : LIGHT]} />;
}

/** Studio lighting built from light panels, so the scene needs no HDR file from the network. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      {/* A grey cyclorama: polished steel looks like steel only when it has a bright room to reflect */}
      <color attach="background" args={["#4a4b50"]} />
      <Lightformer
        form="rect"
        intensity={4}
        color="#ffffff"
        position={[0, 0, 14]}
        scale={[22, 22, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#fff4e2"
        position={[0, -14, 6]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[30, 6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.4}
        color="#dfe8ff"
        position={[-14, 4, 4]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[20, 5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.4}
        color="#ffffff"
        position={[14, 4, 4]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[20, 5, 1]}
      />
      <Lightformer form="ring" intensity={3} color="#ffe9c4" position={[6, -6, 12]} scale={5} />
    </Environment>
  );
}

function CameraRig({
  controls,
  orbit,
  onOrbitStart,
}: {
  controls: React.RefObject<MovementControls>;
  orbit: boolean;
  onOrbitStart?: () => void;
}) {
  const orbitRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const target = useRef(new THREE.Vector3());
  const goal = useRef(new THREE.Vector3());
  const goalTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const view = controls.current.view;
    if (!view) return;
    const k = Math.min(1, delta * 2.5);
    goalTarget.current.set(...view.target);
    // Views are framed for landscape; on a phone held upright the camera backs off so the movement still fits
    const fit = aspect < 1 ? Math.min(2.2, Math.max(1, 0.8 / aspect)) : 1;
    goal.current
      .set(...view.position)
      .sub(goalTarget.current)
      .multiplyScalar(fit)
      .add(goalTarget.current);
    camera.position.lerp(goal.current, k);
    target.current.lerp(goalTarget.current, k);
    if (orbitRef.current) {
      orbitRef.current.target.copy(target.current);
      orbitRef.current.update();
    } else {
      camera.lookAt(target.current);
    }
  });

  return orbit ? (
    <OrbitControls
      ref={orbitRef}
      enablePan={false}
      minDistance={18}
      maxDistance={120}
      enableDamping
      dampingFactor={0.08}
      onStart={onOrbitStart}
    />
  ) : null;
}

export default function MovementStage({
  controls,
  orbit = false,
  onSelect,
  onHover,
  onOrbitStart,
  backdrop = "studio",
  cad,
  className,
  label,
}: MovementStageProps) {
  return (
    <div className={className} role="img" aria-label={label}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, -62, 26], fov: 30, near: 0.5, far: 600, up: [0, 0, 1] }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
        onPointerMissed={() => onSelect?.(null)}
      >
        <Studio />
        <Backdrop controls={controls} mode={backdrop} />
        <ambientLight intensity={0.08} />
        <directionalLight position={[8, -6, 20]} intensity={1.1} color="#fff3df" />
        <directionalLight position={[-10, 8, 6]} intensity={0.35} color="#c9d7ff" />
        {cad ? (
          <Suspense fallback={null}>
            <CadMovement model={cad} controls={controls} onSelect={onSelect} onHover={onHover} />
          </Suspense>
        ) : (
          <MovementModel controls={controls} onSelect={onSelect} onHover={onHover} />
        )}
        <ContactShadows
          position={[0, 0, FLOOR_Z]}
          rotation={[Math.PI / 2, 0, 0]}
          opacity={0.55}
          scale={70}
          blur={2.6}
          far={30}
        />
        <CameraRig controls={controls} orbit={orbit} onOrbitStart={onOrbitStart} />
      </Canvas>
    </div>
  );
}
