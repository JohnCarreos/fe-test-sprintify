import { describe, expect, it } from 'vitest'
import { createInitialState, gameReducer } from './gameReducer'
import { getStatusMessage } from './statusMessage'
import type { Card, GameAction, GameState } from './types'

const card = (id: string, symbolId: string): Card => ({ id, symbolId, isFlipped: false, isMatched: false })
const initial = createInitialState({
  difficulty: 'easy',
  cards: [card('a1', 'apple'), card('b1', 'banana'), card('a2', 'apple'), card('b2', 'banana')],
})
const flip = (id: string): GameAction => ({ type: 'FLIP', id, now: 0 })
const run = (state: GameState, ...ids: string[]) => ids.map(flip).reduce(gameReducer, state)

describe('getStatusMessage', () => {
  it('is empty before the first turn completes', () => {
    expect(getStatusMessage(initial, 0)).toBe('')
    expect(getStatusMessage(run(initial, 'a1'), 0)).toBe('')
  })

  it('describes matches and mismatches', () => {
    expect(getStatusMessage(run(initial, 'a1', 'a2'), 0)).toBe('Match: apple. 1 of 2 pairs found.')
    expect(getStatusMessage(run(initial, 'a1', 'b1'), 0)).toBe('No match: apple and banana.')
  })

  it('summarises the win', () => {
    const won = run(initial, 'a1', 'a2', 'b1', 'b2')
    expect(getStatusMessage({ ...won, isNewBest: false }, 65)).toBe('You won in 2 moves and 1:05.')
    expect(getStatusMessage({ ...won, isNewBest: true }, 65)).toBe('You won in 2 moves and 1:05. New best score!')
  })
})
