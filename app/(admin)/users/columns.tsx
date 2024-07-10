import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User } from "@/lib/types/login/user";
import { Badge } from "@/components/ui/badge"; // Adjust the path as necessary

export const columns = (
  handleDelete: (userId: string) => void,
  handleEdit: (userId: string) => void,
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "identity",
    header: "Identity",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {`${row.original.firstName} ${row.original.lastName}`} <br />
        <span className="text-sm text-gray-500">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: "Age",
    cell: ({ row }) => {
      const dob = new Date(row.getValue("dateOfBirth"));
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return (
        <div onClick={() => handleEdit(row.original._id)}>{age || "-"}</div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.original.countryCode ? `+${row.original.countryCode} ` : ""}
        {row.getValue("phoneNumber") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        <Badge
          variant={"outline"}
          className="bg-primary-yellow/20 text-primary-yellow border-primary-yellow"
        >
          {row.getValue("role") || "-"}
        </Badge>
      </div>
    ),
  },

  {
    accessorKey: "specialization",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Specialization
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("specialization") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("address") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "isVerified",
    header: "Status",
    cell: ({ row }) => {
      const status: boolean = row.getValue("isVerified");
      const statusColor = status ? "text-green-500" : "text-red-500";
      const statusText = status ? "Verified" : "Not Verified";
      return <div className={`${statusColor}`}>{statusText}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          aria-label="Edit"
          className="p-2 rounded hover:bg-gray-200"
          variant="ghost"
          onClick={() => handleEdit(row.original._id)}
        >
          <Pencil className="h-4 text-blue-500" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              aria-label="Delete"
              className="p-2 rounded hover:bg-gray-100"
              variant="ghost"
            >
              <Trash2 className="h-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                account and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="text-white hover:bg-red-500"
                onClick={() => handleDelete(row.original._id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  },
];
