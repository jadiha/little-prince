import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Rose from './Rose'
import { useAppStore, selectRoseState } from '@/store/appStore'

// Baobab warning — tiny silhouette that grows if goals are neglected
function BaobabWarning({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <group position={[-0.5, 0.9, 0.2]}>
      {/* Trunk */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.06, 0.2, 6]} />
        <meshToonMaterial color="#5d4037" />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.12, 6, 5]} />
        <meshToonMaterial color="#2e7d32" />
      </mesh>
    </group>
  )
}

export default function Asteroid() {
  const meshRef = useRef<THREE.Mesh>(null)
  const roseState = useAppStore(selectRoseState)
  const goals = useAppStore((s) => s.goals)

  // Check if any goal has been neglected >5 days
  const hasNeglectedGoal = goals.some((goal) => {
    if (goal.logs.length === 0) return false
    const lastLog = goal.logs[goal.logs.length - 1]
    const diffMs = Date.now() - new Date(lastLog.date).getTime()
    return diffMs > 5 * 24 * 60 * 60 * 1000
  })

  // Slow self-rotation for the asteroid
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08
      meshRef.current.rotation.x += delta * 0.02
    }
  })

  return (
    <group>
      {/* The asteroid itself */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.0, 1]} />
        <meshToonMaterial color="#8d6e63" />
      </mesh>

      {/* Surface detail — a few small craters */}
      {[
        [0.6, 0.7, 0.4],
        [-0.5, 0.8, -0.3],
        [0.3, -0.8, 0.6],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z] as [number, number, number]}>
          <sphereGeometry args={[0.08, 6, 4]} />
          <meshToonMaterial color="#795548" />
        </mesh>
      ))}

      {/* The one rose */}
      <Rose state={roseState} position={[-0.25, 1.02, 0.1]} scale={1.2} />

      {/* Baobab warning */}
      <BaobabWarning visible={hasNeglectedGoal} />
    </group>
  )
}
