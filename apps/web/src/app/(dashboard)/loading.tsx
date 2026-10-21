import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-80" />
    </div>
  );
}
