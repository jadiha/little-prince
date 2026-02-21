import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STORY_PLANETS } from '@/data/storyPlanets'
import { useAppStore, selectRoseState } from '@/store/appStore'

function PlanetCard({ planet }: { planet: typeof STORY_PLANETS[number] }) {
  const [expanded, setExpanded] = useState(false)
  const [asked, setAsked] = useState(false)
  const [princeResponse, setPrinceResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const goals = useAppStore((s) => s.goals)
  const stars = useAppStore((s) => s.stars)
  const roseState = useAppStore(selectRoseState)

  const handleAsk = async () => {
    if (asked) return
    setLoading(true)
    try {
      const res = await fetch('/api/prince', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'storyPlanet',
          goals: goals.map((g) => ({ name: g.name, logs: g.logs })),
          roseState,
          totalStars: stars.length,
          payload: { storyPlanetId: planet.id },
        }),
      })
      const data = await res.json()
      setPrinceResponse(data.message ?? data.error ?? '')
      setAsked(true)
    } catch {
      setPrinceResponse('The Prince is somewhere among the stars...')
      setAsked(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      layout
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${planet.color}33`,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      whileHover={{ borderColor: `${planet.color}66` }}
    >
      {/* Card header — always visible */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px 24px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${planet.color}cc, ${planet.color}44)`,
            boxShadow: `0 0 16px ${planet.color}44`,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(240,232,210,0.45)', fontSize: '12px', letterSpacing: '0.08em', marginBottom: '2px' }}>
            {planet.planetNumber}
          </div>
          <div style={{ color: 'rgba(240,232,210,0.95)', fontSize: '18px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
            {planet.characterName}
          </div>
          <div style={{ color: planet.color, fontSize: '13px', fontStyle: 'italic', marginTop: '2px', opacity: 0.85 }}>
            {planet.trap}
          </div>
        </div>
        <span style={{ color: 'rgba(240,232,210,0.3)', fontSize: '18px' }}>
          {expanded ? '−' : '+'}
        </span>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div style={{ padding: '0 24px 24px', borderTop: `1px solid ${planet.color}22` }}>
              <p style={{
                color: 'rgba(240,232,210,0.75)',
                fontSize: '15px',
                lineHeight: 1.8,
                fontFamily: "'Cormorant Garamond', serif",
                margin: '16px 0',
              }}>
                {planet.lesson}
              </p>
              <blockquote style={{
                borderLeft: `2px solid ${planet.color}66`,
                paddingLeft: '16px',
                margin: '16px 0',
                color: 'rgba(240,232,210,0.5)',
                fontSize: '14px',
                fontStyle: 'italic',
                lineHeight: 1.7,
              }}>
                {planet.quote}
              </blockquote>

              {!asked && (
                <button
                  onClick={handleAsk}
                  disabled={loading}
                  style={{
                    marginTop: '12px',
                    padding: '8px 20px',
                    background: 'transparent',
                    border: `1px solid ${planet.color}55`,
                    borderRadius: '20px',
                    color: planet.color,
                    fontSize: '13px',
                    fontFamily: "'Cormorant Garamond', serif",
                    cursor: 'pointer',
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? 'The Prince is thinking...' : 'What does the Prince remember?'}
                </button>
              )}

              {princeResponse && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '16px',
                    padding: '14px 18px',
                    background: 'rgba(244,208,63,0.06)',
                    border: '1px solid rgba(244,208,63,0.15)',
                    borderRadius: '8px',
                    color: 'rgba(240,232,210,0.85)',
                    fontSize: '14px',
                    fontFamily: "'IM Fell English', serif",
                    fontStyle: 'italic',
                    lineHeight: 1.8,
                  }}
                >
                  {princeResponse}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ExplorePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        backgroundImage: 'url(/assets/prince-bg2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 20,
      }}
    >
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(6,4,16,0.82)',
        backdropFilter: 'blur(1px)',
      }} />

      <div style={{
        position: 'relative',
        maxWidth: '780px',
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
            fontSize: 'clamp(28px, 5vw, 44px)',
            color: 'rgba(244,208,63,0.9)',
            fontWeight: 400,
            marginBottom: '8px',
            letterSpacing: '0.02em',
          }}>
            The Planets of the Little Prince
          </h1>
          <p style={{
            color: 'rgba(240,232,210,0.5)',
            fontSize: '15px',
            fontStyle: 'italic',
            fontFamily: "'IM Fell English', serif",
            marginBottom: '40px',
            lineHeight: 1.7,
          }}>
            In a distant universe, he visited six planets. Each one taught him something about what it means to grow up.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {STORY_PLANETS.map((planet, i) => (
            <motion.div
              key={planet.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <PlanetCard planet={planet} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
