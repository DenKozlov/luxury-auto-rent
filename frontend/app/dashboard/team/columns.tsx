import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ExtendedUser } from "@/types";
import DataTableColumnHeader from "@/components/data-table-column-header";
import ActionButton from "@/components/action-button";

export const getColumns = (
  actionHandlers: {
    onDeactivate: (user: ExtendedUser) => void;
    onActivate: (user: ExtendedUser) => void;
  },
  isLoading: boolean,
  canDeactivateAdmin: boolean,
): ColumnDef<ExtendedUser>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader title="Full name" column={column} />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader title="Email" column={column} />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader title="Role" column={column} />
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold">Status</span>,
    cell: ({ row }) => {
      const status = row.original.status;
      const clnms =
        status === "ACTIVE"
          ? "bg-green-300 text-green-700"
          : "bg-red-300 text-red-700";
      return <Badge className={clnms}>{status.toLowerCase()}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="font-bold">Joined</span>,
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "lastLoginAt",
    header: () => <span className="font-bold">Last active</span>,
    cell: ({ row }) => {
      if (!row.original.lastLoginAt) {
        return "-";
      }
      return (
        <span>{new Date(row.original.lastLoginAt).toLocaleDateString()}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const isDisabled = !canDeactivateAdmin && user.role === "admin";
      const isActive = user.status === "ACTIVE";
      return (
        <ActionButton
          isDisabled={isDisabled}
          isLoading={isLoading}
          {...(isActive && { variant: "destructive" })}
          actions={
            isActive
              ? [
                  {
                    action: "Deactivate",
                    handler: () => actionHandlers.onDeactivate(user),
                  },
                ]
              : [
                  {
                    action: "Activate",
                    handler: () => actionHandlers.onActivate(user),
                  },
                ]
          }
        />
      );
    },
  },
];
