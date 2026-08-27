"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CamperCard } from "@/components/CamperCard";
import { FilterPanel } from "@/components/FilterPanel";
import { getCampers } from "@/lib/api";
import type { Filters } from "@/lib/types";

const emptyFilters: Filters = {
  location: "",
  form: "",
  transmission: "",
  engine: "",
};

export default function CatalogPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const query = useInfiniteQuery({
    queryKey: ["campers", filters],
    queryFn: ({ pageParam }) => getCampers(pageParam, filters),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
  const campers = query.data?.pages.flatMap((page) => page.campers) ?? [];

  return (
    <main className="catalog container">
      <FilterPanel onApply={setFilters} />
      <section className="catalogResults" aria-live="polite">
        {query.isLoading && <Status text="Loading campers…" />}
        {query.isError && (
          <Status text="Could not load campers. Please try again." error />
        )}
        {!query.isLoading && !query.isError && campers.length === 0 && (
          <Status text="No campers match these filters." />
        )}
        {campers.map((camper) => (
          <CamperCard camper={camper} key={camper.id} />
        ))}
        {query.hasNextPage && (
          <button
            className="loadMore"
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetchingNextPage}
          >
            {query.isFetchingNextPage ? "Loading…" : "Load more"}
          </button>
        )}
      </section>
    </main>
  );
}

function Status({ text, error = false }: { text: string; error?: boolean }) {
  return <div className={`status ${error ? "error" : ""}`}>{text}</div>;
}
