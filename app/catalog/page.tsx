"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CamperCard } from "@/components/CamperCard/CamperCard";
import { FilterPanel } from "@/components/FilterPanel/FilterPanel";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import { Loader } from "@/components/common/Loader/Loader";
import { getCampers } from "@/lib/api";
import type { Filters } from "@/lib/types";
import styles from "./page.module.css";

const emptyFilters: Filters = {
  location: "",
  form: "",
  transmission: "",
  engine: "",
};

export default function CatalogPage() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [draftFilters, setDraftFilters] = useState<Filters>(emptyFilters);

  const query = useInfiniteQuery({
    queryKey: ["campers", filters],
    queryFn: ({ pageParam }) => getCampers(pageParam, filters),
    initialPageParam: 1,
    placeholderData: (previousData) => previousData,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const campers = query.data?.pages.flatMap((page) => page.campers) ?? [];

  const applyFilters = () => {
    setFilters({
      ...draftFilters,
      location: draftFilters.location.trim(),
    });
  };

  const clearFilters = () => {
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
  };

  return (
    <main className={styles.catalog} aria-busy={query.isFetching}>
      {query.isFetching && (
        <Loader
          title="Loading campers..."
          description="Please wait while we fetch the best travel trucks for you"
        />
      )}

      <FilterPanel
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <section className={styles.results} aria-live="polite">
        {query.isError && (
          <Status text="Could not load campers. Please try again." error />
        )}

        {!query.isLoading && !query.isError && campers.length === 0 && (
          <EmptyState onClear={clearFilters} onViewAll={clearFilters} />
        )}

        {!query.isError &&
          campers.map((camper) => (
            <CamperCard camper={camper} key={camper.id} />
          ))}

        {!query.isError && query.hasNextPage && (
          <button
            type="button"
            className={styles.loadMore}
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
  return (
    <div className={`${styles.status} ${error ? styles.error : ""}`}>
      {text}
    </div>
  );
}
