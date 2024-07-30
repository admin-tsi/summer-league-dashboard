"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  LayoutGrid,
  Plus,
  TableProperties,
  UserRoundPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useCurrentToken } from "@/hooks/use-current-token";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingSpinner from "@/components/loading-spinner";
import { columns } from "@/app/(admin)/players/columns";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { deletePlayer, getAllPlayers } from "@/lib/api/players/players";
import { Player } from "@/lib/types/players/players";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [disposition, setDisposition] = useState<"list" | "grid">("list");
  const token = useCurrentToken();

  const router = useRouter();
  const handleDeletePlayer = async (playerId: string) => {
    try {
      setLoading(true);
      await deletePlayer(playerId, token);
      toast.success("Player deleted successfully");
      setPlayers(
        players.filter((player: { _id: string }) => player._id !== playerId)
      );
    } catch (error) {
      toast.error("Failed to delete player");
      console.error("Failed to delete player", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (id: any) => {
    router.push(`/players/${id}`);
  };

  useEffect(() => {
    getAllPlayers(token)
      .then((data) => {
        // @ts-ignore
        setPlayers(data.players);
      })
      .catch(() => setError("Failed to load players"))
      .finally(() => setLoading(false));
  }, []);

  console.log(players);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: players,
    columns: columns(handleDeletePlayer, handleClick),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Players" },
  ];

  return (
    <ContentLayout title="Players">
      <div className="flex justify-between items-center">
        <DynamicBreadcrumbs paths={breadcrumbPaths} />
      </div>
      <div className="flex justify-between items-center space-x-3 py-4">
        <div className="flex w-full">
          <Input
            placeholder="Filter players name..."
            value={
              (table.getColumn("player_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("player_name")?.setFilterValue(event.target.value)
            }
            className="w-full border-r-0 rounded-r-none outline-none ring-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="dropdownBtn">
                <span>Columns</span> <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex justify-center items-center ">
          <Button variant="tableDispositionBtn" size="icon">
            <TableProperties
              strokeWidth={1.75}
              className="group-hover:text-primary-yellow transition-all"
            />
          </Button>
          <Button variant="tableDispositionBtn" size="icon">
            <LayoutGrid
              strokeWidth={1.75}
              className="group-hover:text-primary-yellow transition-all"
            />
          </Button>
          <Button
            variant="tableDispositionBtn"
            onClick={() => handleClick("New")}
          >
            <UserRoundPlus strokeWidth={1.5} size={20} />
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer relative"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? (
                    <div className="w-full flex justify-center items-center">
                      <LoadingSpinner text="Loading..." />
                    </div>
                  ) : (
                    "No results found."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
