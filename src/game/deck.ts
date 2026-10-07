import { SYMBOLS } from './config'
import type { Card } from './types'

export type Rng = () => number

/** Fisher–Yates shuffle. Returns a new array; the input is not mutated. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Builds a shuffled deck of `pairCount` pairs. Symbols are picked at random
 * too, so smaller boards don't always show the same fruit.
 */
export function createDeck(pairCount: number, rng: Rng = Math.random): Card[] {
  if (pairCount > SYMBOLS.length) {
    throw new Error(`Not enough symbols for ${pairCount} pairs`)
  }

  const symbols = shuffle(SYMBOLS, rng).slice(0, pairCount)
  const cards = symbols.flatMap((symbol) =>
    (['a', 'b'] as const).map((copy) => ({
      id: `${symbol.id}-${copy}`,
      symbolId: symbol.id,
      isFlipped: false,
      isMatched: false,
    })),
  )

  return shuffle(cards, rng)
}
