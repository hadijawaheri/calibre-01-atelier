import type { ReviewOwnership, ReviewStatus } from "@kronos/contracts";

import { formatNumber } from "@/lib/format";

export const OWNERSHIP_LABELS: Record<ReviewOwnership, string> = {
  owner: "این ساعت را دارم",
  "former-owner": "زمانی داشته‌ام",
  handled: "از نزدیک دیده و به دست بسته‌ام",
};

export const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "در انتظار تأیید",
  published: "منتشرشده",
  rejected: "ردشده",
};

export const formatRating = (value: number): string => formatNumber(Math.round(value * 10) / 10);
