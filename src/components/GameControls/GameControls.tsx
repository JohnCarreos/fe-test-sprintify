import { useId } from 'react'
import { DIFFICULTIES, DIFFICULTY_ORDER } from '../../game/config'
import type { Difficulty } from '../../game/types'
import styles from './GameControls.module.scss'

interface GameControlsProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onRestart: () => void
}

export function GameControls({ difficulty, onDifficultyChange, onRestart }: GameControlsProps) {
  const id = useId()

  return (
    <div className={styles.controls}>
      <fieldset className={styles.difficulty}>
        <legend className={styles.legend}>Difficulty</legend>
        <div className={styles.options}>
          {DIFFICULTY_ORDER.map((level) => {
            const { label, rows, cols } = DIFFICULTIES[level]
            const inputId = `${id}-${level}`
            return (
              <div key={level} className={styles.option}>
                <input
                  type="radio"
                  id={inputId}
                  name={`${id}-difficulty`}
                  value={level}
                  checked={difficulty === level}
                  onChange={() => onDifficultyChange(level)}
                  className={styles.input}
                />
                <label htmlFor={inputId} className={styles.label}>
                  {label}
                  <span className={styles.size}>
                    {rows}×{cols}
                  </span>
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>

      <button type="button" className={styles.restart} onClick={onRestart}>
        <span aria-hidden="true">↻</span> Restart
      </button>
    </div>
  )
}
