import type { CSSProperties } from 'react'
import type { Card as CardData } from '../../game/types'
import { Card } from '../Card/Card'
import styles from './Board.module.scss'

interface BoardProps {
  cards: CardData[]
  cols: number
  onFlip: (id: string) => void
}

export function Board({ cards, cols, onFlip }: BoardProps) {
  return (
    <ul className={styles.board} style={{ '--cols': cols } as CSSProperties} aria-label="Cards">
      {cards.map((card, index) => (
        <li key={card.id}>
          <Card card={card} index={index} onFlip={onFlip} />
        </li>
      ))}
    </ul>
  )
}
