import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
};

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <span>{icon}</span>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default StatCard;
