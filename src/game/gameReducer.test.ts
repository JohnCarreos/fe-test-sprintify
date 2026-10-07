import { describe, expect, it } from 'vitest'
import { createInitialState, gameReducer } from './gameReducer'
import type { Card, GameAction, GameState } from './types'

const card = (id: string, symbolId: string): Card => ({ id, symbolId, isFlipped: false, isMatched: false })

// Two pairs in a fixed order so tests are deterministic.
const deck = (): Card[] => [card('a1', 'apple'), card('b1', 'banana'), card('a2', 'apple'), card('b2', 'banana')]

const run = (state: GameState, ...actions: GameAction[]) => actions.reduce(gameReducer, state)
const flip = (id: string, now = 1000): GameAction => ({ type: 'FLIP', id, now })

describe('gameReducer', () => {
  const initial = createInitialState({ difficulty: 'easy', cards: deck() })

  it('starts the timer on the first flip', () => {
    const state = run(initial, flip('a1', 5000))
    expect(state.status).toBe('playing')
    expect(state.startedAt).toBe(5000)
    expect(state.moves).toBe(0)
    expect(state.cards[0].isFlipped).toBe(true)
  })

  it('keeps a matching pair face-up and counts one move', () => {
    const state = run(initial, flip('a1'), flip('a2'))
    expect(state.moves).toBe(1)
    expect(state.lastTurn).toEqual({ isMatch: true, cardIds: ['a1', 'a2'] })
    expect(state.flippedIds).toEqual([])
    expect(state.cards.filter((c) => c.isMatched).map((c) => c.id)).toEqual(['a1', 'a2'])
  })

  it('flips a mismatched pair back on HIDE_UNMATCHED', () => {
    const mismatched = run(initial, flip('a1'), flip('b1'))
    expect(mismatched.moves).toBe(1)
    expect(mismatched.lastTurn).toEqual({ isMatch: false, cardIds: ['a1', 'b1'] })
    expect(mismatched.flippedIds).toEqual(['a1', 'b1'])

    const hidden = gameReducer(mismatched, { type: 'HIDE_UNMATCHED' })
    expect(hidden.flippedIds).toEqual([])
    expect(hidden.cards.every((c) => !c.isFlipped)).toBe(true)
  })

  it('ignores a third flip while a mismatch is pending', () => {
    const mismatched = run(initial, flip('a1'), flip('b1'))
    expect(gameReducer(mismatched, flip('a2'))).toBe(mismatched)
  })

  it('ignores flipping the same card twice or an already matched card', () => {
    const oneUp = run(initial, flip('a1'))
    expect(gameReducer(oneUp, flip('a1'))).toBe(oneUp)

    const matched = run(initial, flip('a1'), flip('a2'))
    expect(gameReducer(matched, flip('a1'))).toBe(matched)
  })

  it('wins and stops the timer on the last match', () => {
    const state = run(initial, flip('a1', 1000), flip('a2', 2000), flip('b1', 3000), flip('b2', 9000))
    expect(state.status).toBe('won')
    expect(state.moves).toBe(2)
    expect(state.startedAt).toBe(1000)
    expect(state.endedAt).toBe(9000)
    expect(gameReducer(state, flip('a1'))).toBe(state)
  })

  it('records the first win as a new best score', () => {
    const state = run(initial, flip('a1', 1000), flip('a2', 2000), flip('b1', 3000), flip('b2', 9000))
    expect(state.isNewBest).toBe(true)
    expect(state.bestScore).toEqual({ moves: 2, seconds: 8 })
  })

  it('keeps the previous best when the new score is worse', () => {
    const previousBest = { moves: 2, seconds: 3 }
    const start = createInitialState({ difficulty: 'easy', cards: deck(), bestScore: previousBest })
    const state = run(start, flip('a1', 0), flip('a2', 0), flip('b1', 0), flip('b2', 10_000))
    expect(state.isNewBest).toBe(false)
    expect(state.bestScore).toBe(previousBest)
  })

  it('RESET returns a fresh idle game', () => {
    const played = run(initial, flip('a1'), flip('b1'))
    const bestScore = { moves: 5, seconds: 20 }
    const reset = gameReducer(played, { type: 'RESET', difficulty: 'medium', cards: deck(), bestScore })
    expect(reset).toEqual(createInitialState({ difficulty: 'medium', cards: deck(), bestScore, round: played.round + 1 }))
  })
})
