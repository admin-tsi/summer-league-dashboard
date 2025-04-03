import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

type Props = {
  team?: any;
};

const TeamSchedule = ({ team }: Props) => {
  return (
    <Card className="border-b-8 border-primary shadow-sm h-fit md:h-[50vh]">
      <CardHeader className="pb-4">
        <CardTitle className="text-primary">Upcoming Fixtures</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(5)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + (i + 1) * 7);

          return (
            <div key={i} className="flex items-center border-b pb-3">
              <div className="w-16 text-center">
                <div className="text-sm font-medium">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </div>
                <div className="text-2xl font-bold">{date.getDate()}</div>
              </div>

              <div className="flex-1 mx-4">
                <div className="font-medium">vs. Opponent {i + 1}</div>
                <div className="text-sm text-gray-500">
                  {i % 2 === 0 ? "Home" : "Away"} •{" "}
                  {["League", "Cup", "Friendly"][i % 3]}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">{`${Math.floor(Math.random() * 12 + 10)}:${Math.random() > 0.5 ? "00" : "30"} ${Math.random() > 0.5 ? "AM" : "PM"}`}</div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TeamSchedule;
