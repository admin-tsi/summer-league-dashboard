/**
 * An array of public routes
 * These routes are accessible to everyone
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/login"];

/**
 * An array of private routes
 * These routes will redirect logged users to the defaultLoginRedirect
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/login"];

/**
 * An array of api auth routes
 * These routes are used for authentication
 * @type {string[]}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * An array of api auth routes
 * These routes are used for authentication
 * @type {string}
 */
export const defaultLoginRedirect: string = "/";
