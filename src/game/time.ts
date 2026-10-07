/** Formats whole seconds as m:ss (e.g. 75 → "1:15"). */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function elapsedSeconds(startedAt: number | null, endedAt: number | null, now: number): number {
  if (startedAt === null) return 0
  return Math.max(0, Math.floor(((endedAt ?? now) - startedAt) / 1000))
}
