import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'

export default function LittlePrinceSprite() {
  const activeView = useAppStore((s) => s.activeView)

  if (activeView !== 'universe' && activeView !== 'goalPlanet') return null

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('prince:clicked'))
  }

  return (
    <motion.div
      className="prince-sprite-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 1 }}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '40px',
        width: '120px',
        zIndex: 10,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      title="Talk to the Little Prince"
    >
      <motion.img
        src="/assets/prince-back.png"
        alt="The Little Prince"
        style={{
          width: '100%',
          height: 'auto',
          mixBlendMode: 'multiply',
          filter: 'drop-shadow(0 0 8px rgba(244, 208, 63, 0.4))',
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}
