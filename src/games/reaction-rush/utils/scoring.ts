export function calculateScore(reactionMs: number): number {
  const baseScore = 1000;
  const decayPerMs = 2;
  const score = baseScore - reactionMs * decayPerMs;
  return Math.max(0, Math.floor(score));
}

export function formatReactionTime(ms: number): string {
  const seconds = (ms / 1000).toFixed(3);
  const parts = seconds.split('.');
  return `${parts[0].padStart(2, '0')}.${parts[1]}`;
}