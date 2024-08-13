import React from "react";
import {
  parseISO,
  isAfter,
  isBefore,
  isWithinInterval,
  addHours,
} from "date-fns";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Team {
  _id: string;
  teamName: string;
}

interface ScheduleItem {
  schedule: string;
  date: string;
  hour: string;
  homeTeam: Team;
  awayTeam: Team;
  matchType: string;
  otmTeam: Team;
}

type Props = {
  schedules: ScheduleItem[];
};

const Schedule: React.FC<Props> = ({ schedules }) => {
  const currentUser: any = useCurrentUser();

  const getStatusColor = (date: string, hour: string): string => {
    const now = new Date();
    const [hours, minutes] = hour.split("H").map(Number);
    const matchDateTime = parseISO(date);
    matchDateTime.setHours(hours, minutes);
    const matchEndTime = addHours(matchDateTime, 2);

    if (isBefore(matchEndTime, now)) {
      return "bg-destructive";
    } else if (
      isWithinInterval(now, { start: matchDateTime, end: matchEndTime })
    ) {
      return "bg-primary-green";
    } else if (isAfter(matchDateTime, now)) {
      return "bg-primary-yellow";
    }
    return "bg-gray-400";
  };

  if (schedules.length === 0) {
    return null;
  }

  const teamName = schedules[0].otmTeam.teamName.replace(/\s+/g, "-");
  const linkHref = `/score-keeper/${teamName}/${schedules[0].otmTeam._id}/${schedules[0].schedule}`;

  return (
    <Link href={linkHref} className="block hover:shadow-xl">
      <div className="w-full flex flex-col border-2">
        {schedules.map((item, index) => {
          const date = new Date(item.date);
          const formattedDate = date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          const statusColor = getStatusColor(item.date, item.hour);

          return (
            <React.Fragment key={item.schedule}>
              {index === 0 ||
              date.getDate() !==
                new Date(schedules[index - 1].date).getDate() ? (
                <div className="w-full flex justify-between items-center bg-black text-background p-2 font-medium">
                  <span>
                    {date.toLocaleDateString("fr-FR", { weekday: "long" })}
                  </span>
                  <span>{formattedDate}</span>
                </div>
              ) : null}
              <div className="w-full flex justify-between items-center h-20 p-2">
                <div className="flex gap-2 items-center">
                  <span>{item.hour}</span>
                  <div className={`size-4 ${statusColor} rounded-full`} />
                </div>
                <span className="text-right w-1/2">
                  {item.homeTeam.teamName} VS {item.awayTeam.teamName}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Link>
  );
};

export default Schedule;
