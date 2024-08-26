import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BadgeCheck, Pencil, Trash2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RoleBadge } from "@/components/users/role-badge";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner from "@/components/loading-spinner";

export const columns = (
  handleDelete: (userId: string) => void,
  handleEdit: (userId: string) => void,
  handleRoleChange: (userId: string, newRole: string) => void,
  handleStatusChange: (userId: string, newStatus: boolean) => void,
  loadingRows: { [key: string]: boolean },
): ColumnDef<User>[] => [
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
    header: "Firstname",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("firstName") || "-"}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Lastname",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("lastName") || "-"}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email") || "-"}</div>,
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Age
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dob = new Date(row.getValue("dateOfBirth"));
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return <div>{age || "-"}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div>
        {row.original.countryCode ? `${row.original.countryCode} ` : ""}
        {row.getValue("phoneNumber") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Role
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") || "-";
      return (
        <div>
          <RoleBadge role={String(role)}></RoleBadge>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("address") || "-"}</div>
    ),
  },
  {
    accessorKey: "accountStatus",
    header: "Status",
    cell: ({ row }) => {
      const status: boolean = row.getValue("accountStatus");
      const isLoading = loadingRows[row.original._id];
      return (
        <div className="flex items-center">
          {isLoading ? (
            <LoadingSpinner text="" />
          ) : (
            <Switch
              checked={status}
              onCheckedChange={(newStatus) =>
                handleStatusChange(row.original._id, newStatus)
              }
              disabled={isLoading}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2"
            />
          )}
        </div>
      );
    },
  },
  /*  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Added On
          <ArrowUpDown className="h-4 w-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },*/
  {
    accessorKey: "specialization",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Spe.
          <ArrowUpDown className="h-4 w-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {row.getValue("specialization") || "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const isLoading = loadingRows[row.original._id];
      return (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 rounded hover:bg-gray-100"
                  onClick={() => handleEdit(row.original._id)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 text-blue-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Edit user</span>
              </TooltipContent>
            </Tooltip>
            <AlertDialog>
              <Tooltip>
                <AlertDialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 rounded hover:bg-gray-100"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 text-red-500" />
                    </button>
                  </TooltipTrigger>
                </AlertDialogTrigger>
                <TooltipContent>
                  <span>Delete user</span>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this account and remove the data from our servers.
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

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="p-2 rounded hover:bg-gray-100"
                  disabled={isLoading}
                >
                  <BadgeCheck className="h-4 text-primary-yellow" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Change User Role
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Select a new role for this user
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        onValueChange={(value) =>
                          handleRoleChange(row.original._id, value)
                        }
                        defaultValue={row.original.role}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <RoleBadge role="admin" />
                          </SelectItem>
                          <SelectItem value="user">
                            <RoleBadge role="user" />
                          </SelectItem>
                          <SelectItem value="team-manager">
                            <RoleBadge role="team-manager" />
                          </SelectItem>
                          <SelectItem value="kobe-bryant">
                            <RoleBadge role="kobe-bryant" />
                          </SelectItem>
                          <SelectItem value="content-creator">
                            <RoleBadge role="content-creator" />
                          </SelectItem>
                          <SelectItem value="web-redactor">
                            <RoleBadge role="web-redactor" />
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipProvider>
        </div>
      );
    },
  },
];
