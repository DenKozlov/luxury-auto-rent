"use client";

import { useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getColumns } from "./columns";
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
import { PaginationState, SortingState } from "@tanstack/react-table";
import { ExtendedUser } from "@/types";
import { toast } from "sonner";
import useHaveAccess from "@/hooks/use-have-access";

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
  const queryClient = useQueryClient();

  const [debouncedSearch] = useDebouncedValue(search, {
    wait: 500,
  });

  const { data, isFetching, isError } = useQuery({
    queryKey: ["users", debouncedSearch, searchBy, sorting, pagination],
    queryFn: () =>
      usersService.getUsers({ debouncedSearch, searchBy, sorting, pagination }),
    placeholderData: keepPreviousData,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => usersService.deactivateUser(id),
    onSuccess: async (response) => {
      toast.success(`Account for ${response.user.name} has been deactivated.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const { mutate: reactivateMutation, isPending: isPendingreactivation } =
    useMutation({
      mutationFn: (id: string) => usersService.reactivateUser(id),
      onSuccess: async (response) => {
        toast.success(
          `Account for ${response.user.name} has been reactivated.`,
        );
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });

  const onDeactivate = useCallback(
    (user: ExtendedUser) => {
      mutate(user.id);
    },
    [mutate],
  );
  const onActivate = useCallback(
    (user: ExtendedUser) => {
      reactivateMutation(user.id);
    },
    [reactivateMutation],
  );

  const isLoading = isPending || isPendingreactivation;
  const { hasPermissions } = useHaveAccess({
    employee: ["deactivate-admin"],
  });

  const users = useMemo(() => data?.users ?? [], [data]);
  const total = useMemo(() => data?.total ?? 0, [data]);
  const columns = useMemo(
    () => getColumns({ onDeactivate, onActivate }, isLoading, hasPermissions),
    [hasPermissions, isLoading, onActivate, onDeactivate],
  );

  return (
    <div className="space-y-4 mt-16">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 items-center">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        isLoading={isFetching}
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
