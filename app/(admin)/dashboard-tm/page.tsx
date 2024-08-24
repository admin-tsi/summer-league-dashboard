"use client";
import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import TeamCreation from "@/components/dashboard-fm/teamCreation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getTeamById } from "@/lib/api/teams/teams";

export default function Page() {
  const [breadcrumbPaths, setBreadcrumbPaths] = useState([
    { label: "Home", href: "/" },
    { label: "Dashboard" },
  ]);

  const currentUser: any = useCurrentUser();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (currentUser.isManageTeam) {
        try {
          const teamId = currentUser.isManageTeam;
          const competitionId = localStorage.getItem("selectedCompetitionId");
          const token = currentUser.accessToken;
          const team = await getTeamById(competitionId, teamId, token);
          console.log(team);

          localStorage.setItem("currentTeam", JSON.stringify(team));
          setBreadcrumbPaths([
            { label: "Home", href: "/" },
            { label: "Dashboard", href: "/dashboard" },
            { label: team.teamName },
          ]);
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
      <div className="w-full h-[85vh] flex justify-center items-center">
        {currentUser.role === "user" ? (
          <p>
            Hello {currentUser.firstName} {currentUser.lastName}, welcome to the
            platform for Summer League team managers. Your account is currently
            being validated. Our team is working diligently to complete this
            process as quickly as possible. Please check back in a few moments
            to see if your account has been validated.
          </p>
        ) : (
          <TeamCreation />
        )}
      </div>
    </ContentLayout>
  );
}
