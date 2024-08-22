"use client";
import * as React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
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
import { User } from "@/lib/types/login/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRows, setLoadingRows] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [error, setError] = useState<string | null>(null);
  const token = useCurrentToken();
  const router = useRouter();

  const currentPageRef = useRef(0);

  const handleDeleteUser = useCallback(
    async (userId: string) => {
      try {
        setLoadingRows((prev) => ({ ...prev, [userId]: true }));
        await deleteUser(userId, token);
        toast.success("User deleted successfully");
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId),
        );
      } catch (error) {
        toast.error("Failed to delete user");
        console.error("Failed to delete user", error);
      } finally {
        setLoadingRows((prev) => ({ ...prev, [userId]: false }));
      }
    },
    [token],
  );

  const handleRoleChange = useCallback(
    async (userId: string, newRole: string) => {
      try {
        setLoadingRows((prev) => ({ ...prev, [userId]: true }));
        await promoteUser(userId, token, newRole);
        toast.success("User role updated successfully");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user,
          ),
        );
      } catch (error) {
        toast.error("Failed to update user role");
        console.error("Failed to update user role", error);
      } finally {
        setLoadingRows((prev) => ({ ...prev, [userId]: false }));
      }
    },
    [token],
  );

  const handleStatusChange = useCallback(
    async (userId: string, newStatus: boolean) => {
      try {
        setLoadingRows((prev) => ({ ...prev, [userId]: true }));
        await validateAccount(userId, token);
        toast.success("User status updated successfully");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, accountStatus: newStatus } : user,
          ),
        );
      } catch (error) {
        toast.error("Failed to update user status");
        console.error("Failed to update user status", error);
      } finally {
        setLoadingRows((prev) => ({ ...prev, [userId]: false }));
      }
    },
    [token],
  );

  const handleClick = useCallback(
    (id: string) => {
      router.push(`/users/${id}`);
    },
    [router],
  );

  useEffect(() => {
    getAllUsers(token)
      .then((fetchedUsers) => {
        const usersWithCreatedAt = fetchedUsers.map((user) => ({
          ...user,
          createdAt: user.createdAt || new Date().toISOString(),
        }));
        setUsers(usersWithCreatedAt);
      })
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, [token]);

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
              loadingRows,
            )}
            data={users}
            currentPageRef={currentPageRef}
          />
        )}
      </div>
    </ContentLayout>
  );
}
