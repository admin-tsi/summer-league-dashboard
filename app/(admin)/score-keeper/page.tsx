"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Page() {
  const currentUser: any = useCurrentUser();

  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Kobe Bryant", href: "/score-keeper" },
    { label: `${currentUser.firstName} ${currentUser.lastName}` },
  ];
  return (
    <ContentLayout title="OTM">
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
    </ContentLayout>
  );
}
