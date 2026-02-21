import type { GoalPlanetStyle } from '@/types'

export interface PlanetStyleDef {
  id: GoalPlanetStyle
  label: string
  description: string
  color: string
  emissive: string
  ringColor?: string
}

export const GOAL_PLANET_STYLES: PlanetStyleDef[] = [
  {
    id: 'amber-health',
    label: 'Health & Body',
    description: 'Movement, rest, nourishment',
    color: '#e67e22',
    emissive: '#7d3c00',
    ringColor: '#f39c12',
  },
  {
    id: 'blue-learning',
    label: 'Learning & Mind',
    description: 'Reading, skills, curiosity',
    color: '#2e86c1',
    emissive: '#1a3c5e',
    ringColor: '#85c1e9',
  },
  {
    id: 'purple-creativity',
    label: 'Creativity & Soul',
    description: 'Making, expressing, creating',
    color: '#8e44ad',
    emissive: '#4a235a',
    ringColor: '#d7bde2',
  },
  {
    id: 'rosegold-relationships',
    label: 'Relationships & Love',
    description: 'Connection, presence, care',
    color: '#c0766e',
    emissive: '#7d3c36',
    ringColor: '#f1948a',
  },
  {
    id: 'green-rest',
    label: 'Rest & Joy',
    description: 'Play, stillness, things done for you',
    color: '#1e8449',
    emissive: '#0e4025',
    ringColor: '#82e0aa',
  },
]

export function getStyleById(id: GoalPlanetStyle): PlanetStyleDef {
  return GOAL_PLANET_STYLES.find((s) => s.id === id) ?? GOAL_PLANET_STYLES[0]
}
