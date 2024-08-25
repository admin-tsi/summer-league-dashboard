import React from "react";
import StatCard from "./StatCard";

const StatCardsGrid = () => (
  <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
    <StatCard title="Total Game played" value="00" icon="🏀" />
    <StatCard title="Total Win Game" value="00" icon="🏆" />
    <StatCard title="Total Lost Game" value="00" icon="📊" />
    <StatCard title="Team Efficiency Rating" value="00" icon="🥉" />
  </div>
);

export default StatCardsGrid;
