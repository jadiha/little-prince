import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, selectIsGoalTendedToday, selectDaysSinceTended } from '@/store/appStore'
import { GOAL_PLANET_STYLES, getStyleById } from '@/data/goalPlanetStyles'
import type { Goal } from '@/types'
import type { GoalPlanetStyle } from '@/types'

// ─── Add Planet Form ──────────────────────────────────────────────────────────

function AddPlanetForm({
  onAdd,
  onClose,
}: {
  onAdd: (name: string, style: GoalPlanetStyle, reason: string) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<GoalPlanetStyle>('amber-health')

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(240,232,210,0.12)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'rgba(240,232,210,0.88)',
    fontSize: '15px',
    fontFamily: "'Cormorant Garamond', serif",
    outline: 'none',
  }

  const labelStyle = {
    color: 'rgba(240,232,210,0.4)',
    fontSize: '11px',
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    marginBottom: '7px',
    display: 'block',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35 }}
      style={{
        marginTop: '20px',
        background: 'rgba(244,208,63,0.04)',
        border: '1px solid rgba(244,208,63,0.2)',
        borderRadius: '16px',
        padding: '24px',
      }}
    >
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '18px',
        color: 'rgba(244,208,63,0.85)',
        fontWeight: 400,
        marginBottom: '20px',
      }}>
        A new planet for your sky
      </h3>

      {/* Goal name */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>What will this planet be?</label>
        <input
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Run every morning"
          onFocus={(e) => { e.target.style.borderColor = 'rgba(244,208,63,0.4)' }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(240,232,210,0.12)' }}
          autoFocus
        />
      </div>

      {/* Reason */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Why does it matter to you? (optional)</label>
        <input
          style={inputStyle}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. I want to feel strong in my body"
          onFocus={(e) => { e.target.style.borderColor = 'rgba(244,208,63,0.4)' }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(240,232,210,0.12)' }}
        />
      </div>

      {/* Planet style */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Choose its colour</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {GOAL_PLANET_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStyle(s.id)}
              title={s.description}
              style={{
                padding: '6px 14px',
                border: `1px solid ${selectedStyle === s.id ? s.color : s.color + '44'}`,
                borderRadius: '20px',
                background: selectedStyle === s.id ? `${s.color}20` : 'transparent',
                color: selectedStyle === s.id ? s.color : `${s.color}88`,
                fontSize: '12px',
                fontFamily: "'Cormorant Garamond', serif",
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => { if (name.trim()) onAdd(name.trim(), selectedStyle, reason.trim()) }}
          disabled={!name.trim()}
          style={{
            padding: '10px 24px',
            background: name.trim() ? 'rgba(244,208,63,0.15)' : 'transparent',
            border: `1px solid ${name.trim() ? 'rgba(244,208,63,0.5)' : 'rgba(244,208,63,0.15)'}`,
            borderRadius: '20px',
            color: name.trim() ? 'rgba(244,208,63,0.9)' : 'rgba(244,208,63,0.3)',
            fontSize: '14px',
            fontFamily: "'Cormorant Garamond', serif",
            cursor: name.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
          }}
        >
          Add to my universe
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '10px 18px',
            background: 'transparent',
            border: '1px solid rgba(240,232,210,0.1)',
            borderRadius: '20px',
            color: 'rgba(240,232,210,0.3)',
            fontSize: '13px',
            fontFamily: "'Cormorant Garamond', serif",
            cursor: 'pointer',
          }}
        >
          cancel
        </button>
      </div>
    </motion.div>
  )
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({ goal }: { goal: Goal }) {
  const style = getStyleById(goal.planetStyle)
  const isTendedToday = useAppStore(selectIsGoalTendedToday(goal.id))
  const daysSince = useAppStore(selectDaysSinceTended(goal.id))
  const openCheckIn = useAppStore((s) => s.openCheckIn)
  const stars = useAppStore((s) => s.stars.filter((star) => star.goalId === goal.id))

  const logs = goal.logs ?? []
  const lastLog = logs.length > 0 ? logs[logs.length - 1] : null

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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyGoalsPage() {
  const goals = useAppStore((s) => s.goals)
  const userName = useAppStore((s) => s.userName)
  const addGoal = useAppStore((s) => s.addGoal)
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (name: string, style: GoalPlanetStyle, reason: string) => {
    addGoal(name, style, reason || undefined)
    setShowForm(false)
  }

  const canAddMore = goals.length < 5

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        background: 'linear-gradient(160deg, #080612 0%, #0d0a1f 60%, #080612 100%)',
        zIndex: 50,
      }}
    >
      <div className="page-sidebar-inset" style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '80px 24px 80px',
      }}>
        {/* Header */}
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

        {/* Empty state */}
        {goals.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', paddingTop: '24px' }}
          >
            <p style={{
              color: 'rgba(240,232,210,0.35)',
              fontSize: '15px',
              fontStyle: 'italic',
              fontFamily: "'IM Fell English', serif",
              marginBottom: '24px',
              lineHeight: 1.7,
            }}>
              Your sky is waiting for its first constellation.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '10px 28px',
                background: 'transparent',
                border: '1px solid rgba(244,208,63,0.3)',
                borderRadius: '24px',
                color: 'rgba(244,208,63,0.7)',
                fontSize: '14px',
                fontFamily: "'Cormorant Garamond', serif",
                cursor: 'pointer',
              }}
            >
              + Create your first planet
            </button>
          </motion.div>
        )}

        {/* Goals list */}
        {goals.length > 0 && (
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

        {/* Add planet button — only when not showing form and under limit */}
        {canAddMore && !showForm && goals.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setShowForm(true)}
            style={{
              marginTop: '20px',
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

        {/* Inline add form */}
        <AnimatePresence>
          {showForm && (
            <AddPlanetForm
              onAdd={handleAdd}
              onClose={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
