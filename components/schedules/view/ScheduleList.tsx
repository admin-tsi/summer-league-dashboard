import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, User, Phone, Mail } from "lucide-react";
import { Schedule } from "@/lib/types/schedules/schedules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/loading-spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScheduleListProps {
  groupedSchedules: Record<string, Record<string, Schedule[]>>;
  isLoading: boolean;
}

interface OfficerInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  groupedSchedules,
  isLoading,
}) => {
  const [animatingSchedules, setAnimatingSchedules] = useState<string[]>([]);

  useEffect(() => {
    const newScheduleIds = Object.values(groupedSchedules)
      .flatMap((dates) => Object.values(dates).flat())
      .map((schedule) => schedule._id)
      .filter((id) => !animatingSchedules.includes(id));

    setAnimatingSchedules((prev) => [...prev, ...newScheduleIds]);

    const timer = setTimeout(() => {
      setAnimatingSchedules([]);
    }, 500);

    return () => clearTimeout(timer);
  }, [groupedSchedules]);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "not started":
        return "bg-yellow-400";
      case "finish":
        return "bg-red-500";
      case "pending":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getTeamInfo = (team: any) => {
    if (typeof team === "object" && team !== null) {
      return {
        name: team.teamName || "Unknown Team",
        gender: team.teamGender || "U",
      };
    }
    return { name: "Unknown Team", gender: "U" };
  };

  const renderOfficerInfo = (
    officer: OfficerInfo | undefined,
    role: string,
  ) => (
    <div className="mb-2">
      <span className="font-semibold">{role} Officer:</span>
      {officer ? (
        <div className="ml-4">
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            {officer.firstName} {officer.lastName}
          </div>
          <div className="flex items-center">
            <Mail size={14} className="mr-1" />
            {officer.email}
          </div>
          <div className="flex items-center">
            <Phone size={14} className="mr-1" />
            {officer.countryCode} {officer.phoneNumber}
          </div>
        </div>
      ) : (
        <span className="ml-4">Not assigned</span>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner text="Loading schedules..." />
          ) : (
            Object.entries(groupedSchedules).map(([matchType, dates]) => (
              <div key={matchType} className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-primary-yellow">
                  {matchType.toUpperCase()}
                </h2>
                {Object.entries(dates).map(([date, daySchedules]) => (
                  <div key={date} className="border mb-4">
                    <div className="bg-black text-white p-2 flex justify-between">
                      <span>
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </span>
                      <span>
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="py-2">
                      {daySchedules.map((schedule) => {
                        const homeTeam = getTeamInfo(schedule.homeTeam);
                        const awayTeam = getTeamInfo(schedule.awayTeam);
                        const isAnimating = animatingSchedules.includes(
                          schedule._id,
                        );

                        return (
                          <Tooltip key={schedule._id}>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={
                                  isAnimating ? { opacity: 0, y: 20 } : false
                                }
                                animate={
                                  isAnimating ? { opacity: 1, y: 0 } : {}
                                }
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-12 gap-2 items-center p-2 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
                              >
                                <span className="col-span-2 text-sm">
                                  {`${schedule.startTime || schedule.hour} - ${schedule.endTime || ""}`}
                                </span>
                                <span className="col-span-6 font-semibold text-sm">
                                  {`${homeTeam.name} (${homeTeam.gender.charAt(0).toUpperCase()}) VS ${awayTeam.name} (${awayTeam.gender.charAt(0).toUpperCase()})`}
                                </span>
                                <span className="col-span-3 text-sm flex items-center">
                                  <MapPin
                                    size={16}
                                    className="mr-1 flex-shrink-0"
                                  />
                                  <span className="truncate">
                                    {schedule.stadiumLocation}
                                  </span>
                                </span>
                                <span className="col-span-1 flex justify-center">
                                  <span
                                    className={`inline-block w-4 h-4 rounded-full ${getStatusColor(schedule.status)}`}
                                    title={schedule.status}
                                  ></span>
                                </span>
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex flex-col">
                                <span className="font-semibold mb-2">
                                  Scoreboard Officers:
                                </span>
                                {renderOfficerInfo(
                                  schedule.homeScoreboardOfficier as unknown as OfficerInfo,
                                  "Home",
                                )}
                                {renderOfficerInfo(
                                  schedule.awayScoreboardOfficier as unknown as OfficerInfo,
                                  "Away",
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ScheduleList;
