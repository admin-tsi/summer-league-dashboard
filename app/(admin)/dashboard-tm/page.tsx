"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import TeamCreation from "@/components/dashboard-fm/teamCreation";
import TeamManagerDashboard from "@/components/dashboard-fm/TeamManagerDashboard";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getTeamById } from "@/lib/api/teams/teams";
import { useEffect, useState } from "react";

export default function Page() {
  const [breadcrumbPaths, setBreadcrumbPaths] = useState([
    { label: "Home", href: "/" },
    { label: "Dashboard" },
  ]);

  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (currentUser?.user?.isManageTeam) {
        try {
          const teamId = currentUser.user.isManageTeam;
          const competitionId = localStorage.getItem("selectedCompetitionId");
          const token = currentUser.user.accessToken;
          const team = await getTeamById(competitionId, teamId, token);
          localStorage.setItem("currentTeam", JSON.stringify(team));
        } catch (error) {
          console.error("Failed to fetch team details:", error);
        }
      }
    };

    fetchTeamDetails();
  }, [currentUser]);

  return (
    <ContentLayout title="Dashboard">
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
      <div className="w-full flex justify-center items-center mt-6">
        {currentUser?.user?.isManageTeam ? (
          <TeamManagerDashboard />
        ) : (
          <TeamCreation />
        )}
      </div>
    </ContentLayout>
  );
}
