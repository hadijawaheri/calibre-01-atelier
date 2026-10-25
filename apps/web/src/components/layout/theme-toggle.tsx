"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const noop = () => () => {};

/** Switches between the ivory and obsidian themes; the system preference decides until the visitor chooses. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only known in the browser; the server renders a neutral button to match the first paint
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const dark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "تم روشن" : "تم تیره"}
      title={dark ? "تم روشن" : "تم تیره"}
    >
      {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </Button>
  );
}
