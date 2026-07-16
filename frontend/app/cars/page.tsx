"use client";

import { FiltersFormValues } from "@/components/car-filters-form";
import CarList from "@/components/cars-list";
import SidebarFilters from "@/components/sidebar-filters";
import { useState } from "react";

const Cars = () => {
  const [filters, setFilters] = useState<FiltersFormValues>({});

  return (
    <div className="flex gap-8 p-8 mt-16">
      <aside className="w-80 shrink-0">
        <SidebarFilters onFiltersSubmit={setFilters} />
      </aside>
      <main className="flex-1" role="main">
        <CarList filters={filters} />
      </main>
    </div>
  );
};

export default Cars;
