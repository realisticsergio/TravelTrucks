"use client";

import { MapPin, Truck, Settings2, Fuel } from "lucide-react";
import { useState } from "react";
import type { CamperForm, Engine, Filters, Transmission } from "@/lib/types";

const forms: { value: CamperForm; label: string }[] = [
  { value: "panel_van", label: "Van" },
  { value: "integrated", label: "Fully Integrated" },
  { value: "alcove", label: "Alcove" },
  { value: "semi_integrated", label: "Semi Integrated" },
];
const engines: Engine[] = ["diesel", "petrol", "hybrid", "electric"];
const transmissions: Transmission[] = ["automatic", "manual"];

export function FilterPanel({
  onApply,
}: {
  onApply: (filters: Filters) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    location: "",
    form: "",
    transmission: "",
    engine: "",
  });
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  return (
    <aside className="filters">
      <label className="fieldLabel" htmlFor="location">
        Location
      </label>
      <div className="locationField">
        <MapPin size={20} />
        <input
          id="location"
          placeholder="City"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
      </div>
      <p className="filtersLabel">Filters</p>
      <FilterGroup title="Vehicle type">
        {forms.map((item) => (
          <Choice
            key={item.value}
            active={filters.form === item.value}
            onClick={() => set("form", item.value)}
            icon={<Truck />}
            label={item.label}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Engine type">
        {engines.map((value) => (
          <Choice
            key={value}
            active={filters.engine === value}
            onClick={() => set("engine", value)}
            icon={<Fuel />}
            label={value}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Transmission">
        {transmissions.map((value) => (
          <Choice
            key={value}
            active={filters.transmission === value}
            onClick={() => set("transmission", value)}
            icon={<Settings2 />}
            label={value}
          />
        ))}
      </FilterGroup>
      <button
        className="primaryButton filterSubmit"
        onClick={() =>
          onApply({ ...filters, location: filters.location.trim() })
        }
      >
        Search
      </button>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="filterGroup">
      <h2>{title}</h2>
      <div className="choiceGrid">{children}</div>
    </section>
  );
}

function Choice({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`choice ${active ? "selected" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
