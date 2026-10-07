export type Difficulty = 'easy' | 'medium' | 'hard'

export interface DifficultyConfig {
  label: string
  rows: number
  cols: number
}

export interface CardSymbol {
  id: string
  emoji: string
  label: string
}

export interface Card {
  id: string
  symbolId: string
  isFlipped: boolean
  isMatched: boolean
}

export type GameStatus = 'idle' | 'playing' | 'won'

/** Result of the most recent completed turn (two flips). */
export interface Turn {
  isMatch: boolean
  cardIds: [string, string]
}

export interface GameState {
  /** Incremented on every reset; used as a React key to re-deal the board. */
  round: number
  difficulty: Difficulty
  cards: Card[]
  flippedIds: string[]
  moves: number
  status: GameStatus
  lastTurn: Turn | null
  startedAt: number | null
  endedAt: number | null
  /** Best score for the current difficulty, including this game once won. */
  bestScore: Score | null
  /** True when the finished game beat the previous best. */
  isNewBest: boolean
}

export type GameAction =
  | { type: 'FLIP'; id: string; now: number }
  | { type: 'HIDE_UNMATCHED' }
  | { type: 'RESET'; difficulty: Difficulty; cards: Card[]; bestScore: Score | null }

export interface Score {
  moves: number
  seconds: number
}
