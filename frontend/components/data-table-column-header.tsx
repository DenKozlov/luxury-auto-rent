import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { Column } from "@tanstack/react-table";

interface DataTableColumnHeaderProps<TData, TValue> {
  title: string;
  column: Column<TData, TValue>;
}

const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  const isSorted = column.getIsSorted();
  const isAsc = column.getIsSorted() === "asc";
  const Icon = isAsc ? ArrowDown : ArrowUp;
  return (
    <Button
      className="cursor-pointer"
      variant="ghost"
      onClick={column.getToggleSortingHandler()}
    >
      {title} {isSorted && <Icon className="ml-2 h-4 w-4" />}
    </Button>
  );
};

export default DataTableColumnHeader;
