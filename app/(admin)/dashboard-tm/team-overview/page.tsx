"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamManagerDashboard from "@/components/dashboard-fm/TeamManagerDashboard";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { useState } from "react";

export default function Page() {
  const [breadcrumbPaths, setBreadcrumbPaths] = useState([
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Team Manager" },
  ]);

  return (
    <ContentLayout title="Team Manager Dashboard">
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
      <div className="w-full flex justify-center items-center mt-6">
        <TeamManagerDashboard />
      </div>
    </ContentLayout>
  );
}
