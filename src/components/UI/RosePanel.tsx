import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { useAppStore, selectRoseState } from '@/store/appStore'
import type { RoseState } from '@/types'

// ─── Per-state info ────────────────────────────────────────────────────────────

const ROSE_INFO: Record<RoseState, {
  title: string
  description: string
  emoji: string
  color: string
}> = {
  fullBloom: {
    title: 'Full Bloom',
    description: 'Your rose is radiant. You have been returning, consistently, to what matters. She remembers every day you came back.',
    emoji: '🌹',
    color: '#e74c3c',
  },
  blooming: {
    title: 'Blooming',
    description: 'Your rose is open and warm. The last seven days have been kind to her. She notices when you return.',
    emoji: '🌸',
    color: '#c0392b',
  },
  budding: {
    title: 'Budding',
    description: 'Your rose is beginning to open. She needs a little more of your time. She is patient with you.',
    emoji: '🌷',
    color: '#922b21',
  },
  wilting: {
    title: 'Wilting',
    description: 'Your rose needs you. She has been waiting. Even one small act of tending will change everything.',
    emoji: '🥀',
    color: '#c0795e',
  },
  revival: {
    title: 'Revival',
    description: 'Your rose is very still. But she is not gone — she never goes. She only waits, for you to come back.',
    emoji: '🌱',
    color: '#7fb3d3',
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RosePanel() {
  const roseState = useAppStore(selectRoseState)
  const goals = useAppStore((s) => s.goals)
  const stars = useAppStore((s) => s.stars)
  const activeView = useAppStore((s) => s.activeView)
  const setActiveView = useAppStore((s) => s.setActiveView)

  const info = ROSE_INFO[roseState]

  // 7-day tending score
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const cutoff = format(sevenDaysAgo, 'yyyy-MM-dd')
  const totalPossible = goals.length * 7
  const totalLogged = stars.filter((s) => s.date >= cutoff).length
  const score = totalPossible > 0 ? Math.round((totalLogged / totalPossible) * 100) : 100

  return (
    <AnimatePresence>
      {activeView === 'roseView' && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 45,
            width: '100%',
            maxWidth: '360px',
            padding: '0 16px',
            pointerEvents: 'auto',
          }}
        >
          <div style={{
            background: 'rgba(14,6,32,0.95)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${info.color}44`,
            borderRadius: '22px',
            padding: '28px 26px 22px',
            boxShadow: `0 8px 48px ${info.color}1a, 0 0 0 1px rgba(255,255,255,0.03)`,
          }}>

            {/* Rose state header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <span style={{ fontSize: '36px', lineHeight: 1 }}>{info.emoji}</span>
              <div>
                <div style={{
                  color: info.color,
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  fontFamily: "'Cormorant Garamond', serif",
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  opacity: 0.85,
                }}>
                  Your Rose
                </div>
                <div style={{
                  color: 'rgba(240,232,210,0.92)',
                  fontSize: '22px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 500,
                  lineHeight: 1,
                }}>
                  {info.title}
                </div>
              </div>
            </div>

            {/* 7-day progress bar */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '7px',
              }}>
                <span style={{
                  color: 'rgba(240,232,210,0.35)',
                  fontSize: '11px',
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: '0.06em',
                }}>
                  7-day tending
                </span>
                <span style={{
                  color: info.color,
                  fontSize: '13px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                }}>
                  {score}%
                </span>
              </div>
              <div style={{
                height: '3px',
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1.1, delay: 0.35, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${info.color}66, ${info.color})`,
                    borderRadius: '2px',
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <p style={{
              color: 'rgba(240,232,210,0.58)',
              fontSize: '13px',
              fontFamily: "'IM Fell English', serif",
              fontStyle: 'italic',
              lineHeight: 1.75,
              marginBottom: '22px',
            }}>
              {info.description}
            </p>

            {/* Close */}
            <button
              onClick={() => setActiveView('universe')}
              style={{
                width: '100%',
                padding: '9px',
                background: 'transparent',
                border: `1px solid rgba(240,232,210,0.1)`,
                borderRadius: '12px',
                color: 'rgba(240,232,210,0.35)',
                fontSize: '12px',
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(240,232,210,0.65)'
                e.currentTarget.style.borderColor = 'rgba(240,232,210,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(240,232,210,0.35)'
                e.currentTarget.style.borderColor = 'rgba(240,232,210,0.1)'
              }}
            >
              return to your universe
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
