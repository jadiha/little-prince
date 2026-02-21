import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/store/appStore'
import { registerPlanetPosition } from '@/lib/planetRegistry'
import type { StoryPlanet as StoryPlanetType } from '@/types'

interface Props {
  planet: StoryPlanetType
}

export default function StoryPlanet({ planet }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const selectStoryPlanet = useAppStore((s) => s.selectStoryPlanet)
  const activeView = useAppStore((s) => s.activeView)
  const selectedStoryPlanetId = useAppStore((s) => s.selectedStoryPlanetId)

  const isSelected = activeView === 'storyPlanet' && selectedStoryPlanetId === planet.id

  // Story planets are dimmer and desaturated — they feel like the past
  const baseColor = new THREE.Color(planet.color)
  const dimColor = baseColor.clone().multiplyScalar(0.55)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(t * planet.orbitSpeed + planet.orbitPhase) * planet.orbitRadius
      groupRef.current.position.z = Math.sin(t * planet.orbitSpeed + planet.orbitPhase) * planet.orbitRadius
      groupRef.current.position.y = Math.sin(t * planet.orbitSpeed * 0.3) * 0.5

      registerPlanetPosition(planet.id, groupRef.current.position)
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
    }
  })

  const handleClick = () => {
    selectStoryPlanet(planet.id)
  }

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        scale={hovered ? 1.08 : 1}
      >
        <sphereGeometry args={[0.35, 20, 14]} />
        <meshStandardMaterial
          color={dimColor}
          roughness={0.9}
          metalness={0.1}
          emissive={dimColor}
          emissiveIntensity={isSelected ? 0.4 : 0.05}
        />
      </mesh>

      {/* Very faint aura — subtle, not pulsing */}
      <pointLight
        color={planet.color}
        intensity={isSelected ? 0.5 : 0.1}
        distance={2.5}
      />
    </group>
  )
}
