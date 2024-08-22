import React from "react";

interface ScoreDisplayProps {
  score: string;
  team: string | null;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, team }) => (
  <div className="md:w-fit grid grid-cols-1 md:flex md:flex-row-reverse divide-x border">
    <div className="flex justify-center items-center p-3">
      <span className="text-4xl text-center font-bold">{score} pts</span>
    </div>
    <div className="flex justify-center items-center p-3">
      <span className="text-3xl text-center">{team}:</span>
    </div>
  </div>
);
