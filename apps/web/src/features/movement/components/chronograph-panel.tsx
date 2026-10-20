"use client";

import { RotateCcw, Timer } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { formatChronograph } from "../chronograph";

interface ChronographPanelProps {
  running: boolean;
  onRunningChange: (running: boolean) => void;
  /** Every push turns the column wheel by one column */
  onPush: () => void;
}

export function ChronographPanel({ running, onRunningChange, onPush }: ChronographPanelProps) {
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!running || startedAt === null) return;
    // A 5 Hz movement resolves tenths of a second, so the display does too
    const id = window.setInterval(() => setElapsed(performance.now() - startedAt), 100);
    return () => window.clearInterval(id);
  }, [running, startedAt]);

  const startStop = () => {
    onPush();
    if (running) {
      onRunningChange(false);
      return;
    }
    setStartedAt(performance.now() - elapsed);
    onRunningChange(true);
  };

  const reset = () => {
    onPush();
    setElapsed(0);
    setStartedAt(null);
  };

  return (
    <div className="border-border bg-card/60 flex items-center justify-between gap-3 border px-4 py-3">
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">کرونوگراف، دقت یک‌دهم ثانیه</span>
        <output className="text-3xl font-light tabular-nums" aria-live="off" dir="ltr">
          {formatChronograph(elapsed)}
        </output>
      </div>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={startStop} className="rounded-none">
          <Timer data-icon="inline-start" />
          {running ? "توقف" : "استارت"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={reset}
          disabled={running || elapsed === 0}
          aria-label="صفر کردن کرونوگراف"
          className="rounded-none"
        >
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}
