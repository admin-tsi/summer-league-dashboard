"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { columns } from "@/components/schedule-stats/[id]/columns";
import { EditStatsModal } from "@/components/schedule-stats/[id]/editStatsModal";
import { DataTable } from "@/components/schedule-stats/schedulesDataTable";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  deleteSchedulesStats,
  getDetailedScheduleStats,
} from "@/lib/api/schedules-stats/schedules-stats";
import { PlayerStats } from "@/lib/types/players/players";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({ params }: { params: { id: string } }) {
  const currentUser = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [teams, setTeams] = useState<PlayerStats[]>([]);
  const isAdmin = currentUser?.role === "admin";
  const [editingTeamIndex, setEditingTeamIndex] = useState<number | null>(null);

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
          currentUser.accessToken,
        );
        console.log(data);
        if (Array.isArray(data) && data.length > 0) {
          setTeams(data);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load schedules",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, [currentUser, params.id]);

  const handleDeletePlayer = (teamIndex: number) => (id: string) => {
    setTeams((prevTeams) => {
      const newTeams = [...prevTeams];
      newTeams[teamIndex] = {
        ...newTeams[teamIndex],
        players: newTeams[teamIndex].players.filter(
          (player) => player.player._id !== id,
        ),
      };
      return newTeams;
    });
  };

  const handleDeleteScheduleStats = async (scheduleStatId: string) => {
    try {
      const competitionId = localStorage.getItem("selectedCompetitionId");
      if (!competitionId || !currentUser?.accessToken) {
        throw new Error("Missing competition ID or access token");
      }
      await deleteSchedulesStats(
        competitionId,
        scheduleStatId,
        currentUser.accessToken,
      );
      toast.success("This schedule stat has been deleted");
      setTeams((prevTeams) =>
        prevTeams.filter((team) => team._id !== scheduleStatId),
      );
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleUpdateStats = async () => {
    window.location.reload();
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
        ) : teams.length === 0 ? (
          <div className="h-[600px] w-full flex justify-center items-center">
            <p>No schedules stats available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="w-full pt-5 grid grid-cols-1 gap-5">
              {teams.map((team, index) => (
                <div key={index}>
                  <DataTable
                    columns={columns({
                      handleDelete: handleDeletePlayer(index),
                      isAdmin,
                    })}
                    data={[team]}
                    showHeaderAndFooter={false}
                  />
                  <div className="w-full flex justify-end items-center mt-4">
                    <Button
                      variant="def"
                      className="border hover:bg-destructive hover:text-white mr-2"
                      onClick={() => setEditingTeamIndex(index)}
                    >
                      Update this schedule stats
                    </Button>
                    <Button
                      variant="def"
                      className="border hover:bg-destructive hover:text-white"
                      onClick={() => handleDeleteScheduleStats(team._id)}
                    >
                      {isDeleting ? (
                        <LoadingSpinner text="Deleting..." />
                      ) : (
                        "Delete this schedule stats"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {teams.length === 2 && (
              <div className="w-full flex justify-end items-center">
                <Button
                  variant="def"
                  className="border hover:bg-primary-green hover:text-white"
                >
                  Validate this schedule stats
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {editingTeamIndex !== null && teams[editingTeamIndex] && (
        <EditStatsModal
          isOpen={true}
          onClose={() => setEditingTeamIndex(null)}
          team={teams[editingTeamIndex]}
          onSave={handleUpdateStats}
          scheduleStatId={teams[editingTeamIndex]._id}
        />
      )}
    </ContentLayout>
  );
}
