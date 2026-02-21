import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { STORY_PLANETS } from '@/data/storyPlanets'
import { usePrince } from '@/hooks/usePrince'

export default function StoryPlanetPanel() {
  const selectedStoryPlanetId = useAppStore((s) => s.selectedStoryPlanetId)
  const selectStoryPlanet = useAppStore((s) => s.selectStoryPlanet)
  const isPrinceTyping = useAppStore((s) => s.isPrinceTyping)
  const { callPrince } = usePrince()

  const planet = STORY_PLANETS.find((p) => p.id === selectedStoryPlanetId)
  const isOpen = !!planet

  const handleClose = () => {
    selectStoryPlanet(null)
  }

  const handleAskPrince = () => {
    if (!planet) return
    callPrince('storyPlanet', undefined, undefined, planet.id)
  }

  return (
    <AnimatePresence>
      {isOpen && planet && (
        <>
          {/* Backdrop (click to close) */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Side panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <div className="min-h-full parchment p-7 flex flex-col gap-6">
              {/* Header */}
              <div>
                <p
                  className="text-xs tracking-widest uppercase font-serif mb-1"
                  style={{ color: planet.color }}
                >
                  {planet.planetNumber}
                </p>
                <h2 className="font-handwriting text-ivory text-2xl">
                  {planet.characterName}
                </h2>
              </div>

              {/* The trap */}
              <div
                className="border-l-2 pl-4 py-1"
                style={{ borderColor: planet.color }}
              >
                <p className="font-serif text-ivory/80 text-sm italic leading-relaxed">
                  {planet.trap}
                </p>
              </div>

              {/* Lesson */}
              <p className="font-serif text-ivory/65 text-sm leading-loose">
                {planet.lesson}
              </p>

              {/* Quote */}
              <blockquote className="font-handwriting text-ivory/50 text-sm italic leading-relaxed border-t border-white/10 pt-4">
                {planet.quote}
              </blockquote>

              {/* Ask the Prince */}
              <button
                onClick={handleAskPrince}
                disabled={isPrinceTyping}
                className="w-full py-3 rounded-xl font-serif text-sm border border-star-gold/30
                           text-star-gold/80 hover:text-star-gold hover:border-star-gold/60
                           transition-colors disabled:opacity-40"
              >
                {isPrinceTyping ? 'the prince is thinking…' : 'what does the prince say?'}
              </button>

              {/* Close */}
              <button
                onClick={handleClose}
                className="text-ivory/30 text-xs font-serif hover:text-ivory/60 transition-colors"
              >
                return to the universe
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
