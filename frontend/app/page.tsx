import CarList from "@/components/cars-list";
import SidebarFilters from "@/components/sidebar-filters";

export default function Home() {
  return (
    <div className="flex gap-8 p-8">
      <aside className="w-80 shrink-0">
        <SidebarFilters />
      </aside>
      <main className="flex-1 grid grid-cols-3 gap-6">
        <CarList />
      </main>
    </div>
  );
}
