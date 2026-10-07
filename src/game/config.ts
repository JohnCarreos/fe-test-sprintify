import type { CardSymbol, Difficulty, DifficultyConfig } from './types'

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { label: 'Easy', rows: 2, cols: 2 },
  medium: { label: 'Medium', rows: 4, cols: 4 },
  hard: { label: 'Hard', rows: 6, cols: 6 },
}

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard']

export const DEFAULT_DIFFICULTY: Difficulty = 'medium'

/** How long two mismatched cards stay face-up before flipping back. */
export const MISMATCH_DELAY_MS = 800

/** Enough symbols for the largest board (6×6 = 18 pairs). */
export const SYMBOLS: CardSymbol[] = [
  { id: 'apple', emoji: '🍎', label: 'apple' },
  { id: 'banana', emoji: '🍌', label: 'banana' },
  { id: 'cherry', emoji: '🍒', label: 'cherry' },
  { id: 'grapes', emoji: '🍇', label: 'grapes' },
  { id: 'lemon', emoji: '🍋', label: 'lemon' },
  { id: 'peach', emoji: '🍑', label: 'peach' },
  { id: 'pineapple', emoji: '🍍', label: 'pineapple' },
  { id: 'strawberry', emoji: '🍓', label: 'strawberry' },
  { id: 'watermelon', emoji: '🍉', label: 'watermelon' },
  { id: 'kiwi', emoji: '🥝', label: 'kiwi' },
  { id: 'avocado', emoji: '🥑', label: 'avocado' },
  { id: 'carrot', emoji: '🥕', label: 'carrot' },
  { id: 'corn', emoji: '🌽', label: 'corn' },
  { id: 'pepper', emoji: '🌶️', label: 'chili pepper' },
  { id: 'mushroom', emoji: '🍄', label: 'mushroom' },
  { id: 'coconut', emoji: '🥥', label: 'coconut' },
  { id: 'blueberries', emoji: '🫐', label: 'blueberries' },
  { id: 'broccoli', emoji: '🥦', label: 'broccoli' },
]

export const SYMBOLS_BY_ID: Record<string, CardSymbol> = Object.fromEntries(
  SYMBOLS.map((symbol) => [symbol.id, symbol]),
)

export function getPairCount(difficulty: Difficulty): number {
  const { rows, cols } = DIFFICULTIES[difficulty]
  return (rows * cols) / 2
}
