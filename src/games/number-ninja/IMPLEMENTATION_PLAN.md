# Number Ninja — Implementation Plan

## Game Overview
Number Ninja: Guess a hidden random number within limited attempts. After each guess, the game indicates "Higher" or "Lower". Score based on attempts used and time taken.

---

## Architecture Decisions

**All game code lives in:** `src/games/number-ninja/`

**No modifications** to other game folders or shared infrastructure needed.  
**Integration points** (identified below): Routing in `App.tsx`, possibly a shared game layout component if one emerges.

---

## File Structure to Create

```
src/games/number-ninja/
├── components/
│   ├── GameHeader.tsx          # Title, difficulty badge, timer, attempts left
│   ├── GuessInput.tsx          # Number input + submit button, validation
│   ├── GuessHistory.tsx        # List of past guesses with "Higher/Lower" tags
│   ├── GameStatus.tsx          # Win/lose message, final score, play again button
│   ├── DifficultySelector.tsx  # Radio/group for Easy/Medium/Hard (pre-game)
│   └── index.ts                # Barrel export
├── hooks/
│   ├── useGameState.ts         # Core game logic: secret, guesses, attempts, status
│   ├── useTimer.ts             # Count-up timer, formatted display
│   └── useScore.ts             # Score calculation based on attempts + time
├── utils/
│   ├── constants.ts            # Difficulty configs, max attempts, ranges
│   ├── random.ts               # Seeded random number generation
│   ├── validation.ts           # Input validation helpers
│   └── scoring.ts              # Score formula
├── types/
│   └── index.ts                # TypeScript interfaces
├── NumberNinja.tsx             # Main game page component (route entry)
└── index.ts                    # Barrel export for the game module
```

---

## Types (`types/index.ts`)

```ts
type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  label: string;
  min: number;
  max: number;
  maxAttempts: number;
  timeBonusThreshold: number; // seconds for time bonus
}

interface Guess {
  value: number;
  result: 'higher' | 'lower' | 'correct';
  timestamp: number;
}

type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

interface GameState {
  difficulty: Difficulty;
  secretNumber: number;
  guesses: Guess[];
  attemptsLeft: number;
  status: GameStatus;
  startTime: number | null;
  endTime: number | null;
}

interface ScoreBreakdown {
  baseScore: number;
  attemptBonus: number;
  timeBonus: number;
  total: number;
}
```

---

## Constants (`utils/constants.ts`)

```ts
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy:   { label: 'Easy',   min: 1,   max: 50,  maxAttempts: 10, timeBonusThreshold: 30 },
  medium: { label: 'Medium', min: 1,   max: 100, maxAttempts: 7,  timeBonusThreshold: 45 },
  hard:   { label: 'Hard',   min: 1,   max: 200, maxAttempts: 5,  timeBonusThreshold: 60 },
};
```

---

## Random Generation (`utils/random.ts`)

- Use `crypto.getRandomValues` for cryptographically secure randomness
- Function: `generateSecret(min: number, max: number): number`
- No external seed needed; browser RNG is sufficient

---

## Validation (`utils/validation.ts`)

- `validateGuess(value: string, min: number, max: number): { valid: boolean; error?: string; parsed?: number }`
- Checks: not empty, integer, within [min, max], not already guessed

---

## Scoring (`utils/scoring.ts`)

```
baseScore = 1000
attemptBonus = (attemptsLeft / maxAttempts) * 500
timeBonus = (timeBonusThreshold - elapsedSeconds) > 0 ? (timeBonusThreshold - elapsedSeconds) * 10 : 0
total = baseScore + attemptBonus + timeBonus
```

- Minimum score: 100 (participation)
- All values rounded to nearest integer

---

## Hooks

### `useGameState` (`hooks/useGameState.ts`)
- Manages `GameState`
- Actions: `startGame(difficulty)`, `makeGuess(number)`, `resetGame()`
- Derived: `attemptsUsed`, `isGameOver`, `lastGuessResult`
- Persists nothing (session-only)

### `useTimer` (`hooks/useTimer.ts`)
- `startTime: number | null` → returns `{ elapsedSeconds: number; formatted: string }`
- Updates every 1s via `setInterval`
- Stops when game status is `won` or `lost`

### `useScore` (`hooks/useScore.ts`)
- Input: `GameState`, `DifficultyConfig`
- Returns `ScoreBreakdown` when game ends (`won`)

---

## Components

### `DifficultySelector` (`components/DifficultySelector.tsx`)
- Radio group or card grid for 3 difficulties
- Displays range & attempts per difficulty
- `onSelect: (difficulty: Difficulty) => void`

### `GameHeader` (`components/GameHeader.tsx`)
- Shows: "Number Ninja", difficulty badge, timer (mm:ss), attempts remaining (e.g., "3/7")
- Conditional styling for low attempts (≤2 → warning color)

### `GuessInput` (`components/GuessInput.tsx`)
- Controlled `<input type="number">` with min/max from difficulty
- Submit button (disabled while validating or game over)
- Enter key submits
- Shows inline validation error
- `onSubmit: (value: number) => void`

### `GuessHistory` (`components/GuessHistory.tsx`)
- Reverse chronological list
- Each row: guess number, "Higher"/"Lower"/"✓ Correct" badge with color coding
- Empty state: "No guesses yet. Make your first guess!"

### `GameStatus` (`components/GameStatus.tsx`)
- Shows only when `status === 'won' | 'lost'`
- Won: "🎉 You found it in X attempts! Score: Y"
- Lost: "💀 Out of attempts! The number was Z"
- "Play Again" button → calls `resetGame()`

---

## Main Component (`NumberNinja.tsx`)

- Composes all components
- Owns `useGameState`, `useTimer`, `useScore`
- Layout: centered card, max-width 480px, responsive padding
- Handles pre-game (difficulty selector) vs in-game vs post-game states

---

## Routing Integration

**Modify:** `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NumberNinja } from './games/number-ninja';

// Inside App component:
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/number-ninja" element={<NumberNinja />} />
    {/* other game routes */}
  </Routes>
</BrowserRouter>
```

- Add a landing page or nav later; for now just the route works
- No changes to other game folders

---

## Responsive UI

- Tailwind utility classes throughout
- Breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Card: `w-full max-w-md mx-auto p-4 sm:p-6`
- Input: `w-full` on mobile, fixed width on desktop
- Touch-friendly: min 44px tap targets, `inputmode="numeric"`

---

## Edge Cases Handled

| Case | Handling |
|------|----------|
| Duplicate guess | Validation rejects with inline error |
| Out of range | Validation rejects |
| Non-integer input | `type="number"` + step=1 + parseInt validation |
| Rapid clicks | Button disabled during processing |
| Tab away / timer drift | `useTimer` uses `Date.now()` delta, not interval count |
| Refresh mid-game | State resets (session-only; no persistence required) |
| Zero/negative input | Min attribute + validation |
| Max attempts reached exactly on correct guess | Win takes precedence |

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)
- `utils/random.test.ts` — range bounds
- `utils/validation.test.ts` — all validation branches
- `utils/scoring.test.ts` — formula with known inputs
- `hooks/useGameState.test.ts` — state transitions
- `hooks/useTimer.test.ts` — formatting, start/stop
- `hooks/useScore.test.ts` — score breakdowns

### Component Tests
- `GuessInput` — validation messages, submit callback
- `GuessHistory` — rendering, empty state, color badges
- `GameStatus` — win/lost copy, play again click
- `NumberNinja` — full flow: select difficulty → guess → win/lose → restart

### E2E (Playwright, optional)
- Happy path: Easy difficulty, win in 3 guesses
- Lose path: Exhaust attempts
- Responsive: mobile vs desktop layout

---

## Commands to Add (package.json)

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "lint": "eslint .",
  "typecheck": "tsc -b"
}
```

Dev dependencies to add: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `playwright` (optional)

---

## Implementation Order

1. **Types & Constants** — foundation
2. **Utils** — random, validation, scoring (pure, testable)
3. **Hooks** — useGameState, useTimer, useScore
4. **Components** — leaf components first (GuessInput, GuessHistory, GameHeader, GameStatus, DifficultySelector)
5. **Main Page** — NumberNinja.tsx composition
6. **Routing** — update App.tsx
7. **Tests** — unit + component
8. **Lint + Typecheck** — verify

---

## No External File Changes Required

Only `src/App.tsx` needs modification for routing. All game logic stays in `src/games/number-ninja/`.