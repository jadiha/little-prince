import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Rose from './Rose'
import { useAppStore, selectRoseState } from '@/store/appStore'

// Glass dome positioned over the rose
function GlassDome() {
  return (
    <group position={[-0.25, 1.02, 0.1]}>
      {/* Outer glass surface */}
      <mesh>
        <sphereGeometry args={[0.34, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#d4ecff"
          transparent
          opacity={0.13}
          roughness={0.05}
          metalness={0.15}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>
      {/* Inner tint for depth */}
      <mesh>
        <sphereGeometry args={[0.32, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#a0c8ff"
          transparent
          opacity={0.05}
          roughness={0}
          metalness={0}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Dome rim (torus base ring) */}
      <mesh>
        <torusGeometry args={[0.34, 0.012, 8, 56]} />
        <meshToonMaterial color="#b8d4e8" transparent opacity={0.55} />
      </mesh>
      {/* Warm glow inside dome */}
      <pointLight color="#ffe8a0" intensity={0.3} distance={0.75} decay={2} />
    </group>
  )
}

export default function Asteroid() {
  const meshRef = useRef<THREE.Mesh>(null)
  const roseState = useAppStore(selectRoseState)
  const activeView = useAppStore((s) => s.activeView)
  const setActiveView = useAppStore((s) => s.setActiveView)

  // Slow self-rotation for the asteroid
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08
      meshRef.current.rotation.x += delta * 0.02
    }
  })

  const handleRoseClick = () => {
    if (activeView === 'universe') setActiveView('roseView')
  }

  return (
    <group
      onClick={handleRoseClick}
      onPointerOver={() => { if (activeView === 'universe') document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'default' }}
    >
      {/* The asteroid itself */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.0, 1]} />
        <meshToonMaterial color="#b08450" />
      </mesh>

      {/* Surface detail — a few small craters */}
      {[
        [0.6, 0.7, 0.4],
        [-0.5, 0.8, -0.3],
        [0.3, -0.8, 0.6],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z] as [number, number, number]}>
          <sphereGeometry args={[0.08, 6, 4]} />
          <meshToonMaterial color="#8d6a38" />
        </mesh>
      ))}

      {/* The one rose */}
      <Rose state={roseState} position={[-0.25, 1.02, 0.1]} scale={1.2} />

      {/* Glass dome over the rose */}
      <GlassDome />
    </group>
  )
}
