"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useCurrentToken } from "@/hooks/use-current-token";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { DataTable } from "@/components/articles/view/data-table";
import { columns } from "@/components/articles/view/columns";
import { getAllArticles } from "@/lib/api/articles/articles";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = useCurrentToken();

  const router = useRouter();

  const handleView = (id: string) => {
    router.push(`/articles/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/articles/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    // Implement delete logic here
    console.log(`Delete article with id: ${id}`);
  };

  useEffect(() => {
    getAllArticles(token)
      .then(setArticles)
      .catch(() => setError("Failed to load articles"))
      .finally(() => setLoading(false));
  }, []);

  console.log(articles);

  const breadcrumbPaths = [
    { label: "Settings", href: "/articles" },
    { label: "Articles" },
  ];

  return (
    <ContentLayout title="Articles">
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
              (id) => handleView(id),
              (id) => handleEdit(id),
              (id) => handleDelete(id),
            )}
            data={articles}
          />
        )}
      </div>
    </ContentLayout>
  );
}
