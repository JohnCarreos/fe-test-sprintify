import { useId } from 'react'
import { formatTime } from '../../game/time'
import styles from './WinBanner.module.scss'

interface WinBannerProps {
  moves: number
  seconds: number
  isNewBest: boolean
  onPlayAgain: () => void
}

export function WinBanner({ moves, seconds, isNewBest, onPlayAgain }: WinBannerProps) {
  const titleId = useId()

  return (
    <div className={styles.overlay}>
      <section className={styles.banner} aria-labelledby={titleId}>
        <p className={styles.emoji} aria-hidden="true">
          🎉
        </p>
        <h2 id={titleId} className={styles.title}>
          You did it!
        </h2>
        <p className={styles.summary}>
          {moves} moves in {formatTime(seconds)}
        </p>
        {isNewBest && <p className={styles.badge}>New best score!</p>}
        {/* The banner only mounts on win, so autoFocus moves keyboard users straight to the next action. */}
        <button type="button" className={styles.button} onClick={onPlayAgain} autoFocus>
          Play again
        </button>
      </section>
    </div>
  )
}
