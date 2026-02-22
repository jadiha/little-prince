import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/store/appStore'
import { getStyleById } from '@/data/goalPlanetStyles'

// Tracks birth time of each new star for entry animation
const starBirthTimes = new Map<string, number>()

// Generate a canvas-based 5-pointed star texture
function createStarTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 64, 64)
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2
    const innerAngle = outerAngle + (2 * Math.PI) / 10
    if (i === 0) {
      ctx.moveTo(32 + 28 * Math.cos(outerAngle), 32 + 28 * Math.sin(outerAngle))
    } else {
      ctx.lineTo(32 + 28 * Math.cos(outerAngle), 32 + 28 * Math.sin(outerAngle))
    }
    ctx.lineTo(32 + 12 * Math.cos(innerAngle), 32 + 12 * Math.sin(innerAngle))
  }
  ctx.closePath()
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

export default function LoggedStars() {
  const stars = useAppStore((s) => s.stars)
  const goals = useAppStore((s) => s.goals)
  const setHoveredStar = useAppStore((s) => s.setHoveredStar)
  const clockRef = useRef(0)

  const meshRef = useRef<THREE.Points>(null)
  const starTexture = useMemo(() => createStarTexture(), [])

  // Map goalId → color from planet style
  const goalColorMap = useMemo(() => {
    const map = new Map<string, THREE.Color>()
    for (const goal of goals) {
      const style = getStyleById(goal.planetStyle)
      map.set(goal.id, new THREE.Color(style.color))
    }
    return map
  }, [goals])

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(stars.length * 3)
    const col = new Float32Array(stars.length * 3)
    const sz = new Float32Array(stars.length)

    stars.forEach((star, i) => {
      pos[i * 3] = star.position.x
      pos[i * 3 + 1] = star.position.y
      pos[i * 3 + 2] = star.position.z

      const color = goalColorMap.get(star.goalId) ?? new THREE.Color('#f4d03f')
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b

      sz[i] = starBirthTimes.has(star.id) ? 0 : 0.42
    })

    return { positions: pos, colors: col, sizes: sz }
  }, [stars, goalColorMap])

  // Register birth time for newly added stars
  useEffect(() => {
    const now = performance.now()
    for (const star of stars) {
      if (!starBirthTimes.has(star.id)) {
        starBirthTimes.set(star.id, now)
      }
    }
  }, [stars])

  useFrame((state) => {
    clockRef.current = state.clock.getElapsedTime()
    if (!meshRef.current) return

    const sizeAttr = meshRef.current.geometry.attributes.size as THREE.BufferAttribute
    const now = performance.now()
    let needsUpdate = false

    stars.forEach((star, i) => {
      const birthTime = starBirthTimes.get(star.id)
      if (birthTime !== undefined) {
        const age = (now - birthTime) / 1500 // 0→1 over 1.5s
        if (age < 1) {
          // Ease out back: overshoot then settle
          const t = Math.min(age, 1)
          const eased = t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2
          sizeAttr.setX(i, eased * 0.55)
          needsUpdate = true
        } else {
          // Add a gentle twinkle once settled
          const twinkle = 0.42 + Math.sin(clockRef.current * 1.8 + i * 0.9) * 0.14
          sizeAttr.setX(i, twinkle)
          needsUpdate = true
        }
      }
    })

    if (needsUpdate) sizeAttr.needsUpdate = true
  })

  if (stars.length === 0) return null

  return (
    <points
      ref={meshRef}
      onPointerMove={(e) => {
        e.stopPropagation()
        const star = stars[e.index]
        if (star) setHoveredStar({ goalId: star.goalId, date: star.date })
      }}
      onPointerOut={() => setHoveredStar(null)}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.95}
        size={0.48}
        map={starTexture}
        alphaTest={0.1}
        depthWrite={false}
      />
    </points>
  )
}
