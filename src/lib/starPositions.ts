// Each goal owns an angular sector of the sky sphere.
// Stars for that goal cluster within that sector so the sky
// visually shows distinct constellations per goal.

export function generateStarPosition(
  goalIndex: number,
  totalGoals: number
): { x: number; y: number; z: number } {
  const total = Math.max(totalGoals, 1)
  const sectorAngle = (Math.PI * 2) / total
  const basePhi = goalIndex * sectorAngle

  // Randomise within sector with ~80% spread
  const phi = basePhi + (Math.random() - 0.5) * sectorAngle * 0.8

  // Uniform distribution over the sphere surface
  const theta = Math.acos(2 * Math.random() - 1)

  // Shell radius 12–18 units (outside the planet ring)
  const r = 12 + Math.random() * 6

  return {
    x: r * Math.sin(theta) * Math.cos(phi),
    y: r * Math.cos(theta),
    z: r * Math.sin(theta) * Math.sin(phi),
  }
}
