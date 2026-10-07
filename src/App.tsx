import styles from './App.module.scss'
import { Board } from './components/Board/Board'
import { GameControls } from './components/GameControls/GameControls'
import { GameStats } from './components/GameStats/GameStats'
import { StatusAnnouncer } from './components/StatusAnnouncer/StatusAnnouncer'
import { WinBanner } from './components/WinBanner/WinBanner'
import { DEFAULT_DIFFICULTY, DIFFICULTIES } from './game/config'
import { getStatusMessage } from './game/statusMessage'
import { useElapsedTime } from './hooks/useElapsedTime'
import { useMemoryGame } from './hooks/useMemoryGame'

function App() {
  const { state, flip, reset } = useMemoryGame(DEFAULT_DIFFICULTY)
  const seconds = useElapsedTime(state.startedAt, state.endedAt)

  const { cols } = DIFFICULTIES[state.difficulty]
  const pairsFound = state.cards.filter((c) => c.isMatched).length / 2

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Memory</h1>
        <p className={styles.subtitle}>Flip two cards at a time and find every matching pair.</p>
      </header>

      <GameControls difficulty={state.difficulty} onDifficultyChange={reset} onRestart={() => reset()} />

      <GameStats
        moves={state.moves}
        seconds={seconds}
        pairsFound={pairsFound}
        totalPairs={state.cards.length / 2}
        bestScore={state.bestScore}
      />

      <StatusAnnouncer message={getStatusMessage(state, seconds)} />

      <section className={styles.boardArea} aria-label="Game board">
        {/* A new key per round remounts the cards, so they are re-dealt face down
            instead of animating from their old positions (which would leak symbols). */}
        <Board key={state.round} cards={state.cards} cols={cols} onFlip={flip} />
        {state.status === 'won' && (
          <WinBanner moves={state.moves} seconds={seconds} isNewBest={state.isNewBest} onPlayAgain={() => reset()} />
        )}
      </section>
    </main>
  )
}

export default App
