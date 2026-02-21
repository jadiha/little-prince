import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Rose from './Rose'
import { useAppStore, selectRoseState } from '@/store/appStore'

// Simple Little Prince figure built from basic geometries
function LittlePrince({ onClick }: { onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle idle sway
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.7) * 0.06
      groupRef.current.rotation.y += 0.004
    }
  })

  const goldColor = new THREE.Color('#f4d03f')
  const skinColor = new THREE.Color('#f5cba7')
  const scarfColor = new THREE.Color('#fdfefe')

  return (
    <group
      ref={groupRef}
      position={[0.3, 1.05, 0.3]}
      scale={hovered ? 1.08 : 1}
      onClick={onClick}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* Body (golden coat) */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.09, 0.18, 8]} />
        <meshToonMaterial color={goldColor} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshToonMaterial color={skinColor} />
      </mesh>

      {/* Hair (golden-blonde) */}
      <mesh position={[0, 0.29, 0]}>
        <sphereGeometry args={[0.075, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshToonMaterial color={goldColor} />
      </mesh>

      {/* Scarf */}
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.075, 0.018, 6, 12]} />
        <meshToonMaterial color={scarfColor} />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.1, 0.06, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 6]} />
        <meshToonMaterial color={goldColor} />
      </mesh>

      {/* Right arm (raised slightly — as if gesturing) */}
      <mesh position={[0.1, 0.1, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 6]} />
        <meshToonMaterial color={goldColor} />
      </mesh>
    </group>
  )
}

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
  const setPrinceMessage = useAppStore((s) => s.setPrinceMessage)
  const setIsPrinceTyping = useAppStore((s) => s.setIsPrinceTyping)

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

  const handlePrinceClick = () => {
    // Trigger a Claude greeting — handled by usePrince in MainUI
    // We use a custom event so the canvas component stays decoupled
    window.dispatchEvent(new CustomEvent('prince:clicked'))
  }

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

      {/* Little Prince */}
      <LittlePrince onClick={handlePrinceClick} />

      {/* Baobab warning */}
      <BaobabWarning visible={hasNeglectedGoal} />
    </group>
  )
}
