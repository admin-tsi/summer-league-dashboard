import { Checkbox } from "@/components/ui/checkbox";
import { PlayerStatsRow } from "@/lib/types/players/players";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnsProps {
  handleDelete?: (scheduleId: string) => void;
  isAdmin?: boolean;
}

export const columns = ({
  handleDelete,
  isAdmin,
}: ColumnsProps): ColumnDef<PlayerStatsRow>[] => {
  const baseColumns: ColumnDef<PlayerStatsRow>[] = [
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
      accessorKey: "player.firstName",
      header: () => <div className="text-left">Player Name</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.player.firstName}</div>
      ),
    },
    {
      accessorKey: "player.dorseyNumber",
      header: () => <div className="text-left">Dorsey Number</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.player.dorseyNumber}</div>
      ),
    },
    {
      accessorKey: "player.position",
      header: () => <div className="text-left">Position</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.player.position}</div>
      ),
    },
    {
      accessorKey: "threePoints",
      header: () => <div className="text-left">Three Points</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.threePoints}</div>
      ),
    },
    {
      accessorKey: "twoPoints",
      header: () => <div className="text-left">Two Points</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.twoPoints}</div>
      ),
    },
    {
      accessorKey: "lancerFranc",
      header: () => <div className="text-left">Free Throw</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.lancerFranc}</div>
      ),
    },
    {
      accessorKey: "turnOver",
      header: () => <div className="text-left">Turn Over</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.turnOver}</div>
      ),
    },
    {
      accessorKey: "assists",
      header: () => <div className="text-left">Assists</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.assists}</div>
      ),
    },
    {
      accessorKey: "rebonds",
      header: () => <div className="text-left">Rebonds</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original.rebonds}</div>
      ),
    },
    {
      accessorKey: "blocks",
      header: () => <div className="text-left">Blocks</div>,
      cell: ({ row }) => <div className="text-left">{row.original.blocks}</div>,
    },
    {
      accessorKey: "fouls",
      header: () => <div className="text-left">Fouls</div>,
      cell: ({ row }) => <div className="text-left">{row.original.fouls}</div>,
    },
    {
      accessorKey: "steal",
      header: () => <div className="text-left">Steal</div>,
      cell: ({ row }) => <div className="text-left">{row.original.steal}</div>,
    },
  ];

  return baseColumns;
};
