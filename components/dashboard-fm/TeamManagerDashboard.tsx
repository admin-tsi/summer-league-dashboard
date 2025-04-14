import Rancking from "./Rancking";
import TeamHeader from "./TeamHeader";
import TeamOverview from "./TeamOverview";
import TeamSchedule from "./TeamSchedule";

type Props = {
  team?: any;
};

const TeamManagerDashboard = ({ team = 1 }: Props) => {
  return (
    <div className="space-y-6 w-full">
      <TeamHeader />
      <TeamOverview />
      <div className="w-full h-[50vh] grid grid-cols-1 md:grid-cols-2 gap-4">
        <TeamSchedule />
        <Rancking />
      </div>
    </div>
  );
};

export default TeamManagerDashboard;
