import { ColumnDef } from "@tanstack/react-table";
import { Invitation } from "@/types";
import DataTableColumnHeader from "@/components/data-table-column-header";
import ActionButton from "@/components/action-button";

export const getColumns = (
  actions: {
    action: string;
    handler: (id: string) => void;
    isLoading: boolean;
  }[],
  canManipulateAdmin: boolean,
): ColumnDef<Invitation>[] => [
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
    header: ({ column }) => (
      <DataTableColumnHeader title="Status" column={column} />
    ),
    cell: ({ row }) => {
      return <span>{row.original.status.toLowerCase()}</span>;
    },
  },
  {
    accessorKey: "invitedBy",
    header: ({ column }) => (
      <DataTableColumnHeader title="Invited by" column={column} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="font-bold">Created</span>,
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: () => <span className="font-bold">Expires</span>,
    cell: ({ row }) => (
      <span>{new Date(row.original.expiresAt).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "acceptedAt",
    header: () => <span className="font-bold">Accepted</span>,
    cell: ({ row }) => {
      if (!row.original.acceptedAt) {
        return "-";
      }
      return (
        <span>{new Date(row.original.acceptedAt).toLocaleDateString()}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { role, id } = row.original;
      const isDisabled = !canManipulateAdmin && role === "admin";
      const enrichedActions = actions.map((action) => ({
        ...action,
        handler: () => action.handler(id),
      }));
      return <ActionButton isDisabled={isDisabled} actions={enrichedActions} />;
    },
  },
];
