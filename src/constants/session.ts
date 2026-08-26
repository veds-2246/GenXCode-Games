export const SESSION_DURATION_MS = 10 * 60 * 1000;
export const SESSION_WARNING_THRESHOLD_MS = 30 * 1000;

export const SESSION_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  ENDED: "ended",
} as const;

export type SessionStatus = (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];

export function getTimeRemaining(expiresAt: string): number {
  const now = Date.now();
  const expiry = new Date(expiresAt).getTime();
  return Math.max(0, expiry - now);
}

export function isSessionActive(expiresAt: string, status: SessionStatus): boolean {
  if (status !== SESSION_STATUS.ACTIVE) return false;
  return getTimeRemaining(expiresAt) > 0;
}

export function formatTimeRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}