import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/lib/types/articles/articles";

const getStatusColor = (
  status: "draft" | "published" | "pending" | "archived",
) => {
  switch (status) {
    case "published":
      return "bg-primary-green text-primary-green-foreground";
    case "draft":
      return "bg-secondary text-secondary-foreground";
    case "pending":
      return "bg-primary-yellow text-primary-yellow-foreground";
    case "archived":
      return "bg-muted text-muted-foreground";
  }
};

export const columns = (
  handleView: (articleId: string) => void,
  handleEdit: (articleId: string) => void,
  handleDelete: (articleId: string) => void,
  userRole: string,
): ColumnDef<Article>[] => [
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
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.getValue("author") as {
        firstName: string;
        lastName: string;
      } | null;
      return (
        <div>{author ? `${author.firstName} ${author.lastName}` : "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "draft"
        | "published"
        | "pending"
        | "archived";
      return (
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "likes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Likes
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("likes")}</div>,
  },
  {
    accessorKey: "featuredArticle",
    header: "Featured",
    cell: ({ row }) => (
      <Badge variant={row.getValue("featuredArticle") ? "default" : "outline"}>
        {row.getValue("featuredArticle") ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleView(row.original._id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        {userRole === "admin" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
];
