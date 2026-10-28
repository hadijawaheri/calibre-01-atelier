import { Suspense } from "react";

import { PageHeader } from "@/components/atlas";

import { buildCompareSets } from "../sets";
import { CompareTool } from "./compare-tool";

export function ComparePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 lg:py-20">
      <PageHeader
        title="مقایسه"
        reference="Side by side · up to three"
        intro="دو یا سه ساعت یا کالیبر را کنار هم بگذارید: سال، موومنت، فرکانس، ذخیرهٔ انرژی و هر مشخصه‌ای که منابع داده‌اند، ردیف به ردیف."
      />
      {/* The tool reads its choice from the address on the client, so the page itself stays static */}
      <Suspense>
        <CompareTool sets={buildCompareSets()} />
      </Suspense>
    </div>
  );
}
