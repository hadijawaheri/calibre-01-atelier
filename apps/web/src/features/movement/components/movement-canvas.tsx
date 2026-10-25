"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { PartId } from "../parts";
import type { CadModel } from "../three/cad-model";
import type { MovementControls } from "../three/controls";

// WebGL and three.js only exist in the browser; the server renders the poster underneath
const MovementStage = dynamic(() => import("../three/movement-stage"), {
  ssr: false,
  loading: () => <StagePoster busy />,
});

function StagePoster({ busy = false, message }: { busy?: boolean; message?: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-busy={busy || undefined}>
      <div className="flex flex-col items-center gap-4 text-center">
        <Skeleton className="size-40 rounded-full motion-reduce:animate-none" />
        {message && <p className="max-w-xs text-sm leading-7 text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}

let webglSupport: boolean | undefined;
function detectWebgl(): boolean {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const subscribe = () => () => {};

interface MovementCanvasProps {
  controls: React.RefObject<MovementControls>;
  orbit?: boolean;
  onSelect?: (id: PartId | null) => void;
  onHover?: (id: PartId | null) => void;
  onOrbitStart?: () => void;
  backdrop?: "studio" | "night";
  cad?: CadModel;
  className?: string;
  /** What the custom cursor says over the stage. */
  "data-cursor"?: string;
}

export function MovementCanvas({
  className,
  "data-cursor": cursor,
  ...props
}: MovementCanvasProps) {
  const supported = useSyncExternalStore(subscribe, detectWebgl, () => true);
  return (
    <div className={cn("relative", className)} data-cursor={cursor}>
      {supported ? (
        <MovementStage
          {...props}
          className="absolute inset-0"
          label="مدل سه‌بعدی موومنت اتوماتیک در حال کار؛ قطعه‌ها را می‌توان جدا کرد و بررسی کرد"
        />
      ) : (
        <StagePoster message="مرورگر شما از WebGL پشتیبانی نمی‌کند، پس مدل سه‌بعدی نمایش داده نمی‌شود. توضیح قطعه‌ها همچنان در دسترس است." />
      )}
    </div>
  );
}
