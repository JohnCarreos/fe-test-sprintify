# Memory Game

A card-matching ("Concentration") game built with **React 18, TypeScript, SCSS Modules and Vite**.

Flip two cards per turn. A matching pair stays face-up; a mismatched pair flips back after a short delay. Find every pair in as few moves and as little time as you can.

## Getting started

```bash
pnpm install
pnpm dev       # start the dev server
pnpm test      # run the unit tests (Vitest)
pnpm lint      # ESLint
pnpm build     # type-check and build for production
```

## Features

**Core**
- Shuffled board (Fisher–Yates), default 4×4, reshuffled on restart and on a difficulty change
- Exactly two flips per turn. Matches stay up; mismatches flip back after 800 ms, and the board ignores clicks until then
- Timer starts on the first flip and stops on the last match
- Move counter goes up once per pair of flips
- Restart button
- Difficulty selector: Easy 2×2, Medium 4×4, Hard 6×6
- Responsive layout down to 320px wide; cards and emoji scale with the board
- 3D flip animation using CSS transforms

**Stretch goals**
- Full keyboard play: cards are native `<button>`s, so Tab/Shift+Tab, Enter and Space work. Difficulty is a native radio group (arrow keys work there too).
- Accessibility semantics:
  - `aria-pressed` on cards, with labels such as "Card 5, apple, matched"
  - `aria-disabled` on matched cards, so focus is never lost
  - a polite live region that announces matches, mismatches and the result
  - focus moves to "Play again" when you win
- Best score saved in `localStorage` for each difficulty. Fewest moves wins; a tie goes to the faster time.

**Extras**
- Pairs-found counter and a win overlay with a "New best score!" badge
- Automatic light/dark theme (`prefers-color-scheme`)
- `prefers-reduced-motion` turns off the flip, deal and pop animations
- Cards are dealt in with a short staggered animation

## Project structure

```
src/
  game/          Pure, framework-free game logic (fully unit tested)
    config.ts      difficulties, symbols, timing constants
    deck.ts        shuffle + deck creation (injectable RNG)
    gameReducer.ts all game rules: flipping, matching, locking, winning, best score
    bestScore.ts   score comparison + safe localStorage access
    statusMessage.ts  live-region text
    time.ts        elapsed time / m:ss formatting
  hooks/
    useMemoryGame.ts   useReducer + mismatch timeout + best-score persistence
    useElapsedTime.ts  ticking timer derived from start/end timestamps
  components/    Board, Card, GameControls, GameStats, StatusAnnouncer, WinBanner
                 (each with its own *.module.scss)
  styles/        _variables.scss, _mixins.scss, global.scss
```

## Design decisions

- **One reducer, no state library.** All game rules live in a single pure reducer. It never calls `Math.random` or `Date.now`; the shuffled deck and the current time come in through the action. That makes the rules deterministic and easy to unit test. React only adds two side effects:
  - a timeout that flips mismatched cards back
  - a `localStorage` write when a new best score is set
- **Best score is decided in the reducer.** I first detected a win in the click handler. That broke when two clicks landed before React re-rendered, so the reducer now records the result atomically.
- **The board locks during a mismatch.** A third click is ignored until the two cards flip back. This keeps the rule "exactly two cards per turn" simple and predictable.
- **Time is derived, not counted.** The reducer stores `startedAt`/`endedAt` timestamps, and the timer hook only re-renders while the game is running. The time on screen can't drift from the time saved as a best score.
- **The board is re-dealt on reset.** The board is keyed by a round number, so a restart remounts the cards instead of animating old cards over new symbols. Without this, the new layout would show for a moment.
- **Styling:** SCSS variables point at CSS custom properties, so theming works at runtime while components still use SCSS names. Mixins cover:
  - focus ring
  - visually-hidden
  - breakpoints
  - reduced motion
  - surfaces and buttons

  Emoji size uses container query units (`cqi`), so they fit every board size without per-difficulty rules.

## Trade-offs / not done

- Unit tests cover the game logic (reducer, deck, scoring, messages). There are no component/DOM tests, because that would mean adding Testing Library and jsdom; I checked the UI manually in the browser instead.
- Card faces are emoji, which keeps the bundle tiny. They look slightly different on each OS.
- Arrow-key navigation across the grid (a roving tabindex) would help on the 6×6 board but wasn't added. Tab order already follows reading order.
- Changing difficulty during a game starts a new game without asking first.
