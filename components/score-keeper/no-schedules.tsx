import React from "react";
import { Calendar } from "lucide-react";

const NoSchedules = () => {
  return (
    <div className="h-[600px] w-full flex flex-col justify-center items-center rounded-lg shadow-sm">
      <Calendar className="w-16 h-16 text-primary mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        No Schedules Available
      </h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        There are currently no schedules available for your team. Check back
        later or contact the administrator for more information.
      </p>
    </div>
  );
};

export default NoSchedules;
