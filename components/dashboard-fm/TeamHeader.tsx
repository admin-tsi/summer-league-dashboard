import { useEffect, useState } from "react";
import { Handshake, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Teams } from "@/lib/types/teams/teams";
import { getTeamById } from "@/lib/api/teams/teams";
import { useCurrentUser } from "@/hooks/use-current-user";

const TeamHeader = () => {
  const currentUser = useCurrentUser();
  const [team, setTeam] = useState<Teams | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        const teamId = currentUser?.user?.isManageTeam;
        const competitionId = localStorage.getItem("selectedCompetitionId");
        const token = currentUser?.user?.accessToken;

        if (!teamId || !competitionId || !token) {
          console.error("Missing required data for team fetch");
          setIsLoading(false);
          return;
        }

        const teamData = await getTeamById(competitionId, teamId, token);
        setTeam(teamData);

        // Sauvegarder dans localStorage pour utilisation ailleurs
        localStorage.setItem("currentTeam", JSON.stringify(teamData));
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [currentUser?.user?.isManageTeam, currentUser?.user?.accessToken]);

  const getTeamInitials = (teamName?: string) => {
    if (!teamName) return "TM";
    const words = teamName.split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return teamName.substring(0, 2).toUpperCase();
  };

  const teamInitials = getTeamInitials(team?.teamName);
  const locationInfo = [
    team?.divisionName && `${team.divisionName} division`,
    team?.teamGender && `of ${team.teamGender}`,
    team?.city && `in ${team.city}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-primary/10 rounded-lg w-full">
      <div className="flex justify-center items-center gap-4">
        <div className="h-16 w-16 hidden md:flex justify-center items-center bg-primary/20 text-primary font-bold rounded-full">
          <span>{teamInitials}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-center md:text-left">
            {isLoading ? "Loading..." : team?.teamName || "Team Name"}
          </h1>
          {locationInfo && (
            <div className="text-gray-500 text-sm">
              <span>{locationInfo}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <Button
          variant="outline"
          className="px-3 py-2 text-primary hover:bg-primary hover:text-white"
        >
          <Pencil className="h-4 w-4 mr-2" />
          <span className="hidden md:block">Edit Team</span>
        </Button>
        <Button
          variant="outline"
          className="px-3 py-2 text-primary hover:bg-primary hover:text-white"
        >
          <Handshake className="h-4 w-4 mr-2" />
          <span className="hidden md:block">Team Staff</span>
        </Button>
      </div>
    </div>
  );
};

export default TeamHeader;
