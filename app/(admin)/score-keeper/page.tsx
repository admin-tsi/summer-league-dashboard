"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import Schedule from "@/components/score-keeer/schedule";
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
  startTime: string;
  endTime: string;
  homeTeam: Team;
  awayTeam: Team;
  matchType: string;
  otmTeam: Team;
  location: string;
}

export default function Page() {
  const currentUser: any = useCurrentUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const otmSchedule = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
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
      } catch (error: unknown) {
        setError(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    otmSchedule();
  }, [currentUser]);

  return (
    <ContentLayout title="OTM">
      <div className="w-full">
        {isLoading ? (
          <div className="h-[600px] w-full flex justify-center items-center">
            <LoadingSpinner text="Loading..." />
          </div>
        ) : error ? (
          <div className="h-[600px] w-full flex justify-center items-center">
            <p>{error}</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="h-[600px] w-full flex justify-center items-center">
            <p>No schedules available</p>
          </div>
        ) : (
          <div className="w-full pt-5">
            <Schedule schedules={schedules} />
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
