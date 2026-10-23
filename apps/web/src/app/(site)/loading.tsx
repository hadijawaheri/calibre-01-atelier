import { Spinner } from "@/components/ui/spinner";

export default function SiteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner className="size-5 text-metal" />
    </div>
  );
}
