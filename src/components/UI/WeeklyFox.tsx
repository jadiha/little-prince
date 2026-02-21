import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, startOfWeek } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { useAppStore } from '@/store/appStore'
import { usePrince } from '@/hooks/usePrince'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function WeeklyFox({ isOpen, onClose }: Props) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [princeReply, setPrinceReply] = useState<string | null>(null)

  const addReflection = useAppStore((s) => s.addReflection)
  const { callPrince } = usePrince()

  const handleSubmit = async () => {
    if (!answer.trim()) return
    setSubmitted(true)

    const reply = await callPrince('weeklyFox', undefined, answer.trim())

    const weekOf = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
    addReflection({
      weekOf,
      foxAnswer: answer.trim(),
      princeResponse: reply ?? '',
    })

    setPrinceReply(reply)
  }

  const handleClose = () => {
    setAnswer('')
    setSubmitted(false)
    setPrinceReply(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div className="parchment rounded-3xl p-7">
              {/* Fox header */}
              <div className="text-center mb-5">
                <p className="text-xs tracking-widest uppercase font-serif text-[#d35400]/70 mb-2">
                  the fox speaks
                </p>
                <h2 className="font-handwriting text-ivory text-xl leading-snug">
                  What did you tame this week?
                </h2>
                <p className="font-handwriting text-ivory/40 text-sm italic mt-2">
                  "You become responsible, forever, for what you have tamed."
                </p>
              </div>

              {!submitted ? (
                <>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3
                               font-serif text-ivory text-sm placeholder-ivory/25
                               focus:outline-none focus:border-star-gold/40 resize-none leading-relaxed"
                    rows={4}
                    placeholder="write freely, the prince is listening…"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim()}
                    className="w-full mt-4 py-3 rounded-xl font-serif text-space-dark
                               bg-star-gold hover:bg-yellow-300 transition-colors text-sm
                               tracking-wide disabled:opacity-40"
                  >
                    tell the prince
                  </button>
                </>
              ) : (
                <div className="text-center py-2">
                  {princeReply ? (
                    <p className="font-handwriting text-ivory text-base leading-relaxed italic text-glow">
                      "{princeReply}"
                    </p>
                  ) : (
                    <div className="flex justify-center gap-1.5 py-4">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-star-gold inline-block"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(submitted && princeReply) && (
                <button
                  onClick={handleClose}
                  className="w-full mt-5 text-ivory/30 text-xs font-serif hover:text-ivory/60 transition-colors"
                >
                  until next friday
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
