import React from "react";
import StatCard from "./StatCard";
import { GameStats } from "@/lib/types/teams/teams";

interface StatCardsGridProps {
  stats: GameStats;
}

const StatCardsGrid: React.FC<StatCardsGridProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <StatCard
        title="Total Game played"
        value={stats.totalGame.toString()}
        icon="🏀"
      />
      <StatCard
        title="Total Win Game"
        value={stats.wins.toString()}
        icon="🏆"
      />
      <StatCard
        title="Total Lost Game"
        value={stats.losses.toString()}
        icon="📊"
      />
      <StatCard
        title="Team Efficiency Rating"
        value={stats.rating.toString()}
        icon="🥉"
      />
    </div>
  );
};

export default StatCardsGrid;
