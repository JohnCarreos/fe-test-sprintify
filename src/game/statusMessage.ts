import { SYMBOLS_BY_ID } from './config'
import { formatTime } from './time'
import type { GameState } from './types'

function symbolLabel(state: GameState, cardId: string): string {
  const card = state.cards.find((c) => c.id === cardId)
  return card ? SYMBOLS_BY_ID[card.symbolId].label : 'unknown'
}

/**
 * Text for the screen reader live region. Each message names the cards
 * involved, so consecutive turns produce different text and are re-announced.
 */
export function getStatusMessage(state: GameState, seconds: number): string {
  if (state.status === 'won') {
    const summary = `You won in ${state.moves} moves and ${formatTime(seconds)}.`
    return state.isNewBest ? `${summary} New best score!` : summary
  }

  if (!state.lastTurn) return ''

  const [firstId, secondId] = state.lastTurn.cardIds
  if (state.lastTurn.isMatch) {
    const found = state.cards.filter((c) => c.isMatched).length / 2
    const total = state.cards.length / 2
    return `Match: ${symbolLabel(state, firstId)}. ${found} of ${total} pairs found.`
  }
  return `No match: ${symbolLabel(state, firstId)} and ${symbolLabel(state, secondId)}.`
}
