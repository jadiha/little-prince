// ─── Goal (what the user tends to) ───────────────────────────────────────────

export interface Goal {
  id: string
  name: string                  // e.g. "Run every morning"
  reason?: string               // why it matters to the user
  planetStyle: GoalPlanetStyle  // visual style for the planet
  createdAt: string             // ISO date string
  logs: DayLog[]
}

export interface DayLog {
  date: string                  // 'YYYY-MM-DD' — one per calendar day enforced
  note?: string
  starId: string
}

// ─── Star (released when a goal day is logged) ────────────────────────────────

export interface Star {
  id: string
  goalId: string
  date: string
  position: { x: number; y: number; z: number }
}

// ─── The Rose (one, on the asteroid — always computed, never stored) ──────────

export type RoseState = 'fullBloom' | 'blooming' | 'budding' | 'wilting' | 'revival'
// Derived from 7-day rolling score across all goals:
//   85–100% → fullBloom
//   60–84%  → blooming
//   40–59%  → budding
//   20–39%  → wilting
//   0–19%   → revival

// ─── Onboarding ───────────────────────────────────────────────────────────────

export interface OnboardingState {
  completed: boolean
  completedAt?: string
}

// ─── Weekly Reflection (Fox, every Friday) ────────────────────────────────────

export interface WeeklyReflection {
  weekOf: string          // ISO date of Monday of that week
  foxAnswer: string       // user's free text
  princeResponse: string  // Claude's response
}

// ─── Story Planet (fixed, from the book) ─────────────────────────────────────

export type StoryPlanetId =
  | 'king'
  | 'vain'
  | 'drunkard'
  | 'businessman'
  | 'lamplighter'
  | 'geographer'

export interface StoryPlanet {
  id: StoryPlanetId
  planetNumber: string    // "Planet 325"
  characterName: string   // "The King"
  trap: string            // one-line summary
  lesson: string          // full paragraph
  quote: string           // direct quote from the book
  color: string           // hex
  orbitRadius: number     // 9–16 units (outer ring)
  orbitSpeed: number      // radians/sec
  orbitPhase: number      // initial angle offset
}

// ─── Goal Planet Styles ───────────────────────────────────────────────────────

export type GoalPlanetStyle =
  | 'amber-health'
  | 'blue-learning'
  | 'purple-creativity'
  | 'rosegold-relationships'
  | 'green-rest'

// ─── Claude API ───────────────────────────────────────────────────────────────

export type PrinceContext = 'morning' | 'afterLog' | 'weeklyFox' | 'storyPlanet'

export interface PrinceRequest {
  context: PrinceContext
  goals: Pick<Goal, 'name' | 'logs'>[]
  roseState: RoseState
  totalStars: number
  payload?: {
    goalName?: string      // for afterLog
    note?: string          // for afterLog / weeklyFox
    storyPlanetId?: StoryPlanetId  // for storyPlanet
  }
}
