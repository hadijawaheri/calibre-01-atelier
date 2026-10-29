"use client";

import { Mic, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";

import type { Measurement } from "../analyse";
import type { TimegrapherStatus } from "../use-timegrapher";
import { useTimegrapher } from "../use-timegrapher";

const WIDTH = 600;
const HEIGHT = 240;
/** The plot shows the newest beats only, like the paper of a printing timegrapher */
const SHOWN_BEATS = 120;

const signed = (value: number, digits: number) => {
  const rounded = Number(value.toFixed(digits));
  return `${rounded > 0 ? "+" : ""}${new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(rounded)}`;
};

const STATUS_TEXT: Record<Exclude<TimegrapherStatus, "listening" | "idle">, string> = {
  starting: "اجازهٔ استفاده از میکروفون را بدهید…",
  denied:
    "اجازهٔ میکروفون داده نشد. از تنظیمات مرورگر برای این سایت اجازه دهید و دوباره امتحان کنید.",
  unsupported:
    "این مرورگر ضبط صدا را پشتیبانی نمی‌کند. با کروم، فایرفاکس یا سافاری تازه امتحان کنید.",
  failed: "میکروفون باز نشد. اگر برنامهٔ دیگری از آن استفاده می‌کند ببندید و دوباره امتحان کنید.",
};

function Plot({ measurement }: { measurement: Measurement | null }) {
  const points = measurement?.points.slice(-SHOWN_BEATS) ?? [];
  const first = points[0]?.beat ?? 0;
  const last = points.at(-1)?.beat ?? SHOWN_BEATS;
  const centre = points.length
    ? points.reduce((sum, point) => sum + point.offset, 0) / points.length
    : 0;
  // At least ±2 ms, so a steady watch reads as a flat line rather than magnified noise
  const span = Math.max(2, ...points.map((point) => Math.abs(point.offset - centre))) * 1.2;
  const x = (beat: number) => ((beat - first) / Math.max(last - first, 1)) * WIDTH;
  const y = (offset: number) => HEIGHT / 2 - ((offset - centre) / span) * (HEIGHT / 2);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label={
        measurement
          ? `نمودار تیک و تاک: ${formatNumber(points.length)} ضربهٔ آخر`
          : "نمودار تیک و تاک، هنوز خالی"
      }
    >
      <line
        x1={0}
        x2={WIDTH}
        y1={HEIGHT / 2}
        y2={HEIGHT / 2}
        className="stroke-border"
        strokeDasharray="4 6"
      />
      {points.map((point) => (
        <circle
          key={point.beat}
          cx={x(point.beat)}
          cy={y(point.offset)}
          r={2.5}
          className={point.beat % 2 ? "fill-metal-ink" : "fill-foreground"}
        />
      ))}
    </svg>
  );
}

function Reading({ label, latin, value }: { label: string; latin: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 bg-card p-4">
      <dt className="label">{label}</dt>
      <dd className="font-display text-3xl tabular-nums" dir="ltr">
        {value}
      </dd>
      <dd className="caps text-muted-foreground" dir="ltr">
        {latin}
      </dd>
    </div>
  );
}

export function TimegrapherTool() {
  const { status, measurement, heard, start, stop } = useTimegrapher();
  const listening = status === "listening";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        {listening ? (
          <Button variant="outline" onClick={stop}>
            <Square aria-hidden />
            توقف
          </Button>
        ) : (
          <Button onClick={start} disabled={status === "starting"}>
            <Mic aria-hidden />
            شروع گوش دادن
          </Button>
        )}
        <p role="status" className="text-sm leading-7 text-muted-foreground">
          {listening
            ? measurement
              ? `در حال گوش دادن؛ ${formatNumber(measurement.beats)} ضربه در ${formatNumber(Math.round(Math.min(heard, 12)))} ثانیهٔ اخیر.`
              : `ساعت را به میکروفون بچسبانید… ${formatNumber(Math.round(heard))} ثانیه`
            : status === "idle"
              ? "صدا از دستگاه شما بیرون نمی‌رود؛ همه‌چیز در همین مرورگر حساب می‌شود."
              : STATUS_TEXT[status]}
        </p>
      </div>

      <figure className="flex flex-col plate">
        <div className="flex items-baseline justify-between gap-4 border-b border-border px-5 py-3">
          <span className="text-sm">تیک و تاک در برابر ساعت دقیق</span>
          <span className="caps text-muted-foreground" dir="ltr">
            Trace · ms
          </span>
        </div>
        <div className="px-5 py-6">
          <Plot measurement={measurement} />
        </div>
        <figcaption className="border-t border-border px-5 py-3 text-xs leading-6 text-muted-foreground">
          هر نقطه یک ضربه است، تیک‌ها تیره و تاک‌ها مسی. خط رو به بالا یعنی ساعت جلو می‌رود و دو خط
          جدا از هم یعنی خطای ضربه.
        </figcaption>
      </figure>

      <dl className="grid gap-px border border-border bg-border sm:grid-cols-3">
        <Reading
          label="خطای روزانه"
          latin="Rate · s/d"
          value={measurement ? signed(measurement.rate, 0) : "–"}
        />
        <Reading
          label="خطای ضربه"
          latin="Beat error · ms"
          value={measurement ? formatNumber(Number(measurement.beatError.toFixed(1))) : "–"}
        />
        <Reading
          label="ضربه در ساعت"
          latin="Beat · bph"
          value={measurement ? formatNumber(measurement.bph) : "–"}
        />
      </dl>
    </div>
  );
}
