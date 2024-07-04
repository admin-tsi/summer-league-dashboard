"use client";
import { Nav } from "./ui/nav";
import { LayoutDashboard, UsersRound } from "lucide-react";

type Props = {};

import { useWindowWidth } from "@react-hook/window-size";

export default function SideNavbar({}: Props) {
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  return (
    <div className="relative min-w-[100px] border-r px-3 pb-10 pt-6">
      <Nav
        isCollapsed={mobileWidth}
        links={[
          {
            title: "Dashboard",
            href: "/",
            icon: LayoutDashboard,
            variant: "ghost",
          },
          {
            title: "Users",
            href: "/Users",
            icon: UsersRound,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
}
