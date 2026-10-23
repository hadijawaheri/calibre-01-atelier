import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The movement standing still in a section, for visitors who asked for less motion. Once the travelling movement
 * is flying (`data-flight=on`), it takes this place and the still steps aside.
 */
export function StillMovement({
  side = "caseback",
  className,
}: {
  side?: "caseback" | "dial";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none relative aspect-[1500/635] [[data-flight=on]_&]:hidden",
        className,
      )}
    >
      <Image
        src={`/media/movement-cutout/${side}.webp`}
        alt=""
        fill
        sizes="(max-width: 1023px) 90vw, 40rem"
        className="object-contain drop-shadow-(--object-shadow)"
      />
    </div>
  );
}
