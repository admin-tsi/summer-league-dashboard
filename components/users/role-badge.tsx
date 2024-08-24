import React from "react";
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  let badgeClass: string;

  switch (role) {
    case "admin":
      badgeClass = "bg-destructive/80 text-primary-foreground";
      break;
    case "team-manager":
      badgeClass = "bg-primary-yellow/80 text-primary-foreground";
      break;
    case "user":
      badgeClass = "bg-primary-green/80 text-primary-foreground";
      break;
    case "kobe-bryant":
      badgeClass = "bg-primary/80 text-primary-foreground";
      break;
    case "content-creator":
      badgeClass = "bg-pink-950/80 text-primary-foreground";
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-700 hover:text-white";
  }

  return (
    <div>
      <Badge className={`${badgeClass} truncate`}>{String(role)}</Badge>
    </div>
  );
};
