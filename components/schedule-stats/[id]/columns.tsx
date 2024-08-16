import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlayerStats } from "@/lib/types/players/players";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface ColumnsProps {
  handleDelete?: (scheduleId: string) => void;
}

export const columns = ({
  handleDelete,
}: ColumnsProps): ColumnDef<PlayerStats>[] => [
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
    accessorKey: "team.teamName",
    header: () => <div className="text-left">Team</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.team.teamName}</div>
    ),
  },
  {
    accessorKey: "team.teamGender",
    header: () => <div className="text-left">Gender</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.team.teamGender}</div>
    ),
  },
  {
    accessorKey: "players[0].player.firstName",
    header: () => <div className="text-left">Player Name</div>,
    cell: ({ row }) => (
      <div className="text-left">
        {row.original.players[0]?.player.firstName}
      </div>
    ),
  },
  {
    accessorKey: "players[0].player.dorseyNumber",
    header: () => <div className="text-left">Jersey Number</div>,
    cell: ({ row }) => (
      <div className="text-left">
        {row.original.players[0]?.player.dorseyNumber}
      </div>
    ),
  },
  {
    accessorKey: "players[0].player.position",
    header: () => <div className="text-left">Position</div>,
    cell: ({ row }) => (
      <div className="text-left">
        {row.original.players[0]?.player.position}
      </div>
    ),
  },
  {
    accessorKey: "players[0].threePoints",
    header: () => <div className="text-left">3PT</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.players[0]?.threePoints}</div>
    ),
  },
  {
    accessorKey: "players[0].twoPoints",
    header: () => <div className="text-left">2PT</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.players[0]?.twoPoints}</div>
    ),
  },
  {
    accessorKey: "players[0].lancerFranc",
    header: () => <div className="text-left">FT</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.players[0]?.lancerFranc}</div>
    ),
  },
  {
    accessorKey: "players[0].assists",
    header: () => <div className="text-left">AST</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.players[0]?.assists}</div>
    ),
  },
  {
    accessorKey: "players[0].blocks",
    header: () => <div className="text-left">BLK</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.players[0]?.blocks}</div>
    ),
  },
  {
    accessorKey: "players[0].steal",
    header: () => <div className="text-left">STL</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.players[0]?.steal}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const scheduleId = row.original.schedule;
      return (
        <div className="flex justify-center items-center gap-3">
          <Button
            className="p-2 rounded hover:bg-gray-100"
            variant="ghost"
            asChild
          >
            <Link
              href={`/schedule-stats/${scheduleId}`}
              className="border rounded-md"
            >
              <span>More details</span>
            </Link>
          </Button>
        </div>
      );
    },
  },
];
