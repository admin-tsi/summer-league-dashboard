import { ColumnDef } from "@tanstack/react-table";
import { CircleEllipsis, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScheduleData } from "@/lib/types/schedules/schedules";

interface ColumnsProps {
  handleDelete?: (scheduleId: string) => void;
}

export const columns = ({
  handleDelete,
}: ColumnsProps): ColumnDef<ScheduleData>[] => [
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
    accessorKey: "schedule.date",
    header: () => <div className="text-left">Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.original.schedule.date).toLocaleDateString();
      return <div className="text-left">{date}</div>;
    },
  },
  {
    accessorKey: "schedule.stadiumLocation",
    header: () => <div className="text-left">Location</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.schedule.stadiumLocation}</div>
    ),
  },
  {
    id: "team1",
    header: () => <div className="text-left">Team 1</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.otmStats[0].team.teamName}</div>
    ),
  },
  {
    id: "team2",
    header: () => <div className="text-left">Team 2</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.otmStats[1]?.team.teamName}</div>
    ),
  },
  {
    accessorKey: "gender",
    header: () => <div className="text-left">Team Gender</div>,
    cell: ({ row }) => (
      <div className="text-left">
        {row.original.otmStats[1]?.team.teamGender}
      </div>
    ),
  },
  {
    accessorKey: "schedule.startTime",
    header: () => <div className="text-left">Start Time</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.schedule.startTime}</div>
    ),
  },
  {
    accessorKey: "schedule.endTime",
    header: () => <div className="text-left">End Time</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.schedule.endTime}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const scheduleId = row.original.schedule._id;

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
