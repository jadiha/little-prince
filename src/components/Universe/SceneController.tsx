import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/store/appStore'
import { planetPositionRegistry } from '@/lib/planetRegistry'

const UNIVERSE_POSITION = new THREE.Vector3(0, 2, 10)
const UNIVERSE_LOOKAT = new THREE.Vector3(0, 0, 0)

const _targetPos = new THREE.Vector3()
const _targetLook = new THREE.Vector3()

export default function SceneController() {
  const { camera } = useThree()
  const activeView = useAppStore((s) => s.activeView)
  const selectedGoalId = useAppStore((s) => s.selectedGoalId)
  const selectedStoryPlanetId = useAppStore((s) => s.selectedStoryPlanetId)

  // Store a stable camera-look ref so we can lerp smoothly
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((_, delta) => {
    const speed = delta * 0.9

    if (activeView === 'universe') {
      _targetPos.copy(UNIVERSE_POSITION)
      _targetLook.copy(UNIVERSE_LOOKAT)
    } else if (activeView === 'goalPlanet' && selectedGoalId) {
      const planetPos = planetPositionRegistry.get(selectedGoalId)
      if (planetPos) {
        // Position camera 2.5 units in front of planet, on the same plane
        const dir = planetPos.clone().normalize()
        _targetPos.copy(planetPos).addScaledVector(dir, 2.5)
        _targetLook.copy(planetPos)
      }
    } else if (activeView === 'storyPlanet' && selectedStoryPlanetId) {
      const planetPos = planetPositionRegistry.get(selectedStoryPlanetId)
      if (planetPos) {
        const dir = planetPos.clone().normalize()
        _targetPos.copy(planetPos).addScaledVector(dir, 3.5)
        _targetLook.copy(planetPos)
      }
    } else if (activeView === 'roseView') {
      // Zoom into the rose sitting on top of the asteroid
      _targetPos.set(0, 2.2, 3.0)
      _targetLook.set(-0.25, 1.1, 0.1)
    }

    camera.position.lerp(_targetPos, speed)
    currentLookAt.current.lerp(_targetLook, speed)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
