import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { useAppStore } from '@/store/appStore'

export default function StarTooltip() {
  const hoveredStar = useAppStore((s) => s.hoveredStar)
  const goals = useAppStore((s) => s.goals)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const goal = goals.find((g) => g.id === hoveredStar?.goalId)
  const dateFormatted = hoveredStar
    ? format(parseISO(hoveredStar.date), 'MMMM d, yyyy')
    : ''

  return (
    <AnimatePresence>
      {hoveredStar && goal && (
        <motion.div
          key={`${hoveredStar.goalId}-${hoveredStar.date}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            left: pos.x + 16,
            top: pos.y - 48,
            zIndex: 9999,
            pointerEvents: 'none',
            background: 'rgba(6,4,20,0.92)',
            border: '1px solid rgba(244,208,63,0.22)',
            borderRadius: '10px',
            padding: '8px 14px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{
            color: 'rgba(244,208,63,0.92)',
            fontSize: '13px',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            marginBottom: '2px',
          }}>
            {goal.name}
          </div>
          <div style={{
            color: 'rgba(240,232,210,0.38)',
            fontSize: '11px',
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: '0.03em',
          }}>
            {dateFormatted}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
