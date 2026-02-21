import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'

function TypewriterText({ text, speed = 28 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return <span>{displayed}</span>
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-star-gold inline-block"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  )
}

export default function PrinceMessage() {
  const princeMessage = useAppStore((s) => s.princeMessage)
  const isPrinceTyping = useAppStore((s) => s.isPrinceTyping)
  const setPrinceMessage = useAppStore((s) => s.setPrinceMessage)

  const isVisible = isPrinceTyping || !!princeMessage

  // Auto-dismiss after 14s
  useEffect(() => {
    if (!princeMessage) return
    const id = setTimeout(() => setPrinceMessage(null), 14000)
    return () => clearTimeout(id)
  }, [princeMessage, setPrinceMessage])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="parchment rounded-2xl px-6 py-5 text-center cursor-pointer"
            onClick={() => setPrinceMessage(null)}
          >
            {/* Prince icon */}
            <div className="text-star-gold text-xs tracking-widest uppercase mb-3 opacity-60">
              the little prince
            </div>

            <p className="font-handwriting text-ivory text-lg leading-relaxed text-glow min-h-[2.5rem]">
              {isPrinceTyping && !princeMessage ? (
                <ThinkingDots />
              ) : princeMessage ? (
                <TypewriterText text={princeMessage} />
              ) : null}
            </p>

            <p className="text-ivory/30 text-xs mt-3 font-serif">
              tap to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
