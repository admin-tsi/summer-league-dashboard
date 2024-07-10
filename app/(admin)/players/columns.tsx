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
import { Player } from "@/lib/types/players/players";

export const columns = (
  handleDelete: (playerId: string) => void,
  handleEdit: (playerId: string) => void,
): ColumnDef<Player>[] => [
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
    id: "playerIdentity",
    header: "Player Identity",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {/*        <img
          src={row.original.player_image}
          alt={row.original.player_name}
          className="w-10 h-10 rounded-full"
        />*/}
        {row.original.player_name} <br />
        <span className="text-sm text-gray-500">
          {row.original.nationality}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "date_of_birth",
    header: "Age",
    cell: ({ row }) => {
      const dateOfBirth = new Date(row.getValue("date_of_birth"));
      const today = new Date();
      let age = today.getFullYear() - dateOfBirth.getFullYear();
      const m = today.getMonth() - dateOfBirth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
        age--;
      }
      return (
        <div onClick={() => handleEdit(row.original._id)}>{age || "-"}</div>
      );
    },
  },
  {
    accessorKey: "height",
    header: "Height",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("height")} cm
      </div>
    ),
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("weight")} kg
      </div>
    ),
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("phone_number") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("position") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "dorseyNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Dorsey Number
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("dorseyNumber") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("nationality") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "player_status",
    header: "Status",
    cell: ({ row }) => {
      const status: boolean = row.getValue("player_status");
      const statusColor = status ? "text-green-500" : "text-red-500";
      const statusText = status ? "Active" : "Inactive";
      return <div className={`${statusColor}`}>{statusText}</div>;
    },
  },
  {
    accessorKey: "saison",
    header: "Season",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("saison") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "player_team",
    header: "Team",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {row.getValue("player_team") || "-"}
      </div>
    ),
  },
  /*
  {
    accessorKey: "player_stats",
    header: "Stats",
    cell: ({ row }) => (
      <div onClick={() => handleEdit(row.original._id)}>
        {Object.entries(row.getValue("player_stats")).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))}
      </div>
    ),
  },
*/
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
                player&#39;s data from our servers.
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
