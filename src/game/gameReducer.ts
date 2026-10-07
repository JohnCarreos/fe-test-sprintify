import { isBetterScore } from './bestScore'
import { elapsedSeconds } from './time'
import type { Card, Difficulty, GameAction, GameState, Score } from './types'

interface InitialStateOptions {
  difficulty: Difficulty
  cards: Card[]
  bestScore?: Score | null
  round?: number
}

export function createInitialState({ difficulty, cards, bestScore = null, round = 0 }: InitialStateOptions): GameState {
  return {
    round,
    difficulty,
    cards,
    flippedIds: [],
    moves: 0,
    status: 'idle',
    lastTurn: null,
    startedAt: null,
    endedAt: null,
    bestScore,
    isNewBest: false,
  }
}

/** True while two mismatched cards are waiting to be flipped back. */
export function isBoardLocked(state: GameState): boolean {
  return state.flippedIds.length >= 2
}

function flipCard(state: GameState, id: string, now: number): GameState {
  const card = state.cards.find((c) => c.id === id)
  if (!card || card.isFlipped || card.isMatched) return state
  if (state.status === 'won' || isBoardLocked(state)) return state

  const isFirstFlipOfGame = state.status === 'idle'
  const flippedIds = [...state.flippedIds, id]
  let cards = state.cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))

  const next: GameState = {
    ...state,
    cards,
    flippedIds,
    status: 'playing',
    startedAt: isFirstFlipOfGame ? now : state.startedAt,
  }

  if (flippedIds.length < 2) {
    return next
  }

  // Second card of the turn: count the move and check for a pair.
  const [firstId, secondId] = flippedIds as [string, string]
  const first = cards.find((c) => c.id === firstId)
  const second = cards.find((c) => c.id === secondId)
  const isMatch = first !== undefined && second !== undefined && first.symbolId === second.symbolId
  const moves = state.moves + 1

  if (!isMatch) {
    // Leave both face-up; HIDE_UNMATCHED flips them back after a delay.
    return { ...next, moves, lastTurn: { isMatch: false, cardIds: [firstId, secondId] } }
  }

  cards = cards.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c))
  const afterMatch: GameState = {
    ...next,
    cards,
    flippedIds: [],
    moves,
    lastTurn: { isMatch: true, cardIds: [firstId, secondId] },
  }

  if (!cards.every((c) => c.isMatched)) return afterMatch

  // Last pair found: stop the clock and compare against the best score.
  const score: Score = { moves, seconds: elapsedSeconds(next.startedAt, now, now) }
  const isNewBest = isBetterScore(score, state.bestScore)
  return {
    ...afterMatch,
    status: 'won',
    endedAt: now,
    isNewBest,
    bestScore: isNewBest ? score : state.bestScore,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'FLIP':
      return flipCard(state, action.id, action.now)

    case 'HIDE_UNMATCHED': {
      if (state.flippedIds.length === 0) return state
      return {
        ...state,
        cards: state.cards.map((c) =>
          state.flippedIds.includes(c.id) && !c.isMatched ? { ...c, isFlipped: false } : c,
        ),
        flippedIds: [],
      }
    }

    case 'RESET':
      return createInitialState({
        difficulty: action.difficulty,
        cards: action.cards,
        bestScore: action.bestScore,
        round: state.round + 1,
      })
  }
}
