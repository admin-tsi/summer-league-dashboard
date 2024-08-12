"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useCurrentToken } from "@/hooks/use-current-token";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingSpinner from "@/components/loading-spinner";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  deleteUser,
  getAllUsers,
  promoteUser,
  validateAccount,
} from "@/lib/api/users/users";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { DataTable } from "@/components/users/view/data-table";
import { columns } from "@/components/users/view/columns";

export default function UsersPage() {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = useCurrentToken();

  const router = useRouter();
  const handleDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      await deleteUser(userId, token);
      toast.success("User deleted successfully");
      setUsers(users.filter((user: { _id: string }) => user._id !== userId));
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Failed to delete user", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setLoading(true);
      await promoteUser(userId, token, newRole);
      toast.success("User role updated successfully");
      setUsers(
        users.map((user: { _id: string; role: string }) =>
          user._id === userId ? { ...user, role: newRole } : user,
        ),
      );
    } catch (error) {
      toast.error("Failed to update user role");
      console.error("Failed to update user role", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    try {
      setLoading(true);

      await validateAccount(userId, token);

      toast.success("User status updated successfully");

      setUsers(
        users.map((user: { _id: string }) =>
          user._id === userId ? { ...user, accountStatus: newStatus } : user,
        ),
      );
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Failed to update user status", error);
    } finally {
      setLoading(false);
    }
  };
  const handleClick = async (id: any) => {
    router.push(`/users/${id}`);
  };

  useEffect(() => {
    getAllUsers(token)
      .then(setUsers)
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  console.log(users);

  const breadcrumbPaths = [
    { label: "Settings", href: "/users" },
    { label: "Users" },
  ];

  return (
    <ContentLayout title="Users">
      <div className="flex justify-between items-center">
        <DynamicBreadcrumbs paths={breadcrumbPaths} />
      </div>
      <div className="py-10">
        {loading ? (
          <div className="h-[500px] w-full flex justify-center items-center">
            <LoadingSpinner text="Loading..." />
          </div>
        ) : error ? (
          <div className="h-[500px] w-full flex justify-center items-center">
            <p className="w-[80%] md:w-1/2 lg:w-1/3">{error}</p>
          </div>
        ) : (
          <DataTable
            columns={columns(
              handleDeleteUser,
              handleClick,
              handleRoleChange,
              handleStatusChange,
            )}
            data={users}
          />
        )}
      </div>
    </ContentLayout>
  );
}
