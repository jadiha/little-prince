import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { STORY_PLANETS } from '@/data/storyPlanets'

// ─── A single distant planet — purely decorative, non-interactive ──────────────
// Orbits at 2× the original radius so it feels like a separate, far-away universe
// Uses emissive glow + atmospheric haze so it reads as luminous from a distance

function DistantPlanet({ planet }: { planet: typeof STORY_PLANETS[0] }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  const orbitRadius = planet.orbitRadius * 2.1   // 19–32 units — far past goal planets
  const orbitSpeed  = planet.orbitSpeed * 0.7    // slightly lazier rotation
  const tilt        = planet.orbitPhase * 0.12   // gentle plane inclination

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(t * orbitSpeed + planet.orbitPhase) * orbitRadius
      groupRef.current.position.z = Math.sin(t * orbitSpeed + planet.orbitPhase) * orbitRadius
      // A gentle bobbing so each planet feels alive in 3D, not just flat orbit
      groupRef.current.position.y = Math.sin(t * orbitSpeed * 0.25 + planet.orbitPhase) * (1.5 + tilt)
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  const base = new THREE.Color(planet.color)
  // Dark body, strong emissive — so it glows like a distant star rather than
  // looking like a chunk of rock nearby
  const bodyColor = base.clone().multiplyScalar(0.25)

  return (
    <group ref={groupRef}>
      {/* Planet body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.65, 24, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.88}
          metalness={0.05}
          emissive={base}
          emissiveIntensity={0.55}
        />
      </mesh>

      {/* Atmospheric haze — slightly larger, transparent, backside */}
      <mesh>
        <sphereGeometry args={[0.9, 16, 12]} />
        <meshStandardMaterial
          color={planet.color}
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          emissive={planet.color}
          emissiveIntensity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Outer atmospheric glow ring — very faint */}
      <mesh>
        <sphereGeometry args={[1.15, 12, 8]} />
        <meshStandardMaterial
          color={planet.color}
          transparent
          opacity={0.018}
          side={THREE.BackSide}
          emissive={planet.color}
          emissiveIntensity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle local light so the atmosphere catches a faint glow */}
      <pointLight color={planet.color} intensity={0.22} distance={5} decay={2} />
    </group>
  )
}

// ─── Exported group ────────────────────────────────────────────────────────────
export default function DistantUniversePlanets() {
  return (
    <group>
      {STORY_PLANETS.map((planet) => (
        <DistantPlanet key={planet.id} planet={planet} />
      ))}
    </group>
  )
}
