import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  count?: number
}

export default function StarParticles({ count = 800 }: Props) {
  const mesh1Ref = useRef<THREE.Points>(null)
  const mesh2Ref = useRef<THREE.Points>(null)
  const mesh3Ref = useRef<THREE.Points>(null)

  const third = Math.floor(count / 3)

  // Three groups of stars at slightly different depths — creates natural depth layering
  const [pos1, pos2, pos3] = useMemo(() => {
    const make = (n: number, rMin: number, rMax: number) => {
      const pos = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        const theta = Math.acos(2 * Math.random() - 1)
        const phi = Math.random() * Math.PI * 2
        const r = rMin + Math.random() * (rMax - rMin)
        pos[i * 3]     = r * Math.sin(theta) * Math.cos(phi)
        pos[i * 3 + 1] = r * Math.cos(theta)
        pos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi)
      }
      return pos
    }
    return [
      make(third, 22, 38),
      make(third, 38, 55),
      make(count - third * 2, 55, 80),
    ]
  }, [count, third])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (mesh1Ref.current) {
      mesh1Ref.current.rotation.y += 0.0004
      const mat = mesh1Ref.current.material as THREE.PointsMaterial
      mat.opacity = 0.75 + Math.sin(t * 0.4) * 0.15
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.y -= 0.0003
      const mat = mesh2Ref.current.material as THREE.PointsMaterial
      mat.opacity = 0.65 + Math.sin(t * 0.4 + 1.2) * 0.15
    }
    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.y += 0.0002
      const mat = mesh3Ref.current.material as THREE.PointsMaterial
      mat.opacity = 0.5 + Math.sin(t * 0.4 + 2.4) * 0.12
    }
  })

  return (
    <>
      {/* Near stars — brightest */}
      <points ref={mesh1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos1, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#fffef5" sizeAttenuation transparent opacity={0.75} size={0.055} />
      </points>

      {/* Mid stars */}
      <points ref={mesh2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos2, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#e8d5ff" sizeAttenuation transparent opacity={0.65} size={0.038} />
      </points>

      {/* Distant stars — smallest, most numerous */}
      <points ref={mesh3Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos3, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#c8b8f0" sizeAttenuation transparent opacity={0.5} size={0.022} />
      </points>
    </>
  )
}
