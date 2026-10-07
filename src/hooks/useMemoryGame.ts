import { useEffect, useReducer } from 'react'
import { loadBestScore, saveBestScore } from '../game/bestScore'
import { getPairCount, MISMATCH_DELAY_MS } from '../game/config'
import { createDeck } from '../game/deck'
import { createInitialState, gameReducer } from '../game/gameReducer'
import type { Difficulty } from '../game/types'

function buildInitialState(difficulty: Difficulty) {
  return createInitialState({
    difficulty,
    cards: createDeck(getPairCount(difficulty)),
    bestScore: loadBestScore(difficulty),
  })
}

export function useMemoryGame(initialDifficulty: Difficulty) {
  const [state, dispatch] = useReducer(gameReducer, initialDifficulty, buildInitialState)

  // Two face-up cards that aren't matched get flipped back after a short delay.
  // The cleanup cancels the timer if the game is reset in the meantime.
  const isMismatchPending = state.flippedIds.length === 2
  useEffect(() => {
    if (!isMismatchPending) return
    const timeout = window.setTimeout(() => dispatch({ type: 'HIDE_UNMATCHED' }), MISMATCH_DELAY_MS)
    return () => window.clearTimeout(timeout)
  }, [isMismatchPending])

  // The reducer decides whether a win is a new best; this only persists it.
  const { difficulty, bestScore, isNewBest } = state
  useEffect(() => {
    if (isNewBest && bestScore) saveBestScore(difficulty, bestScore)
  }, [difficulty, bestScore, isNewBest])

  const flip = (id: string) => dispatch({ type: 'FLIP', id, now: Date.now() })

  const reset = (nextDifficulty: Difficulty = state.difficulty) => {
    dispatch({
      type: 'RESET',
      difficulty: nextDifficulty,
      cards: createDeck(getPairCount(nextDifficulty)),
      bestScore: loadBestScore(nextDifficulty),
    })
  }

  return { state, flip, reset }
}
