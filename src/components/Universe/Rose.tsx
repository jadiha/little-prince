import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RoseState } from '@/types'

interface Props {
  state: RoseState
  scale?: number
  position?: [number, number, number]
}

// Rose states map to visual configurations
const ROSE_CONFIGS: Record<RoseState, {
  petalOpenness: number    // 0 = closed bud, 1 = fully open
  petalColor: string
  stemColor: string
  glowIntensity: number
  droopAmount: number      // how much petals droop downward
}> = {
  fullBloom:  { petalOpenness: 1.0,  petalColor: '#e74c3c', stemColor: '#27ae60', glowIntensity: 1.2, droopAmount: 0 },
  blooming:   { petalOpenness: 0.75, petalColor: '#c0392b', stemColor: '#27ae60', glowIntensity: 0.7, droopAmount: 0 },
  budding:    { petalOpenness: 0.4,  petalColor: '#922b21', stemColor: '#1e8449', glowIntensity: 0.3, droopAmount: 0 },
  wilting:    { petalOpenness: 0.6,  petalColor: '#7b241c', stemColor: '#196f3d', glowIntensity: 0.1, droopAmount: 0.3 },
  revival:    { petalOpenness: 0.2,  petalColor: '#641e16', stemColor: '#145a32', glowIntensity: 0.05, droopAmount: 0.5 },
}

export default function Rose({ state, scale = 1, position = [0, 0, 0] }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const petalRefs = useRef<THREE.Mesh[]>([])
  const glowRef = useRef<THREE.PointLight>(null)
  const config = ROSE_CONFIGS[state]

  // Gentle bobbing float animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.8) * 0.04
      groupRef.current.rotation.y += 0.003
    }
    if (glowRef.current) {
      // Breathe the glow
      glowRef.current.intensity = config.glowIntensity * (0.8 + Math.sin(clock.getElapsedTime() * 1.2) * 0.2)
    }
  })

  const petalColor = new THREE.Color(config.petalColor)
  const stemColor = new THREE.Color(config.stemColor)

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.3, 6]} />
        <meshToonMaterial color={stemColor} />
      </mesh>

      {/* Rose head — petals arranged radially */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const openness = config.petalOpenness
        const droop = config.droopAmount

        return (
          <mesh
            key={i}
            ref={(el) => { if (el) petalRefs.current[i] = el }}
            position={[
              Math.cos(rad) * 0.08 * openness,
              0.05 - droop * 0.08,
              Math.sin(rad) * 0.08 * openness,
            ]}
            rotation={[
              -Math.PI / 4 * openness + droop * 0.5,
              rad,
              Math.PI / 6 * openness,
            ]}
            castShadow
          >
            <sphereGeometry args={[0.07, 6, 4, 0, Math.PI]} />
            <meshToonMaterial color={petalColor} side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* Inner petals (slightly smaller, rotated 36°) */}
      {[36, 108, 180, 252, 324].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const openness = config.petalOpenness * 0.7

        return (
          <mesh
            key={`inner-${i}`}
            position={[
              Math.cos(rad) * 0.05 * openness,
              0.06,
              Math.sin(rad) * 0.05 * openness,
            ]}
            rotation={[-Math.PI / 3 * openness, rad, 0]}
          >
            <sphereGeometry args={[0.05, 5, 3, 0, Math.PI]} />
            <meshToonMaterial color={petalColor} side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* Centre bud */}
      <mesh position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshToonMaterial color={petalColor} emissive={petalColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Glow light — only visible when blooming */}
      {config.glowIntensity > 0 && (
        <pointLight
          ref={glowRef}
          color="#e74c3c"
          intensity={config.glowIntensity}
          distance={1.5}
        />
      )}
    </group>
  )
}
