import { Player } from "@/lib/types/players/players";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import Link from "next/link";
import { DeletePlayer } from "./deletePlayer";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ColumnsProps {
  handleDelete: (playerId: string) => void;
}

export const columns = ({
  handleDelete,
}: ColumnsProps): ColumnDef<Player>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: () => <div className="text-left">First Name</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.firstName}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <div
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="text-left">{row.original.lastName}</div>,
  },
  {
    accessorKey: "birthdate",
    header: () => <div className="text-left">Age</div>,
    cell: ({ row }) => {
      const dateOfBirth = new Date(row.getValue("birthdate"));
      const today = new Date();
      let age = today.getFullYear() - dateOfBirth.getFullYear();
      const m = today.getMonth() - dateOfBirth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
        age--;
      }
      return <div>{age || "-"}</div>;
    },
  },
  {
    accessorKey: "height",
    header: () => <div className="text-left">Height</div>,
    cell: ({ row }) => <div className="text-left">{row.original.height}</div>,
  },
  {
    accessorKey: "weight",
    header: () => <div className="text-left">Weight</div>,
    cell: ({ row }) => <div className="text-left">{row.original.weight}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="text-left">Phone Number</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.phoneNumber}</div>
    ),
  },
  {
    accessorKey: "position",
    header: () => <div className="text-left">Position</div>,
    cell: ({ row }) => <div className="text-left">{row.original.position}</div>,
  },
  {
    accessorKey: "dorseyNumber",
    header: () => <div className="text-left">Dorsey Number</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.dorseyNumber}</div>
    ),
  },
  {
    accessorKey: "nationality",
    header: () => <div className="text-left">Nationality</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.nationality}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const playerId = row.original._id;

      return (
        <div className="flex justify-center items-center gap-3">
          <Button variant="def">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chart-no-axes-combined"
            >
              <path d="M12 16v5" />
              <path d="M16 14v7" />
              <path d="M20 10v11" />
              <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
              <path d="M4 18v3" />
              <path d="M8 14v7" />
            </svg>
          </Button>
          <Link href={`/players/${playerId}`} className="">
            <Pencil className="h-4 text-blue-500" />
          </Link>
          <DeletePlayer
            playerId={playerId}
            handleDelete={() => handleDelete(playerId)}
          />
        </div>
      );
    },
  },
];
