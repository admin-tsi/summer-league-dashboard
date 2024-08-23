// pages/schedule-stats/[id].tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { columns } from "@/components/schedule-stats/[id]/columns";
import { EditStatsModal } from "@/components/schedule-stats/[id]/editStatsModal";
import { DataTable } from "@/components/schedule-stats/schedulesDataTable";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  deleteOtmScheduleStat,
  deleteSchedulesStats,
  getDetailedScheduleStats,
  saveScheduleStat,
} from "@/lib/api/schedules-stats/schedules-stats";
import { Team, PlayerStat } from "@/lib/types/schedules-stats/schedules-stats";

export default function Page({ params }: { params: { id: string } }) {
  const currentUser = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isAdmin = currentUser?.role === "admin";

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!currentUser?.accessToken) {
        throw new Error("You must be logged in to view this page.");
      }
      const competitionId = localStorage.getItem("selectedCompetitionId");
      if (!competitionId) {
        throw new Error(
          "No competition selected. Please select a competition first."
        );
      }
      const data = await getDetailedScheduleStats(
        params.id,
        competitionId,
        currentUser.accessToken
      );
      setHomeTeam(data.homeTeam || null);
      setAwayTeam(data.awayTeam || null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load schedules."
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, params.id]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleDeleteScheduleStats = async (scheduleStatId: string) => {
    setIsDeleting(true);
    try {
      const competitionId = localStorage.getItem("selectedCompetitionId");
      if (!competitionId || !currentUser?.accessToken) {
        throw new Error("Missing competition ID or access token.");
      }
      await deleteOtmScheduleStat(
        competitionId,
        scheduleStatId,
        currentUser.accessToken
      );
      toast.success("This schedule stat has been deleted.");
      if (homeTeam?._id === scheduleStatId) {
        setHomeTeam(null);
      } else if (awayTeam?._id === scheduleStatId) {
        setAwayTeam(null);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete schedule stat."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveScheduleStats = async () => {
    setIsValidating(true);
    try {
      const competitionId = localStorage.getItem("selectedCompetitionId");
      if (!competitionId || !currentUser?.accessToken) {
        throw new Error("Missing competition ID or access token.");
      }
      const finalResult = {
        homeTeam: {
          teamId: homeTeam?.team._id,
          stats: homeTeam?.players,
        },
        awayTeam: {
          teamId: awayTeam?.team._id,
          stats: awayTeam?.players,
        },
      };
      await saveScheduleStat(
        competitionId,
        params.id,
        currentUser.accessToken,
        finalResult
      );
      toast.success("This schedule stat has been saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save schedule stat."
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpdateStats = (updatedTeam: Team) => {
    if (updatedTeam._id === homeTeam?._id) {
      setHomeTeam(updatedTeam);
    } else if (updatedTeam._id === awayTeam?._id) {
      setAwayTeam(updatedTeam);
    }
    setIsEditModalOpen(false);
  };

  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Schedules Stats", href: "/schedules-stats" },
    { label: `${params.id}` },
  ];

  const renderTeamStats = (team: Team | null, isHomeTeam: boolean) => {
    if (!team) return null;
    return (
      <div className="w-full pt-5 grid grid-cols-1 gap-5">
        <div>
          <div className="w-full py-3">
            <span>
              {team.team.teamName} ({team.team.teamGender})
            </span>
          </div>
          <DataTable
            columns={columns({ isAdmin })}
            data={team.players || []}
            showHeaderAndFooter={false}
          />
          <div className="w-full flex justify-end items-center mt-4">
            <Button
              variant="def"
              className="border hover:bg-primary hover:text-white mr-2"
              onClick={() => {
                setEditingTeam(team);
                setIsEditModalOpen(true);
              }}
            >
              Update this schedule stats
            </Button>
            <Button
              variant="def"
              className="border hover:bg-destructive hover:text-white"
              onClick={() => handleDeleteScheduleStats(team._id || "")}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <LoadingSpinner text="Deleting..." />
              ) : (
                "Delete this schedule stats"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

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
        ) : homeTeam || awayTeam ? (
          <div className="grid grid-cols-1 gap-4">
            {renderTeamStats(homeTeam, true)}
            {renderTeamStats(awayTeam, false)}
            {homeTeam && awayTeam && (
              <div className="w-full flex justify-end items-center mb-10">
                <Button
                  variant="def"
                  className="border hover:bg-primary-green hover:text-white"
                  onClick={handleSaveScheduleStats}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <LoadingSpinner text="Validating..." />
                  ) : (
                    "Validate this schedule stats"
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[600px] w-full flex justify-center items-center">
            <p>No team data available.</p>
          </div>
        )}
      </div>
      <EditStatsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        team={editingTeam}
        onSave={handleUpdateStats}
        scheduleStatId={editingTeam?._id ?? null}
      />
    </ContentLayout>
  );
}
