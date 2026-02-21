/**
 * Local development proxy — mirrors the Vercel edge function at /api/prince.
 * Runs on port 3001. Vite proxies /api → this server in dev.
 *
 * Start with: tsx watch server/hono.ts
 * (handled automatically by `npm run dev` via concurrently)
 */
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { PrinceRequest, RoseState, StoryPlanetId } from '../src/types'

// Load .env.local manually (tsx doesn't load it automatically)
try {
  const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf-8')
  for (const line of envFile.split('\n')) {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim()
  }
} catch {
  // .env.local not found — relying on environment variables
}

// Import story planets data for the system prompt
// (dynamic import keeps this file simple)
const { STORY_PLANETS } = await import('../src/data/storyPlanets.js')

const app = new Hono()

app.post('/api/prince', async (c) => {
  const body = await c.req.json() as PrinceRequest
  const { context, goals, roseState, totalStars, payload } = body

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return c.json({ error: 'ANTHROPIC_API_KEY not set in .env.local' }, 500)
  }

  const client = new Anthropic({ apiKey })

  const goalNames = goals.map((g: { name: string }) => `"${g.name}"`).join(', ')

  let system = `You are the Little Prince from Asteroid B-612. You speak with gentle, philosophical, child-like wonder. You are never a coach or an advisor. You notice small things. You find meaning in devotion, in tending what you love.

The person tends to these goals: ${goalNames || 'nothing yet'}.
Their rose — their self-love — is currently: ${roseState}.
They have released ${totalStars} stars into their sky.

Speak in 2–3 sentences only. Sometimes reference their rose or stars, but not always. Occasionally quote yourself from the book. Never use bullet points, productivity language, or the word "journey". Your words should feel like finding a letter on a doorstep — not receiving a push notification.`

  if (context === 'storyPlanet' && payload?.storyPlanetId) {
    const planet = STORY_PLANETS.find((p: { id: string }) => p.id === payload.storyPlanetId)
    if (planet) {
      system += `\n\nThe person has just visited ${planet.characterName} on ${planet.planetNumber}. This character represents: ${planet.trap}. Reflect gently on what this character might mean — not as a lesson to deliver, but as a quiet observation. You have met this person before, on your travels.`
    }
  }

  let userMessage: string
  switch (context) {
    case 'morning':
      userMessage = 'It is morning. The person has just opened their universe. Greet them gently.'
      break
    case 'afterLog':
      userMessage = payload?.note
        ? `The person just tended "${payload.goalName ?? 'their goal'}". They wrote: "${payload.note}". Acknowledge their devotion.`
        : `The person just tended "${payload?.goalName ?? 'their goal'}". Acknowledge their small act of devotion.`
      break
    case 'weeklyFox':
      userMessage = `It is Friday. They wrote: "${payload?.note ?? ''}". Respond as the Little Prince, finding the quiet truth in it.`
      break
    case 'storyPlanet':
      userMessage = 'The person is visiting this planet. Speak about this character gently, as if remembering someone you once met.'
      break
    default:
      userMessage = 'Say something gentle and true.'
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      system,
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return c.json({ message: text })
  } catch (err) {
    console.error('Claude API error:', err)
    return c.json({ error: 'API unavailable' }, 500)
  }
})

serve({ fetch: app.fetch, port: 3001 }, () => {
  console.log('🌹 Prince proxy running on http://localhost:3001')
})
