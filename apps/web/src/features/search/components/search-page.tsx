import { Suspense } from "react";

import { PageHeader } from "@/components/atlas";
import { buildSearchIndex } from "@/components/layout/search-index";

import { SearchResults } from "./search-results";

export function SearchPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 lg:py-20">
      <PageHeader
        title="جستجو"
        reference="Search the atlas"
        intro="در همهٔ کرونوس: ساعت‌ها، کالیبرها، برندها، کمپلیکیشن‌ها و آزمایشگاه. سال، مرجع یا نام لاتین هم پیدا می‌شود."
      />
      {/* The results read the address on the client, so the page itself stays static */}
      <Suspense>
        <SearchResults entries={buildSearchIndex()} />
      </Suspense>
    </div>
  );
}
