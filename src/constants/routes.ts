export const ROUTES = {
  HOME: "/",
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  WAITING: "/waiting",
  ARCADE: "/arcade",
  GAME: (slug: string) => `/games/${slug}`,
  RESULTS: (slug: string) => `/results/${slug}`,
  LEADERBOARD: "/leaderboard",
  LEADERBOARD_GAME: (slug: string) => `/leaderboard/${slug}`,
  ADMIN: "/admin",
  ADMIN_SESSIONS: "/admin/sessions",
  ADMIN_USERS: "/admin/users",
  ADMIN_GAMES: "/admin/games",
} as const;

export type RouteKey = keyof typeof ROUTES;

export function isValidRoute(path: string): boolean {
  const staticRoutes: string[] = [];
  for (const value of Object.values(ROUTES)) {
    if (typeof value === "string") {
      staticRoutes.push(value);
    }
  }
  return staticRoutes.includes(path);
}