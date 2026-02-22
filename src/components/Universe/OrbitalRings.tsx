import { useAppStore } from '@/store/appStore'

function OrbitalRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.018, 6, 128]} />
      <meshBasicMaterial
        color="#b388ff"
        transparent
        opacity={0.07}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function OrbitalRings() {
  const goals = useAppStore((s) => s.goals)

  return (
    <>
      {goals.map((_, i) => {
        const orbitRadius = 3.5 + i * 2.0
        return <OrbitalRing key={i} radius={orbitRadius} />
      })}
    </>
  )
}
