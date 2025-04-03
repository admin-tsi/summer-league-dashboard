import {
  TrendingDownIcon,
  TrendingUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";

type Props = {
  team?: any;
};

const TeamOverview = ({ team }: Props) => {
  const [showAllStats, setShowAllStats] = useState(false);

  // Default values if team data is not provided
  const stats = {
    winPercentage: team?.winPercentage || 65.2,
    pointsPerGame: team?.pointsPerGame || 86.4,
    reboundsPerGame: team?.reboundsPerGame || 42.5,
    assistsPerGame: team?.assistsPerGame || 21.8,
    winTrend: team?.winTrend || 8.5,
    pointsTrend: team?.pointsTrend || 3.2,
    reboundsTrend: team?.reboundsTrend || -2.5,
    assistsTrend: team?.assistsTrend || 5.1,
  };

  return (
    <div className="w-full grid grid-cols-1 gap-4">
      <h2 className="text-2xl font-semibold">Season Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card border-b-8 border-b-primary">
          <CardHeader className="relative">
            <CardDescription>Win Percentage</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {stats.winPercentage}%
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className={`flex gap-1 rounded-lg text-xs ${
                  stats.winTrend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.winTrend >= 0 ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {stats.winTrend >= 0 ? "+" : ""}
                {stats.winTrend}%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.winTrend >= 0 ? (
                <>
                  Strong tournament performance{" "}
                  <TrendingUpIcon className="size-4 text-green-600" />
                </>
              ) : (
                <>
                  Needs improvement{" "}
                  <TrendingDownIcon className="size-4 text-red-600" />
                </>
              )}
            </div>
            <div className="text-muted-foreground">
              Based on last {team?.gamesPlayed || 12} games
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card border-b-8 border-b-primary">
          <CardHeader className="relative">
            <CardDescription>Points Per Game</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {stats.pointsPerGame}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className={`flex gap-1 rounded-lg text-xs ${
                  stats.pointsTrend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.pointsTrend >= 0 ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {stats.pointsTrend >= 0 ? "+" : ""}
                {stats.pointsTrend}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.pointsTrend >= 0 ? (
                <>
                  Offensive improvement{" "}
                  <TrendingUpIcon className="size-4 text-green-600" />
                </>
              ) : (
                <>
                  Scoring decline{" "}
                  <TrendingDownIcon className="size-4 text-red-600" />
                </>
              )}
            </div>
            <div className="text-muted-foreground">
              Team ranks {team?.pointsRank || 3}/{team?.totalTeams || 16} in
              scoring
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card border-b-8 border-b-primary">
          <CardHeader className="relative">
            <CardDescription>Rebounds Per Game</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {stats.reboundsPerGame}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className={`flex gap-1 rounded-lg text-xs ${
                  stats.reboundsTrend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.reboundsTrend >= 0 ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {stats.reboundsTrend >= 0 ? "+" : ""}
                {stats.reboundsTrend}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.reboundsTrend >= 0 ? (
                <>
                  Dominating the glass{" "}
                  <TrendingUpIcon className="size-4 text-green-600" />
                </>
              ) : (
                <>
                  Rebounding issues{" "}
                  <TrendingDownIcon className="size-4 text-red-600" />
                </>
              )}
            </div>
            <div className="text-muted-foreground">
              {stats.reboundsTrend >= 0
                ? "Strong frontcourt presence"
                : "Focus area for improvement"}
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card border-b-8 border-b-primary">
          <CardHeader className="relative">
            <CardDescription>Assists Per Game</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {stats.assistsPerGame}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className={`flex gap-1 rounded-lg text-xs ${
                  stats.assistsTrend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.assistsTrend >= 0 ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {stats.assistsTrend >= 0 ? "+" : ""}
                {stats.assistsTrend}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.assistsTrend >= 0 ? (
                <>
                  Great ball movement{" "}
                  <TrendingUpIcon className="size-4 text-green-600" />
                </>
              ) : (
                <>
                  Less team play{" "}
                  <TrendingDownIcon className="size-4 text-red-600" />
                </>
              )}
            </div>
            <div className="text-muted-foreground">
              {stats.assistsTrend >= 0
                ? "Team chemistry improving"
                : "Offensive flow needs work"}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Second row of stats that are conditionally rendered */}
      {showAllStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          <Card className="@container/card border-b-8 border-b-primary">
            <CardHeader className="relative">
              <CardDescription>FG Percentage</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {team?.fieldGoalPercentage || 47.2}%
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs text-green-600"
                >
                  <TrendingUpIcon className="size-3" />
                  +1.8%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Efficient shooting{" "}
                <TrendingUpIcon className="size-4 text-green-600" />
              </div>
              <div className="text-muted-foreground">Good shot selection</div>
            </CardFooter>
          </Card>

          <Card className="@container/card border-b-8 border-b-primary">
            <CardHeader className="relative">
              <CardDescription>3PT Percentage</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {team?.threePointPercentage || 36.5}%
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs text-red-600"
                >
                  <TrendingDownIcon className="size-3" />
                  -1.2%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Perimeter shooting dip{" "}
                <TrendingDownIcon className="size-4 text-red-600" />
              </div>
              <div className="text-muted-foreground">
                Focus on shooting drills
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card border-b-8 border-b-primary">
            <CardHeader className="relative">
              <CardDescription>Turnovers Per Game</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {team?.turnoversPerGame || 13.8}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs text-green-600"
                >
                  <TrendingDownIcon className="size-3" />
                  -2.4
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Better ball security{" "}
                <TrendingUpIcon className="size-4 text-green-600" />
              </div>
              <div className="text-muted-foreground">
                Fewer possessions wasted
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card border-b-8 border-b-primary">
            <CardHeader className="relative">
              <CardDescription>Steals Per Game</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                {team?.stealsPerGame || 8.7}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge
                  variant="outline"
                  className="flex gap-1 rounded-lg text-xs text-green-600"
                >
                  <TrendingUpIcon className="size-3" />
                  +1.3
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Active defense{" "}
                <TrendingUpIcon className="size-4 text-green-600" />
              </div>
              <div className="text-muted-foreground">
                Creating transition chances
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Show/Hide button */}
      <div className="flex justify-end items-center mt-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setShowAllStats(!showAllStats)}
          className="flex items-center gap-2"
        >
          {showAllStats ? (
            <>
              Voir moins
              <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Voir plus
              <ChevronDownIcon className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TeamOverview;
