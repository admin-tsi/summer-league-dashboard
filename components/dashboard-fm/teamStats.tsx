import React from "react";
import StatCard from "./StatCard";
import { GameStats } from "@/lib/types/teams/teams";

interface StatCardsGridProps {
  stats?: GameStats;
}

const StatCardsGrid: React.FC<StatCardsGridProps> = ({ stats }) => {
  const defaultValue = "00";

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <StatCard
        title="Total Game played"
        value={stats ? stats.totalGame.toString() : defaultValue}
        icon="🏀"
      />
      <StatCard
        title="Total Win Game"
        value={stats ? stats.wins.toString() : defaultValue}
        icon="🏆"
      />
      <StatCard
        title="Total Lost Game"
        value={stats ? stats.losses.toString() : defaultValue}
        icon="📊"
      />
      <StatCard
        title="Team Efficiency Rating"
        value={stats ? stats.rating.toString() : defaultValue}
        icon="🥉"
      />
    </div>
  );
};

export default StatCardsGrid;
