import {
  Calendar,
  ClipboardPenLine,
  LayoutGrid,
  NotebookPenIcon,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  roles: string[];
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  roles: string[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(
  pathname: string,
  userRole: string | undefined,
): Group[] {
  const allMenus: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
          roles: ["user"],
        },
        {
          href: "/dashboard-tm",
          label: "Dashboard team manager",
          active: pathname.includes("/dashboard-tm"),
          icon: LayoutGrid,
          submenus: [],
          roles: ["team-manager"],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
          roles: ["admin"],
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: [],
          roles: [],
        },
      ],
    },
    {
      groupLabel: "Management",
      menus: [
        {
          href: "/players",
          label: "Players",
          active: pathname.includes("/players"),
          icon: Shield,
          submenus: [],
          roles: ["admin", "team-manager"],
        },
        {
          href: "/articles",
          label: "Article",
          active: pathname.includes("/articles"),
          icon: NotebookPenIcon,
          submenus: [],
          roles: ["admin", "web-redactor"],
        },
      ],
    },
    {
      groupLabel: "Score keeper",
      menus: [
        {
          href: "/score-keeper",
          label: "Score keeper",
          active: pathname.includes("/score-keeper"),
          icon: ClipboardPenLine,
          submenus: [],
          roles: ["admin", "kobe-bryant"],
        },
      ],
    },
    {
      groupLabel: "Schedule stats",
      menus: [
        {
          href: "/schedule-stats",
          label: "Schedule stats",
          active: pathname.includes("/schedule-stats"),
          icon: TrendingUp,
          submenus: [],
          roles: ["admin"],
        },
        {
          href: "/schedules",
          label: "Schedules",
          active: pathname.includes("/schedules"),
          icon: Calendar,
          submenus: [],
          roles: ["admin"],
        },
      ],
    },
  ];

  return allMenus
    .map((group) => ({
      ...group,
      menus: group.menus.filter((menu) =>
        userRole ? menu.roles.includes(userRole) : menu.roles.length === 0,
      ),
    }))
    .filter((group) => group.menus.length > 0);
}
