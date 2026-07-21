"use client";

import { useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { getColumns } from "./columns";
import DataTable from "@/components/data-table";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { toast } from "sonner";
import useHaveAccess from "@/hooks/use-have-access";
import { invitationsService } from "@/services/invitations.service";
import useGetInvitations from "@/hooks/use-get-invitations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";

export default function Invitations() {
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

  const { data, isFetching, isError } = useGetInvitations({
    search: debouncedSearch,
    pagination,
    sorting,
  });

  const { mutate: resendMutate, isPending: isPendingResend } = useMutation({
    mutationFn: (id: string) => invitationsService.resend(id),
    onSuccess: (response) => {
      toast.success(
        <span>
          Invitaion for <b>{response.data.email}</b> has been resent
        </span>,
      );
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Resend operation failed");
    },
  });

  const { mutate: revokeMutate, isPending: isPendingRevoke } = useMutation({
    mutationFn: (id: string) => invitationsService.revoke(id),
    onSuccess: (response) => {
      toast.success(
        <span>
          Invitaion for <b>{response.data.email}</b> has been revoked.
        </span>,
      );
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Revoke operation failed");
    },
  });

  const onResend = useCallback(
    (id: string) => {
      resendMutate(id);
    },
    [resendMutate],
  );
  const onRevoke = useCallback(
    (id: string) => {
      revokeMutate(id);
    },
    [revokeMutate],
  );

  const { hasPermissions } = useHaveAccess({
    invitation: ["revoke-admin", "resend-admin"],
  });

  const invitations = useMemo(() => data?.invitations ?? [], [data]);
  const actions = useMemo(
    () => [
      {
        action: "Resend",
        handler: (id: string) => {
          onResend(id);
        },
        isLoading: isPendingResend,
      },
      {
        action: "Revoke",
        handler: (id: string) => onRevoke(id),
        isLoading: isPendingRevoke,
      },
    ],
    [isPendingResend, isPendingRevoke, onResend, onRevoke],
  );

  const total = useMemo(() => data?.totalItems ?? 0, [data]);
  const columns = useMemo(
    () => getColumns(actions, hasPermissions),
    [hasPermissions, actions],
  );

  return (
    <div className="space-y-4 mt-16">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4 items-center">
          <Input
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            className="w-72 mb-0"
          />
        </div>
      </div>
      <DataTable
        isError={isError}
        isLoading={isFetching}
        data={invitations}
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
