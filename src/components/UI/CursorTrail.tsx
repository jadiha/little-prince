import { useEffect, useRef } from 'react'

interface Sparkle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  gold: boolean
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparklesRef = useRef<Sparkle[]>([])
  const lastSpawnRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastSpawnRef.current < 28) return
      lastSpawnRef.current = now

      // Spawn 2–3 sparkles per move event
      const count = Math.random() > 0.5 ? 2 : 3
      for (let i = 0; i < count; i++) {
        sparklesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -Math.random() * 1.8 - 0.4,
          life: 1,
          size: Math.random() * 2.2 + 0.8,
          gold: Math.random() > 0.35,
        })
      }
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparklesRef.current = sparklesRef.current.filter((s) => s.life > 0.02)

      for (const s of sparklesRef.current) {
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.025   // gentle gravity
        s.vx *= 0.98    // slight drag
        s.life -= 0.032

        const alpha = Math.max(0, s.life)
        // Gold (#f4d03f) or soft purple (#c8a0f0)
        const color = s.gold ? `255, 210, 60` : `200, 160, 245`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${alpha * 0.85})`
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
