import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/lib/types";
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("email") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "firstname",
    header: "First Name",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("firstname") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
    cell: ({ row }) => (
      <div className="uppercase" onClick={() => handleEdit(row.original._id)}>
        {row.getValue("lastname") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => {
      const dob = new Date(row.getValue("age"));
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
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("phone") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("role") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "isverified",
    header: "Status",
    cell: ({ row }) => {
      const status: boolean = row.getValue("isverified");
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
                className="bg-muted text-white hover:bg-red-500"
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
