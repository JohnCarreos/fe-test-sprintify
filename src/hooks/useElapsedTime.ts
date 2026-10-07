import { useEffect, useState } from 'react'
import { elapsedSeconds } from '../game/time'

const TICK_MS = 250

/** Whole seconds between `startedAt` and `endedAt` (or now, while running). */
export function useElapsedTime(startedAt: number | null, endedAt: number | null): number {
  const [now, setNow] = useState(0)
  const isRunning = startedAt !== null && endedAt === null

  useEffect(() => {
    if (!isRunning) return
    const interval = window.setInterval(() => setNow(Date.now()), TICK_MS)
    return () => window.clearInterval(interval)
  }, [isRunning])

  return elapsedSeconds(startedAt, endedAt, now)
}
