"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import Schedule from "@/components/score-keeer/schedule";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getOtmSchedules } from "@/lib/api/otm/otm";
import { useEffect, useState } from "react";

interface BreadcrumbPath {
  label: string;
  href?: string;
}

interface Team {
  _id: string;
  teamName: string;
}

interface ScheduleItem {
  schedule: string;
  date: string;
  hour: string;
  homeTeam: Team;
  awayTeam: Team;
  matchType: string;
  otmTeam: Team;
}

export default function Page() {
  const currentUser: any = useCurrentUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const otmSchedule = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const competitionId: string | null = localStorage.getItem(
          "selectedCompetitionId"
        );
        if (!competitionId) {
          throw new Error("Competition ID not found in localStorage");
        }
        const otmId: string = currentUser.id;
        const token: string = currentUser.accessToken;
        const data: ScheduleItem[] = await getOtmSchedules(
          competitionId,
          otmId,
          token
        );
        setSchedules(data);
        console.log("Données :", data);
      } catch (error: unknown) {
        console.error("Error retrieving match from otm: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    otmSchedule();
  }, [currentUser]);

  const breadcrumbPaths: BreadcrumbPath[] = [
    { label: "Home", href: "/" },
    { label: "Kobe Bryant", href: "/score-keeper" },
    { label: `${currentUser.firstName} ${currentUser.lastName}` },
  ];

  return (
    <ContentLayout title="OTM">
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
      <div className="w-full">
        {isLoading ? (
          <div className="h-[600px] w-full flex justify-center items-center">
            <LoadingSpinner text="Loading..." />
          </div>
        ) : (
          <div className="w-full pt-5">
            <Schedule schedules={schedules} />{" "}
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
