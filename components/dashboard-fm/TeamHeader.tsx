import { useEffect, useState } from "react";
import { Handshake, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Teams } from "@/lib/types/teams/teams";

type Props = {};

const TeamHeader = ({}: Props) => {
  const [team, setTeam] = useState<Teams | null>(null);

  useEffect(() => {
    const storedTeam = localStorage.getItem("currentTeam");
    if (storedTeam) {
      try {
        const parsedTeam = JSON.parse(storedTeam);
        setTeam(parsedTeam);
      } catch (error) {
        console.error("Failed to parse team data from localStorage:", error);
      }
    }
  }, []);

  const getTeamInitials = (teamName?: string) => {
    if (!teamName) return "TM";

    const words = teamName.split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return teamName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-row justify-between items-center gap-4 p-4 bg-primary/10 rounded-lg w-full">
      <div className="flex justify-center items-center gap-4">
        <div className="h-16 w-16 hidden md:flex justify-center items-center ">
          <span>{getTeamInitials(team?.teamName)}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {team?.teamName || "Team Name"}
          </h1>
          <div className="text-gray-500 text-sm flex gap-3">
            <span>
              {team?.divisionName
                ? `${team.divisionName} division`
                : "Division not specified"}
              {team?.teamGender ? ` of ${team.teamGender}` : ""}
              {team?.city ? ` in ${team.city}` : ""}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-2 md:mt-0">
        <Button className="px-4 py-2 border text-sm bg-transparent text-primary hover:text-background rounded flex justify-center items-center gap-2 ">
          <Pencil className="h-4 w-4" />
          <span className="hidden md:block">Edit Team</span>
        </Button>
        <Button className="px-4 py-2 border text-sm bg-transparent text-primary hover:text-background rounded flex justify-center items-center gap-2 ">
          <Handshake className="h-4 w-4" />
          <span className="hidden md:block">Team Staff</span>
        </Button>
      </div>
    </div>
  );
};

export default TeamHeader;
