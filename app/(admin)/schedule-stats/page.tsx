"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { columns } from "@/components/schedule-stats/columns";
import { DataTable } from "@/components/schedule-stats/schedulesDataTable";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getAllSchedulesStats } from "@/lib/api/schedules-stats/schedules-stats";
import { ScheduleData } from "@/lib/types/schedules/schedules";
import { useEffect, useState } from "react";

export default function Page() {
  const currentUser: any = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Schedules Stats" },
  ];

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.schedule._id !== id));
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        if (!currentUser.accessToken) {
          setError(
            "Unable to get schedule list because your token is not provided. Please reload your page, and if the problem persists, don't hesitate to contact us."
          );
          return;
        }
        const competitionId = localStorage.getItem("selectedCompetitionId");

        if (!competitionId) {
          throw new Error("Competition ID not found in localStorage");
        }
        const data = await getAllSchedulesStats(
          competitionId,
          currentUser.accessToken
        );
        setSchedules(data);
      } catch (error) {
        setError("Failed to load schedules");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [currentUser]);

  return (
    <ContentLayout title="Schedules">
      <DynamicBreadcrumbs paths={breadcrumbPaths} />

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
            <DataTable
              columns={columns({ handleDelete })}
              data={schedules}
              showHeaderAndFooter={false}
            />
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
