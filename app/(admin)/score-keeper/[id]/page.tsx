"use client";
import React, { useState } from "react";
import { PlayerButton } from "@/components/score-keeer/playerButton";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Stat from "@/components/score-keeer/stat";
import { playerStats } from "@/constants/stat/gameStatName";
import { ActionButton } from "@/components/score-keeer/actionButton";
import { ScoreDisplay } from "@/components/score-keeer/scoreDisplay";

const scoreImpact: Record<string, number> = {
  "03 Points": 3,
  "02 Points": 2,
  "Free Throws": 1,
};

type PlayerStat = Record<string, number>;

const Page: React.FC = () => {
  const [activePlayer, setActivePlayer] = useState<number | null>(null);

  const initializePlayerStats = () => {
    const initialStats: Record<number, PlayerStat> = {};
    for (let i = 0; i < 8; i++) {
      initialStats[i] = playerStats.reduce(
        (acc, stat) => ({ ...acc, [stat]: 0 }),
        {}
      );
    }
    return initialStats;
  };

  const [playersData, setPlayersData] = useState<Record<number, PlayerStat>>(
    initializePlayerStats
  );

  const [totalScore, setTotalScore] = useState(0);

  const updateScore = (stat: string, increment: boolean) => {
    if (stat in scoreImpact) {
      const change = increment ? scoreImpact[stat] : -scoreImpact[stat];
      setTotalScore((prevScore) => Math.max(0, prevScore + change));
    }
  };

  const handleIncrement = (stat: string) => {
    if (activePlayer !== null) {
      setPlayersData((prevData) => ({
        ...prevData,
        [activePlayer]: {
          ...prevData[activePlayer],
          [stat]: (prevData[activePlayer][stat] || 0) + 1,
        },
      }));
      updateScore(stat, true);
    }
  };

  const handleDecrement = (stat: string) => {
    if (activePlayer !== null) {
      setPlayersData((prevData) => {
        const newValue = Math.max(0, (prevData[activePlayer][stat] || 0) - 1);
        if (newValue === prevData[activePlayer][stat]) {
          return prevData;
        }
        updateScore(stat, false);
        return {
          ...prevData,
          [activePlayer]: {
            ...prevData[activePlayer],
            [stat]: newValue,
          },
        };
      });
    }
  };

  const handlePlayerClick = (index: number) => {
    setActivePlayer(activePlayer === index ? null : index);
  };

  const handleClear = () => {
    setPlayersData(initializePlayerStats());
    setTotalScore(0);
    setActivePlayer(null);
  };

  const handleSave = () => {
    console.log("Players Stats:", playersData);
    console.log("Total Score:", totalScore);
  };

  return (
    <ContentLayout title="OTM">
      <div className="h-full border border-t-primary-yellow border-t-8 w-full flex flex-col gap-8 justify-center items-center py-5">
        <ScoreDisplay
          score={totalScore.toString().padStart(2, "0")}
          team="YEWA GUARDIANS"
        />
        <div className="w-full flex justify-center items-center flex-wrap gap-3">
          {[...Array(8)].map((_, index) => (
            <PlayerButton
              key={index}
              number={`0${index + 1}`}
              isActive={activePlayer === index}
              onClick={() => handlePlayerClick(index)}
            />
          ))}
        </div>
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5 px-2">
          {playerStats.map((stat, index) => (
            <div key={index}>
              <Stat
                playerStats={stat}
                value={
                  activePlayer !== null ? playersData[activePlayer][stat] : 0
                }
                onIncrement={() => handleIncrement(stat)}
                onDecrement={() => handleDecrement(stat)}
              />
            </div>
          ))}
        </div>
        <div className="w-1/2 grid grid-cols-2 gap-2">
          <ActionButton onClick={handleClear}>CLEAR</ActionButton>
          <ActionButton destructive onClick={handleSave}>
            SAVE
          </ActionButton>
        </div>
      </div>
    </ContentLayout>
  );
};

export default Page;
