import {
  addHours,
  format,
  isAfter,
  isBefore,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

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
  location: string;
}

type Props = {
  schedules: ScheduleItem[];
};

const Schedule: React.FC<Props> = ({ schedules }) => {
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

  const groupSchedulesByDate = (schedules: ScheduleItem[]) => {
    const grouped: { [key: string]: ScheduleItem[] } = {};
    schedules.forEach((item) => {
      const date = format(parseISO(item.date), "yyyy-MM-dd");
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });
    return grouped;
  };

  const groupedSchedules = groupSchedulesByDate(schedules);

  const getLinkHref = (item: ScheduleItem) => {
    const teamName = item.otmTeam.teamName.replace(/\s+/g, "-");
    return `/score-keeper/${teamName}/${item.otmTeam._id}/${item.schedule}`;
  };

  return (
    <div className="block">
      <div className="w-full flex flex-col border-2">
        {Object.entries(groupedSchedules).map(([date, items]) => (
          <React.Fragment key={date}>
            <div className="w-full flex justify-between items-center bg-black text-background p-2 font-medium">
              <span>{format(parseISO(date), "EEEE", { locale: enUS })}</span>
              <span>
                {format(parseISO(date), "MMMM d, yyyy", { locale: enUS })}
              </span>
            </div>
            {items.map((item) => {
              const statusColor = getStatusColor(item.date, item.hour);
              const linkHref = getLinkHref(item);
              return (
                <Link
                  href={linkHref}
                  key={item.schedule}
                  className="w-full grid grid-cols-8 content-center px-2 py-5 border-b-2 hover:bg-primary-foreground"
                >
                  <span className="col-span-4 md:col-span-2">{item.hour}</span>
                  <div className="col-span-4 md:col-span-4 flex gap-2 items-center">
                    <div className={`size-4 ${statusColor} rounded-full`} />
                    <span className="w-full">
                      {item.homeTeam.teamName} VS {item.awayTeam.teamName}
                    </span>
                  </div>
                  <div className="hidden col-span-2 md:flex justify-end items-center gap-3">
                    <MapPin size={20} />
                    {item.location}
                  </div>
                </Link>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
