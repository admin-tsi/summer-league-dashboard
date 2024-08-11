import React from "react";

interface ScoreDisplayProps {
  score: string;
  team: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, team }) => (
  <div className="md:w-[30%] lg:w-[20%] grid grid-cols-1 divide-y border">
    <div className="flex justify-center items-center py-3">
      <span className="text-5xl text-center font-bold">{score} pts</span>
    </div>
    <div className="flex justify-center items-center p-3">
      <span className="text-3xl text-center">{team}</span>
    </div>
  </div>
);
