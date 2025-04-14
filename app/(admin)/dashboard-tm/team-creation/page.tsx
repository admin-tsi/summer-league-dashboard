"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamCreation from "@/components/dashboard-fm/teamCreation";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { useState } from "react";

export default function Page() {
  const [breadcrumbPaths, setBreadcrumbPaths] = useState([
    { label: "Home", href: "/" },
    { label: "Team Manager Dashboard", href: "/dashboard" },
    { label: "Team Creation" },
  ]);

  return (
    <ContentLayout title="Team Manager Dashboard">
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
      <div className="w-full flex justify-center items-center mt-6">
        <TeamCreation />
      </div>
    </ContentLayout>
  );
}
