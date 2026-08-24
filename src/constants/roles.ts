export const USER_ROLES = {
  PLAYER: "player",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export function isAdmin(role: UserRole): boolean {
  return role === USER_ROLES.ADMIN;
}

export function isPlayer(role: UserRole): boolean {
  return role === USER_ROLES.PLAYER;
}