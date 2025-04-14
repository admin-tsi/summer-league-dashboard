import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

type Props = {
  team?: any;
};

const TeamStatistics = ({ team }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Goals Scored", value: 0, max: 30 },
              {
                label: "Goals Conceded",
                value: 0,
                max: 30,
              },
              { label: "Clean Sheets", value: 0, max: 15 },
              { label: "Win Rate", value: 0, max: 100 },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{stat.label}</span>
                  <span>
                    {stat.value}
                    {stat.label === "Win Rate" ? "%" : ""}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(stat.value / stat.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-2 mb-4">
            {(team.recentForm || "WLWDL")
              .split("")
              .map((result: any, i: any) => (
                <div
                  key={i}
                  className={`h-8 w-8 flex items-center justify-center rounded-full text-white font-medium ${
                    result === "W"
                      ? "bg-green-500"
                      : result === "L"
                        ? "bg-red-500"
                        : result === "D"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                  }`}
                >
                  {result}
                </div>
              ))}
          </div>

          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="font-medium text-gray-500">Last 5 matches:</dt>
              <dd>{"3W 1D 1L"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-500">Goals in last 5:</dt>
              <dd>{"7 scored, 3 conceded"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-gray-500">Points gained:</dt>
              <dd>{"10 / 15"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStatistics;
