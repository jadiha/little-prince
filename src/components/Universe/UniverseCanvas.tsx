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
import StarBirthTrails from './StarBirthTrails'
import OrbitalRings from './OrbitalRings'
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
        toneMappingExposure: 1.1,
      }}
      onCreated={(state) => state.gl.setClearColor(new THREE.Color('#06051f'))}
      shadows
      dpr={[1, 2]}
    >
      {/* Performance helpers */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      {/* Scene controller drives camera */}
      <SceneController />

      {/* Lighting */}
      <ambientLight color="#4a2a8a" intensity={0.8} />
      <directionalLight
        position={[5, 8, 5]}
        color="#ffe8c0"
        intensity={1.8}
        castShadow
      />
      <pointLight position={[-8, 6, -4]} color="#7744cc" intensity={0.6} distance={40} />
      {/* Warm gold light near asteroid for illustrated warmth */}
      <pointLight position={[0, 2, 2]} color="#f4d03f" intensity={0.4} distance={8} />

      {/* Background stars */}
      <StarParticles count={1000} />

      {/* User's earned stars */}
      <LoggedStars />

      {/* B-612 Asteroid with the one rose */}
      <Asteroid />

      {/* Orbital path rings */}
      <OrbitalRings />

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

      {/* 3D shooting star trail when a new habit is logged */}
      <StarBirthTrails />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.45}
          luminanceSmoothing={0.3}
          intensity={1.0}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  )
}
