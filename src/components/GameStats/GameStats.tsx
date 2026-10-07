import { formatTime } from '../../game/time'
import type { Score } from '../../game/types'
import styles from './GameStats.module.scss'

interface GameStatsProps {
  moves: number
  seconds: number
  pairsFound: number
  totalPairs: number
  bestScore: Score | null
}

export function GameStats({ moves, seconds, pairsFound, totalPairs, bestScore }: GameStatsProps) {
  return (
    <dl className={styles.stats}>
      <div className={styles.stat}>
        <dt>Moves</dt>
        <dd>{moves}</dd>
      </div>
      <div className={styles.stat}>
        <dt>Time</dt>
        <dd>
          <time dateTime={`PT${seconds}S`}>{formatTime(seconds)}</time>
        </dd>
      </div>
      <div className={styles.stat}>
        <dt>Pairs</dt>
        <dd>
          {pairsFound}/{totalPairs}
        </dd>
      </div>
      <div className={styles.stat}>
        <dt>Best</dt>
        <dd>{bestScore ? `${bestScore.moves} · ${formatTime(bestScore.seconds)}` : '—'}</dd>
      </div>
    </dl>
  )
}
