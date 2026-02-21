import * as THREE from 'three'

// Module-level registry so the SceneController can read planet world positions
// without needing prop-drilling through the component tree.
// GoalPlanet + StoryPlanet update their entry every frame via useFrame.

export const planetPositionRegistry = new Map<string, THREE.Vector3>()

export function registerPlanetPosition(id: string, position: THREE.Vector3) {
  if (!planetPositionRegistry.has(id)) {
    planetPositionRegistry.set(id, position.clone())
  } else {
    planetPositionRegistry.get(id)!.copy(position)
  }
}
