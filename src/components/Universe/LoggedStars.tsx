import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/store/appStore'
import { getStyleById } from '@/data/goalPlanetStyles'

// Tracks birth time of each new star for entry animation
const starBirthTimes = new Map<string, number>()

export default function LoggedStars() {
  const stars = useAppStore((s) => s.stars)
  const goals = useAppStore((s) => s.goals)
  const clockRef = useRef(0)

  const meshRef = useRef<THREE.Points>(null)

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

      sz[i] = starBirthTimes.has(star.id) ? 0 : 0.12
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
          sizeAttr.setX(i, eased * 0.16)
          needsUpdate = true
        } else {
          // Add a gentle twinkle once settled
          const twinkle = 0.10 + Math.sin(clockRef.current * 1.5 + i * 0.7) * 0.04
          sizeAttr.setX(i, twinkle)
          needsUpdate = true
        }
      }
    })

    if (needsUpdate) sizeAttr.needsUpdate = true
  })

  if (stars.length === 0) return null

  return (
    <points ref={meshRef}>
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
        size={0.12}
      />
    </points>
  )
}
