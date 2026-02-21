import { useEffect, useState } from 'react'

interface ShootingStar {
  id: number
  top: number
  left: number
  delay: number
}

export default function ShootingStars({ onDone }: { onDone: () => void }) {
  const [stars] = useState<ShootingStar[]>(() => [
    { id: 1, top: 8,  left: 5,  delay: 0 },
    { id: 2, top: 15, left: 20, delay: 0.35 },
    { id: 3, top: 5,  left: 35, delay: 0.7 },
  ])

  useEffect(() => {
    // Remove after all animations complete (3 stars × ~1.2s + longest delay 0.7s + buffer)
    const timer = setTimeout(onDone, 2600)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
