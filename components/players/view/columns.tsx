import { Player } from "@/lib/types/players/players";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import Link from "next/link";
import { DeletePlayer } from "./deletePlayer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    accessorKey: "team",
    header: () => <div className="text-left">Team</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.playerTeam.teamName}</div>
    ),
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
    accessorKey: "playerStatus",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const status = row.original.playerStatus?.status;
      const comment = row.original.playerStatus?.comment;
      let badgeVariant: any = "default";
      let statusText = "Unknown";

      if (status === true) {
        badgeVariant = "success";
        statusText = "Verified";
      } else if (status === false) {
        if (comment) {
          badgeVariant = "destructive";
          statusText = "Rejected";
        } else {
          badgeVariant = "default";
          statusText = "Pending";
        }
      }

      return (
        <div className="flex flex-col">
          <Badge variant={badgeVariant} className="text-xs w-fit">
            {statusText}
          </Badge>
          {comment && (
            <span className="text-xs text-muted-foreground mt-1 hidden sm:inline">
              {comment}
            </span>
          )}
          {comment && (
            <span className="text-xs text-muted-foreground mt-1 sm:hidden">
              {comment}
            </span>
          )}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const playerId = row.original._id;

      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            className="p-2 rounded hover:bg-gray-100"
            variant="ghost"
            asChild
          >
            <Link href={`/players/${playerId}`} className="">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Pencil className="h-4 text-blue-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Edit player</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          </Button>
          <DeletePlayer
            playerId={playerId}
            onDelete={() => handleDelete(playerId)}
          />
        </div>
      );
    },
  },
];
