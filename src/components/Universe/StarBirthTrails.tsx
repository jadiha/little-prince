import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/store/appStore'
import type { Star } from '@/types'

// ─── Single trail sphere ───────────────────────────────────────────────────────
// Travels from the asteroid top (0, 1.2, 0) to the logged star's final position
// over ~1.8 seconds, then fades out and disappears.

function ShootingTrail({ star, startMs }: { star: Star; startMs: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const DURATION = 1800   // ms

  const startPos = useMemo(() => new THREE.Vector3(0, 1.2, 0), [])
  const endPos   = useMemo(
    () => new THREE.Vector3(star.position.x, star.position.y, star.position.z),
    [star]
  )

  useFrame(() => {
    const raw = (performance.now() - startMs) / DURATION
    const t   = Math.min(raw, 1)

    // Ease out quad: starts fast, decelerates
    const eased = 1 - (1 - t) * (1 - t)

    const pos = new THREE.Vector3().lerpVectors(startPos, endPos, eased)

    if (meshRef.current) {
      meshRef.current.position.copy(pos)
      // Shrink to zero as it arrives
      const s = Math.max(0, (1 - t * 1.1) * 0.85)
      meshRef.current.scale.setScalar(s)
      // Fade opacity
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = Math.max(0, 1 - t * 1.2)
    }

    if (lightRef.current) {
      lightRef.current.position.copy(pos)
      lightRef.current.intensity = Math.max(0, (1 - t) * 1.4)
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.1, 10, 7]} />
        <meshStandardMaterial
          emissive="#f4d03f"
          emissiveIntensity={4}
          color="#fffce0"
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>

      {/* Warm glow that tracks the sphere */}
      <pointLight
        ref={lightRef}
        color="#f4d03f"
        intensity={1.4}
        distance={6}
        decay={2}
      />
    </group>
  )
}

// ─── Parent: tracks newly added stars and spawns trails ───────────────────────

type Trail = { star: Star; startMs: number }

export default function StarBirthTrails() {
  const stars = useAppStore((s) => s.stars)
  const [trails, setTrails] = useState<Trail[]>([])
  const prevLenRef = useRef(stars.length)

  useEffect(() => {
    const prevLen = prevLenRef.current
    const newLen  = stars.length

    if (newLen > prevLen) {
      const newStars = stars.slice(prevLen)
      const now      = performance.now()
      const batch: Trail[] = newStars.map((s) => ({ star: s, startMs: now }))

      setTrails((prev) => [...prev, ...batch])

      // Remove trails after animation completes
      const ids = new Set(batch.map((t) => t.star.id))
      const timer = setTimeout(() => {
        setTrails((prev) => prev.filter((t) => !ids.has(t.star.id)))
      }, 2400)

      prevLenRef.current = newLen
      return () => clearTimeout(timer)
    }

    prevLenRef.current = newLen
  }, [stars])

  return (
    <>
      {trails.map((trail) => (
        <ShootingTrail
          key={trail.star.id}
          star={trail.star}
          startMs={trail.startMs}
        />
      ))}
    </>
  )
}
