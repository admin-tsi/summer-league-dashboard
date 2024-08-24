"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface PlayerButtonProps {
  number: number;
  isActive: boolean;
  onClick: () => void;
}

export const PlayerButton: React.FC<PlayerButtonProps> = ({
  number,
  isActive,
  onClick,
}) => {
  const baseClassName =
    "size-20 rounded-none border-4 border-destructive text-3xl";
  const activeClassName = isActive
    ? "text-destructive bg-background"
    : "text-background bg-destructive";

  return (
    <Button
      variant="def"
      className={`${baseClassName} ${activeClassName}`}
      onClick={onClick}
    >
      {number}
    </Button>
  );
};
