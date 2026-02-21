import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Rose from './Rose'
import { useAppStore, selectRoseState } from '@/store/appStore'

export default function Asteroid() {
  const meshRef = useRef<THREE.Mesh>(null)
  const roseState = useAppStore(selectRoseState)

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
    </group>
  )
}
