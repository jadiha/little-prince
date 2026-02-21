import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  count?: number
}

export default function StarParticles({ count = 150 }: Props) {
  const meshRef = useRef<THREE.Points>(null)

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute on a large sphere shell (radius 25–60)
      const theta = Math.acos(2 * Math.random() - 1)
      const phi = Math.random() * Math.PI * 2
      const r = 25 + Math.random() * 35

      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi)
      pos[i * 3 + 1] = r * Math.cos(theta)
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi)

      // Vary sizes for depth perception — kept small and subtle
      sz[i] = Math.random() * 0.04 + 0.008
    }

    return [pos, sz]
  }, [count])

  // Very slow drift rotation — barely perceptible, adds life
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.005
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#e8d5a3"
        sizeAttenuation
        transparent
        opacity={0.35}
        size={0.025}
      />
    </points>
  )
}
