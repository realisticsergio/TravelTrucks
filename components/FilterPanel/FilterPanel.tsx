"use client";

import { MapPin, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { CamperForm, Engine, Filters, Transmission } from "@/lib/types";
import styles from "./FilterPanel.module.css";
import { Button } from "@/components/common/Button/Button";

const emptyFilters: Filters = {
  location: "",
  form: "",
  transmission: "",
  engine: "",
};

const forms: { value: CamperForm; label: string }[] = [
  { value: "alcove", label: "Alcove" },
  { value: "panel_van", label: "Panel Van" },
  { value: "integrated", label: "Integrated" },
  { value: "semi_integrated", label: "Semi Integrated" },
];

const engines: { value: Engine; label: string }[] = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
];

const transmissions: { value: Transmission; label: string }[] = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
];

export function FilterPanel({
  onApply,
}: {
  onApply: (filters: Filters) => void;
}) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((previous) => ({
      ...previous,
      [key]: previous[key] === value ? "" : value,
    }));
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    onApply(emptyFilters);
  };

  return (
    <aside className={styles.panel}>
      <div>
        <label className={styles.fieldLabel} htmlFor="location">
          Location
        </label>

        <div className={styles.locationField}>
          <MapPin size={20} />
          <input
            id="location"
            placeholder="City"
            value={filters.location}
            onChange={(event) =>
              setFilters({
                ...filters,
                location: event.target.value,
              })
            }
          />
        </div>
      </div>

      <div className={styles.filtersContent}>
        <h2 className={styles.title}>Filters</h2>

        <FilterGroup title="Camper form">
          {forms.map((item) => (
            <Choice
              key={item.value}
              active={filters.form === item.value}
              onClick={() => set("form", item.value)}
              label={item.label}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Engine">
          {engines.map((item) => (
            <Choice
              key={item.value}
              active={filters.engine === item.value}
              onClick={() => set("engine", item.value)}
              label={item.label}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Transmission">
          {transmissions.map((item) => (
            <Choice
              key={item.value}
              active={filters.transmission === item.value}
              onClick={() => set("transmission", item.value)}
              label={item.label}
            />
          ))}
        </FilterGroup>
      </div>

      <div className={styles.buttons}>
        <Button
          fullWidth
          onClick={() =>
            onApply({
              ...filters,
              location: filters.location.trim(),
            })
          }
        >
          Search
        </Button>
        <Button variant="secondary" fullWidth onClick={clearFilters}>
          <X size={20} />
          Clear filters
        </Button>
      </div>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.group}>
      <h3 className={styles.groupTitle}>{title}</h3>
      <div className={styles.choiceList}>{children}</div>
    </section>
  );
}

function Choice({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`${styles.choice} ${active ? styles.selected : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <span className={styles.radio} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
