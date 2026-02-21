import { motion } from 'framer-motion'
import { useAppStore, selectIsGoalTendedToday, selectDaysSinceTended } from '@/store/appStore'
import { getStyleById } from '@/data/goalPlanetStyles'
import type { Goal } from '@/types'
import { format, formatDistanceToNow } from 'date-fns'

function GoalCard({ goal }: { goal: Goal }) {
  const style = getStyleById(goal.planetStyle)
  const isTendedToday = useAppStore(selectIsGoalTendedToday(goal.id))
  const daysSince = useAppStore(selectDaysSinceTended(goal.id))
  const openCheckIn = useAppStore((s) => s.openCheckIn)
  const stars = useAppStore((s) => s.stars.filter((star) => star.goalId === goal.id))

  const lastLog = goal.logs.length > 0 ? goal.logs[goal.logs.length - 1] : null

  return (
    <motion.div
      layout
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${style.color}33`,
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
      }}
      whileHover={{ borderColor: `${style.color}66` }}
    >
      {/* Planet dot */}
      <div style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${style.color}cc, ${style.color}55)`,
        boxShadow: `0 0 8px ${style.color}44`,
        flexShrink: 0,
        marginTop: '4px',
      }} />

      <div style={{ flex: 1 }}>
        <div style={{
          color: 'rgba(240,232,210,0.95)',
          fontSize: '17px',
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          marginBottom: '4px',
        }}>
          {goal.name}
        </div>

        {goal.reason && (
          <div style={{
            color: 'rgba(240,232,210,0.45)',
            fontSize: '13px',
            fontStyle: 'italic',
            fontFamily: "'IM Fell English', serif",
            marginBottom: '12px',
            lineHeight: 1.5,
          }}>
            {goal.reason}
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <div style={{ color: 'rgba(244,208,63,0.75)', fontSize: '13px' }}>
            ✦ {stars.length} star{stars.length !== 1 ? 's' : ''} released
          </div>
          {lastLog && (
            <div style={{ color: 'rgba(240,232,210,0.35)', fontSize: '13px' }}>
              Last tended {daysSince === 0 ? 'today' : `${daysSince}d ago`}
            </div>
          )}
          {!lastLog && (
            <div style={{ color: 'rgba(240,232,210,0.25)', fontSize: '13px' }}>
              Not yet tended
            </div>
          )}
        </div>

        {!isTendedToday ? (
          <button
            onClick={() => openCheckIn(goal.id)}
            style={{
              padding: '8px 20px',
              background: 'transparent',
              border: `1px solid ${style.color}55`,
              borderRadius: '20px',
              color: style.color,
              fontSize: '13px',
              fontFamily: "'Cormorant Garamond', serif",
              cursor: 'pointer',
            }}
          >
            I showed up today
          </button>
        ) : (
          <div style={{
            fontSize: '13px',
            color: 'rgba(244,208,63,0.6)',
            fontStyle: 'italic',
            fontFamily: "'IM Fell English', serif",
          }}>
            ✓ Tended today
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function MyGoalsPage() {
  const goals = useAppStore((s) => s.goals)
  const userName = useAppStore((s) => s.userName)
  const setActiveView = useAppStore((s) => s.setActiveView)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        background: 'linear-gradient(160deg, #080612 0%, #0d0a1f 60%, #080612 100%)',
        zIndex: 20,
      }}
    >
      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '80px 24px 60px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(26px, 5vw, 40px)',
            color: 'rgba(244,208,63,0.9)',
            fontWeight: 400,
            marginBottom: '8px',
          }}>
            Your planets{userName ? `, ${userName}` : ''}
          </h1>
          <p style={{
            color: 'rgba(240,232,210,0.4)',
            fontSize: '14px',
            fontStyle: 'italic',
            fontFamily: "'IM Fell English', serif",
            marginBottom: '36px',
          }}>
            Each one orbits your asteroid. Each one waits for you to return.
          </p>
        </motion.div>

        {goals.length === 0 ? (
          <div style={{
            color: 'rgba(240,232,210,0.3)',
            fontSize: '15px',
            fontStyle: 'italic',
            fontFamily: "'IM Fell English', serif",
            textAlign: 'center',
            paddingTop: '40px',
          }}>
            No planets yet. Return to your universe to create one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {goals.map((goal, i) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <GoalCard goal={goal} />
              </motion.div>
            ))}
          </div>
        )}

        {goals.length > 0 && goals.length < 5 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setActiveView('universe')}
            style={{
              marginTop: '24px',
              padding: '10px 24px',
              background: 'transparent',
              border: '1px solid rgba(244,208,63,0.25)',
              borderRadius: '24px',
              color: 'rgba(244,208,63,0.6)',
              fontSize: '14px',
              fontFamily: "'Cormorant Garamond', serif",
              cursor: 'pointer',
              display: 'block',
            }}
          >
            + Add a planet
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
