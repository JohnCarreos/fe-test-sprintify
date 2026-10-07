import { describe, expect, it } from 'vitest'
import { DIFFICULTIES, getPairCount } from './config'
import { createDeck, shuffle } from './deck'
import type { Difficulty } from './types'

describe('shuffle', () => {
  it('keeps every element and does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5, 6]
    const result = shuffle(input)
    expect(input).toEqual([1, 2, 3, 4, 5, 6])
    expect([...result].sort()).toEqual(input)
  })

  it('uses the provided rng', () => {
    // rng always 0 → each element swaps with index 0
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1])
  })
})

describe('createDeck', () => {
  it.each(Object.keys(DIFFICULTIES) as Difficulty[])('builds a full board of pairs for %s', (difficulty) => {
    const { rows, cols } = DIFFICULTIES[difficulty]
    const deck = createDeck(getPairCount(difficulty))

    expect(deck).toHaveLength(rows * cols)
    expect(new Set(deck.map((c) => c.id)).size).toBe(deck.length)

    const counts = new Map<string, number>()
    deck.forEach((c) => counts.set(c.symbolId, (counts.get(c.symbolId) ?? 0) + 1))
    expect([...counts.values()].every((n) => n === 2)).toBe(true)
    expect(deck.every((c) => !c.isFlipped && !c.isMatched)).toBe(true)
  })

  it('throws when asked for more pairs than symbols exist', () => {
    expect(() => createDeck(100)).toThrow()
  })
})
