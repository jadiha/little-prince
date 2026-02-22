import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STORY_PLANETS } from '@/data/storyPlanets'
import { useAppStore, selectRoseState } from '@/store/appStore'

// ─── Planet positions in the 2D space ─────────────────────────────────────────
// Positioned so all planets fall to the right of the 200px sidebar on desktop.
// On mobile the sidebar is hidden so all positions work fine.
const PLANET_LAYOUT = [
  { left: '28%', top: '22%', size: 88, delay: 0.0 },   // King
  { left: '56%', top: '12%', size: 64, delay: 0.3 },   // Vain
  { left: '78%', top: '36%', size: 52, delay: 0.6 },   // Drunkard
  { left: '72%', top: '66%', size: 72, delay: 0.5 },   // Businessman
  { left: '46%', top: '74%', size: 60, delay: 0.2 },   // Lamplighter
  { left: '26%', top: '56%', size: 80, delay: 0.8 },   // Geographer
]

// ─── Types ────────────────────────────────────────────────────────────────────
type Planet = typeof STORY_PLANETS[0]

// ─── Overview: all 6 planets floating in space ────────────────────────────────
function PlanetOverview({
  onEnter,
}: {
  onEnter: (planet: Planet) => void
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {/* Subtle header */}
      <div style={{
        position: 'absolute',
        top: '28px',
        left: 0,
        right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(16px, 2vw, 24px)',
          color: 'rgba(244,208,63,0.6)',
          fontWeight: 400,
          letterSpacing: '0.05em',
          marginBottom: '4px',
        }}>
          The Planets of the Little Prince
        </h1>
        <p style={{
          color: 'rgba(240,232,210,0.25)',
          fontSize: '12px',
          fontStyle: 'italic',
          fontFamily: "'IM Fell English', serif",
        }}>
          Hover to see the trap. Click to enter the world.
        </p>
      </div>

      {/* Floating planets */}
      {STORY_PLANETS.map((planet, i) => {
        const pos = PLANET_LAYOUT[i]
        const isHovered = hoveredId === planet.id

        return (
          <motion.div
            key={planet.id}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              zIndex: isHovered ? 5 : 1,
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: pos.delay, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            onHoverStart={() => setHoveredId(planet.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => onEnter(planet)}
          >
            {/* Trap tooltip — appears above on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '14px',
                    background: 'rgba(4,2,12,0.95)',
                    border: `1px solid ${planet.color}55`,
                    borderRadius: '10px',
                    padding: '10px 16px',
                    width: '200px',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    boxShadow: `0 4px 24px ${planet.color}22`,
                  }}
                >
                  <div style={{
                    color: planet.color,
                    fontSize: '12px',
                    fontStyle: 'italic',
                    fontFamily: "'IM Fell English', serif",
                    lineHeight: 1.5,
                    opacity: 0.9,
                  }}>
                    {planet.trap}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Planet orb with float animation */}
            <motion.div
              animate={{ y: [0, i % 2 === 0 ? -10 : -7, 0] }}
              transition={{
                duration: 3.2 + i * 0.35,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: pos.delay * 0.5,
              }}
              whileHover={{ scale: 1.12 }}
              style={{
                width: `${pos.size}px`,
                height: `${pos.size}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle at 33% 30%, ${planet.color}ff 0%, ${planet.color}99 35%, ${planet.color}33 70%, transparent 100%)`,
                boxShadow: isHovered
                  ? `0 0 ${pos.size * 0.5}px ${planet.color}77, 0 0 ${pos.size}px ${planet.color}33, inset 0 0 ${pos.size * 0.2}px ${planet.color}44`
                  : `0 0 ${pos.size * 0.3}px ${planet.color}44, 0 0 ${pos.size * 0.7}px ${planet.color}18`,
                transition: 'box-shadow 0.35s ease',
              }}
            />

            {/* Planet label */}
            <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{
                color: 'rgba(240,232,210,0.28)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                fontFamily: "'Cormorant Garamond', serif",
                marginBottom: '2px',
                textTransform: 'uppercase',
              }}>
                {planet.planetNumber}
              </div>
              <div style={{
                color: isHovered ? 'rgba(240,232,210,0.92)' : 'rgba(240,232,210,0.5)',
                fontSize: '13px',
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                transition: 'color 0.25s ease',
                letterSpacing: '0.02em',
              }}>
                {planet.characterName}
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── Character illustration — SVG portrait or jpg if provided ─────────────────
function CharacterIllustration({ planet }: { planet: Planet }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  // Try .svg first (our illustrated portraits)
  const [src, setSrc] = useState(`/assets/characters/${planet.id}.svg`)
  const [failed, setFailed] = useState(false)

  const handleError = () => {
    if (src.endsWith('.svg')) {
      // Try .jpg (user-provided photo)
      setSrc(`/assets/characters/${planet.id}.jpg`)
    } else {
      setFailed(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.05 }}
      style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}
    >
      {!failed ? (
        <img
          src={src}
          alt={planet.characterName}
          onLoad={() => setImgLoaded(true)}
          onError={handleError}
          style={{
            width: '160px',
            height: '160px',
            objectFit: 'contain',
            borderRadius: '50%',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            boxShadow: `0 0 40px ${planet.color}33, 0 0 80px ${planet.color}11`,
            border: `1px solid ${planet.color}22`,
          }}
        />
      ) : (
        /* Fallback circle if all image loading fails */
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${planet.color}55 0%, ${planet.color}22 50%, transparent 100%)`,
          border: `1px solid ${planet.color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 40px ${planet.color}22`,
        }}>
          <span style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: '52px',
            color: planet.color,
            opacity: 0.7,
            lineHeight: 1,
          }}>
            {planet.characterName.charAt(planet.characterName.indexOf(' ') + 1) || planet.characterName.charAt(0)}
          </span>
        </div>
      )}
    </motion.div>
  )
}

// ─── Detail: entered a planet ─────────────────────────────────────────────────
function PlanetDetail({
  planet,
  onBack,
}: {
  planet: Planet
  onBack: () => void
}) {
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
      key="detail"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        background: `radial-gradient(ellipse at 25% 20%, ${planet.color}1a 0%, transparent 55%)`,
      }}
    >
      {/* Back button — fixed at top, offset past sidebar */}
      <div
        className="page-sidebar-inset"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          padding: '20px 24px 0',
          background: 'transparent',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(240,232,210,0.4)',
            fontSize: '14px',
            fontFamily: "'Cormorant Garamond', serif",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 0',
            letterSpacing: '0.02em',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(240,232,210,0.8)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,232,210,0.4)')}
        >
          ← return to the stars
        </button>
      </div>

      {/* Content */}
      <div
        className="page-sidebar-inset"
        style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px 80px' }}
      >
        {/* Character illustration — loads from /assets/characters/{id}.jpg if available */}
        <CharacterIllustration planet={planet} />

        {/* Planet orb */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `radial-gradient(circle at 33% 30%, ${planet.color}ff 0%, ${planet.color}99 35%, ${planet.color}33 70%, transparent 100%)`,
            boxShadow: `0 0 40px ${planet.color}55, 0 0 80px ${planet.color}22`,
            marginBottom: '28px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <p style={{
            color: 'rgba(240,232,210,0.3)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            fontFamily: "'Cormorant Garamond', serif",
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            {planet.planetNumber}
          </p>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(30px, 4.5vw, 48px)',
            color: 'rgba(240,232,210,0.95)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '10px',
          }}>
            {planet.characterName}
          </h1>

          <p style={{
            color: planet.color,
            fontSize: '15px',
            fontStyle: 'italic',
            fontFamily: "'IM Fell English', serif",
            marginBottom: '36px',
            opacity: 0.9,
            lineHeight: 1.5,
          }}>
            {planet.trap}
          </p>

          <p style={{
            color: 'rgba(240,232,210,0.78)',
            fontSize: '16px',
            lineHeight: 1.9,
            fontFamily: "'Cormorant Garamond', serif",
            marginBottom: '28px',
          }}>
            {planet.lesson}
          </p>

          <blockquote style={{
            borderLeft: `2px solid ${planet.color}55`,
            paddingLeft: '22px',
            margin: '28px 0 32px',
            color: 'rgba(240,232,210,0.48)',
            fontSize: '14px',
            fontStyle: 'italic',
            fontFamily: "'IM Fell English', serif",
            lineHeight: 1.85,
          }}>
            {planet.quote}
          </blockquote>

          {!asked && (
            <button
              onClick={handleAsk}
              disabled={loading}
              style={{
                padding: '10px 26px',
                background: 'transparent',
                border: `1px solid ${planet.color}55`,
                borderRadius: '24px',
                color: planet.color,
                fontSize: '14px',
                fontFamily: "'Cormorant Garamond', serif",
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.5 : 1,
                letterSpacing: '0.02em',
                transition: 'border-color 0.2s ease, opacity 0.2s ease',
              }}
            >
              {loading ? 'The Prince is thinking...' : 'What does the Prince remember?'}
            </button>
          )}

          {princeResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '20px',
                padding: '18px 22px',
                background: 'rgba(244,208,63,0.05)',
                border: '1px solid rgba(244,208,63,0.15)',
                borderRadius: '12px',
                color: 'rgba(240,232,210,0.85)',
                fontSize: '14px',
                fontFamily: "'IM Fell English', serif",
                fontStyle: 'italic',
                lineHeight: 1.9,
              }}
            >
              {princeResponse}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Main ExplorePage ─────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at 65% 40%, #1a0a38 0%, #0d0525 50%, #070315 100%)',
        zIndex: 35,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        {selectedPlanet ? (
          <PlanetDetail
            key={selectedPlanet.id}
            planet={selectedPlanet}
            onBack={() => setSelectedPlanet(null)}
          />
        ) : (
          <PlanetOverview
            key="overview"
            onEnter={(planet) => setSelectedPlanet(planet)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
