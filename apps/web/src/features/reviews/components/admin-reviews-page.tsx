import { PageHeader } from "@/components/atlas";
import { WATCHES } from "@/features/reference/watches";

import { AdminReviews } from "./admin-reviews";

export function AdminReviewsPage() {
  const watchNames = Object.fromEntries(WATCHES.map((watch) => [watch.slug, watch.name]));
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6">
      <PageHeader
        title="بررسی نظرها"
        reference="Moderation · reviews"
        intro="نظرهای خوانندگان تا وقتی اینجا منتشر نشوند در صفحهٔ ساعت دیده نمی‌شوند."
      />
      <AdminReviews watchNames={watchNames} />
    </div>
  );
}
