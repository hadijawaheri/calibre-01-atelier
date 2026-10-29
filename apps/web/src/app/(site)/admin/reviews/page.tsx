import type { Metadata } from "next";

import { AdminReviewsPage } from "@/features/reviews";

export const metadata: Metadata = {
  title: "بررسی نظرها",
  robots: { index: false, follow: false },
};

export default function AdminReviewsRoute() {
  return <AdminReviewsPage />;
}
