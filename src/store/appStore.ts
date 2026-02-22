import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { generateStarPosition } from '@/lib/starPositions'
import type {
  Goal,
  Star,
  DayLog,
  OnboardingState,
  WeeklyReflection,
  RoseState,
  StoryPlanetId,
  GoalPlanetStyle,
} from '@/types'

// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  // Persisted data
  goals: Goal[]
  stars: Star[]
  weeklyReflections: WeeklyReflection[]
  onboarding: OnboardingState

  // Persisted user data
  userName: string
  lastVisitDate: string | null   // 'YYYY-MM-DD' — for shooting stars detection

  // UI state (not persisted)
  activeView: 'universe' | 'goalPlanet' | 'storyPlanet' | 'onboarding' | 'explore' | 'mygoals' | 'roseView'
  selectedGoalId: string | null
  selectedStoryPlanetId: StoryPlanetId | null
  princeMessage: string | null
  isPrinceTyping: boolean
  checkInGoalId: string | null   // which goal's check-in modal is open
  hoveredStar: { goalId: string; date: string } | null
}

// ─── Actions ──────────────────────────────────────────────────────────────────

interface AppActions {
  // Goals
  addGoal: (name: string, planetStyle: GoalPlanetStyle, reason?: string) => Goal
  updateGoalName: (goalId: string, name: string) => void

  // User
  setUserName: (name: string) => void
  recordVisit: () => boolean  // records today's visit, returns true if returning user

  // Logging
  logDay: (goalId: string, note?: string) => Star | null  // null if already logged today

  // Onboarding
  completeOnboarding: () => void

  // Reflections
  addReflection: (reflection: WeeklyReflection) => void

  // UI
  setActiveView: (view: AppState['activeView']) => void
  selectGoalPlanet: (goalId: string | null) => void
  selectStoryPlanet: (id: StoryPlanetId | null) => void
  setPrinceMessage: (msg: string | null) => void
  setIsPrinceTyping: (v: boolean) => void
  openCheckIn: (goalId: string) => void
  closeCheckIn: () => void
  setHoveredStar: (star: { goalId: string; date: string } | null) => void
}

type AppStore = AppState & AppActions

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────────
      goals: [],
      stars: [],
      weeklyReflections: [],
      onboarding: { completed: false },
      userName: '',
      lastVisitDate: null,

      activeView: 'onboarding',
      selectedGoalId: null,
      selectedStoryPlanetId: null,
      princeMessage: null,
      isPrinceTyping: false,
      checkInGoalId: null,
      hoveredStar: null,

      // ── Goal actions ───────────────────────────────────────────────────────
      addGoal: (name, planetStyle, reason) => {
        const goal: Goal = {
          id: uuidv4(),
          name,
          reason,
          planetStyle,
          createdAt: new Date().toISOString(),
          logs: [],
        }
        set((s) => ({ goals: [...s.goals, goal] }))
        return goal
      },

      // ── User actions ───────────────────────────────────────────────────────
      setUserName: (name) => set({ userName: name }),

      recordVisit: () => {
        const today = format(new Date(), 'yyyy-MM-dd')
        const { lastVisitDate } = get()
        const isReturning = lastVisitDate !== null && lastVisitDate !== today
        set({ lastVisitDate: today })
        return isReturning
      },

      updateGoalName: (goalId, name) => {
        set((s) => ({
          goals: s.goals.map((g) => (g.id === goalId ? { ...g, name } : g)),
        }))
      },

      // ── Logging ────────────────────────────────────────────────────────────
      logDay: (goalId, note) => {
        const { goals, stars } = get()
        const today = format(new Date(), 'yyyy-MM-dd')
        const goal = goals.find((g) => g.id === goalId)
        if (!goal) return null

        // Prevent double-logging on the same day
        if (goal.logs.some((l) => l.date === today)) return null

        const goalIndex = goals.findIndex((g) => g.id === goalId)
        const position = generateStarPosition(goalIndex, goals.length)

        const star: Star = {
          id: uuidv4(),
          goalId,
          date: today,
          position,
        }

        const log: DayLog = {
          date: today,
          note,
          starId: star.id,
        }

        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId ? { ...g, logs: [...g.logs, log] } : g
          ),
          stars: [...s.stars, star],
        }))

        return star
      },

      // ── Onboarding ─────────────────────────────────────────────────────────
      completeOnboarding: () => {
        set({
          onboarding: { completed: true, completedAt: new Date().toISOString() },
          activeView: 'universe',
        })
      },

      // ── Reflections ────────────────────────────────────────────────────────
      addReflection: (reflection) => {
        set((s) => ({
          weeklyReflections: [...s.weeklyReflections, reflection],
        }))
      },

      // ── UI actions ─────────────────────────────────────────────────────────
      setActiveView: (view) => set({ activeView: view }),

      selectGoalPlanet: (goalId) => {
        set({
          selectedGoalId: goalId,
          selectedStoryPlanetId: null,
          activeView: goalId ? 'goalPlanet' : 'universe',
        })
      },

      selectStoryPlanet: (id) => {
        set({
          selectedStoryPlanetId: id,
          selectedGoalId: null,
          activeView: id ? 'storyPlanet' : 'universe',
        })
      },

      setPrinceMessage: (msg) => set({ princeMessage: msg }),
      setIsPrinceTyping: (v) => set({ isPrinceTyping: v }),
      openCheckIn: (goalId) => set({ checkInGoalId: goalId }),
      closeCheckIn: () => set({ checkInGoalId: null }),
      setHoveredStar: (star) => set({ hoveredStar: star }),
    }),
    {
      name: 'little-prince-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist data — not UI state
      partialize: (state) => ({
        goals: state.goals,
        stars: state.stars,
        weeklyReflections: state.weeklyReflections,
        onboarding: state.onboarding,
        userName: state.userName,
        lastVisitDate: state.lastVisitDate,
      }),
      // Re-derive activeView from onboarding state on rehydration
      onRehydrateStorage: () => (state) => {
        if (state && state.onboarding.completed) {
          state.activeView = 'universe'
        } else if (state) {
          state.activeView = 'onboarding'
        }
      },
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectGoalById = (id: string) => (s: AppStore) =>
  s.goals.find((g) => g.id === id)

export const selectStarsByGoal = (goalId: string) => (s: AppStore) =>
  s.stars.filter((star) => star.goalId === goalId)

export const selectRoseState = (s: AppStore): RoseState => {
  const { goals, stars } = s
  if (goals.length === 0) return 'fullBloom'

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const cutoff = format(sevenDaysAgo, 'yyyy-MM-dd')

  const totalPossible = goals.length * 7
  const totalLogged = stars.filter((star) => star.date >= cutoff).length
  const score = (totalLogged / totalPossible) * 100

  if (score >= 85) return 'fullBloom'
  if (score >= 60) return 'blooming'
  if (score >= 40) return 'budding'
  if (score >= 20) return 'wilting'
  return 'revival'
}

export const selectIsGoalTendedToday = (goalId: string) => (s: AppStore) => {
  const goal = s.goals.find((g) => g.id === goalId)
  if (!goal) return false
  const today = format(new Date(), 'yyyy-MM-dd')
  return goal.logs.some((l) => l.date === today)
}

export const selectDaysSinceTended = (goalId: string) => (s: AppStore) => {
  const goal = s.goals.find((g) => g.id === goalId)
  if (!goal || goal.logs.length === 0) return Infinity
  const lastLog = goal.logs[goal.logs.length - 1]
  const today = format(new Date(), 'yyyy-MM-dd')
  if (lastLog.date === today) return 0
  const diffMs = new Date().getTime() - new Date(lastLog.date).getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

// Count consecutive days (working backwards from today) with at least one star logged
export const selectCurrentStreak = (s: AppStore): number => {
  const { stars } = s
  if (stars.length === 0) return 0

  const starDates = new Set(stars.map((st) => st.date))
  let streak = 0
  const cursor = new Date()

  while (true) {
    const dateStr = format(cursor, 'yyyy-MM-dd')
    if (starDates.has(dateStr)) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
