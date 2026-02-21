import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { GOAL_PLANET_STYLES, getStyleById } from '@/data/goalPlanetStyles'
import type { GoalPlanetStyle } from '@/types'

type Step = 'name' | 'rose' | 'howItWorks' | 'create'

interface GoalEntry {
  name: string
  reason: string
  style: GoalPlanetStyle
}

const STYLES_ORDER: GoalPlanetStyle[] = [
  'amber-health',
  'blue-learning',
  'purple-creativity',
  'rosegold-relationships',
  'green-rest',
]

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>('name')
  const [nameInput, setNameInput] = useState('')
  const [goals, setGoals] = useState<GoalEntry[]>([
    { name: '', reason: '', style: 'amber-health' },
  ])

  const setUserName = useAppStore((s) => s.setUserName)
  const addGoalToStore = useAppStore((s) => s.addGoal)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const recordVisit = useAppStore((s) => s.recordVisit)

  const handleNameContinue = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    setUserName(trimmed)
    setStep('rose')
  }

  const handleAddGoal = () => {
    if (goals.length >= 5) return
    const nextStyle = STYLES_ORDER[goals.length % STYLES_ORDER.length]
    setGoals([...goals, { name: '', reason: '', style: nextStyle }])
  }

  const handleBegin = () => {
    const valid = goals.filter((g) => g.name.trim().length > 0)
    if (valid.length === 0) return
    for (const g of valid) {
      addGoalToStore(g.name.trim(), g.style, g.reason.trim() || undefined)
    }
    recordVisit()
    completeOnboarding()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        overflowY: 'auto',
      }}
    >
      <AnimatePresence mode="wait">

        {/* ── Step 1: Name ─────────────────────────────────────────────── */}
        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: 'url(/assets/prince-bg1.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,2,12,0.72)' }} />
            <motion.div
              style={{ position: 'relative', textAlign: 'center', padding: '32px 24px', maxWidth: '480px', width: '100%' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <p style={{
                fontFamily: "'IM Fell English', serif",
                fontStyle: 'italic',
                color: 'rgba(240,232,210,0.6)',
                fontSize: '15px',
                lineHeight: 1.8,
                marginBottom: '40px',
              }}>
                "All grown-ups were once children — but only few of them remember it."
              </p>

              <label style={{
                display: 'block',
                color: 'rgba(240,232,210,0.8)',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px',
                marginBottom: '20px',
              }}>
                What is your name?
              </label>

              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameContinue()}
                placeholder="Your name..."
                autoFocus
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(244,208,63,0.3)',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  color: 'rgba(240,232,210,0.9)',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '18px',
                  outline: 'none',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              />

              <motion.button
                onClick={handleNameContinue}
                disabled={!nameInput.trim()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  marginTop: '24px',
                  padding: '12px 40px',
                  background: 'rgba(244,208,63,0.1)',
                  border: '1px solid rgba(244,208,63,0.5)',
                  borderRadius: '30px',
                  color: 'rgba(244,208,63,0.9)',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '16px',
                  cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
                  opacity: nameInput.trim() ? 1 : 0.4,
                }}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Step 2: The Rose ─────────────────────────────────────────── */}
        {step === 'rose' && (
          <motion.div
            key="rose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'linear-gradient(160deg, #08040f 0%, #160a1a 50%, #08040f 100%)',
            }}
          >
            {/* LP image on the side */}
            <img
              src="/assets/prince-rose-scene.png"
              alt=""
              style={{
                position: 'absolute',
                bottom: 0,
                right: '5%',
                height: '65vh',
                maxHeight: '480px',
                mixBlendMode: 'multiply',
                opacity: 0.85,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />

            <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,2,12,0.35)' }} />

            <motion.div
              style={{
                position: 'relative',
                maxWidth: '520px',
                padding: '40px 32px',
                marginRight: 'auto',
                marginLeft: '8vw',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
            >
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: 'rgba(240,232,210,0.85)',
                fontSize: 'clamp(15px, 2.2vw, 18px)',
                lineHeight: 2,
                marginBottom: '32px',
              }}>
                <span style={{ color: 'rgba(244,208,63,0.85)' }}>{nameInput.trim()},</span> before we begin — there is something you should know about your rose.
                <br /><br />
                The Little Prince had one rose. Just one. And she was difficult — dramatic, vain, prone to complaint. Yet she was the most important thing in his universe. Not because she was perfect. But because of the time he gave her. The care. The returning.
                <br /><br />
                <em style={{ color: 'rgba(240,232,210,0.6)' }}>Your rose is you.</em> It is your relationship with yourself. It blooms when you tend to what matters. It wilts gently when you disappear. But it never dies. You can always come back to it.
              </p>

              <motion.button
                onClick={() => setStep('howItWorks')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '12px 40px',
                  background: 'transparent',
                  border: '1px solid rgba(244,208,63,0.4)',
                  borderRadius: '30px',
                  color: 'rgba(244,208,63,0.85)',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                I understand
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Step 3: How it works ─────────────────────────────────────── */}
        {step === 'howItWorks' && (
          <motion.div
            key="howItWorks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(160deg, #05030e 0%, #0a0618 60%, #05030e 100%)',
            }}
          >
            <motion.div
              style={{ maxWidth: '660px', padding: '40px 28px', width: '100%' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
            >
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(22px, 4vw, 36px)',
                color: 'rgba(240,232,210,0.9)',
                fontWeight: 400,
                marginBottom: '36px',
              }}>
                Two universes
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '40px' }}>
                {/* Your Universe */}
                <div style={{
                  padding: '24px',
                  background: 'rgba(244,208,63,0.04)',
                  border: '1px solid rgba(244,208,63,0.15)',
                  borderRadius: '10px',
                }}>
                  <div style={{ color: 'rgba(244,208,63,0.8)', fontSize: '13px', letterSpacing: '0.1em', marginBottom: '10px' }}>
                    YOUR UNIVERSE
                  </div>
                  <p style={{
                    color: 'rgba(240,232,210,0.65)',
                    fontSize: '14px',
                    lineHeight: 1.85,
                    fontFamily: "'Cormorant Garamond', serif",
                  }}>
                    Each goal you set becomes a planet orbiting your asteroid. Every day you show up for that goal, a star is released into your sky. Your sky is empty today. In a year, it could be full.
                  </p>
                </div>

                {/* The Prince's Journey */}
                <div style={{
                  padding: '24px',
                  background: 'rgba(100,80,180,0.05)',
                  border: '1px solid rgba(120,90,200,0.15)',
                  borderRadius: '10px',
                }}>
                  <div style={{ color: 'rgba(170,140,240,0.7)', fontSize: '13px', letterSpacing: '0.1em', marginBottom: '10px' }}>
                    THE PRINCE'S JOURNEY
                  </div>
                  <p style={{
                    color: 'rgba(240,232,210,0.65)',
                    fontSize: '14px',
                    lineHeight: 1.85,
                    fontFamily: "'Cormorant Garamond', serif",
                  }}>
                    In the distance, six planets orbit quietly. These are the planets the Little Prince visited — The King, The Vain Man, The Drunkard, The Businessman, The Lamplighter, The Geographer. Each one holds a lesson about a trap adults fall into.
                  </p>
                </div>
              </div>

              <motion.button
                onClick={() => setStep('create')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '13px 44px',
                  background: 'rgba(244,208,63,0.08)',
                  border: '1px solid rgba(244,208,63,0.45)',
                  borderRadius: '30px',
                  color: 'rgba(244,208,63,0.9)',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '17px',
                  cursor: 'pointer',
                }}
              >
                Create my universe
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Step 4: Goal Creation ────────────────────────────────────── */}
        {step === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              background: 'linear-gradient(160deg, #05030e 0%, #0a0618 60%, #05030e 100%)',
              paddingTop: '60px',
              paddingBottom: '60px',
            }}
          >
            <motion.div
              style={{ maxWidth: '600px', padding: '0 24px', width: '100%' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
            >
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(20px, 3.5vw, 32px)',
                color: 'rgba(240,232,210,0.9)',
                fontWeight: 400,
                marginBottom: '6px',
              }}>
                What will your planets be this year{nameInput.trim() ? `, ${nameInput.trim()}` : ''}?
              </h2>
              <p style={{
                color: 'rgba(240,232,210,0.4)',
                fontSize: '14px',
                fontStyle: 'italic',
                fontFamily: "'IM Fell English', serif",
                marginBottom: '32px',
              }}>
                Each goal becomes a planet. Give it a name. Give it a reason.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {goals.map((goal, i) => {
                  const styleData = getStyleById(goal.style)
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '20px',
                        background: 'rgba(255,255,255,0.025)',
                        border: `1px solid ${styleData.color}33`,
                        borderRadius: '10px',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Goal name (e.g. Run every morning)"
                        value={goal.name}
                        onChange={(e) => {
                          const next = [...goals]
                          next[i] = { ...next[i], name: e.target.value }
                          setGoals(next)
                        }}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: `1px solid ${styleData.color}44`,
                          padding: '8px 0',
                          color: 'rgba(240,232,210,0.9)',
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '17px',
                          outline: 'none',
                          marginBottom: '12px',
                          boxSizing: 'border-box',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Why does this matter to you? (optional)"
                        value={goal.reason}
                        onChange={(e) => {
                          const next = [...goals]
                          next[i] = { ...next[i], reason: e.target.value }
                          setGoals(next)
                        }}
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(240,232,210,0.1)',
                          padding: '8px 0',
                          color: 'rgba(240,232,210,0.5)',
                          fontFamily: "'IM Fell English', serif",
                          fontStyle: 'italic',
                          fontSize: '14px',
                          outline: 'none',
                          marginBottom: '16px',
                          boxSizing: 'border-box',
                        }}
                      />

                      {/* Planet style picker */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {GOAL_PLANET_STYLES.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              const next = [...goals]
                              next[i] = { ...next[i], style: s.id as GoalPlanetStyle }
                              setGoals(next)
                            }}
                            title={s.label}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: s.color,
                              border: goal.style === s.id
                                ? `2px solid rgba(240,232,210,0.8)`
                                : '2px solid transparent',
                              cursor: 'pointer',
                              boxShadow: goal.style === s.id ? `0 0 8px ${s.color}88` : 'none',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
                {goals.length < 5 && (
                  <button
                    onClick={handleAddGoal}
                    style={{
                      padding: '10px 24px',
                      background: 'transparent',
                      border: '1px solid rgba(240,232,210,0.15)',
                      borderRadius: '24px',
                      color: 'rgba(240,232,210,0.4)',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    + Add another planet
                  </button>
                )}

                <motion.button
                  onClick={handleBegin}
                  disabled={goals.every((g) => !g.name.trim())}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '12px 36px',
                    background: 'rgba(244,208,63,0.1)',
                    border: '1px solid rgba(244,208,63,0.5)',
                    borderRadius: '30px',
                    color: 'rgba(244,208,63,0.9)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '16px',
                    cursor: goals.some((g) => g.name.trim()) ? 'pointer' : 'not-allowed',
                    opacity: goals.some((g) => g.name.trim()) ? 1 : 0.4,
                  }}
                >
                  Begin my universe
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

