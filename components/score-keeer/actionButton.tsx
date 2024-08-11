import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  children: React.ReactNode;
  destructive?: boolean;
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  destructive = false,
  onClick,
}) => (
  <Button
    variant="def"
    className={`rounded-none border-2 border-destructive w-full py-6 md:py-8 text-1xl md:text-2xl ${
      destructive ? "bg-destructive text-background" : ""
    }`}
    onClick={onClick}
  >
    {children}
  </Button>
);
