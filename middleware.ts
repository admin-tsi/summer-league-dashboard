import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";
import { getDefaultPageForRole, hasAccess } from "@/lib/utils";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  // @ts-ignore
  const userRole = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      const defaultPage = getDefaultPageForRole(userRole);
      return NextResponse.redirect(new URL(defaultPage, nextUrl));
    }
    return NextResponse.next();
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!userRole || !hasAccess(nextUrl.pathname, userRole)) {
    const safePage = userRole ? getDefaultPageForRole(userRole) : "/login";
    return NextResponse.redirect(new URL(safePage, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
