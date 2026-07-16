import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ExtendedUser } from "@/types";
import DataTableColumnHeader from "@/components/data-table-column-header";

export const columns: ColumnDef<ExtendedUser>[] = [
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
    header: "Status",
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
    header: "Joined",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last active",
    cell: ({ row }) => {
      if (!row.original.lastLoginAt) {
        return "-";
      }
      return (
        <span>{new Date(row.original.lastLoginAt).toLocaleDateString()}</span>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <div className="flex gap-2">
  //       <Button variant="ghost" size="icon">
  //         <Mail className="h-4 w-4" />
  //       </Button>
  //       {row.original.status === "active" ? (
  //         <Button variant="ghost" size="icon">
  //           <Ban className="h-4 w-4" />
  //         </Button>
  //       ) : (
  //         <Button variant="ghost" size="icon">
  //           <CheckCircle className="h-4 w-4" />
  //         </Button>
  //       )}
  //     </div>
  //   ),
  // },
];
