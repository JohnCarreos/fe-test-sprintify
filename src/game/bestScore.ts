import type { Difficulty, Score } from './types'

const STORAGE_PREFIX = 'memory-game:best:'

/** Fewer moves wins; equal moves are broken by the faster time. */
export function isBetterScore(candidate: Score, current: Score | null): boolean {
  if (current === null) return true
  if (candidate.moves !== current.moves) return candidate.moves < current.moves
  return candidate.seconds < current.seconds
}

function isScore(value: unknown): value is Score {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Score).moves === 'number' &&
    typeof (value as Score).seconds === 'number'
  )
}

// localStorage can throw (private mode, disabled storage, quota), so every
// access is guarded and failures simply mean "no best score".
export function loadBestScore(difficulty: Difficulty): Score | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + difficulty)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isScore(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveBestScore(difficulty: Difficulty, score: Score): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + difficulty, JSON.stringify(score))
  } catch {
    // Ignore: the game still works without persistence.
  }
}
