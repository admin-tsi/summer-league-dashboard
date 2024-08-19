import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import WelcomeMessage from "./WelcomeMessage";
import StatCardsGrid from "./StatCardsGrid";
import TodayGames from "./TodayGames";
import Standings from "./Standings";
import { Game } from "@/lib/types/schedules/schedules";
import { getTeamSchedules } from "@/lib/api/schedules/schedules";
import LoadingSpinner from "../loading-spinner";

const TeamStats = () => {
  const currentUser: any = useCurrentUser();
  const [nextGames, setNextGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNextGames = async () => {
      setIsLoading(true);
      try {
        const games = await getTeamSchedules(currentUser.isManageTeam);
        setNextGames(games);
      } catch (error) {
        console.error("Failed to load next games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNextGames();
  }, [currentUser]);

  return (
    <div className="h-full w-full py-5 flex flex-col space-y-4">
      {isLoading ? (
        <div className="h-full w-full flex justify-center items-center">
          <LoadingSpinner text="Loading..." />
        </div>
      ) : (
        <>
          <WelcomeMessage
            firstName={currentUser.firstName}
            lastName={currentUser.lastName}
          />
          <StatCardsGrid />
          <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
            <TodayGames nextGames={nextGames} />
            <Standings />
          </div>
        </>
      )}
    </div>
  );
};

export default TeamStats;
