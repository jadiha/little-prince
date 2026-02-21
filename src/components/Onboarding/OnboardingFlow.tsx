import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { GOAL_PLANET_STYLES } from '@/data/goalPlanetStyles'
import type { GoalPlanetStyle } from '@/types'

type Step = 'welcome' | 'create'

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>('welcome')
  const [goals, setGoals] = useState<{ name: string; style: GoalPlanetStyle }[]>([
    { name: '', style: 'amber-health' },
  ])

  const addGoalToStore = useAppStore((s) => s.addGoal)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)

  const handleAddGoal = () => {
    if (goals.length < 5) {
      setGoals([...goals, { name: '', style: 'blue-learning' }])
    }
  }

  const handleSave = () => {
    const valid = goals.filter((g) => g.name.trim().length > 0)
    if (valid.length === 0) return
    for (const g of valid) {
      addGoalToStore(g.name.trim(), g.style)
    }
    completeOnboarding()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            className="text-center max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.2 }}
          >
            <motion.p
              className="font-handwriting text-ivory/60 text-xl leading-relaxed italic mb-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.5 }}
            >
              "What is essential is invisible to the eye."
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1.2 }}
            >
              <p className="font-serif text-ivory/80 text-lg leading-relaxed mb-2">
                Hello.
              </p>
              <p className="font-serif text-ivory/55 text-base leading-loose mb-10">
                I have been waiting for someone who tends things carefully.
              </p>

              <button
                onClick={() => setStep('create')}
                className="font-serif text-star-gold/70 text-sm tracking-widest uppercase
                           hover:text-star-gold transition-colors border-b border-star-gold/30
                           hover:border-star-gold/70 pb-0.5"
              >
                I am here
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === 'create' && (
          <motion.div
            key="create"
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="parchment rounded-3xl p-7">
              <h2 className="font-handwriting text-ivory text-xl text-center mb-1">
                What do you want to tend to?
              </h2>
              <p className="text-ivory/35 text-xs font-serif text-center mb-6">
                These are your goals. Each becomes a planet in your universe.
              </p>

              <div className="flex flex-col gap-4">
                {goals.map((goal, i) => (
                  <GoalInput
                    key={i}
                    index={i}
                    value={goal.name}
                    style={goal.style}
                    onNameChange={(v) => {
                      const next = [...goals]
                      next[i].name = v
                      setGoals(next)
                    }}
                    onStyleChange={(s) => {
                      const next = [...goals]
                      next[i].style = s
                      setGoals(next)
                    }}
                    onRemove={goals.length > 1 ? () => {
                      setGoals(goals.filter((_, idx) => idx !== i))
                    } : undefined}
                  />
                ))}
              </div>

              {goals.length < 5 && (
                <button
                  onClick={handleAddGoal}
                  className="w-full mt-3 py-2 text-ivory/30 text-xs font-serif
                             hover:text-ivory/60 transition-colors border border-dashed
                             border-white/10 rounded-xl hover:border-white/20"
                >
                  + add another
                </button>
              )}

              <button
                onClick={handleSave}
                disabled={!goals.some((g) => g.name.trim())}
                className="w-full mt-5 py-3 rounded-xl font-serif text-space-dark
                           bg-star-gold hover:bg-yellow-300 transition-colors text-sm
                           tracking-wide disabled:opacity-40"
              >
                plant my rose
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Goal input row ─────────────────────────────────────────────────────────────

interface GoalInputProps {
  index: number
  value: string
  style: GoalPlanetStyle
  onNameChange: (v: string) => void
  onStyleChange: (s: GoalPlanetStyle) => void
  onRemove?: () => void
}

function GoalInput({ index, value, style, onNameChange, onStyleChange, onRemove }: GoalInputProps) {
  const selectedStyle = GOAL_PLANET_STYLES.find((s) => s.id === style)!

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Color swatch (opens style picker) */}
        <div className="relative group">
          <div
            className="w-5 h-5 rounded-full flex-shrink-0 cursor-pointer border border-white/20"
            style={{ backgroundColor: selectedStyle.color }}
          />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={`goal ${index + 1}…`}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2
                     font-serif text-ivory text-sm placeholder-ivory/20
                     focus:outline-none focus:border-star-gold/40"
        />

        {onRemove && (
          <button
            onClick={onRemove}
            className="text-ivory/20 hover:text-ivory/50 text-xs transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Planet style selector */}
      <div className="flex gap-2 pl-7">
        {GOAL_PLANET_STYLES.map((s) => (
          <button
            key={s.id}
            className="w-4 h-4 rounded-full border transition-all"
            style={{
              backgroundColor: s.color,
              borderColor: style === s.id ? '#f4d03f' : 'transparent',
              opacity: style === s.id ? 1 : 0.5,
            }}
            title={s.label}
            onClick={() => onStyleChange(s.id)}
          />
        ))}
      </div>
    </div>
  )
}
