"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { ActionButton } from "@/components/score-keeer/actionButton";
import { PlayerButton } from "@/components/score-keeer/playerButton";
import { ScoreDisplay } from "@/components/score-keeer/scoreDisplay";
import Stat from "@/components/score-keeer/stat";
import { playerStats } from "@/constants/stat/gameStatName";
import { useCurrentUser } from "@/hooks/use-current-user";
import { saveOtmScheduleStat } from "@/lib/api/otm/otm";
import { getAllPlayers } from "@/lib/api/players/players";
import { Player } from "@/lib/types/players/players";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const scoreImpact: Record<string, number> = {
  "03 Points": 3,
  "02 Points": 2,
  "Free Throws": 1,
};

const saveToLocalStorage = (data: any, teamId: string) => {
  const key = `basketballStats_${teamId}`;
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (teamId: string): any | null => {
  const key = `basketballStats_${teamId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const clearLocalStorage = (teamId: string) => {
  const key = `basketballStats_${teamId}`;
  localStorage.removeItem(key);
};

type PlayerStat = Record<string, number>;
type PageProps = { params: { id: string[] } };

const Page: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const currentUser: any = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [submittingErrors, setSubmittingErrors] = useState<string | null>(null);
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [playersData, setPlayersData] = useState<Record<string, PlayerStat>>(
    {}
  );
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const initializePlayerStats = useCallback(
    (players: Player[]): Record<string, PlayerStat> => {
      return players.reduce(
        (acc, player) => {
          acc[player._id] = playerStats.reduce(
            (statAcc, stat) => ({ ...statAcc, [stat]: 0 }),
            {} as PlayerStat
          );
          return acc;
        },
        {} as Record<string, PlayerStat>
      );
    },
    []
  );

  const updateScore = useCallback((stat: string, increment: boolean) => {
    if (stat in scoreImpact) {
      const change = increment ? scoreImpact[stat] : -scoreImpact[stat];
      setTotalScore((prevScore) => {
        const newScore = Math.max(0, prevScore + change);
        return newScore;
      });
    }
  }, []);

  const handleIncrement = useCallback(
    (stat: string) => {
      if (activePlayer !== null) {
        setPlayersData((prevData) => ({
          ...prevData,
          [activePlayer]: {
            ...((prevData[activePlayer] || {}) as PlayerStat),
            [stat]: ((prevData[activePlayer] || {})[stat] || 0) + 1,
          },
        }));
        updateScore(stat, true);
        setHasChanges(true);
      }
    },
    [activePlayer, updateScore]
  );

  const handleDecrement = useCallback(
    (stat: string) => {
      if (activePlayer !== null) {
        setPlayersData((prevData) => {
          const currentValue = ((prevData[activePlayer] || {})[stat] ||
            0) as number;
          if (currentValue === 0) {
            return prevData;
          }

          const newValue = currentValue - 1;

          return {
            ...prevData,
            [activePlayer]: {
              ...((prevData[activePlayer] || {}) as PlayerStat),
              [stat]: newValue,
            },
          };
        });

        updateScore(stat, false);
        setHasChanges(true);
      }
    },
    [activePlayer, updateScore]
  );

  const handlePlayerClick = useCallback(
    (playerId: string) => {
      setActivePlayer(activePlayer === playerId ? null : playerId);
    },
    [activePlayer]
  );

  const handleClear = useCallback(() => {
    setPlayersData(initializePlayerStats(players));
    setTotalScore(0);
    setActivePlayer(null);
    if (teamId) clearLocalStorage(teamId);
    setHasChanges(false);
  }, [players, initializePlayerStats, teamId]);

  const handleSave = useCallback(async () => {
    if (!hasChanges) {
      toast.error("No changes to save.");
      return;
    }

    setSubmittingErrors("");
    setIsSubmitting(true);
    const mappedData = Object.entries(playersData).map(([playerId, stats]) => ({
      player: playerId,
      threePoints: stats["03 Points"] || 0,
      twoPoints: stats["02 Points"] || 0,
      lancerFranc: stats["Free Throws"] || 0,
      assists: stats.Assists || 0,
      blocks: stats.Blocks || 0,
      fouls: stats.Fouls || 0,
      turnOver: stats.Turnovers || 0,
      steal: stats.Steals || 0,
      rebonds: stats.Rebounds || 0,
    }));

    try {
      const competitionId: string | null = localStorage.getItem(
        "selectedCompetitionId"
      );
      if (!competitionId) {
        throw new Error("Competition ID not found in localStorage");
      }

      const scheduleId: string = params.id[2];
      const token: string = currentUser.accessToken;

      const stat = {
        team: teamId,
        players: mappedData,
      };

      console.log(stat);

      await saveOtmScheduleStat(competitionId, scheduleId, token, stat);
      toast.success("This schedule stats has been successfully saved.");
      router.push("/score-keeper");

      handleClear();
    } catch (error: any) {
      toast.error(`${error.message}`);
      setSubmittingErrors(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    hasChanges,
    playersData,
    teamId,
    currentUser,
    params.id,
    router,
    handleClear,
  ]);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      const cleanTeamName = (params.id[0] as string)?.replace(/[-_]/g, " ");
      setTeamName(cleanTeamName);
      const currentTeamId = params.id[1];
      setTeamId(currentTeamId);

      try {
        if (!currentUser.accessToken) {
          setError(
            "Unable to get player list because your token is not provided. Please reload your page, and if the problem persists, don't hesitate to contact us."
          );
          return;
        }

        const data = await getAllPlayers(
          currentUser.role,
          currentUser.accessToken,
          currentTeamId
        );

        setPlayers(data);

        const savedData = loadFromLocalStorage(currentTeamId);
        if (savedData) {
          setPlayersData(savedData.playersData);
          setTotalScore(savedData.totalScore);
        } else {
          setPlayersData(initializePlayerStats(data));
        }
      } catch (error) {
        setError("Failed to load players");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [currentUser, params.id, initializePlayerStats]);

  useEffect(() => {
    if (teamId) {
      saveToLocalStorage(
        {
          playersData,
          totalScore,
        },
        teamId
      );
    }
  }, [playersData, totalScore, teamId]);

  return (
    <ContentLayout title="OTM">
      <>
        {isLoading ? (
          <div className="h-[800px] w-full flex justify-center items-center">
            <LoadingSpinner text="Loading..." />
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : players.length === 0 ? (
          <div className="w-full h-[800px] flex flex-col justify-center items-center gap-2">
            <span>No players available for this team.</span>
            <Button
              onClick={() => {
                router.push("/score-keeper");
              }}
            >
              Go Back
            </Button>
          </div>
        ) : (
          <div className="h-full border border-t-primary-yellow border-t-8 w-full flex flex-col gap-8 justify-center items-center py-5">
            <ScoreDisplay
              score={totalScore.toString().padStart(2, "0")}
              team={teamName}
            />
            <div className="w-full flex justify-center items-center flex-wrap gap-3">
              {players.map((player) => (
                <PlayerButton
                  key={player._id}
                  number={player.dorseyNumber}
                  isActive={activePlayer === player._id}
                  onClick={() => handlePlayerClick(player._id)}
                />
              ))}
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5 px-2">
              {playerStats.map((stat, index) => (
                <div key={index}>
                  <Stat
                    playerStats={stat}
                    value={
                      activePlayer !== null && playersData[activePlayer]
                        ? playersData[activePlayer][stat] || 0
                        : 0
                    }
                    onIncrement={() => handleIncrement(stat)}
                    onDecrement={() => handleDecrement(stat)}
                  />
                </div>
              ))}
            </div>
            <div className="w-1/2 grid grid-cols-2 gap-2">
              <ActionButton onClick={handleClear}>CLEAR</ActionButton>
              <ActionButton
                destructive
                onClick={handleSave}
                disabled={!hasChanges || isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner text="Saving..." /> : "SAVE"}
              </ActionButton>
            </div>
          </div>
        )}
      </>
    </ContentLayout>
  );
};

export default Page;
