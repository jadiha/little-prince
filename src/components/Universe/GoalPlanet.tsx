import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore, selectIsGoalTendedToday } from '@/store/appStore'
import { getStyleById } from '@/data/goalPlanetStyles'
import { registerPlanetPosition } from '@/lib/planetRegistry'
import type { Goal } from '@/types'

interface Props {
  goal: Goal
  goalIndex: number
  totalGoals: number
}

export default function GoalPlanet({ goal, goalIndex, totalGoals }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const isTendedToday = useAppStore(selectIsGoalTendedToday(goal.id))
  const openCheckIn = useAppStore((s) => s.openCheckIn)
  const selectGoalPlanet = useAppStore((s) => s.selectGoalPlanet)
  const activeView = useAppStore((s) => s.activeView)
  const selectedGoalId = useAppStore((s) => s.selectedGoalId)

  const isSelected = activeView === 'goalPlanet' && selectedGoalId === goal.id

  const style = getStyleById(goal.planetStyle)
  const planetColor = new THREE.Color(style.color)
  const emissiveColor = new THREE.Color(style.emissive)

  // Orbit parameters — inner ring
  const orbitRadius = 3.5 + goalIndex * 2.0
  const orbitSpeed = 0.011 - goalIndex * 0.0008
  const orbitPhase = (goalIndex / Math.max(totalGoals, 1)) * Math.PI * 2
  const inclination = goalIndex * 0.08

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(t * orbitSpeed + orbitPhase) * orbitRadius
      groupRef.current.position.z = Math.sin(t * orbitSpeed + orbitPhase) * orbitRadius
      groupRef.current.position.y = Math.sin(t * orbitSpeed * 0.5 + orbitPhase) * inclination * orbitRadius * 0.15

      // Register position every frame for camera targeting
      registerPlanetPosition(goal.id, groupRef.current.position)
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }

    // Pulse glow ring for untended planets
    if (ringRef.current && !isTendedToday) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      const pulse = (Math.sin(t * 1.5) + 1) / 2
      mat.opacity = 0.15 + pulse * 0.35
      ringRef.current.scale.setScalar(1 + pulse * 0.12)
    }
  })

  const handleClick = () => {
    selectGoalPlanet(goal.id)
    // Delay opening check-in to allow camera to dolly in
    setTimeout(() => {
      openCheckIn(goal.id)
    }, 900)
  }

  const planetRadius = 0.55

  return (
    <group ref={groupRef}>
      {/* Atmospheric glow — outer haze */}
      <mesh scale={hovered || isSelected ? 1.35 : 1.25}>
        <sphereGeometry args={[planetRadius, 16, 12]} />
        <meshBasicMaterial
          color={style.color}
          transparent
          opacity={hovered || isSelected ? 0.12 : 0.07}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        castShadow
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        scale={hovered || isSelected ? 1.15 : 1}
      >
        <sphereGeometry args={[planetRadius, 28, 20]} />
        <meshToonMaterial
          color={planetColor}
          emissive={emissiveColor}
          emissiveIntensity={isSelected ? 1.6 : hovered ? 1.0 : 0.6}
        />
      </mesh>

      {/* Pulse ring — only shown when not tended today */}
      {!isTendedToday && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planetRadius + 0.06, planetRadius + 0.25, 32]} />
          <meshBasicMaterial
            color={style.ringColor ?? style.color}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Planet's own glow light */}
      <pointLight color={style.color} intensity={hovered ? 2.5 : 1.4} distance={6} decay={2} />
    </group>
  )
}
