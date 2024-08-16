"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { columns } from "@/components/schedule-stats/[id]/columns";
import { DataTable } from "@/components/schedule-stats/schedulesDataTable";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getDetailedScheduleStats } from "@/lib/api/schedules-stats/schedules-stats";
import { PlayerStats } from "@/lib/types/players/players";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const currentUser = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [team1, setTeam1] = useState<PlayerStats | null>(null);
  const [team2, setTeam2] = useState<PlayerStats | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!currentUser?.accessToken) {
          throw new Error("Access token not provided");
        }
        const competitionId = localStorage.getItem("selectedCompetitionId");
        if (!competitionId) {
          throw new Error("Competition ID not found in localStorage");
        }
        const data = await getDetailedScheduleStats(
          params.id,
          competitionId,
          currentUser.accessToken
        );
        if (Array.isArray(data) && data.length >= 2) {
          setTeam1(data[0]);
          setTeam2(data[1]);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load schedules"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, [currentUser, params.id]);

  const handleDeletePlayerTeam1 = (id: string) => {
    if (team1) {
      setTeam1({
        ...team1,
        players: team1.players.filter((player) => player.player._id !== id),
      });
    }
  };

  const handleDeletePlayerTeam2 = (id: string) => {
    if (team2) {
      setTeam2({
        ...team2,
        players: team2.players.filter((player) => player.player._id !== id),
      });
    }
  };

  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Schedules Stats", href: "/schedules-stats" },
    { label: `${params.id}` },
  ];

  return (
    <ContentLayout title="Specific Schedule Stats">
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
        ) : !team1 || !team2 ? (
          <div className="h-[600px] w-full flex justify-center items-center">
            <p>No schedules stats available</p>
          </div>
        ) : (
          <div className="w-full pt-5 grid grid-cols-1 gap-5">
            <div className="grid grid-cols-1 gap-3">
              <DataTable
                columns={columns({ handleDelete: handleDeletePlayerTeam1 })}
                data={[team1]}
                showHeaderAndFooter={false}
              />
              <div className="w-full flex justify-end items-center">
                <Button>Delete this stats</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <DataTable
                columns={columns({ handleDelete: handleDeletePlayerTeam2 })}
                data={[team2]}
                showHeaderAndFooter={false}
              />
              <div className="w-full flex justify-end items-center">
                <Button>Delete this stats</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
