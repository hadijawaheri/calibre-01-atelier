import { Skeleton } from "@/components/ui/skeleton";

export default function WatchesLoading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6">
      <Skeleton className="h-20 w-80" />
      <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
        <Skeleton className="hidden h-96 lg:block" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="aspect-[3/4]" />
          ))}
        </div>
      </div>
    </div>
  );
}
