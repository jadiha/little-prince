import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useAppStore, selectRoseState, selectIsGoalTendedToday } from '@/store/appStore'
import { getStyleById } from '@/data/goalPlanetStyles'

export default function HUD() {
  const goals = useAppStore((s) => s.goals)
  const stars = useAppStore((s) => s.stars)
  const roseState = useAppStore(selectRoseState)
  const activeView = useAppStore((s) => s.activeView)
  const selectGoalPlanet = useAppStore((s) => s.selectGoalPlanet)

  // Hide HUD when zoomed into a planet
  if (activeView !== 'universe') return null

  const today = format(new Date(), 'MMMM d')

  const roseEmoji: Record<string, string> = {
    fullBloom: '🌹',
    blooming: '🌸',
    budding: '🌷',
    wilting: '🥀',
    revival: '🌱',
  }

  return (
    <motion.div
      className="fixed top-0 right-0 z-30 pointer-events-none"
      style={{ left: 'var(--sidebar-width, 56px)' }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
    >
      <div className="flex items-start justify-between px-6 pt-5">
        {/* Date + star count */}
        <div>
          <p className="font-serif text-ivory/40 text-xs tracking-widest uppercase">
            {today}
          </p>
          <p className="font-handwriting text-ivory/25 text-xs italic mt-0.5">
            {stars.length} {stars.length === 1 ? 'star' : 'stars'} in your sky
          </p>
        </div>

        {/* Rose state + goal dots */}
        <div className="flex items-center gap-3">
          {/* Rose indicator */}
          <span className="text-lg opacity-70" title={`your rose: ${roseState}`}>
            {roseEmoji[roseState] ?? '🌹'}
          </span>

          {/* Goal dots — clickable, glowing if untended */}
          <div className="flex gap-2 items-center pointer-events-auto">
            {goals.map((goal) => (
              <GoalDot key={goal.id} goalId={goal.id} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function GoalDot({ goalId }: { goalId: string }) {
  const goal = useAppStore((s) => s.goals.find((g) => g.id === goalId))
  const isTended = useAppStore(selectIsGoalTendedToday(goalId))
  const openCheckIn = useAppStore((s) => s.openCheckIn)
  const selectGoalPlanet = useAppStore((s) => s.selectGoalPlanet)

  if (!goal) return null
  const style = getStyleById(goal.planetStyle)

  return (
    <button
      className="w-2.5 h-2.5 rounded-full transition-all"
      style={{
        backgroundColor: style.color,
        opacity: isTended ? 0.9 : 0.35,
        boxShadow: isTended ? `0 0 6px ${style.color}` : 'none',
      }}
      title={goal.name}
      onClick={() => {
        selectGoalPlanet(goalId)
        setTimeout(() => openCheckIn(goalId), 900)
      }}
    />
  )
}
