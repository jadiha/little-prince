import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { useAppStore, selectIsGoalTendedToday } from '@/store/appStore'
import { usePrince } from '@/hooks/usePrince'

export default function DailyCheckIn() {
  const checkInGoalId = useAppStore((s) => s.checkInGoalId)
  const goals = useAppStore((s) => s.goals)
  const closeCheckIn = useAppStore((s) => s.closeCheckIn)
  const logDay = useAppStore((s) => s.logDay)
  const selectGoalPlanet = useAppStore((s) => s.selectGoalPlanet)
  const activeView = useAppStore((s) => s.activeView)
  const { callPrince } = usePrince()

  const [note, setNote] = useState('')
  const [logged, setLogged] = useState(false)

  const goal = goals.find((g) => g.id === checkInGoalId)
  const isTendedToday = useAppStore(selectIsGoalTendedToday(checkInGoalId ?? ''))

  const isOpen = !!checkInGoalId

  const handleClose = () => {
    closeCheckIn()
    // Only navigate back to universe if check-in was opened from the 3D planet view
    if (activeView === 'goalPlanet') {
      selectGoalPlanet(null)
    }
    setNote('')
    setLogged(false)
  }

  const handleTend = () => {
    if (!goal || isTendedToday) return
    logDay(goal.id, note.trim() || undefined)
    setLogged(true)

    // Call Prince after a brief pause
    setTimeout(() => {
      callPrince('afterLog', goal.name, note.trim() || undefined)
    }, 600)

    // Auto close after showing success state
    setTimeout(handleClose, 2500)
  }

  const lastLog = goal?.logs[goal.logs.length - 1]
  const lastLogText = lastLog
    ? formatDistanceToNow(parseISO(lastLog.date), { addSuffix: true })
    : 'never'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            <div className="parchment rounded-3xl p-7">
              {logged ? (
                /* Success state */
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">✦</div>
                  <p className="font-handwriting text-star-gold text-xl text-glow">
                    a star was released
                  </p>
                  <p className="text-ivory/50 text-sm mt-2 font-serif">
                    it is yours forever
                  </p>
                </div>
              ) : (
                <>
                  {/* Goal name */}
                  <h2 className="font-handwriting text-star-gold text-xl text-center mb-1">
                    {goal?.name}
                  </h2>

                  {isTendedToday ? (
                    /* Already tended */
                    <div className="text-center py-4">
                      <p className="font-serif text-ivory/70 text-base leading-relaxed">
                        Your rose is tended today.
                      </p>
                      <p className="font-handwriting text-ivory/40 text-sm mt-2 italic">
                        Come back tomorrow.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Last tended */}
                      <p className="text-center text-ivory/40 text-xs font-serif mb-5">
                        last tended {lastLogText}
                      </p>

                      {/* Optional note */}
                      <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3
                                   font-serif text-ivory text-sm placeholder-ivory/25
                                   focus:outline-none focus:border-star-gold/40 resize-none
                                   leading-relaxed"
                        rows={2}
                        placeholder="a few words, if you like…"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />

                      {/* Tend button */}
                      <button
                        onClick={handleTend}
                        className="w-full mt-4 py-3 rounded-xl font-serif text-space-dark
                                   bg-star-gold hover:bg-yellow-300 transition-colors
                                   text-sm tracking-wide"
                      >
                        I showed up today
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleClose}
                    className="w-full mt-3 text-ivory/30 text-xs font-serif hover:text-ivory/60 transition-colors"
                  >
                    not today
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
