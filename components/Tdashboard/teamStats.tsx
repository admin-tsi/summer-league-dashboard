import React from "react";

type TeamStatsProps = {
  teamId: string | null;
};

const TeamStats = ({ teamId }: TeamStatsProps) => {
  return <div>Team Stats for team ID: {teamId}</div>;
};

export default TeamStats;
