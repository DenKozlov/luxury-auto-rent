"use client";
import { ChangeEvent, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { columns } from "./columns";
import { usersService } from "@/services/users.service";
import InviteUserContainer from "@/components/invite-user-container";
import DataTable from "@/components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@tanstack/react-pacer";
// import { SortState } from "@/types";
import { PaginationState, SortingState } from "@tanstack/react-table";

const items = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
];

export default function Team() {
  const [searchBy, setSearchBy] = useState("name");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [debouncedSearch] = useDebouncedValue(search, {
    wait: 500,
  });

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["users", debouncedSearch, searchBy, sorting, pagination],
    queryFn: () =>
      usersService.getUsers({ debouncedSearch, searchBy, sorting, pagination }),
    placeholderData: keepPreviousData,
  });

  // const handleSortingChange = (p) => {
  //   const result = p();
  //   console.log(result);
  // };

  // listUsers из better-auth возвращает { users, total, limit, offset },
  // поэтому реальный массив лежит в data.users, а не в самом data
  const users = useMemo(() => data?.users ?? [], [data]);
  const total = useMemo(() => data?.total ?? 0, [data]);

  return (
    <div className="space-y-4 mt-16">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 items-center">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // value={table.getColumn("email")?.getFilterValue() ?? ""}
            // onChange={(e) =>
            //   table.getColumn("email")?.setFilterValue(e.target.value)
            // }
            type="search"
            className="w-72 mb-0"
          />
          <div className="flex items-center space-x-2">
            <p>Search by:</p>
            <Select defaultValue={searchBy} onValueChange={setSearchBy}>
              <SelectTrigger className="max-w-48 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent id="input-field-username">
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <InviteUserContainer />
      </div>
      <DataTable
        isError={isError}
        isLoading={isLoading || isFetching}
        data={users}
        columns={columns}
        sorting={sorting}
        total={total}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      />
    </div>
  );
}
