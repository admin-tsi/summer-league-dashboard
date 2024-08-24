import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Game } from "@/lib/types/schedules/schedules";
import { useState } from "react";

type TodayGamesProps = {
  nextGames: Game[];
};

const TodayGames = ({ nextGames }: TodayGamesProps) => {
  const currentUser: any = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="border rounded-md p-5 h-fit md:h-[550px] gap-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-1xl font-semibold">Next Game</span>
        <span>View All</span>
      </div>
      <div className="w-full pt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/12">Hour</TableHead>
              <TableHead className="w-4/12">Home Team</TableHead>
              <TableHead className="w-4/12">Away Team</TableHead>
              <TableHead className="w-2/12">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nextGames.map((game) => (
              <TableRow key={game._id}>
                <TableCell className="font-medium">{game.startTime}</TableCell>
                <TableCell className="font-medium">
                  {game.homeTeam.teamName}
                </TableCell>
                <TableCell className="font-medium">
                  {game.awayTeam.teamName}
                </TableCell>
                <TableCell className="font-medium">
                  {game.stadiumLocation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TodayGames;
