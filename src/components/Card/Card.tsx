import type { CSSProperties } from 'react'
import { SYMBOLS_BY_ID } from '../../game/config'
import type { Card as CardData } from '../../game/types'
import { classNames } from '../../utils/classNames'
import styles from './Card.module.scss'

interface CardProps {
  card: CardData
  /** Position on the board, used for the accessible name and deal animation. */
  index: number
  onFlip: (id: string) => void
}

export function Card({ card, index, onFlip }: CardProps) {
  const symbol = SYMBOLS_BY_ID[card.symbolId]
  const isFaceUp = card.isFlipped || card.isMatched

  let label = `Card ${index + 1}, face down`
  if (isFaceUp) label = `Card ${index + 1}, ${symbol.label}${card.isMatched ? ', matched' : ''}`

  return (
    <button
      type="button"
      className={classNames(styles.card, isFaceUp && styles.faceUp, card.isMatched && styles.matched)}
      style={{ '--i': index } as CSSProperties}
      aria-label={label}
      aria-pressed={isFaceUp}
      // aria-disabled (not disabled) keeps matched cards focusable, so keyboard
      // focus is never lost when the card under it gets matched.
      aria-disabled={card.isMatched || undefined}
      onClick={() => onFlip(card.id)}
    >
      <span className={styles.inner} aria-hidden="true">
        <span className={classNames(styles.face, styles.back)} />
        <span className={classNames(styles.face, styles.front)}>{symbol.emoji}</span>
      </span>
    </button>
  )
}
