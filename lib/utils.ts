import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getMenuList } from "@/lib/menu-list";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasAccess(
  pathname: string,
  userRole: string | undefined,
): boolean {
  if (!userRole) return false;

  const menuList = getMenuList(pathname, userRole);

  const allRoutes = menuList.flatMap((group) =>
    group.menus.flatMap((menu) =>
      [menu, ...menu.submenus].map((item) => item.href),
    ),
  );

  return allRoutes.some((route) => pathname.startsWith(route));
}

type RoleDefaultPages = {
  [key: string]: string;
};

export const roleDefaultPages: RoleDefaultPages = {
  admin: "/users",
  "team-manager": "/dashboard-tm",
  "kobe-bryant": "/score-keeper",
  user: "/dashboard",
  "web-redactor": "/articles",
};

export const getDefaultPageForRole = (role: string | undefined): string => {
  if (!role) return "/dashboard";
  return roleDefaultPages[role] || "/dashboard";
};
