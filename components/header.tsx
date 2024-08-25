"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="relative border-b-[1px] px-2 sm:px-4 py-6 flex items-center">
      <div className="flex justify-between w-full">
        <div className="text-lg font-bold">
          {pathname.replace("/", "") || "Home"}
        </div>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 cursor-pointer">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">SEASON 24-25</span>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Option 1</DropdownMenuItem>
            <DropdownMenuItem>Option 2</DropdownMenuItem>
            <DropdownMenuItem>Option 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center mr-4"></div>
    </div>
  );
};

export default Header;
