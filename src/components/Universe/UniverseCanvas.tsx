import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import SceneController from './SceneController'
import StarParticles from './StarParticles'
import LoggedStars from './LoggedStars'
import Asteroid from './Asteroid'
import GoalPlanet from './GoalPlanet'
import DistantUniversePlanets from './DistantUniversePlanets'
import { useAppStore } from '@/store/appStore'

export default function UniverseCanvas() {
  const goals = useAppStore((s) => s.goals)

  return (
    <Canvas
      className="fixed inset-0"
      camera={{ position: [0, 2, 10], fov: 60, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      shadows
      dpr={[1, 2]}
    >
      {/* Performance helpers */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      {/* Scene controller drives camera */}
      <SceneController />

      {/* Lighting */}
      <ambientLight color="#1a1a4e" intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        color="#fff5e0"
        intensity={1.2}
        castShadow
      />

      {/* Background stars (static) */}
      <StarParticles count={150} />

      {/* User's earned stars */}
      <LoggedStars />

      {/* B-612 Asteroid with the one rose */}
      <Asteroid />

      {/* Goal planets — inner ring */}
      {goals.map((goal, i) => (
        <GoalPlanet
          key={goal.id}
          goal={goal}
          goalIndex={i}
          totalGoals={goals.length}
        />
      ))}

      {/* Distant universe — the 6 planets the Little Prince visited, far away */}
      <DistantUniversePlanets />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.4}
          intensity={0.5}
        />
        <Vignette eskil={false} offset={0.3} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  )
}
